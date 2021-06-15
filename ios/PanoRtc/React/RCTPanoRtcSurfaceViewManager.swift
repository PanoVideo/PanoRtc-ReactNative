//
//  RCTPanoRtcSurfaceViewManager.swift
//  pano_rtc
//
//  Copyright © 2021 Pano. All rights reserved.
//

import Foundation
import PanoRtc

enum RtcSurfaceViewEventType: String, CaseIterable {
    case onResultReturned
}

@objc(RCTPanoRtcSurfaceViewEventEmitter)
class RCTPanoRtcSurfaceViewEventEmitter: RCTEventEmitter {
    static let PREFIX = "video.pano.rtc."
    
    private var hasListeners = false
    
    override func constantsToExport() -> [AnyHashable: Any]! {
        return ["prefix": RCTPanoRtcSurfaceViewEventEmitter.PREFIX]
    }
    
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }
    
    override func supportedEvents() -> [String]! {
        return RtcSurfaceViewEventType.allCases
            .map({ "\(RCTPanoRtcSurfaceViewEventEmitter.PREFIX)\($0.rawValue)" })
    }
    
    func onResultReturned(_ reactTag: Int, _ requestId: Int, _ result: Any?, _ error: String?) {
        if hasListeners {
            sendEvent(withName: "\(RCTPanoRtcSurfaceViewEventEmitter.PREFIX)\(RtcSurfaceViewEventType.onResultReturned.rawValue)",
                      body: ["reactTag": reactTag, "requestId": requestId, "result": result, "error": error])
        }
    }
}

@objc(RCTPanoRtcSurfaceViewManager)
class RCTPanoRtcSurfaceViewManager: RCTViewManager {
    override func view() -> UIView! {
        let view = RtcView()
        view.setEngineManager(engineManager)
        view.setVideoStreamManager(videoStreamManager)
        view.setAnntationCache(annotationCache)
        return view
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override var methodQueue: DispatchQueue! {
        return DispatchQueue.main
    }

    private func engineManager() -> RtcEngineManager? {
        return (bridge.module(for: RCTPanoRtcEngineModule.classForCoder()) as? RCTPanoRtcEngineModule)?.manager
    }
    
    private func videoStreamManager() -> RtcVideoStreamManager? {
        return (bridge.module(for: RCTPanoRtcVideoStreamManagerModule.classForCoder()) as? RCTPanoRtcVideoStreamManagerModule)?.manager
    }
    
    private func annotationCache() -> RtcAnnotationCache? {
        return (bridge.module(for: RCTPanoRtcAnnotationModule.classForCoder()) as? RCTPanoRtcAnnotationModule)?.manager
    }
    
    private func eventEmitter() -> RCTPanoRtcSurfaceViewEventEmitter? {
        return bridge.module(for: RCTPanoRtcSurfaceViewEventEmitter.classForCoder()) as? RCTPanoRtcSurfaceViewEventEmitter
    }

    @objc func callMethod(_ reactTag: NSNumber, _ method: String, _ requestId: NSNumber, _ params: NSDictionary?) {
        self.bridge.uiManager.addUIBlock { (uiManager, viewRegistry) in
            let tagView = viewRegistry?[reactTag] as? RtcView
            let callback = PromiseCallback { result in
                self.eventEmitter()?.onResultReturned(reactTag as! Int, requestId as! Int, result, nil)
            } _: { (code, message, error) in
                self.eventEmitter()?.onResultReturned(reactTag as! Int, requestId as! Int, nil, code)
            }
            
            if let `params` = params {
                tagView?.perform(NSSelectorFromString(method + "::"), with: params, with: callback)
            } else {
                tagView?.perform(NSSelectorFromString(method + ":"), with: callback)
            }
        }
    }
}

@objc(RtcView)
class RtcView: UIView {
    //RtcEngine
    
    private var getEngineManager: (() -> RtcEngineManager?)?

    func setEngineManager(_ getEngineManager: @escaping () -> RtcEngineManager?) {
        self.getEngineManager = getEngineManager
    }
    
    @objc func startVideo(_ params: NSDictionary, _ callback: Callback) {
        let manager = getEngineManager?()
        let params = NSMutableDictionary.init(dictionary: params)
        params["view"] = self
        manager?.startVideo(params, callback)
    }
    
    @objc func subscribeVideo(_ params: NSDictionary, _ callback: Callback) {
        let manager = getEngineManager?()
        let params = NSMutableDictionary.init(dictionary: params)
        params["view"] = self
        manager?.subscribeVideo(params, callback)
    }
    
    @objc func subscribeScreen(_ params: NSDictionary, _ callback: Callback) {
        let manager = getEngineManager?()
        let params = NSMutableDictionary.init(dictionary: params)
        params["view"] = self
        manager?.subscribeScreen(params, callback)
    }
    
    @objc func startPreview(_ params: NSDictionary, _ callback: Callback) {
        let manager = getEngineManager?()
        let params = NSMutableDictionary.init(dictionary: params)
        params["view"] = self
        manager?.startPreview(params, callback)
    }
    
    //RtcVideoStreamManager
    
    private var getVideoStreamManager: (() -> RtcVideoStreamManager?)?

    func setVideoStreamManager(_ getVideoStreamManager: @escaping () -> RtcVideoStreamManager?) {
        self.getVideoStreamManager = getVideoStreamManager
    }
    
    @objc func startVideoWithStreamId(_ params: NSDictionary, _ callback: Callback) {
        let manager = getVideoStreamManager?()
        let params = NSMutableDictionary.init(dictionary: params)
        params["view"] = self
        manager?.startVideoWithStreamId(params, callback)
    }
    
    @objc func subscribeVideoWithStreamId(_ params: NSDictionary, _ callback: Callback) {
        let manager = getVideoStreamManager?()
        let params = NSMutableDictionary.init(dictionary: params)
        params["view"] = self
        manager?.subscribeVideoWithStreamId(params, callback)
    }
    
    //RtcAnnotation
    
    private var getAnntationCache: (() -> RtcAnnotationCache?)?

    func setAnntationCache(_ getAnntationCache: @escaping () -> RtcAnnotationCache?) {
        self.getAnntationCache = getAnntationCache
    }
    
    @objc func startAnnotation(_ params: NSDictionary, _ callback: Callback) {
        let annotationCache = getAnntationCache?()
        let params = NSMutableDictionary.init(dictionary: params)
        params["view"] = self
        annotationCache?.startAnnotation(params, callback)
    }
}
