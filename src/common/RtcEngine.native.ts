import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

import {
  RtcEngineConfig,
  RtcChannelConfig,
  RtcRenderConfig,
  RtcPoint,
  RtcAudioMixingConfig,
  RtcSnapshotVideoOption,
  FeedbackInfo,
  FaceBeautifyOption,
  RtcAudioProfile,
  QuadTransformOption,
} from './Objects';
import {
  AudioDeviceType,
  AudioEqualizationMode,
  AudioReverbMode,
  OptionType,
  ResultCode,
  ScreenScalingRatio,
  VideoFrameRateType,
} from './Enums';
import type {
  Listener,
  RtcEngineEventHandler,
  Subscription,
} from './RtcEvents';
import type { RtcSurfaceView } from './RtcRenderView.native';
import type { RefObject } from 'react';
import RtcWhiteboard from './RtcWhiteboard.native';
import RtcVideoStreamManager from './RtcVideoStreamManager.native';
import RtcAnnotationManager from './RtcAnnotationManager.native';
import RtcNetworkManager from './RtcNetworkManager.native';
import RtcMessageService from './RtcMessageService.native';

const {
  /**
   * @ignore
   */
  PanoRtcEngineModule,
} = NativeModules;
/**
 * @ignore
 */
const Prefix = PanoRtcEngineModule.prefix;
/**
 * @ignore
 */
const RtcEngineEvent = new NativeEventEmitter(PanoRtcEngineModule);

/**
 * @ignore
 */
let engine: RtcEngineKit | undefined;

/**
 * [`RtcEngineKit`]{@link RtcEngineKit} is the main class of the PanoRtc SDK.
 */
export default class RtcEngineKit implements RtcEngineKitInterface {
  /**
   * @ignore
   */
  private _listeners = new Map<string, Map<Listener, Listener>>();

  private _whiteboardMap = new Map<String, RtcWhiteboard>();
  private _videoStreamManager: RtcVideoStreamManager | undefined;
  private _annotationManager: RtcAnnotationManager | undefined;
  private _messageService: RtcMessageService | undefined;
  private _networkManager: RtcNetworkManager | undefined;

  /**
   * @ignore
   */
  private static _callMethod<T>(method: string, args?: {}): Promise<T> {
    return PanoRtcEngineModule.callMethod(method, args);
  }

  /**
   * Gets a created [`RtcEngineKit`]{@link RtcEngineKit} instance.
   *
   * **Note**
   *
   * Ensure that you have created an `RtcEngineKit`. Otherwise, the method call fails and the SDK returns an error message.
   * @returns
   * - The `RtcEngineKit` instance, if the method call succeeds.
   * - Returns an error when it fails to get an `RtcEngineKit`.
   */
  static instance(): RtcEngineKit {
    if (engine) {
      return engine as RtcEngineKit;
    } else {
      throw new Error('please create RtcEngineKit first');
    }
  }

  /**
   * Creates an [`RtcEngineKit`]{@link RtcEngineKit} instance.
   *
   * Unless otherwise specified, all the methods provided by the [`RtcEngineKit`]{@link RtcEngineKit} class are executed asynchronously. Pano recommends calling these methods in the same thread.
   *
   * **Note**
   * - You must create an [`RtcEngineKit`]{@link RtcEngineKit} instance before calling any other method.
   * - The Pano React Native SDK supports creating only one [`RtcEngineKit`]{@link RtcEngineKit} instance for an app.
   * @param config An [`RtcEngineConfig`]{@link RtcEngineConfig}
   * @returns
   * - The `RtcEngineKit` instance, if the method call succeeds.
   * @note If the object creation fails, an null object is returned.
   */
  static async create(config: RtcEngineConfig): Promise<RtcEngineKit> {
    if (engine) return engine;
    await RtcEngineKit._callMethod('create', { config });
    engine = new RtcEngineKit();
    engine.setParameters(
      JSON.stringify({
        pano_sdk: { sdk_type: 'react native' },
      })
    );
    return engine;
  }

  updateConfig(config: RtcEngineConfig): Promise<ResultCode> {
    return RtcEngineKit._callMethod('updateConfig', { config });
  }

  /**
   * Destroys the [`RtcEngineKit`]{@link RtcEngineKit} instance and releases all resources used by the PanoRtc SDK.
   *
   * Use this method for apps in which users occasionally make voice or video calls. When users do not make calls, you can free up resources for other operations.
   * Once you call this method to destroy the created [`RtcEngineKit`]{@link RtcEngineKit} instance, you cannot use any method or callback in the SDK any more.
   * If you want to use the real-time communication functions again, you must call `create` to create a new [`RtcEngineKit`]{@link RtcEngineKit} instance.
   *
   * **Note**
   *
   * - Because [`destroy`]{@link destroy} is a synchronous method and the app cannot move on to another task until the execution completes,
   * Pano suggests calling this method in a sub-thread to avoid congestion in the main thread.
   * Besides, you cannot call [`destroy`]{@link destroy} in any method or callback of the SDK.
   * Otherwise, the SDK cannot release the resources occupied by the [`RtcEngineKit`]{@link RtcEngineKit} instance until the callbacks return results, which may result in a deadlock.
   * - If you want to create a new [`RtcEngineKit`]{@link RtcEngineKit} instance after destroying the current one, ensure that you wait till the [`destroy`]{@link destroy} method completes executing.
   */
  destroy(): Promise<void> {
    this.removeAllListeners();
    engine = undefined;
    this._whiteboardMap.forEach(function (value) {
      value.destroy();
    });
    this._whiteboardMap.clear();
    this._videoStreamManager?.destroy();
    this._annotationManager?.destroy();
    this._messageService?.destroy();
    this._networkManager?.destroy();
    return RtcEngineKit._callMethod('destroy');
  }

