//
//  RCTPanoRtcMessageModule.swift
//  pano_rtc
//
//  Copyright © 2021 Pano. All rights reserved.
//

import Foundation
import PanoRtc

@objc(RCTPanoRtcMessageModule)
class RCTPanoRtcMessageModule: RCTEventEmitter {
    static let REACT_CLASS = "RCTPanoRtcMessageModule"

    private var hasListeners = false
    private(set) var service: RtcMessage?
    
    override init() {
        super.init()
        service = RtcMessage()
        service?.delegate = self
    }
    
    deinit {
        service?.cleanup()
    }
    
    override class func moduleName() -> String! {
        return RCTPanoRtcMessageModule.REACT_CLASS
    }

    override func constantsToExport() -> [AnyHashable: Any]! {
        return ["prefix": PanoRtcMessageDelegateHandler.PREFIX]
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override var methodQueue: DispatchQueue! {
        return DispatchQueue.main
    }

    override func supportedEvents() -> [String]! {
        return PanoRtcMessageDelegateType.allCases
            .map({ "\(PanoRtcMessageDelegateHandler.PREFIX)\($0.rawValue)" })
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
            service?.perform(NSSelectorFromString(methodName + "::"), with: newParams, with: PromiseCallback(resolve, reject))
        } else {
            service?.perform(NSSelectorFromString(methodName + ":"), with: PromiseCallback(resolve, reject))
        }
    }
}

extension RCTPanoRtcMessageModule: RtcMessageDelegate {
    func emit(_ methodName: String, _ data: Dictionary<String, Any?>?) {
        if hasListeners {
            var newData = data
            if let `data` = data {
                if let array = data["data"]! as? [Any?] {
                    let newArray = array.map { $0 is Data ? String(data: $0 as! Data, encoding: .utf8) as Any? : $0 }
                    newData = ["data": newArray]
                }
            }
            sendEvent(withName: "\(PanoRtcMessageDelegateHandler.PREFIX)\(methodName)", body: newData)
        }
    }
}
