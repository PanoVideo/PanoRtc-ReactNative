//
//  RCTPanoRtcAnnotationManagerModule.swift
//  pano_rtc
//
//  Copyright © 2021 Pano. All rights reserved.
//

import Foundation
import PanoRtc

@objc(RCTPanoRtcAnnotationManagerModule)
class RCTPanoRtcAnnotationManagerModule: RCTEventEmitter {
    static let REACT_CLASS = "RCTPanoRtcAnnotationManagerModule"

    private var hasListeners = false
    private(set) var manager: RtcAnnotationManager?
    
    override init() {
        super.init()
        manager = RtcAnnotationManager()
        manager?.delegate = self
    }
    
    override class func moduleName() -> String! {
        return RCTPanoRtcAnnotationManagerModule.REACT_CLASS
    }

    override func constantsToExport() -> [AnyHashable: Any]! {
        return ["prefix": PanoRtcAnnotationManagerDelegateHandler.PREFIX]
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override var methodQueue: DispatchQueue! {
        return DispatchQueue.main
    }

    override func supportedEvents() -> [String]! {
        return PanoRtcAnnotationManagerDelegateType.allCases
            .map({ "\(PanoRtcAnnotationManagerDelegateHandler.PREFIX)\($0.rawValue)" })
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

extension RCTPanoRtcAnnotationManagerModule: RtcAnnotationManagerDelegate {
    func emit(_ methodName: String, _ data: Dictionary<String, Any?>?) {
        if hasListeners {
            sendEvent(withName: "\(PanoRtcAnnotationManagerDelegateHandler.PREFIX)\(methodName)", body: data)
        }
    }
    
    func createAnnotationIfNeeded(_ annotationId: String, _ annotation: PanoRtcAnnotation) {
        let annotationCache = (bridge.module(for: RCTPanoRtcAnnotationModule.classForCoder()) as? RCTPanoRtcAnnotationModule)?.manager
        if annotationCache?[annotationId] == nil {
            annotationCache?.create(annotationId, annotation)
        }
    }
}
