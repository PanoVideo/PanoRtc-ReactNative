import type { RefObject } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { ResultCode } from './Enums';
import { RtcRenderConfig, RtcSnapshotVideoOption } from './Objects';

import type {
  Listener,
  RtcVideoStreamManagerEventHandler,
  Subscription,
} from './RtcEvents';
import type { RtcSurfaceView } from './RtcRenderView.native';

const {
  /**
   * @ignore
   */
  PanoRtcVideoStreamManagerModule,
} = NativeModules;
/**
 * @ignore
 */
const Prefix = PanoRtcVideoStreamManagerModule.prefix;
/**
 * @ignore
 */
const RtcVideoStreamManagerEvent = new NativeEventEmitter(
  PanoRtcVideoStreamManagerModule
);

/**
 * The {@link RtcVideoStreamManager} class.
 */
export default class RtcVideoStreamManager
  implements RtcVideoStreamManagerInterface {
  /**
   * @ignore
   */
  private _listeners = new Map<string, Map<Listener, Listener>>();

  /**
   * @ignore
   */
  private static _callMethod<T>(method: string, args?: {}): Promise<T> {
    return PanoRtcVideoStreamManagerModule.callMethod(method, args);
  }

  destroy() {
    this.removeAllListeners();
  }

  /**
   * Adds the [`RtcVideoStreamManagerEventHandler`]{@link RtcVideoStreamManagerEventHandler} handler.
   *
   * After setting the [`RtcVideoStreamManagerEventHandler`]{@link RtcVideoStreamManagerEventHandler} handler, you can listen for `RtcVideoStreamManager` events and receive the statistics of the corresponding RtcVideoStreamManager instance.
   * @param event The event type.
   * @param listener The [`RtcVideoStreamManagerEventHandler`]{@link RtcVideoStreamManagerEventHandler} handler.
   */
  addListener<EventType extends keyof RtcVideoStreamManagerEventHandler>(
    event: EventType,
    listener: RtcVideoStreamManagerEventHandler[EventType]
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
    RtcVideoStreamManagerEvent.addListener(Prefix + event, callback);
    map.set(listener, callback);
    return {
      remove: () => {
        this.removeListener(event, listener);
      },
    };
  }

  /**
   * Removes the [`RtcVideoStreamManagerEventHandler`]{@link RtcVideoStreamManagerEventHandler} handler.
   *
   * For callback events that you only want to listen for once, call this method to remove the specific [`RtcVideoStreamManagerEventHandler`]{@link RtcVideoStreamManagerEventHandler} objects after you have received them.
   * @param event The event type.
   * @param listener The [`RtcVideoStreamManagerEventHandler`]{@link RtcVideoStreamManagerEventHandler} handler.
   */
  removeListener<EventType extends keyof RtcVideoStreamManagerEventHandler>(
    event: EventType,
    listener: RtcVideoStreamManagerEventHandler[EventType]
  ) {
    const map = this._listeners.get(event);
    if (map === undefined) return;
    RtcVideoStreamManagerEvent.removeListener(
      Prefix + event,
      map.get(listener) as Listener
    );
    map.delete(listener);
  }

  /**
   * Removes all the [`RtcVideoStreamManagerEventHandler`]{@link RtcVideoStreamManagerEventHandler} handlers.
   * @param event The event type.
   */
  removeAllListeners<EventType extends keyof RtcVideoStreamManagerEventHandler>(
    event?: EventType
  ) {
    if (event === undefined) {
      this._listeners.forEach((_, key) => {
        RtcVideoStreamManagerEvent.removeAllListeners(Prefix + key);
      });
      this._listeners.clear();
      return;
    }
    RtcVideoStreamManagerEvent.removeAllListeners(Prefix + event);
    this._listeners.delete(event as string);
  }

  /**
   * @~english
   * @brief Create a new video stream.
   * @param deviceId The device to be set to new stream.
   * @return
   *   - ResultCode.OK: video stream ID.
   *   - Others: Failure.
   * @note The default video stream is always available after channel joined.
   * @~chinese
   * @brief 创建一个新的视频流。
   * @param deviceId 设备 ID, 此设备会设置给新视频流。
   * @return
   *   - ResultCode.OK：视频流 ID。
   *   - 其他：失败。
   * @note 默认视频流无需创建，在频道加入成功后即有效。
   */
  createVideoStream(deviceId: string): Promise<number> {
    return RtcVideoStreamManager._callMethod('createVideoStream', { deviceId });
  }

  /**
   * @~english
   * @brief Destroy a video stream.
   * @param streamId The stream ID to be destroyed.
   * @return
   *   - ResultCode.OK: Success.
   *   - Others: Failure.
   * @note The default video stream could not be destroyed.
   * @~chinese
   * @brief 销毁一个视频流。
   * @param streamId 视频流 ID。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   * @note 默认视频流不可销毁。
   */
  destroyVideoStream(streamId: number): Promise<ResultCode> {
    return RtcVideoStreamManager._callMethod('destroyVideoStream', {
      streamId,
    });
  }

  /**
   * @~english
   * @brief Set capture device for video stream.
   * @param streamId Stream ID.
   * @param deviceId Device ID.
   * @return
   *   - ResultCode.OK: Success.
   *   - Others: Failure.
   * @~chinese
   * @brief 设置或更新视频流的采集设备。
   * @param streamId 视频流 ID。
   * @param deviceId 采集设备 ID。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setCaptureDevice(streamId: number, deviceId: string): Promise<ResultCode> {
    return RtcVideoStreamManager._callMethod('setCaptureDevice', {
      streamId,
      deviceId,
    });
  }

  /**
   * @~english
   * @brief Get capture device of the stream.
   * @param streamId Stream ID.
   * @return
   *   - Empty: Failure, the streamId is not found.
   *   - Others: The capture device ID.
   * @~chinese
   * @brief 获取视频流的采集设备。
   * @param streamId 视频流 ID。
   * @return
   *   - 空字符串：失败，streamId未找到或其他错误。
   *   - 非空字符串：成功，返回采集设备ID。
   */
  getCaptureDevice(streamId: number): Promise<string> {
    return RtcVideoStreamManager._callMethod('getCaptureDevice', { streamId });
  }

  /**
   * @~english
   * @brief Start video.
   * @param streamId video stream ID.
   * @param profileType video profile type.
   * @return
   *   - ResultCode.OK: Success.
   *   - Others: Failure.
   * @note Please join one channel before starting video, otherwise it will fail.
   * @~chinese
   * @brief 开启视频。
   * @param streamId 视频流 ID。
   * @param profileType 视频分辨率。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   * @note 开启视频前请先加入一个频道，否则将返回失败。
   */
  startVideo(
    streamId: number,
    view: RefObject<RtcSurfaceView>,
    config: RtcRenderConfig = new RtcRenderConfig()
  ): Promise<ResultCode> {
    if (view.current === undefined) {
      return Promise.resolve(ResultCode.InvalidArgs);
    } else {
      return view.current!._callMethod('startVideoWithStreamId', {
        streamId,
        config,
      });
    }
  }

  /**
   * @~english
   * @brief Stop video stream.
   * @param streamId Stream ID.
   * @return
   *   - ResultCode.OK: Success.
   *   - Others: Failure.
   * @~chinese
   * @brief 关闭视频流。
   * @param streamId 视频流 ID。
   * @return
   *   - ResultCode.OK: 调用成功。
   *   - 其他：调用失败。
   */
  stopVideo(streamId: number): Promise<ResultCode> {
    return RtcVideoStreamManager._callMethod('stopVideo', { streamId });
  }

  /**
   * @~english
   * @brief Pause video stream.
   * @param streamId Stream ID.
   * @return
   *   - ResultCode.OK: Success.
   *   - Others: Failure.
   * @note Please start the video stream before pausing, otherwise it will not work.
   * @~chinese
   * @brief 暂停视频流。
   * @param streamId 视频流 ID。
   * @return
   *   - ResultCode.OK: 成功。
   *   - 其他：失败。
   * @note 暂停视频流前请先开启视频流，否则操作将无效。
   */
  muteVideo(streamId: number): Promise<ResultCode> {
    return RtcVideoStreamManager._callMethod('muteVideo', { streamId });
  }

  /**
   * @~english
   * @brief Resume video stream.
   * @param streamId Stream ID.
   * @return
   *   - ResultCode.OK: Success.
   *   - Others: Failure.
   * @note Please start the video stream before resuming, otherwise it will not work.
   * @~chinese
   * @brief 恢复视频。
   * @param streamId 视频流 ID。
   * @return
   *   - ResultCode.OK: 成功。
   *   - 其他：失败。
   * @note 恢复视频流前请先开启视频流，否则操作将无效。
   */
  unmuteVideo(streamId: number): Promise<ResultCode> {
    return RtcVideoStreamManager._callMethod('unmuteVideo', { streamId });
  }

  /**
   * @~english
   * @brief Subscribe to a user's video stream with render window.
   * @param userId The user ID defined by customer.
   * @param streamId Stream ID.
   * @param profile video profile type.
   * @return
   *   - ResultCode.OK: Success.
   *   - Others: Failure.
   * @note Before subscribing to a user’s video stream, please make sure the user has started the video stream.
   * @~chinese
   * @brief 订阅用户的视频流， 并设置渲染窗口。
   * @param userId 客户定义的用户标识。
   * @param streamId 视频流 ID。
   * @param profile 视频分辨率。
   * @return
   *   - ResultCode.OK: 成功。
   *   - 其他：失败。
   * @note 订阅用户的视频流前，请确保用户已开启视频流。
   */
  subscribeVideo(
    userId: string,
    streamId: number,
    view: RefObject<RtcSurfaceView>,
    config: RtcRenderConfig = new RtcRenderConfig()
  ): Promise<ResultCode> {
    if (view.current === undefined) {
      return Promise.resolve(ResultCode.InvalidArgs);
    } else {
      return view.current!._callMethod('subscribeVideoWithStreamId', {
        userId,
        streamId,
        config,
      });
    }
  }

  /**
   * @~english
   * @brief Unsubscribe to a user's video stream.
   * @param userId The user ID defined by customer.
   * @param streamId Stream ID.
   * @return
   *   - ResultCode.OK: Success.
   *   - Others: Failure.
   * @note When a user stops the video or leaves the channel, the user's video will be automatically unsubscribed.
   * @~chinese
   * @brief 取消订阅用户的视频。
   * @param userId 客户定义的用户标识。
   * @param streamId 视频流 ID。
   * @return
   *   - ResultCode.OK: 成功。
   *   - 其他：失败。
   * @note 当用户停止视频流或者离开频道的时候，用户的视频流将会被自动取消订阅。
   */
  unsubscribeVideo(userId: string, streamId: number): Promise<ResultCode> {
    return RtcVideoStreamManager._callMethod('unsubscribeVideo', {
      userId,
      streamId,
    });
  }

  /**
   * @~english
   * @brief Capture specific user's video stream content.
   * @param userId the id of target user.
   * @param streamId the video stream ID.
   * @param outputDir output directory.
   * @param option snapshot option.
   * @return
   *   - ResultCode.OK: Success.
   *   - Others: Failure.
   * @~chinese
   * @brief 捕获指定用户的视频流画面。
   * @param userId 目标用户的 ID。
   * @param streamId 视频流 ID。
   * @param outputDir 输出路径。
   * @param option 快照选项。
   * @return
   *  - ResultCode.OK: 成功。
   *  - 其他：失败。
   */
  snapshotVideo(
    userId: string,
    streamId: number,
    outputDir: string,
    option: RtcSnapshotVideoOption = new RtcSnapshotVideoOption()
  ): Promise<ResultCode> {
    return RtcVideoStreamManager._callMethod('snapshotVideo', {
      userId,
      streamId,
      outputDir,
      option,
    });
  }
}

/**
 * @ignore
 */
interface RtcVideoStreamManagerInterface {
  createVideoStream(deviceId: string): Promise<number>;

  destroyVideoStream(streamId: number): Promise<ResultCode>;

  setCaptureDevice(streamId: number, deviceId: string): Promise<ResultCode>;

  getCaptureDevice(streamId: number): Promise<string>;

  startVideo(
    streamId: number,
    view: RefObject<RtcSurfaceView>,
    config?: RtcRenderConfig
  ): Promise<ResultCode>;

  stopVideo(streamId: number): Promise<ResultCode>;

  muteVideo(streamId: number): Promise<ResultCode>;

  unmuteVideo(streamId: number): Promise<ResultCode>;

  subscribeVideo(
    userId: string,
    streamId: number,
    view: RefObject<RtcSurfaceView>,
    config?: RtcRenderConfig
  ): Promise<ResultCode>;

  unsubscribeVideo(userId: string, streamId: number): Promise<ResultCode>;

  snapshotVideo(
    userId: string,
    streamId: number,
    outputDir: string,
    option?: RtcSnapshotVideoOption
  ): Promise<ResultCode>;
}
