//
//  RCTPanoRtcWhiteboardModule.swift
//  pano_rtc
//
//  Copyright © 2021 Pano. All rights reserved.
//

import Foundation
import PanoRtc

@objc(RCTPanoRtcWhiteboardModule)
class RCTPanoRtcWhiteboardModule: RCTEventEmitter {
    static let REACT_CLASS = "RCTPanoRtcWhiteboardModule"

    private var hasListeners = false
    private(set) var manager: RtcWhiteboard?
    
    override init() {
        super.init()
        manager = RtcWhiteboard()
        manager?.delegate = self
    }
    
    deinit {
        manager?.cleanup()
    }
    
    override class func moduleName() -> String! {
        return RCTPanoRtcWhiteboardModule.REACT_CLASS
    }

    override func constantsToExport() -> [AnyHashable: Any]! {
        return ["prefix": PanoRtcWhiteboardDelegateHandler.PREFIX]
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override var methodQueue: DispatchQueue! {
        return DispatchQueue.main
    }

    override func supportedEvents() -> [String]! {
        return PanoRtcWhiteboardDelegateType.allCases
            .map({ "\(PanoRtcWhiteboardDelegateHandler.PREFIX)\($0.rawValue)" })
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }
    
    @objc func callMethod(_ methodName: String, _ params: NSDictionary?, _ resolve: RCTPromiseResolveBlock?, _ reject: RCTPromiseRejectBlock?) {
        if let `params` = params {
            let paramsValue = params as! Dictionary<String, Any>
            let tupleArray = paramsValue.map { key, value in
                key == "message" ? (key, (value as? String)?.data(using: .utf8) as Any) : (key, value)
            }
            let newParams = Dictionary(uniqueKeysWithValues: tupleArray)
            manager?.perform(NSSelectorFromString(methodName + "::"), with: newParams, with: PromiseCallback(resolve, reject))
        } else {
            manager?.perform(NSSelectorFromString(methodName + ":"), with: PromiseCallback(resolve, reject))
        }
    }
}

extension RCTPanoRtcWhiteboardModule: RtcWhiteboardDelegate {
    func emit(_ methodName: String, _ data: Dictionary<String, Any?>?) {
        if hasListeners {
            var newData = data
            if let `data` = data {
                if let array = data["data"]! as? [Any?] {
                    let newArray = array.map { $0 is Data ? String(data: $0 as! Data, encoding: .utf8) as Any? : $0 }
                    newData?["data"] = newArray
                }
            }
            sendEvent(withName: "\(PanoRtcWhiteboardDelegateHandler.PREFIX)\(methodName)", body: newData)
        }
    }
}