  /**
   * Adds the [`RtcEngineEventHandler`]{@link RtcEngineEventHandler} handler.
   *
   * After setting the [`RtcEngineEventHandler`]{@link RtcEngineEventHandler} handler, you can listen for `RtcEngineKit` events and receive the statistics of the corresponding RtcEngineKit instance.
   * @param event The event type.
   * @param listener The [`RtcEngineEventHandler`]{@link RtcEngineEventHandler} handler.
   */
  addListener<EventType extends keyof RtcEngineEventHandler>(
    event: EventType,
    listener: RtcEngineEventHandler[EventType]
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
    RtcEngineEvent.addListener(Prefix + event, callback);
    map.set(listener, callback);
    return {
      remove: () => {
        this.removeListener(event, listener);
      },
    };
  }

  /**
   * Removes the [`RtcEngineEventHandler`]{@link RtcEngineEventHandler} handler.
   *
   * For callback events that you only want to listen for once, call this method to remove the specific [`RtcEngineEventHandler`]{@link RtcEngineEventHandler} objects after you have received them.
   * @param event The event type.
   * @param listener The [`RtcEngineEventHandler`]{@link RtcEngineEventHandler} handler.
   */
  removeListener<EventType extends keyof RtcEngineEventHandler>(
    event: EventType,
    listener: RtcEngineEventHandler[EventType]
  ) {
    const map = this._listeners.get(event);
    if (map === undefined) return;
    RtcEngineEvent.removeListener(
      Prefix + event,
      map.get(listener) as Listener
    );
    map.delete(listener);
  }

  /**
   * Removes all the [`RtcEngineEventHandler`]{@link RtcEngineEventHandler} handlers.
   * @param event The event type.
   */
  removeAllListeners<EventType extends keyof RtcEngineEventHandler>(
    event?: EventType
  ) {
    if (event === undefined) {
      this._listeners.forEach((_, key) => {
        RtcEngineEvent.removeAllListeners(Prefix + key);
      });
      this._listeners.clear();
      return;
    }
    RtcEngineEvent.removeAllListeners(Prefix + event);
    this._listeners.delete(event as string);
  }

  /**
   * @~english
   * @brief Join the channel.
   * @param token     The secure token that App Server got from PANO.
   * @param channelId The channel ID defined by customer. It must compliance with the following rules:
   *                  - max length is 128 bytes.
   *                  - characters can be "0-9", "a-z", "A-Z",
   *                    whitespace (cannot at leading and trailing),
   *                    "!", "#", "$", "%", "&", "(", ")", "+", ",", "-", ".", ":",
   *                    ";", "<", "=", ">", "?", "@", "[", "]", "^", "_", "|", "~".
   * @param userId    The user ID defined by customer. It must be unique.
   * @param config    Channel configurations. (Optional)
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note Join only one channel at a time.
   *       User need to check the callback onUserJoinIndication to see if join channel result.
   * @~chinese
   * @brief 加入频道。
   * @param token     应用服务器从PANO获得的安全令牌。
   * @param channelId 客户定义的频道标识。必须符合以下规则:
   *                  - 最大长度是128字节；
   *                  - 只能由以下字符构成：
   *                    "0-9", "a-z", "A-Z", 空格 (不能出现在首部和尾部),
   *                    "!", "#", "$", "%", "&", "(", ")", "+", ",", "-", ".", ":",
   *                    ";", "<", "=", ">", "?", "@", "[", "]", "^", "_", "|", "~"。
   * @param userId    客户定义的用户标识。必须是唯一的。
   * @param config    频道设置。（可选）
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 同一时刻只能加入一个频道。
   *       用户需检查回调函数 onUserJoinIndication 获知加会结果。
   */
  joinChannel(
    token: string | undefined | null,
    channelId: string,
    userId: string,
    config: RtcChannelConfig = new RtcChannelConfig()
  ): Promise<ResultCode> {
    return RtcEngineKit._callMethod('joinChannel', {
      token,
      channelId,
      userId,
      config,
    });
  }

  /**
   * @~english
   * @brief Leave the channel.
   * @~chinese
   * @brief 离开频道。
   */
  leaveChannel(): Promise<void> {
    return RtcEngineKit._callMethod('leaveChannel');
  }

  /**
   * @~english
   * @brief Start audio.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note Please join one channel before starting audio, otherwise it will fail.
   * @~chinese
   * @brief 开启音频。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 开启音频前请先加入一个频道，否则将返回失败。
   */
  startAudio(): Promise<ResultCode> {
    return RtcEngineKit._callMethod('startAudio');
  }

  /**
   * @~english
   * @brief Stop audio.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 停止音频。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  stopAudio(): Promise<ResultCode> {
    return RtcEngineKit._callMethod('stopAudio');
  }

  /**
   * @~english
   * @brief Start video (with a render view).
   * @param view    PanoView object.
   * @param config  PanoRtcRenderConfig object.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note Please join one channel before starting video, otherwise it will fail.
   * @~chinese
   * @brief 开启视频（随带渲染视图）。
   * @param view    PanoView 对象。
   * @param config  PanoRtcRenderConfig 对象。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 开启视频前请先加入一个频道，否则将返回失败。
   */
  startVideo(
    view: RefObject<RtcSurfaceView>,
    config: RtcRenderConfig = new RtcRenderConfig()
  ): Promise<ResultCode> {
    if (view.current === undefined) {
      return Promise.resolve(ResultCode.InvalidArgs);
    } else {
      return view.current!._callMethod('startVideo', { config });
    }
  }

