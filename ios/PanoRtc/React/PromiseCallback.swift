//
//  PromiseCallback.swift
//  pano_rtc
//
//  Copyright © 2021 Pano. All rights reserved.
//

import Foundation
import PanoRtc

@objc(PromiseCallback)
class PromiseCallback: NSObject, Callback {
    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?

    init(_ resolve: RCTPromiseResolveBlock?, _ reject: RCTPromiseRejectBlock?) {
        self.resolve = resolve
        self.reject = reject
    }

    func success(_ data: Any?) {
        resolve?(data)
    }

    func failure(_ code: String) {
        reject?(code, nil, nil)
    }
}
