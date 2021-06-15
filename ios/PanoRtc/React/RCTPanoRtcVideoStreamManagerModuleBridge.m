//
//  RCTPanoRtcVideoStreamManagerModuleBridge.m
//  pano_rtc
//
//  Copyright © 2021 Pano. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RCTPanoRtcVideoStreamManagerModule, NSObject)

RCT_EXTERN_METHOD(callMethod:
    (NSString *) methodName :(NSDictionary *) params :(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock) reject)

@end