  /**
   * @~english
   * @brief Stop video.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 停止视频。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  stopVideo(): Promise<ResultCode> {
    return RtcEngineKit._callMethod('stopVideo');
  }

  /**
   * @~english
   * @brief Subscribe to a user's audio.
   * @param userId  The user ID defined by customer.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note Before subscribing to a user’s audio, please make sure the user has started the audio.
   * @~chinese
   * @brief 订阅用户的音频。
   * @param userId  客户定义的用户标识。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 订阅用户的音频前，请确保用户已开启音频。
   */
  subscribeAudio(userId: string): Promise<ResultCode> {
    return RtcEngineKit._callMethod('subscribeAudio', { userId });
  }

  /**
   * @~english
   * @brief Unsubscribe to a user's audio.
   * @param userId  The user ID defined by customer.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note When a user stops the audio or leaves the channel, the user's audio will be automatically unsubscribed.
   * @~chinese
   * @brief 取消订阅用户的音频。
   * @param userId  客户定义的用户标识。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 当用户停止音频或者离开频道的时候，用户的音频将会被自动取消订阅。
   */
  unsubscribeAudio(userId: string): Promise<ResultCode> {
    return RtcEngineKit._callMethod('unsubscribeAudio', { userId });
  }

  /**
   * @~english
   * @brief Subscribe to a user's video (with a render view).
   * @param userId  The user ID defined by customer.
   * @param view    PanoView object.
   * @param config  PanoRtcRenderConfig object.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note Before subscribing to a user’s video, please make sure the user has started the video.
   * @~chinese
   * @brief 订阅用户的视频（随带渲染视图）。
   * @param userId  客户定义的用户标识。
   * @param view    PanoView 对象。
   * @param config  PanoRtcRenderConfig 对象。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 订阅用户的视频前，请确保用户已开启视频。
   */
  subscribeVideo(
    userId: string,
    view: RefObject<RtcSurfaceView>,
    config: RtcRenderConfig = new RtcRenderConfig()
  ): Promise<ResultCode> {
    if (view.current === undefined) {
      return Promise.resolve(ResultCode.InvalidArgs);
    } else {
      return view.current!._callMethod('subscribeVideo', { userId, config });
    }
  }

  /**
   * @~english
   * @brief Unsubscribe to a user's video.
   * @param userId  The user ID defined by customer.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note When a user stops the video or leaves the channel, the user's video will be automatically unsubscribed.
   * @~chinese
   * @brief 取消订阅用户的视频。
   * @param userId  客户定义的用户标识。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 当用户停止视频或者离开频道的时候，用户的视频将会被自动取消订阅。
   */
  unsubscribeVideo(userId: string): Promise<ResultCode> {
    return RtcEngineKit._callMethod('unsubscribeVideo', { userId });
  }

  /**
   * @~english
   * @brief Subscribe to a user's screen sharing (with a render view).
   * @param userId  The user ID defined by customer.
   * @param view    PanoView object.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note Before subscribing to a user’s screen sharing, please make sure the user has started the screen sharing.
   * @~chinese
   * @brief 订阅用户的屏幕共享（随带渲染视图）。
   * @param userId  客户定义的用户标识。
   * @param view    PanoView 对象。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 订阅用户的屏幕共享前，请确保用户已开启屏幕共享。
   */
  subscribeScreen(
    userId: string,
    view: RefObject<RtcSurfaceView>
  ): Promise<ResultCode> {
    if (view.current === undefined) {
      return Promise.resolve(ResultCode.InvalidArgs);
    } else {
      return view.current!._callMethod('subscribeScreen', { userId });
    }
  }

  /**
   * @~english
   * @brief Unsubscribe to a user's screen sharing.
   * @param userId  The user ID defined by customer.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note When a user stops the screen sharing or leaves the channel,
   *       the user's screen sharing will be automatically unsubscribed.
   * @~chinese
   * @brief 取消订阅用户的屏幕共享。
   * @param userId  客户定义的用户标识。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 当用户停止屏幕共享或者离开频道的时候，用户的屏幕共享将会被自动取消订阅。
   */
  unsubscribeScreen(userId: string): Promise<ResultCode> {
    return RtcEngineKit._callMethod('unsubscribeScreen', { userId });
  }

  /**
   * @~english
   * @brief Start screen capture.
   * @param appGroupId  Application Group Identifier. Online document: https://developer.pano.video/features/rtc/screen-ios/ (Optional)(iOS only)
   * @return
   *   - OK: Success.
   *   - others: Failure.
   * @note iOS: This interface supports iPhone and iPad with iOS 11.0 and above
   *
   * @~chinese
   * @brief 开始屏幕采集。
   * @param appGroupId  Application Group Identifier。请参考文档：https://developer.pano.video/features/rtc/screen-ios/（可选）（仅限iOS）
   * @return
   *   - OK: 成功。
   *   - 其他: 失败。
   * @note iOS: 该接口支持 iOS 11.0 及以上的 iPhone 和 iPad
   */
  startScreen(appGroupId: string = ''): Promise<ResultCode> {
    if (Platform.OS === 'android') {
      return RtcEngineKit._callMethod('startScreen');
    } else {
      return RtcEngineKit._callMethod('startScreen', { appGroupId });
    }
  }

