//
//  RCTPanoRtcWhiteboardSurfaceViewManagerBridge.m
//  pano_rtc
//
//  Copyright © 2021 Pano. All rights reserved.
//

#import <React/RCTUIManager.h>

@interface RCT_EXTERN_MODULE(RCTPanoRtcWhiteboardSurfaceViewManager, NSObject)

RCT_EXTERN_METHOD(callMethod:
                  (nonnull NSNumber *) reactTag :(nonnull NSString *) method :(nonnull NSNumber *) requestId :(NSDictionary *) params)

@end

@interface RCT_EXTERN_MODULE(RCTPanoRtcWhiteboardSurfaceViewEventEmitter, NSObject)

@end
