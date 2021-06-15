//
//  RCTPanoRtcAnnotationModule.swift
//  pano_rtc
//
//  Copyright © 2021 Pano. All rights reserved.
//

import Foundation
import PanoRtc

@objc(RCTPanoRtcAnnotationModule)
class RCTPanoRtcAnnotationModule: RCTEventEmitter {
    static let REACT_CLASS = "RCTPanoRtcAnnotationModule"

    private var hasListeners = false
    private(set) var manager: RtcAnnotationCache?
    
    override init() {
        super.init()
        manager = RtcAnnotationCache()
        manager?.delegate = self
    }
    
    deinit {
        manager?.cleanup()
    }
    
    override class func moduleName() -> String! {
        return RCTPanoRtcAnnotationModule.REACT_CLASS
    }

    override func constantsToExport() -> [AnyHashable: Any]! {
        return ["prefix": PanoRtcAnnotationDelegateHandler.PREFIX]
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override var methodQueue: DispatchQueue! {
        return DispatchQueue.main
    }

    override func supportedEvents() -> [String]! {
        return PanoRtcAnnotationDelegateType.allCases
            .map({ "\(RtcEngineDelegateHandler.PREFIX)\($0.rawValue)" })
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }
    
    @objc func callMethod(_ methodName: String, _ params: NSDictionary?, _ resolve: RCTPromiseResolveBlock?, _ reject: RCTPromiseRejectBlock?) {
        if let `params` = params {
            manager?.perform(NSSelectorFromString(methodName + "::"), with: params, with: PromiseCallback(resolve, reject))
        } else {
            manager?.perform(NSSelectorFromString(methodName + ":"), with: PromiseCallback(resolve, reject))
        }
    }
}

extension RCTPanoRtcAnnotationModule: RtcAnnotationDelegate {
    func emit(_ methodName: String, _ data: Dictionary<String, Any?>?) {
        if hasListeners {
            sendEvent(withName: "\(PanoRtcAnnotationDelegateHandler.PREFIX)\(methodName)", body: data)
        }
    }
}