  /**
   * @~english
   * @brief Stop screen capture.
   * @return
   *   - OK: Success.
   *   - others: Failure.
   *
   * @~chinese
   * @brief 停止屏幕采集。
   * @return
   *   - OK: 成功。
   *   - 其他: 失败。
   */
  stopScreen(): Promise<ResultCode> {
    return RtcEngineKit._callMethod('stopScreen');
  }

  /**
   * @~english
   * @brief Update screen absolute scaling ratio.
   * @param userId  The user ID defined by customer.
   * @param ratio   Screen scaling ratio type.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note The default focus is center point of view.
   * @~chinese
   * @brief 更新屏幕的绝对缩放比例。
   * @param userId  客户定义的用户标识。
   * @param ratio   屏幕缩放比例类型。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 默认焦点是视图的中心点。
   */
  updateScreenScaling(
    userId: string,
    ratio: ScreenScalingRatio
  ): Promise<ResultCode> {
    return RtcEngineKit._callMethod('updateScreenScaling', { userId, ratio });
  }

  /**
   * @~english
   * @brief Update screen relative scaling ratio.
   * @param userId  The user ID defined by customer.
   * @param ratio   Screen scaling ratio value.
   * @param focus   Screen focus coordinate value.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note
   * @~chinese
   * @brief 更新屏幕的相对缩放比例。
   * @param userId  客户定义的用户标识。
   * @param ratio   屏幕缩放比例值。
   * @param focus   屏幕焦点坐标值。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note
   */
  updateScreenScalingWithFocus(
    userId: string,
    ratio: number,
    focus: RtcPoint
  ): Promise<ResultCode> {
    return RtcEngineKit._callMethod('updateScreenScalingWithFocus', {
      userId,
      ratio,
      focus,
    });
  }

  /**
   * @~english
   * @brief Update screen relative moving distance.
   * @param userId    The user ID defined by customer.
   * @param distance  Screen focus moving distance.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note
   * @~chinese
   * @brief 更新屏幕的相对移动距离。
   * @param userId    客户定义的用户标识。
   * @param distance  屏幕焦点移动距离。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note
   */
  updateScreenMoving(userId: string, distance: RtcPoint): Promise<ResultCode> {
    return RtcEngineKit._callMethod('updateScreenMoving', { userId, distance });
  }

  /**
   * @~english
   * @brief Mute audio.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note Please start the audio before muting, otherwise it will not work.
   * @~chinese
   * @brief 静音。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 静音前请先开启音频，否则操作将无效。
   */
  muteAudio(): Promise<ResultCode> {
    return RtcEngineKit._callMethod('muteAudio');
  }

  /**
   * @~english
   * @brief Unmute audio.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note Please start the audio before unmuting, otherwise it will not work.
   * @~chinese
   * @brief 取消静音。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 取消静音前请先开启音频，否则操作将无效。
   */
  unmuteAudio(): Promise<ResultCode> {
    return RtcEngineKit._callMethod('unmuteAudio');
  }

  /**
   * @~english
   * @brief Pause video.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note Please start the video before pausing, otherwise it will not work.
   * @~chinese
   * @brief 暂停视频。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 暂停视频前请先开启视频，否则操作将无效。
   */
  muteVideo(): Promise<ResultCode> {
    return RtcEngineKit._callMethod('muteVideo');
  }

  /**
   * @~english
   * @brief Resume video.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note Please start the video before resuming, otherwise it will not work.
   * @~chinese
   * @brief 恢复视频。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 恢复视频前请先开启视频，否则操作将无效。
   */
  unmuteVideo(): Promise<ResultCode> {
    return RtcEngineKit._callMethod('unmuteVideo');
  }

  /**
   * @~english
   * @brief set microphone mute enable status
   * @param enable  enable mute flag, true/false to mute/unmute
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 设置麦克风采集数据静音状态(不包括伴音等其他声音)
   * @param enable  静音开关， 打开/关闭 静音
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  setMicrophoneMuteStatus(enable: boolean): Promise<ResultCode> {
    return RtcEngineKit._callMethod('setMicrophoneMuteStatus', { enable });
  }

  /**
   * @~english
   * @brief Set the volume of the current audio device.
   * @param volume  Valid value range: [0, 255].
   * @param type    Device type, PanoDeviceType enum type.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 设置当前音频设备的音量。
   * @param volume  有效值范围: [0, 255]。
   * @param type    设备类型，PanoDeviceType 枚举类型。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  setAudioDeviceVolume(
    volume: number,
    type: AudioDeviceType
  ): Promise<ResultCode> {
    return RtcEngineKit._callMethod('setAudioDeviceVolume', { volume, type });
  }

  /**
   * @~english
   * @brief Get the volume of the current audio device.
   * @param type  Device type, PanoDeviceType enum type.
   * @return Current volume. Valid value range: [0, 255].
   * @~chinese
   * @brief 获取当前音频设备的音量。
   * @param type  设备类型，PanoDeviceType 枚举类型。
   * @return 当前音量。有效值范围: [0, 255]。
   */
  getAudioDeviceVolume(type: AudioDeviceType): Promise<number> {
    return RtcEngineKit._callMethod('getAudioDeviceVolume', { type });
  }

  /**
   * @~english
   * @brief Get audio capture level.
   * @return Audio capture level.
   * @~chinese
   * @brief 获取音频采集强度值。
   * @return 音频采集强度值。
   */
  getRecordingLevel(): Promise<number> {
    return RtcEngineKit._callMethod('getRecordingLevel');
  }

