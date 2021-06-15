//
//  RCTPanoRtcVideoStreamManagerModule.swift
//  pano_rtc
//
//  Copyright © 2021 Pano. All rights reserved.
//

import Foundation
import PanoRtc

@objc(RCTPanoRtcVideoStreamManagerModule)
class RCTPanoRtcVideoStreamManagerModule: RCTEventEmitter {
    static let REACT_CLASS = "RCTPanoRtcVideoStreamManagerModule"

    private var hasListeners = false
    private(set) var manager: RtcVideoStreamManager?
    
    override init() {
        super.init()
        manager = RtcVideoStreamManager()
        manager?.delegate = self
    }
    
    override class func moduleName() -> String! {
        return RCTPanoRtcVideoStreamManagerModule.REACT_CLASS
    }

    override func constantsToExport() -> [AnyHashable: Any]! {
        return ["prefix": PanoRtcVideoStreamDelegateHandler.PREFIX]
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override var methodQueue: DispatchQueue! {
        return DispatchQueue.main
    }

    override func supportedEvents() -> [String]! {
        return PanoRtcVideoStreamDelegateType.allCases
            .map({ "\(PanoRtcVideoStreamDelegateHandler.PREFIX)\($0.rawValue)" })
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

extension RCTPanoRtcVideoStreamManagerModule: RtcVideoStreamManagerDelegate {
    func emit(_ methodName: String, _ data: Dictionary<String, Any?>?) {
        if hasListeners {
            sendEvent(withName: "\(PanoRtcVideoStreamDelegateHandler.PREFIX)\(methodName)", body: data)
        }
    }
}
