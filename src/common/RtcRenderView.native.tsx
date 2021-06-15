import React, { Component } from 'react';
import {
  requireNativeComponent,
  ViewProps,
  UIManager,
  findNodeHandle,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

const {
  /**
   * @ignore
   */
  PanoRtcSurfaceViewEventEmitter,

  PanoRtcWhiteboardSurfaceViewEventEmitter,
} = NativeModules;
/**
 * @ignore
 */
const SurfaceViewPrefix = PanoRtcSurfaceViewEventEmitter.prefix;

const WhiteboardViewPrefix = PanoRtcWhiteboardSurfaceViewEventEmitter.prefix;

/**
 * @ignore
 */
const RtcSurfaceViewEmitter = new NativeEventEmitter(
  PanoRtcSurfaceViewEventEmitter
);

const RtcWhiteboardSurfaceViewEmitter = new NativeEventEmitter(
  PanoRtcWhiteboardSurfaceViewEventEmitter
);

/**
 * @ignore
 */
const RCTRtcWhiteboardSurfaceView = requireNativeComponent<RtcRenderViewProps>(
  'RCTPanoRtcWhiteboardSurfaceView'
);

interface RtcRenderViewProps {}

/**
 * @ignore
 */
const RCTRtcSurfaceView = requireNativeComponent<RtcRenderViewProps>(
  'RCTPanoRtcSurfaceView'
);

/**
 * @ignore
 */
export class RtcSurfaceView extends Component<ViewProps, {}> {
  /**
   * @ignore
   */
  private _nextRequestId = 1;
  /**
   * @ignore
   */
  private _requestMap = new Map<number, any>();
  /**
   * @ignore
   */
  private subscription = RtcSurfaceViewEmitter.addListener(
    SurfaceViewPrefix + 'onResultReturned',
    (event) => {
      let { reactTag, requestId, result, error } = event;
      if (reactTag != findNodeHandle(this)) {
        return;
      }
      let promise = this._requestMap.get(requestId);
      if (result != null) {
        // If it was successful, we resolve the promise.
        promise.resolve(result);
      } else {
        // Otherwise, we reject it.
        promise.reject(error);
      }
      // Finally, we clean up our request map.
      this._requestMap.delete(requestId);
    }
  );

  componentWillUnmount() {
    this.subscription.remove();
  }

  _callMethod<T>(method: string, args?: {}): Promise<T> {
    let requestId = this._nextRequestId++;
    let requestMap = this._requestMap;

    // We create a promise here that will be resolved once _onRequestDone is
    // called.
    let promise = new Promise<T>((resolve, reject) => {
      requestMap.set(requestId, { resolve: resolve, reject: reject });
    });

    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.getViewManagerConfig('RCTPanoRtcSurfaceView').Commands
        .callMethod,
      [method, requestId, args]
    );

    return promise;
  }

  render() {
    return <RCTRtcSurfaceView {...this.props} />;
  }
}

/**
 * @ignore
 */
export class RtcWhiteboardSurfaceView extends Component<ViewProps, {}> {
  /**
   * @ignore
   */
  private _nextRequestId = 1;
  /**
   * @ignore
   */
  private _requestMap = new Map<number, any>();
  /**
   * @ignore
   */
  private subscription = RtcWhiteboardSurfaceViewEmitter.addListener(
    WhiteboardViewPrefix + 'onResultReturned',
    (event) => {
      let { reactTag, requestId, result, error } = event;
      if (reactTag != findNodeHandle(this)) {
        return;
      }
      let promise = this._requestMap.get(requestId);
      if (result != null) {
        // If it was successful, we resolve the promise.
        promise.resolve(result);
      } else {
        // Otherwise, we reject it.
        promise.reject(error);
      }
      // Finally, we clean up our request map.
      this._requestMap.delete(requestId);
    }
  );

  componentWillUnmount() {
    this.subscription.remove();
  }

  _callMethod<T>(method: string, args?: {}): Promise<T> {
    let requestId = this._nextRequestId++;
    let requestMap = this._requestMap;

    // We create a promise here that will be resolved once _onRequestDone is
    // called.
    let promise = new Promise<T>((resolve, reject) => {
      requestMap.set(requestId, { resolve: resolve, reject: reject });
    });

    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.getViewManagerConfig('RCTPanoRtcWhiteboardSurfaceView').Commands
        .callMethod,
      [method, requestId, args]
    );

    return promise;
  }

  render() {
    return <RCTRtcWhiteboardSurfaceView {...this.props} />;
  }
}
