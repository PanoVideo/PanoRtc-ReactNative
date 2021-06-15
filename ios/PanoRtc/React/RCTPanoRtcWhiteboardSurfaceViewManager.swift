//
//  RCTPanoRtcWhiteboardSurfaceViewManager.swift
//  pano_rtc
//
//  Copyright © 2021 Pano. All rights reserved.
//

import Foundation
import PanoRtc

enum RtcWhiteboardSurfaceViewEventType: String, CaseIterable {
    case onResultReturned
}

@objc(RCTPanoRtcWhiteboardSurfaceViewEventEmitter)
class RCTPanoRtcWhiteboardSurfaceViewEventEmitter: RCTEventEmitter {
    static let PREFIX = "video.pano.rtc."
    
    private var hasListeners = false
    
    override func constantsToExport() -> [AnyHashable: Any]! {
        return ["prefix": RCTPanoRtcWhiteboardSurfaceViewEventEmitter.PREFIX]
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
        return RtcWhiteboardSurfaceViewEventType.allCases
            .map({ "\(RCTPanoRtcWhiteboardSurfaceViewEventEmitter.PREFIX)\($0.rawValue)" })
    }
    
    func onResultReturned(_ reactTag: Int, _ requestId: Int, _ result: Any?, _ error: String?) {
        if hasListeners {
            sendEvent(withName: "\(RCTPanoRtcWhiteboardSurfaceViewEventEmitter.PREFIX)\(RtcWhiteboardSurfaceViewEventType.onResultReturned.rawValue)",
                      body: ["reactTag": reactTag, "requestId": requestId, "result": result, "error": error])
        }
    }
}

@objc(RCTPanoRtcWhiteboardSurfaceViewManager)
class RCTPanoRtcWhiteboardSurfaceViewManager: RCTViewManager {
    override func view() -> UIView! {
        let view = RtcWhiteboardView()
        view.setWhiteboardManager(whiteboardManager)
        return view
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override var methodQueue: DispatchQueue! {
        return DispatchQueue.main
    }

    private func whiteboardManager() -> RtcWhiteboard? {
        return (bridge.module(for: RCTPanoRtcWhiteboardModule.classForCoder()) as? RCTPanoRtcWhiteboardModule)?.manager
    }
    
    private func eventEmitter() -> RCTPanoRtcWhiteboardSurfaceViewEventEmitter? {
        return bridge.module(for: RCTPanoRtcWhiteboardSurfaceViewEventEmitter.classForCoder()) as? RCTPanoRtcWhiteboardSurfaceViewEventEmitter
    }

    @objc func callMethod(_ reactTag: NSNumber, _ method: String, _ requestId: NSNumber, _ params: NSDictionary?) {
        self.bridge.uiManager.addUIBlock { (uiManager, viewRegistry) in
            let tagView = viewRegistry?[reactTag] as? RtcWhiteboardView
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

@objc(RtcWhiteboardView)
class RtcWhiteboardView: UIView {
    //RtcWhiteboard
    
    private var getWhiteboardManager: (() -> RtcWhiteboard?)?

    func setWhiteboardManager(_ getWhiteboardManager: @escaping () -> RtcWhiteboard?) {
        self.getWhiteboardManager = getWhiteboardManager
    }
    
    @objc func open(_ params: NSDictionary, _ callback: Callback) {
        let manager = getWhiteboardManager?()
        let params = NSMutableDictionary.init(dictionary: params)
        params["view"] = self
        manager?.open(params, callback)
    }
}