  /**
   * @~english
   * @brief Get audio playout level.
   * @return Audio playout level.
   * @~chinese
   * @brief 获取音频播放强度值。
   * @return 音频播放强度值。
   */
  getPlayoutLevel(): Promise<number> {
    return RtcEngineKit._callMethod('getPlayoutLevel');
  }

  /**
   * @~english
   * @brief Set loudspeaker enable status.
   * @param enable  Whether to enable.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 设置扬声器启用状态。
   * @param enable  是否启用。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  setLoudspeakerStatus(enable: boolean): Promise<ResultCode> {
    return RtcEngineKit._callMethod('setLoudspeakerStatus', { enable });
  }

  /**
   * @~english
   * @brief Get loudspeaker enable status.
   * @return Whether to enable.
   * @~chinese
   * @brief 获取扬声器启用状态。
   * @return 是否启用。
   */
  isEnabledLoudspeaker(): Promise<boolean> {
    return RtcEngineKit._callMethod('isEnabledLoudspeaker');
  }

  /**
   * @~english
   * @brief Switch front and rear cameras.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 切换前后置摄像头。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  switchCamera(): Promise<ResultCode> {
    return RtcEngineKit._callMethod('switchCamera');
  }

  /**
   * @~english
   * @brief Get current camera type.
   * @return Whether it is a front camera.
   * @~chinese
   * @brief 获取当前摄像头类型。
   * @return 是否是前置摄像头。
   */
  isFrontCamera(): Promise<boolean> {
    return RtcEngineKit._callMethod('isFrontCamera');
  }

  /**
   * @~english
   * @brief Get camera device ID.
   * @param frontCamera   Camera device type, YES is front camera, NO is back camera.
   * @return Device unique ID.
   * @~chinese
   * @brief 获取摄像头设备标识。
   * @param frontCamera   摄像头设备类型，YES是前置摄像头，NO是后置摄像头。
   * @return 设备唯一标识。
   */
  getCameraDeviceId(frontCamera: boolean): Promise<string> {
    return RtcEngineKit._callMethod('getCameraDeviceId', { frontCamera });
  }

  /**
   * @~english
   * @brief Start current camera preview (with a render view).
   * @param view    PanoView object.
   * @param config  PanoRtcRenderConfig object.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 开启当前摄像头预览（随带渲染视图）。
   * @param view    PanoView 对象。
   * @param config  PanoRtcRenderConfig 对象。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  startPreview(
    view: RefObject<RtcSurfaceView>,
    config: RtcRenderConfig = new RtcRenderConfig()
  ): Promise<ResultCode> {
    if (view.current === undefined) {
      return Promise.resolve(ResultCode.InvalidArgs);
    } else {
      return view.current!._callMethod('startPreview', { config });
    }
  }

  /**
   * @~english
   * @brief Stop current camera preview. (iOS only)
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 停止当前摄像头预览。（仅限iOS）
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  stopPreview(): Promise<ResultCode> {
    return RtcEngineKit._callMethod('stopPreview');
  }

  /**
   * @~english
   * @brief Create audio mixing task.
   * @param taskId    unique identifier of task.
   * @param filename  full path of music file. support mp3, aac, wav.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   *
   * @~chinese
   * @brief 创建混音任务。
   * @param taskId    任务标识。
   * @param filename  音频文件的完整路径。支持mp3，aac，wav。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  createAudioMixingTask(taskId: number, filename: String): Promise<ResultCode> {
    return RtcEngineKit._callMethod('createAudioMixingTask', {
      taskId,
      filename,
    });
  }

  /**
   * @~english
   * @brief Destroy audio mixing task.
   * @param taskId    unique identifier of task.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   *
   * @~chinese
   * @brief 销毁混音任务。
   * @param taskId    任务标识。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  destroyAudioMixingTask(taskId: number): Promise<ResultCode> {
    return RtcEngineKit._callMethod('destroyAudioMixingTask', { taskId });
  }

  /**
   * @~english
   * @brief Start audio mixing task.
   * @param taskId   unique identifier of task.
   * @param config   task configuration
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note The real mixing process will only work after joining channel.
   *
   * @~chinese
   * @brief 启动混音任务。
   * @param taskId    任务标识。
   * @param config    配置参数。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 实际的混音操作仅在加入房间后进行。
   */
  startAudioMixingTask(
    taskId: number,
    config: RtcAudioMixingConfig = new RtcAudioMixingConfig()
  ): Promise<ResultCode> {
    return RtcEngineKit._callMethod('startAudioMixingTask', { taskId, config });
  }

