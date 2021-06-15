import { NativeEventEmitter, NativeModules } from 'react-native';
import RtcAnnotation from './RtcAnnotation.native';

import type {
  Listener,
  RtcAnnotationManagerEventHandler,
  Subscription,
} from './RtcEvents';

const {
  /**
   * @ignore
   */
  PanoRtcAnnotationManagerModule,
} = NativeModules;
/**
 * @ignore
 */
const Prefix = PanoRtcAnnotationManagerModule.prefix;
/**
 * @ignore
 */
const RtcAnnotationManagerEvent = new NativeEventEmitter(
  PanoRtcAnnotationManagerModule
);

/**
 * The {@link RtcAnnotationManager} class.
 */
export default class RtcAnnotationManager
  implements RtcAnnotationManagerInterface {
  /**
   * @ignore
   */
  private _annotations = new Map<string, RtcAnnotation>();

  /**
   * @ignore
   */
  private _listeners = new Map<string, Map<Listener, Listener>>();

  /**
   * @ignore
   */
  private static _callMethod<T>(method: string, args?: {}): Promise<T> {
    return PanoRtcAnnotationManagerModule.callMethod(method, args);
  }

  destroy() {
    this._annotations.forEach((value) => {
      value.destroy();
    });
    this.removeAllListeners();
  }

  /**
   * Adds the [`RtcAnnotationManagerEventHandler`]{@link RtcAnnotationManagerEventHandler} handler.
   *
   * After setting the [`RtcAnnotationManagerEventHandler`]{@link RtcAnnotationManagerEventHandler} handler, you can listen for `RtcAnnotationManager` events and receive the statistics of the corresponding RtcAnnotationManager instance.
   * @param event The event type.
   * @param listener The [`RtcAnnotationManagerEventHandler`]{@link RtcAnnotationManagerEventHandler} handler.
   */
  addListener<EventType extends keyof RtcAnnotationManagerEventHandler>(
    event: EventType,
    listener: RtcAnnotationManagerEventHandler[EventType]
  ): Subscription {
    const callback = (res: any) => {
      const { data } = res;
      // @ts-ignore
      listener(...data);
    };
    let map = this._listeners.get(event);
    if (map === undefined) {
      map = new Map<Listener, Listener>();
      this._listeners.set(event, map);
    }
    RtcAnnotationManagerEvent.addListener(Prefix + event, callback);
    map.set(listener, callback);
    return {
      remove: () => {
        this.removeListener(event, listener);
      },
    };
  }

  /**
   * Removes the [`RtcAnnotationManagerEventHandler`]{@link RtcAnnotationManagerEventHandler} handler.
   *
   * For callback events that you only want to listen for once, call this method to remove the specific [`RtcAnnotationManagerEventHandler`]{@link RtcAnnotationManagerEventHandler} objects after you have received them.
   * @param event The event type.
   * @param listener The [`RtcAnnotationManagerEventHandler`]{@link RtcAnnotationManagerEventHandler} handler.
   */
  removeListener<EventType extends keyof RtcAnnotationManagerEventHandler>(
    event: EventType,
    listener: RtcAnnotationManagerEventHandler[EventType]
  ) {
    const map = this._listeners.get(event);
    if (map === undefined) return;
    RtcAnnotationManagerEvent.removeListener(
      Prefix + event,
      map.get(listener) as Listener
    );
    map.delete(listener);
  }

  /**
   * Removes all the [`RtcAnnotationManagerEventHandler`]{@link RtcAnnotationManagerEventHandler} handlers.
   * @param event The event type.
   */
  removeAllListeners<EventType extends keyof RtcAnnotationManagerEventHandler>(
    event?: EventType
  ) {
    if (event === undefined) {
      this._listeners.forEach((_, key) => {
        RtcAnnotationManagerEvent.removeAllListeners(Prefix + key);
      });
      this._listeners.clear();
      return;
    }
    RtcAnnotationManagerEvent.removeAllListeners(Prefix + event);
    this._listeners.delete(event as string);
  }

  /**
   * @~english
   * @brief Get video annotation object.
   * @param userId  User ID
   * @param streamId Stream ID
   * @return
   *   - PanoRtcAnnotation object
   * @~chinese
   * @brief 获取视频标注对象
   * @param userId 用户ID
   * @param streamId 视频流ID
   * @return
   *  - 视频标注对象
   */
  async getVideoAnnotation(
    userId: string,
    streamId: number
  ): Promise<RtcAnnotation | undefined> {
    let annotationId = await RtcAnnotationManager._callMethod(
      'getVideoAnnotation',
      { userId, streamId }
    );
    if (typeof annotationId == 'string') {
      if (this._annotations.get(annotationId)) {
        return this._annotations.get(annotationId) as RtcAnnotation;
      }
      this._annotations.set(annotationId, new RtcAnnotation(annotationId));
      return this._annotations.get(annotationId) as RtcAnnotation;
    }
    return undefined;
  }

  /**
   * @~english
   * @brief Get share annotation object.
   * @param userId  User ID
   * @return
   *   - PanoRtcAnnotation object
   * @~chinese
   * @brief 获取共享标注对象
   * @param userId 用户ID
   * @return
   *  - 共享标注对象
   */
  async getShareAnnotation(userId: string): Promise<RtcAnnotation | undefined> {
    let annotationId = await RtcAnnotationManager._callMethod(
      'getShareAnnotation',
      { userId }
    );
    if (typeof annotationId == 'string') {
      if (this._annotations.get(annotationId)) {
        return this._annotations.get(annotationId) as RtcAnnotation;
      }
      this._annotations.set(annotationId, new RtcAnnotation(annotationId));
      return this._annotations.get(annotationId) as RtcAnnotation;
    }
    return undefined;
  }
}

/**
 * @ignore
 */
interface RtcAnnotationManagerInterface {
  getVideoAnnotation(
    userId: string,
    streamId: number
  ): Promise<RtcAnnotation | undefined>;

  getShareAnnotation(userId: string): Promise<RtcAnnotation | undefined>;
}
