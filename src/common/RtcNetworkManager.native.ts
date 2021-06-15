import { NativeEventEmitter, NativeModules } from 'react-native';
import type { ResultCode } from './Enums';

import type {
  Listener,
  RtcNetworkManagerHandler,
  Subscription,
} from './RtcEvents';

const {
  /**
   * @ignore
   */
  PanoRtcNetworkManagerModule,
} = NativeModules;
/**
 * @ignore
 */
const Prefix = PanoRtcNetworkManagerModule.prefix;
/**
 * @ignore
 */
const RtcNetworkManagerEvent = new NativeEventEmitter(
  PanoRtcNetworkManagerModule
);

/**
 * The {@link RtcNetworkManager} class.
 */
export default class RtcNetworkManager implements RtcNetworkManagerInterface {
  /**
   * @ignore
   */
  private _listeners = new Map<string, Map<Listener, Listener>>();

  /**
   * @ignore
   */
  private static _callMethod<T>(method: string, args?: {}): Promise<T> {
    return PanoRtcNetworkManagerModule.callMethod(method, args);
  }

  destroy() {
    this.removeAllListeners();
  }

  /**
   * Adds the [`RtcNetworkManagerHandler`]{@link RtcNetworkManagerHandler} handler.
   *
   * After setting the [`RtcNetworkManagerHandler`]{@link RtcNetworkManagerHandler} handler, you can listen for `RtcNetworkManager` events and receive the statistics of the corresponding RtcNetworkManager instance.
   * @param event The event type.
   * @param listener The [`RtcNetworkManagerHandler`]{@link RtcNetworkManagerHandler} handler.
   */
  addListener<EventType extends keyof RtcNetworkManagerHandler>(
    event: EventType,
    listener: RtcNetworkManagerHandler[EventType]
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
    RtcNetworkManagerEvent.addListener(Prefix + event, callback);
    map.set(listener, callback);
    return {
      remove: () => {
        this.removeListener(event, listener);
      },
    };
  }

  /**
   * Removes the [`RtcNetworkManagerHandler`]{@link RtcNetworkManagerHandler} handler.
   *
   * For callback events that you only want to listen for once, call this method to remove the specific [`RtcNetworkManagerHandler`]{@link RtcNetworkManagerHandler} objects after you have received them.
   * @param event The event type.
   * @param listener The [`RtcNetworkManagerHandler`]{@link RtcNetworkManagerHandler} handler.
   */
  removeListener<EventType extends keyof RtcNetworkManagerHandler>(
    event: EventType,
    listener: RtcNetworkManagerHandler[EventType]
  ) {
    const map = this._listeners.get(event);
    if (map === undefined) return;
    RtcNetworkManagerEvent.removeListener(
      Prefix + event,
      map.get(listener) as Listener
    );
    map.delete(listener);
  }

  /**
   * Removes all the [`RtcNetworkManagerHandler`]{@link RtcNetworkManagerHandler} handlers.
   * @param event The event type.
   */
  removeAllListeners<EventType extends keyof RtcNetworkManagerHandler>(
    event?: EventType
  ) {
    if (event === undefined) {
      this._listeners.forEach((_, key) => {
        RtcNetworkManagerEvent.removeAllListeners(Prefix + key);
      });
      this._listeners.clear();
      return;
    }
    RtcNetworkManagerEvent.removeAllListeners(Prefix + event);
    this._listeners.delete(event as string);
  }

  /**
   * @~english
   * @brief Start network test.
   * @param token     The secure token that App Server got from PANO.
   *                  NOTE: don't use the token which is used for joining channel.
   * @param delegate  Callback for test result, must be valid until stopNetworkTest called.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note The network test will consume additional bandwidth, please avoid doing network test in call.
   * @~chinese
   * @brief 启动网络测试。
   * @param token     App服务器向PANO获取的token。注意：不要使用加入频道时使用的 token。
   * @param delegate  测试结果回调，在调用 stopNetworkTest 之前必须保持有效。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 网络测试会产生额外流量，尽量避免在通话过程中进行测试。
   */
  startNetworkTest(token: string): Promise<ResultCode> {
    return RtcNetworkManager._callMethod('startNetworkTest', { token });
  }

  /**
   * @~english
   * @brief Stop network test.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 停止网络测试。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  stopNetworkTest(): Promise<ResultCode> {
    return RtcNetworkManager._callMethod('stopNetworkTest');
  }
}

/**
 * @ignore
 */
interface RtcNetworkManagerInterface {
  startNetworkTest(token: string): Promise<ResultCode>;

  stopNetworkTest(): Promise<ResultCode>;
}