  /**
   * @~english
   * @brief Update audio mixing task configuration.
   * @param taskId   unique identifier of task.
   * @param config   task configuration
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   *
   * @~chinese
   * @brief 更新混音任务配置参数。
   * @param taskId    任务标识。
   * @param config    配置参数。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  updateAudioMixingTask(
    taskId: number,
    config: RtcAudioMixingConfig
  ): Promise<ResultCode> {
    return RtcEngineKit._callMethod('updateAudioMixingTask', {
      taskId,
      config,
    });
  }

  /**
   * @~english
   * @brief Stop audio mixing task.
   * @param taskId    unique identifier of task.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   *
   * @~chinese
   * @brief 结束混音任务。
   * @param taskId    任务标识。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  stopAudioMixingTask(taskId: number): Promise<ResultCode> {
    return RtcEngineKit._callMethod('stopAudioMixingTask', { taskId });
  }

  /**
   * @~english
   * @brief Resume the paused audio mixing task.
   * @param taskId    unique identifier of task.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   *
   * @~chinese
   * @brief 恢复被暂停的混音任务。
   * @param taskId    任务标识。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  resumeAudioMixing(taskId: number): Promise<ResultCode> {
    return RtcEngineKit._callMethod('resumeAudioMixing', { taskId });
  }

  /**
   * @~english
   * @brief Pause audio mixing task.
   * @param taskId    unique identifier of task.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   *
   * @~chinese
   * @brief 暂停混音任务。
   * @param taskId    任务标识。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  pauseAudioMixing(taskId: number): Promise<ResultCode> {
    return RtcEngineKit._callMethod('pauseAudioMixing', { taskId });
  }

  /**
   * @~english
   * @brief Get duration of music file.
   * @param taskId    unique identifier of task.
   * @return Duration with millisecond. If fail, the duration is less than 0.
   * @note The duration is estimated based on the average bitrate. For some audio files with
   * a non-constant bitrate, there may be a deviation from the actual value.
   *
   * @~chinese
   * @brief 获取音频文件的总时长。
   * @param taskId    任务标识。
   * @return 毫秒级总时长。如果失败，返回值小于0。
   * @note 总时长是根据文件平均码率估算出来的。对于某些非恒定码率的音频文件，可能与实际总时长相比存在一定偏差。
   */
  getAudioMixingDuration(taskId: number): Promise<number> {
    return RtcEngineKit._callMethod('getAudioMixingDuration', { taskId });
  }

  /**
   * @~english
   * @brief Get current timestamp.
   * @param taskId    unique identifier of task.
   * @return Current timestamp with millisecond. If fail or task has stopped, the timestamp is less than 0.
   *
   * @~chinese
   * @brief 获取当前时间戳。
   * @param taskId    任务标识。
   * @return 毫秒级当前时间戳。如果失败或者混音任务已结束，返回值小于0。
   */
  getAudioMixingCurrentTimestamp(taskId: number): Promise<number> {
    return RtcEngineKit._callMethod('getAudioMixingCurrentTimestamp', {
      taskId,
    });
  }

  /**
   * @~english
   * @brief Seek to target timestamp.
   * @param taskId        unique identifier of task.
   * @param timestampMs   timestamp.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   *
   * @~chinese
   * @brief 跳转至指定时间戳。
   * @param taskId        任务标识。
   * @param timestampMs   时间戳。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  seekAudioMixing(taskId: number, timestampMs: number): Promise<ResultCode> {
    return RtcEngineKit._callMethod('seekAudioMixing', { taskId, timestampMs });
  }

  /**
   * @brief Capture specific user's video content
   * @param outputDir output directory
   * @param userId    the id of target user
   * @param option    snapshot option
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 捕获指定用户的视频画面
   * @param outputDir 输出路径
   * @param userId    目标用户的ID
   * @param option    快照选项
   * @return
   *  - ResultCode.OK: 成功
   *  - 其他: 失败
   */
  snapshotVideo(
    outputDir: string,
    userId: string,
    option: RtcSnapshotVideoOption = new RtcSnapshotVideoOption()
  ): Promise<ResultCode> {
    return RtcEngineKit._callMethod('snapshotVideo', {
      outputDir,
      userId,
      option,
    });
  }

  /**
   * @~english
   * @brief Switch whiteboard control object.
   * @param whiteboardId whiteboard Id
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note
   *   - This interface is used for multiple whiteboard case.
   *   - PanoRtcEngineKit creates whiteboard with whiteboard Id "default" automatically
   *   - RtcEngine will reserve whiteboard Id with "pano-" prefix, please don't use it.
   *   - When call this interface with whiteboard Id not set before, PanoRtcEngineKit will create new whiteboard internal.
   *   - Call whiteboardEngine to get current whiteboard object after switch.
   * @~chinese
   * @brief 切换白板控制对象
   * @param whiteboardId 白板Id
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note
   *   - 此接口用于多白板用例场景。
   *   - PanoRtcEngineKit会自动创建白板Id为"default"的白板
   *   - RtcEngine会保留前缀为"pano-"的白板Id，请不要使用
   *   - 当传入的whiteboardId之前没被设置过，PanoRtcEngineKit会生成新的白板
   *   - 切换后需要调用whiteboardEngine获得当前的白板控制对象。
   */
  switchWhiteboardEngine(whiteboardId: string): Promise<ResultCode> {
    return RtcEngineKit._callMethod('switchWhiteboardEngine', { whiteboardId });
  }

  /**
   * @~english
   * @brief Get whiteboard control object.
   * @return PanoRtcWhiteboard object.
   * @~chinese
   * @brief 获取白板控制对象。
   * @return PanoRtcWhiteboard 对象。
   */
  whiteboardEngine(): Promise<RtcWhiteboard> {
    return RtcEngineKit._callMethod('whiteboardEngine').then((value) => {
      const whiteboardId = <string>value;
      let whiteboard = this._whiteboardMap.get(whiteboardId);
      if (whiteboard == null) {
        whiteboard = new RtcWhiteboard(whiteboardId);
        this._whiteboardMap.set(whiteboardId, whiteboard);
      }
      return whiteboard;
    });
  }

