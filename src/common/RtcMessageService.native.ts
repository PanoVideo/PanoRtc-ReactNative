import type { ResultCode } from './Enums';
import { NativeEventEmitter, NativeModules } from 'react-native';
import type {
  Listener,
  Subscription,
  RtcMessageServiceEventHandler,
} from './RtcEvents';
const {
  /**
   * @ignore
   */
  PanoRtcMessageModule,
} = NativeModules;

/**
 * @ignore
 */
const Prefix = PanoRtcMessageModule.prefix;
/**
 * @ignore
 */
const RtcMessageServiceEvent = new NativeEventEmitter(PanoRtcMessageModule);

/**
 * The {@link RtcMessageService} class.
 */
export default class RtcMessageService implements RtcMessageServiceInterface {
  /**
   * @ignore
   */
  private _listeners = new Map<string, Map<Listener, Listener>>();

  /**
   * @ignore
   */
  private static _callMethod<T>(method: string, args?: {}): Promise<T> {
    return PanoRtcMessageModule.callMethod(method, args);
  }

  destroy() {
    this.removeAllListeners();
  }

  /**
   * Adds the [`RtcMessageServiceEventHandler`]{@link RtcMessageServiceEventHandler} handler.
   *
   * After setting the [`RtcMessageServiceEventHandler`]{@link RtcMessageServiceEventHandler} handler, you can listen for `RtcMessageService` events and receive the statistics of the corresponding RtcMessageService instance.
   * @param event The event type.
   * @param listener The [`RtcMessageServiceEventHandler`]{@link RtcMessageServiceEventHandler} handler.
   */
  addListener<EventType extends keyof RtcMessageServiceEventHandler>(
    event: EventType,
    listener: RtcMessageServiceEventHandler[EventType]
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
    RtcMessageServiceEvent.addListener(Prefix + event, callback);
    map.set(listener, callback);
    return {
      remove: () => {
        this.removeListener(event, listener);
      },
    };
  }

  /**
   * Removes the [`RtcMessageServiceEventHandler`]{@link RtcMessageServiceEventHandler} handler.
   *
   * For callback events that you only want to listen for once, call this method to remove the specific [`RtcMessageServiceEventHandler`]{@link RtcMessageServiceEventHandler} objects after you have received them.
   * @param event The event type.
   * @param listener The [`RtcMessageServiceEventHandler`]{@link RtcMessageServiceEventHandler} handler.
   */
  removeListener<EventType extends keyof RtcMessageServiceEventHandler>(
    event: EventType,
    listener: RtcMessageServiceEventHandler[EventType]
  ) {
    const map = this._listeners.get(event);
    if (map === undefined) return;
    RtcMessageServiceEvent.removeListener(
      Prefix + event,
      map.get(listener) as Listener
    );
    map.delete(listener);
  }

  /**
   * Removes all the [`RtcMessageServiceEventHandler`]{@link RtcMessageServiceEventHandler} handlers.
   * @param event The event type.
   */
  removeAllListeners<EventType extends keyof RtcMessageServiceEventHandler>(
    event?: EventType
  ) {
    if (event === undefined) {
      this._listeners.forEach((_, key) => {
        RtcMessageServiceEvent.removeAllListeners(Prefix + key);
      });
      this._listeners.clear();
      return;
    }
    RtcMessageServiceEvent.removeAllListeners(Prefix + event);
    this._listeners.delete(event as string);
  }

  /**
   * @~english
   * @brief Send message to specified user.
   * @param userId  The user ID.
   * @param message The message data in string format
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note You can send messages at a maximum frequency of 150 calls every three seconds.
   *       The maximum data length is 4 KB.
   * @~chinese
   * @brief 发送消息给指定用户。
   * @param userId  用户标识。
   * @param message string类型消息数据
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 发送消息的调用频率上限为每 3 秒 150 次。
   *       请确保消息大小不超过 4 KB。
   */
  sendMessage(message: string, userId: string): Promise<ResultCode> {
    return RtcMessageService._callMethod('sendMessage', { message, userId });
  }

  /**
   * @~english
   * @brief Broadcast message.
   * @param message The message data in string format
   * @param sendBack Send back flag
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note You can send messages at a maximum frequency of 150 calls every three seconds.
   *       The maximum data length is 4 KB.
   * @~chinese
   * @brief 广播消息。
   * @param message string类型消息数据
   * @param sendBack 是否回发消息
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 发送消息的调用频率上限为每 3 秒 150 次。
   *       请确保消息大小不超过 4 KB。
   */
  broadcastMessage(
    message: string,
    sendBack: boolean = true
  ): Promise<ResultCode> {
    return RtcMessageService._callMethod('broadcastMessage', {
      message,
      sendBack,
    });
  }
}

interface RtcMessageServiceInterface {
  sendMessage(message: string, userId: string): Promise<ResultCode>;

  broadcastMessage(message: string, sendBack: boolean): Promise<ResultCode>;
}
