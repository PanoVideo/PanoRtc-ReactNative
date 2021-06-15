//
//  RCTPanoRtcEngineModule.swift
//  pano_rtc
//
//  Copyright © 2021 Pano. All rights reserved.
//

import Foundation
import PanoRtc

@objc(RCTPanoRtcEngineModule)
class RCTPanoRtcEngineModule: RCTEventEmitter {
    static let REACT_CLASS = "RCTPanoRtcEngineModule"

    private var hasListeners = false
    private(set) var manager: RtcEngineManager?

    override init() {
        super.init()
        manager = RtcEngineManager()
        manager?.delegate = self
    }

    deinit {
        manager?.cleanup()
    }

    override class func moduleName() -> String! {
        return RCTPanoRtcEngineModule.REACT_CLASS
    }

    override func constantsToExport() -> [AnyHashable: Any]! {
        return ["prefix": RtcEngineDelegateHandler.PREFIX]
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override var methodQueue: DispatchQueue! {
        return DispatchQueue.main
    }

    override func supportedEvents() -> [String]! {
        return RtcEngineDelegateType.allCases
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

extension RCTPanoRtcEngineModule : RtcEngineManagerDelegate {
    func emit(_ methodName: String, _ data: Dictionary<String, Any?>?) {
        if hasListeners {
            sendEvent(withName: "\(RtcEngineDelegateHandler.PREFIX)\(methodName)", body: data)
        }
    }
    
    func createWhiteboardEngineIfNeeded(whiteboardId: String) {
        let whiteboardManager = (bridge.module(for: RCTPanoRtcWhiteboardModule.classForCoder()) as? RCTPanoRtcWhiteboardModule)?.manager
        if whiteboardManager?[whiteboardId] == nil {
            whiteboardManager?.create(whiteboardId, (manager?.engine)!)
        }
    }
    
    func createVideoStreamManager(panoObj: PanoRtcVideoStreamManager?) -> RtcVideoStreamManager? {
        let videoStreamManager = (bridge.module(for: RCTPanoRtcVideoStreamManagerModule.classForCoder()) as? RCTPanoRtcVideoStreamManagerModule)?.manager
        videoStreamManager?.setup(manager: panoObj)
        return videoStreamManager
    }
    
    func createAnnotationManager(panoObj: PanoRtcAnnotationManager?) -> RtcAnnotationManager? {
        let annotationManager = (bridge.module(for: RCTPanoRtcAnnotationManagerModule.classForCoder()) as? RCTPanoRtcAnnotationManagerModule)?.manager
        annotationManager?.setup(manager: panoObj)
        return annotationManager
    }
    
    func createMessageService(panoObj: PanoRtcMessage?) -> RtcMessage? {
        let messageService = (bridge.module(for: RCTPanoRtcMessageModule.classForCoder()) as? RCTPanoRtcMessageModule)?.service
        messageService?.setup(service: panoObj)
        return messageService
    }
    
    func createNetworkManager(panoObj: PanoRtcEngineKit?) -> RtcNetworkManager? {
        let networkManager = (bridge.module(for: RCTPanoRtcNetworkManagerModule.classForCoder()) as? RCTPanoRtcNetworkManagerModule)?.manager
        networkManager?.setup(engine: panoObj)
        return networkManager
    }
    
    func cleanup() {
        (bridge.module(for: RCTPanoRtcWhiteboardModule.classForCoder()) as? RCTPanoRtcWhiteboardModule)?.manager?.cleanup()
        (bridge.module(for: RCTPanoRtcAnnotationModule.classForCoder()) as? RCTPanoRtcAnnotationModule)?.manager?.cleanup()
        (bridge.module(for: RCTPanoRtcAnnotationManagerModule.classForCoder()) as? RCTPanoRtcAnnotationManagerModule)?.manager?.cleanup()
        (bridge.module(for: RCTPanoRtcMessageModule.classForCoder()) as? RCTPanoRtcMessageModule)?.service?.cleanup()
        (bridge.module(for: RCTPanoRtcVideoStreamManagerModule.classForCoder()) as? RCTPanoRtcVideoStreamManagerModule)?.manager?.cleanup()
        (bridge.module(for: RCTPanoRtcNetworkManagerModule.classForCoder()) as? RCTPanoRtcNetworkManagerModule)?.manager?.cleanup()
    }
}