  /**
   * @~english
   * @brief Start audio dump.
   * @param filePath      The dump file path.
   * @param maxFileSize   The max dump file size. If the value is -1, the file size is unlimited.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 开启音频转储。
   * @param filePath      转储文件路径.
   * @param maxFileSize   最大转储文件大小. 如果值为-1，则文件大小不受限制。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  startAudioDumpWithFilePath(
    filePath: string,
    maxFileSize: number
  ): Promise<ResultCode> {
    return RtcEngineKit._callMethod('startAudioDumpWithFilePath', {
      filePath,
      maxFileSize,
    });
  }

  /**
   * @~english
   * @brief Stop audio dump.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 停止音频转储。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  stopAudioDump(): Promise<ResultCode> {
    return RtcEngineKit._callMethod('stopAudioDump');
  }

  /**
   * @~english
   * @brief Send feedback to PANO.
   * @param info  Feedback info.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 发送用户反馈到 PANO。
   * @param info  反馈的信息。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  sendFeedback(info: FeedbackInfo): Promise<ResultCode> {
    return RtcEngineKit._callMethod('sendFeedback', { info });
  }

  /**
   * @~english
   * @brief Set option object to PANO SDK.
   * @param option  The Option object.
   * @param type    PanoOptionType enum type.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 设置选项对象给PANO SDK。
   * @param option  选项对象。
   * @param type    PanoOptionType 枚举类型。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  setOption(option: any, type: OptionType): Promise<ResultCode> {
    let isValid = false;
    switch (type) {
      case OptionType.FaceBeautify: {
        if (option instanceof FaceBeautifyOption) {
          isValid = true;
        }
        break;
      }
      case OptionType.UploadLogs: {
        if (typeof option === 'boolean') {
          isValid = true;
        }
        break;
      }
      case OptionType.UploadAudioDump: {
        if (typeof option === 'boolean') {
          isValid = true;
        }
        break;
      }
      case OptionType.AudioEqualizationMode: {
        if (option in AudioEqualizationMode) {
          isValid = true;
        }
        break;
      }
      case OptionType.AudioReverbMode: {
        if (option in AudioReverbMode) {
          isValid = true;
        }
        break;
      }
      case OptionType.VideoFrameRate: {
        if (option in VideoFrameRateType) {
          isValid = true;
        }
        break;
      }
      case OptionType.AudioEarMonitoring: {
        if (typeof option === 'boolean') {
          isValid = true;
        }
        break;
      }
      case OptionType.BuiltinTransform: {
        break;
      }
      case OptionType.UploadLogsAtFailure: {
        if (typeof option === 'boolean') {
          isValid = true;
        }
        break;
      }
      case OptionType.CpuAdaption: {
        if (typeof option === 'boolean') {
          isValid = true;
        }
        break;
      }
      case OptionType.AudioProfile: {
        if (option instanceof RtcAudioProfile) {
          isValid = true;
        }
        break;
      }
      case OptionType.QuadTransform: {
        if (option instanceof QuadTransformOption) {
          isValid = true;
        }
        break;
      }
      case OptionType.ScreenOptimization: {
        if (typeof option === 'boolean') {
          isValid = true;
        }
        break;
      }
      default: {
        break;
      }
    }
    if (!isValid) {
      return Promise.resolve(ResultCode.InvalidArgs);
    } else {
      return RtcEngineKit._callMethod('setOption', { option, type });
    }
  }

  /**
   * @~english
   * @brief Set customized parameters to PANO SDK.
   * @param param   JSON-format parameters.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @note
   * @~chinese
   * @brief 设置自定义参数给PANO SDK。
   * @param param   JSON格式参数。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note
   */
  setParameters(param: string): Promise<ResultCode> {
    return RtcEngineKit._callMethod('setParameters', { param });
  }

  /**
   * @~english
   * @brief Get video stream manager object.
   * @return PanoRtcVideoStreamManager object.
   * @note If no application client will send more than one video stream at same time,
   *       then it's NO need to use the video stream manager.
   * @~chinese
   * @brief 获取视频流管理器对象。
   * @return PanoRtcVideoStreamManager 对象。
   * @note 如果应用各端都不会同时发送多路视频流，则无需使用视频流管理器。
   */
  async videoStreamManager(): Promise<RtcVideoStreamManager> {
    if (this._videoStreamManager) return this._videoStreamManager;
    await RtcEngineKit._callMethod('videoStreamManager');
    this._videoStreamManager = new RtcVideoStreamManager();
    return this._videoStreamManager;
  }

  /**
   * @~english
   * @brief Get annotation manager object.
   * @return PanoRtcAnnotationManager object.
   * @~chinese
   * @brief 获取标注管理器对象。
   * @return PanoRtcAnnotationManager 对象。
   */
  async annotationManager(): Promise<RtcAnnotationManager> {
    if (this._annotationManager) return this._annotationManager;
    await RtcEngineKit._callMethod('annotationManager');
    this._annotationManager = new RtcAnnotationManager();
    return this._annotationManager;
  }

  /**
   * @~english
   * @brief get the message service interface.
   * @return RtcMessageService object.
   * @~chinese
   * @brief 获取消息服务的接口指针
   * @return RtcMessageService 对象。
   */
  async messageService(): Promise<RtcMessageService> {
    if (this._messageService) return this._messageService;
    await RtcEngineKit._callMethod('messageService');
    this._messageService = new RtcMessageService();
    return this._messageService;
  }

  /**
   * @~english
   * @brief get the network manager, it can be called before initialize.
   * @return
   *   - non-null: the Network Manager objetc.
   *   - others: Failure
   * @~chinese
   * @brief 获取网络管理器的指针。
   * @return
   *  - 非空： 指向网络管理器对象。
   *  - 空指针: 失败
   */
  async networkManager(): Promise<RtcNetworkManager> {
    if (this._networkManager) return this._networkManager;
    await RtcEngineKit._callMethod('networkManager');
    this._networkManager = new RtcNetworkManager();
    return this._networkManager;
  }
}

/**
 * @ignore
 */
interface RtcEngineKitInterface
  extends RtcDeviceManagerInterface,
    RtcAudioMixingManagerInterface,
    RtcSnapshotInterface,
    RtcWhiteboardManagerInterface,
    RtcTroubleshootInterface,
    RtcOptionInterface,
    RtcCustomizedInterface,
    RtcManagersInterface {
  updateConfig(config: RtcEngineConfig): Promise<ResultCode>;

  destroy(): Promise<void>;

  joinChannel(
    token: string | undefined | null,
    channelId: string,
    userId: string,
    config?: RtcChannelConfig
  ): Promise<ResultCode>;

  leaveChannel(): Promise<void>;

  startAudio(): Promise<ResultCode>;

  stopAudio(): Promise<ResultCode>;

  startVideo(
    view: RefObject<RtcSurfaceView>,
    config?: RtcRenderConfig
  ): Promise<ResultCode>;

  stopVideo(): Promise<ResultCode>;

  subscribeAudio(userId: string): Promise<ResultCode>;

  unsubscribeAudio(userId: string): Promise<ResultCode>;

  subscribeVideo(
    userId: string,
    view: RefObject<RtcSurfaceView>,
    config?: RtcRenderConfig
  ): Promise<ResultCode>;

  unsubscribeVideo(userId: string): Promise<ResultCode>;

  subscribeScreen(
    userId: string,
    view: RefObject<RtcSurfaceView>
  ): Promise<ResultCode>;

  unsubscribeScreen(userId: string): Promise<ResultCode>;

  startScreen(appGroupId?: string): Promise<ResultCode>;

  stopScreen(): Promise<ResultCode>;

  updateScreenScaling(
    userId: string,
    ratio: ScreenScalingRatio
  ): Promise<ResultCode>;

  updateScreenScalingWithFocus(
    userId: string,
    ratio: number,
    focus: RtcPoint
  ): Promise<ResultCode>;

  updateScreenMoving(userId: string, distance: RtcPoint): Promise<ResultCode>;

  muteAudio(): Promise<ResultCode>;

  unmuteAudio(): Promise<ResultCode>;

  muteVideo(): Promise<ResultCode>;

  unmuteVideo(): Promise<ResultCode>;
}

/**
 * @ignore
 */
interface RtcDeviceManagerInterface {
  setMicrophoneMuteStatus(enable: boolean): Promise<ResultCode>;

  setAudioDeviceVolume(
    volume: number,
    type: AudioDeviceType
  ): Promise<ResultCode>;

  getAudioDeviceVolume(type: AudioDeviceType): Promise<number>;

  getRecordingLevel(): Promise<number>;

  getPlayoutLevel(): Promise<number>;

  setLoudspeakerStatus(enable: boolean): Promise<ResultCode>;

  isEnabledLoudspeaker(): Promise<boolean>;

  switchCamera(): Promise<ResultCode>;

  isFrontCamera(): Promise<boolean>;

  getCameraDeviceId(frontCamera: boolean): Promise<string>;

  startPreview(
    view: RefObject<RtcSurfaceView>,
    config?: RtcRenderConfig
  ): Promise<ResultCode>;

  stopPreview(): Promise<ResultCode>;
}

/**
 * @ignore
 */
interface RtcAudioMixingManagerInterface {
  createAudioMixingTask(taskId: number, filename: String): Promise<ResultCode>;

  destroyAudioMixingTask(taskId: number): Promise<ResultCode>;

  startAudioMixingTask(
    taskId: number,
    config?: RtcAudioMixingConfig
  ): Promise<ResultCode>;

  updateAudioMixingTask(
    taskId: number,
    config: RtcAudioMixingConfig
  ): Promise<ResultCode>;

  stopAudioMixingTask(taskId: number): Promise<ResultCode>;

  resumeAudioMixing(taskId: number): Promise<ResultCode>;

  pauseAudioMixing(taskId: number): Promise<ResultCode>;

  getAudioMixingDuration(taskId: number): Promise<number>;

  getAudioMixingCurrentTimestamp(taskId: number): Promise<number>;

  seekAudioMixing(taskId: number, timestampMs: number): Promise<ResultCode>;
}

/**
 * @ignore
 */
interface RtcSnapshotInterface {
  snapshotVideo(
    outputDir: string,
    userId: string,
    option?: RtcSnapshotVideoOption
  ): Promise<ResultCode>;
}

/**
 * @ignore
 */
interface RtcWhiteboardManagerInterface {
  whiteboardEngine(): Promise<RtcWhiteboard>;

  switchWhiteboardEngine(whiteboardId: string): Promise<ResultCode>;
}

/**
 * @ignore
 */
interface RtcTroubleshootInterface {
  startAudioDumpWithFilePath(
    filePath: string,
    maxFileSize: number
  ): Promise<ResultCode>;

  stopAudioDump(): Promise<ResultCode>;

  sendFeedback(info: FeedbackInfo): Promise<ResultCode>;
}

/**
 * @ignore
 */
interface RtcOptionInterface {
  setOption(option: any, type: OptionType): Promise<ResultCode>;
}

/**
 * @ignore
 */
interface RtcCustomizedInterface {
  setParameters(param: string): Promise<ResultCode>;
}

/**
 * @ignore
 */
interface RtcManagersInterface {
  videoStreamManager(): Promise<RtcVideoStreamManager>;

  annotationManager(): Promise<RtcAnnotationManager>;

  messageService(): Promise<RtcMessageService>;

  networkManager(): Promise<RtcNetworkManager>;
}
