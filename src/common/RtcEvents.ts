import type {
  RtcAudioLevel,
  RtcAudioRecvStats,
  RtcAudioSendStats,
  RtcNetworkQuality,
  RtcSystemStats,
  RtcVideoRecvBweStats,
  RtcVideoRecvStats,
  RtcVideoSendBweStats,
  RtcVideoSendStats,
  RtcScreenSendStats,
  RtcScreenRecvStats,
  WBPageNumber,
  RtcPropertyAction,
} from './Objects';
import type {
  AudioMixingState,
  FailoverState,
  ResultCode,
  SubscribeResult,
  UserLeaveReason,
  VideoCaptureState,
  VideoProfileType,
  QualityRating,
  WBImageState,
  WBRoleType,
  MessageServiceState,
  ScreenCaptureState,
} from './Enums';

/**
 * @internal
 * @ignore
 */

export type Listener = (...args: any[]) => any;

/**
 * @internal
 * @ignore
 */
export interface Subscription {
  remove(): void;
}

export type EmptyCallback = () => void;
export type ResultCallback =
  /**
   * @~english
   * @param result Result code.
   * @~chinese
   * @param result 返回结果。
   */
  (result: ResultCode) => void;
export type UserIdCallback =
  /**
   * @~english
   * @param userId The user ID defined by customer.
   * @~chinese
   * @param userId 客户定义的用户标识。
   */
  (userId: string) => void;
export type RemainCallback =
  /**
   * @~english
   * @param remain Channel remian time in seconds.
   * @~chinese
   * @param remain 频道剩余时间，单位：秒。
   */
  (remain: number) => void;
export type UserIdWithUserNameCallback =
  /**
   * @~english
   * @param userId    The user ID defined by customer.
   * @param userName  The user display name defined by customer.
   * @~chinese
   * @param userId    客户定义的用户标识。
   * @param userName  客户定义的用户显示名字。
   */
  (userId: string, userName: string) => void;
export type UserLeaveReasonCallback =
  /**
   * @~english
   * @param userId  The user ID defined by customer.
   * @param reason  The reason for user leaving.
   * @~chinese
   * @param userId  客户定义的用户标识。
   * @param reason  用户离开的原因。
   */
  (userId: string, reason: UserLeaveReason) => void;
export type UserIdWithSubscribeResultCallback =
  /**
   * @~english
   * @param userId  The user ID defined by customer.
   * @param result  The result of subscribing.
   * @~chinese
   * @param userId  客户定义的用户标识。
   * @param result  订阅结果
   */
  (userId: string, result: SubscribeResult) => void;
export type UserIdWithStreamIdAndSubscribeResultCallback =
  /**
   * @~english
   * @param userId  The user ID defined by customer.
   * @param streamId  The video stream ID.
   * @param result  The result of subscribing.
   * @~chinese
   * @param userId  客户定义的用户标识。
   * @param streamId  视频流标识。
   * @param result  订阅结果
   */
  (userId: string, streamId: number, result: SubscribeResult) => void;
export type UserIdWithMaxProfileCallback =
  /**
   * @~english
   * @param userId  The user ID defined by customer.
   * @param maxProfile  The max video profile.
   * @~chinese
   * @param userId  客户定义的用户标识。
   * @param maxProfile  最高档视频设定。
   */
  (userId: string, maxProfile: VideoProfileType) => void;
export type UserIdWithStreamIdAndMaxProfileCallback =
  /**
   * @~english
   * @param userId  The user ID defined by customer.
   * @param streamId  The video stream ID.
   * @param maxProfile  The max video profile.
   * @~chinese
   * @param userId  客户定义的用户标识。
   * @param streamId  视频流标识。
   * @param maxProfile  最高档视频设定。
   */
  (userId: string, streamId: number, maxProfile: VideoProfileType) => void;
export type WhiteboardIdCallback =
  /**
   * @~english
   * @param whiteboardId whiteboard Id
   * @~chinese
   * @param whiteboardId 白板Id
   */
  (whiteboardId: string) => void;
export type DeviceIdWithVideoCaptureStateCallback =
  /**
   * @~english
   * @param deviceId  The device unique ID.
   * @param state     The capture state.
   * @~chinese
   * @param deviceId  设备唯一标识。
   * @param state     采集状态。
   */
  (deviceId: string, state: VideoCaptureState) => void;
export type DeviceIdWithStreamIdAndVideoCaptureStateCallback =
  /**
   * @~english
   * @param streamId  The video stream ID.
   * @param deviceId  The device unique ID.
   * @param state     The capture state.
   * @~chinese
   * @param streamId  视频流标识。
   * @param deviceId  设备唯一标识。
   * @param state     采集状态。
   */
  (streamId: number, deviceId: string, state: VideoCaptureState) => void;
export type FailoverStateCallback =
  /**
   * @~english
   * @param state   Failover state.
   * @~chinese
   * @param state   故障转移状态。
   */
  (state: FailoverState) => void;
export type UserIdListCallback =
  /**
   * @~english
   * @param userIds   The userId list.
   * @~chinese
   * @param userIds   用户 ID 列表。
   */
  (userIds: string[]) => void;
export type TaskIdWithAudioMixingStateCallback =
  /**
   * @~english
   * @param taskId unique identifier of task.
   * @param state  state of task.
   * @~chinese
   * @param taskId 任务标识
   * @param state  任务状态
   */
  (taskId: number, state: AudioMixingState) => void;
export type SnapshotCompletedWithUserIdCallback =
  /**
   * @~english
   * @param succeed    Succeed to write the image.
   * @param userId     The userId of snapshot source
   * @param filename   The snapshot image full path with name.
   * @~chinese
   * @param succeed    是否成功写入文件
   * @param userId     快照所属的用户ID
   * @param filename   快照文件名
   */
  (succeed: boolean, userId: string, fileName: string) => void;
export type SnapshotCompletedWithUserIdAndStreamIdCallback =
  /**
   * @~english
   * @param userId      The user ID defined by customer.
   * @param streamId    The video stream ID.
   * @param succeed     Succeed to write the image.
   * @param filename    The snapshot image full path with name.
   * @~chinese
   * @param userId      客户定义的用户标识。
   * @param streamId    视频流标识。
   * @param succeed     是否成功写入文件。
   * @param filename    快照文件名。
   */
  (
    userId: string,
    streamId: number,
    succeed: boolean,
    filename: string
  ) => void;
export type UserIdWithNetworkQualityRatingCallback =
  /**
   * @~english
   * @param quality  The network quality.
   * @param userId   The user ID.
   * @~chinese
   * @param quality  网络质量。
   * @param userId   用户ID。
   */
  (userId: string, quality: QualityRating) => void;
export type AudioLevelCallback =
  /**
   * @~english
   * @param level   Current user audio Level
   * @~chinese
   * @param level   当前的用户音频强度。
   */
  (level: RtcAudioLevel) => void;
export type VideoSendStatsCallback =
  /**
   * @~english
   * @param stats   Statistics of sent video.
   * @~chinese
   * @param stats   已发送视频的统计信息。
   */
  (stats: RtcVideoSendStats) => void;
export type VideoRecvStatsCallback =
  /**
   * @~english
   * @param stats   Statistics of received video.
   * @~chinese
   * @param stats   已接收视频的统计信息。
   */
  (stats: RtcVideoRecvStats) => void;
export type ScreenSendStatsCallback =
  /**
   * @~english
   * @param stats   Statistics of sent video.
   * @~chinese
   * @param stats   已发送屏幕共享的统计信息。
   */
  (stats: RtcScreenSendStats) => void;
export type ScreenRecvStatsCallback =
  /**
   * @~english
   * @param stats   Statistics of received screen sharing.
   * @~chinese
   * @param stats   已接收屏幕共享的统计信息。
   */
  (stats: RtcScreenRecvStats) => void;
export type AudioSendStatsCallback =
  /**
   * @~english
   * @param stats   Statistics of sent aduio.
   * @~chinese
   * @param stats   已发送音频的统计信息。
   */
  (stats: RtcAudioSendStats) => void;
export type AudioRecvStatsCallback =
  /**
   * @~english
   * @param stats   Statistics of received audio.
   * @~chinese
   * @param stats   已接收音频的统计信息。
   */
  (stats: RtcAudioRecvStats) => void;
export type VideoSendBweStatsCallback =
  /**
   * @~english
   * @param stats   Bandwidth estimation of sent video.
   * @~chinese
   * @param stats   发送视频的带宽评估信息。
   */
  (stats: RtcVideoSendBweStats) => void;
export type VideoRecvBweStatsCallback =
  /**
   * @~english
   * @param stats   Bandwidth estimation of received video.
   * @~chinese
   * @param stats   接收视频的带宽评估信息。
   */
  (stats: RtcVideoRecvBweStats) => void;
export type SystemStatsCallback =
  /**
   * @~english
   * @param stats   Current system statistics.
   * @~chinese
   * @param stats   当前的系统统计信息。
   */
  (stats: RtcSystemStats) => void;
export type ResultWithFileIdCallback =
  /**
   * @~english
   * @param result  Notification result
   * @param fileId Whiteboard file ID
   * @~chinese
   * @param result  通知结果
   * @param fileId 白板文件ID
   */
  (result: ResultCode, fileId: string) => void;
export type SnapshotResultWithFileNameCallback =
  /**
   * @~english
   * @param result     snapshot result
   * @param filename   snapshot image full path with name.
   * @~chinese
   * @param result     快照结果
   * @param filename   快照文件名
   */
  (result: ResultCode, filename: string) => void;
export type PageNumberChangedCallback =
  /**
   * @~english
   * @param curPage       The current page number.
   * @param totalPages    The total page number.
   * @~chinese
   * @param curPage       当前页码。
   * @param totalPages    总页码数.
   */
  (curPage: WBPageNumber, totalPages: number) => void;
export type ImageStateCallback =
  /**
   * @~english
   * @param state     The image state.
   * @param url       The image URL.
   * @~chinese
   * @param state     图片状态码。
   * @param url       图片 URL。
   */
  (url: string, status: WBImageState) => void;
export type ViewScaleCallback =
  /**
   * @~english
   * @param scale     The scale factor.
   * @~chinese
   * @param scale     缩放比例。
   */
  (scale: number) => void;
export type NewRoleTypeCallback =
  /**
   * @~english
   * @param newRole   The new role type.
   * @~chinese
   * @param newRole   新角色。
   */
  (newRole: WBRoleType) => void;
export type MessageCallback =
  /**
   * @~english
   * @param userId  The user who send the message.
   * @param message The message data.
   * @~chinese
   * @param userId  发送消息的用户。
   * @param message 接收到的消息。
   */
  (userId: string, message: string) => void;
export type DocTranscodeStatusCallback =
  /**
   * @~english
   * @param result  Notification result
   * @param fileId Whiteboard file ID
   * @param progress Transcode progress
   * @param totalPages Transcode total page number
   * @~chinese
   * @param result  通知结果
   * @param fileId 白板文件ID
   * @param progress 转码进度
   * @param totalPages 转码总页数
   */
  (
    result: ResultCode,
    fileId: string,
    progress: number,
    totalPages: number
  ) => void;
export type SaveDocCallback =
  /**
   * @~english
   * @param result  Notification result
   * @param fileId Whiteboard file ID
   * @param outputDir Output directory
   * @~chinese
   * @param result  通知结果
   * @param fileId 白板文件ID
   * @param outputDir 输出路径
   */
  (result: ResultCode, fileId: string, outputDir: string) => void;
export type DocThumbnailReadyCallback =
  /**
   * @~english
   * @param fileId Whiteboard file ID
   * @param urls Thumbnail url array
   * @~chinese
   * @param fileId 白板文件ID
   * @param urls 缩略图url数组
   */
  (fileId: string, urls: string[]) => void;
export type UserIdWithStreamIdCallback =
  /**
   * @~english
   * @param userId User ID
   * @param streamId Stream ID
   * @~chinese
   * @param userId 用户ID
   * @param streamId 视频流ID
   */
  (userId: string, streamId: number) => void;
export type NetworkTestCallback =
  /**
   * @~english
   * @param quality Network quality report.
   * @~chinese
   * @param quality 网络质量报告。
   */
  (quality: RtcNetworkQuality) => void;
export type MessageServiceStateCallback =
  /**
   * @~english
   * @brief Notification of message service state change
   * @param state The service state, You can send message when state is kPanoMessageServiceAvailable.
   * @param reason The reason of the state change
   * @~chinese
   * @brief 消息服务状态变更的通知
   * @param state 服务状态，kPanoMessageServiceAvailable 时可以发送消息。
   * @param reason 状态变更的原因
   */
  (state: MessageServiceState, reason: ResultCode) => void;
export type SubscribeResultCallback =
  /**
   * @~english
   * @param topic The topic.
   * @param result The result of topic subscription.
   * @~chinese
   * @param topic 主题标识。
   * @param result 主题订阅的结果。
   */
  (topic: string, result: ResultCode) => void;
export type TopicMessageCallback =
  /**
   * @~english
   * @param topic The topic.
   * @param userId The user who published the message.
   * @param data The topic data.
   * @~chinese
   * @param topic 主题标识。
   * @param userId 发布主题消息的用户标识。
   * @param data 主题消息数据。
   */
  (topic: string, userId: string, data: string) => void;
export type PropertyChangedCallback =
  /**
   * @~english
   * @param props The property action array.
   * @~chinese
   * @param props 变更属性的数组。
   */
  (props: RtcPropertyAction[]) => void;
export type ScreenCaptureStateCallback =
  /**
   * @~english
   * Notification of screen capture state changed.
   * @param state     The capture state.
   * @param reason    The reason of capture state change.
   * @~chinese
   * 屏幕采集状态变化的通知。
   * @param state     采集状态。
   * @param reason    状态变化原因。
   */
  (state: ScreenCaptureState, reason: ResultCode) => void;

/**
 * Callbacks.
 *
 * The SDK uses the [`RtcEngineEventHandler`]{@link RtcEngineEventHandler} interface class to send callbacks to the application, and the application inherits the methods of this interface class to retrieve these callbacks.
 * All methods in this interface class have their (empty) default implementations, and the application can inherit only some of the required events instead of all of them.
 * In the callbacks, the application should avoid time-consuming tasks or call blocking APIs, otherwise, the SDK may not work properly.
 */
export interface RtcEngineEventHandler {
  /**
   * Notification of join channel
   *
   * 加入频道的通知
   *
   * @event onChannelJoinConfirm
   */
  onChannelJoinConfirm: ResultCallback;

  /**
   * Notification of leave channel
   *
   * 离开频道的通知
   *
   * @event onChannelLeaveIndication
   */
  onChannelLeaveIndication: ResultCallback;

  /**
   * @~english
   * @brief Notification of channel count down.
   * @event onChannelCountDown
   * @~chinese
   * @brief 频道倒计时通知
   * @event onChannelCountDown
   */
  onChannelCountDown: RemainCallback;

  /**
   * @~english
   * @brief Callback the event when a user joins the channel.
   * @event onUserJoinIndication
   * @~chinese
   * @brief 回调用户加入频道的事件。
   * @event onUserJoinIndication
   */
  onUserJoinIndication: UserIdWithUserNameCallback;

  /**
   * @~english
   * @brief Callback the event when a user leaves the channel.
   * @event onUserLeaveIndication
   * @~chinese
   * @brief 回调用户离开频道的事件。
   * @event onUserLeaveIndication
   */
  onUserLeaveIndication: UserLeaveReasonCallback;

  /**
   * @~english
   * @brief Callback the event when a user starts audio.
   * @event onUserAudioStart
   * @~chinese
   * @brief 回调用户开启音频的事件。
   * @event onUserAudioStart
   */
  onUserAudioStart: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when a user stops audio.
   * @event onUserAudioStop
   * @~chinese
   * @brief 回调用户停止音频的事件。
   * @event onUserAudioStop
   */
  onUserAudioStop: UserIdCallback;

  /**
   * @~english
   * @brief Notification of result to subscribe user audio.
   * @event onUserAudioSubscribe
   * @~chinese
   * @brief 用户音频订阅结果通知。
   * @event onUserAudioSubscribe
   */
  onUserAudioSubscribe: UserIdWithSubscribeResultCallback;

  /**
   * @~english
   * @brief Callback the event when a user starts video.
   * @event onUserVideoStart
   * @~chinese
   * @brief 回调用户开启视频的事件。
   * @event onUserVideoStart
   */
  onUserVideoStart: UserIdWithMaxProfileCallback;

  /**
   * @~english
   * @brief Callback the event when a user stops video.
   * @event onUserVideoStop
   * @~chinese
   * @brief 回调用户停止视频的事件。
   * @event onUserVideoStop
   */
  onUserVideoStop: UserIdCallback;

  /**
   * @~english
   * @brief Notification of result to subscribe user video.
   * @event onUserVideoSubscribe
   * @~chinese
   * @brief 用户视频订阅结果通知。
   * @event onUserVideoSubscribe
   */
  onUserVideoSubscribe: UserIdWithSubscribeResultCallback;

  /**
   * @~english
   * @brief Callback the event when a user mutes audio.
   * @event onUserAudioMute
   * @~chinese
   * @brief 回调用户静音的事件。
   * @event onUserAudioMute
   */
  onUserAudioMute: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when a user unmutes audio.
   * @event onUserAudioUnmute
   * @~chinese
   * @brief 回调用户取消静音的事件。
   * @event onUserAudioUnmute
   */
  onUserAudioUnmute: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when a user pauses video.
   * @event onUserVideoMute
   * @~chinese
   * @brief 回调用户暂停视频的事件。
   * @event onUserVideoMute
   */
  onUserVideoMute: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when a user resumes video.
   * @event onUserVideoUnmute
   * @~chinese
   * @brief 回调用户恢复视频的事件。
   * @event onUserVideoUnmute
   */
  onUserVideoUnmute: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when a user starts screen sharing.
   * @event onUserScreenStart
   * @~chinese
   * @brief 回调用户开启屏幕共享的事件。
   * @event onUserScreenStart
   */
  onUserScreenStart: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when a user stops screen sharing.
   * @event onUserScreenStop
   * @~chinese
   * @brief 回调用户停止屏幕共享的事件。
   * @event onUserScreenStop
   */
  onUserScreenStop: UserIdCallback;

  /**
   * @~english
   * @brief Notification of result to subscribe user screen sharing.
   * @event onUserScreenSubscribe
   * @~chinese
   * @brief 用户屏幕共享订阅结果通知。
   * @event onUserScreenSubscribe
   */
  onUserScreenSubscribe: UserIdWithSubscribeResultCallback;

  /**
   * @~english
   * @brief Callback the event when a user pauses screen sharing.
   * @event onUserScreenMute
   * @~chinese
   * @brief 回调用户暂停屏幕共享的事件。
   * @event onUserScreenMute
   */
  onUserScreenMute: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when a user resumes screen sharing.
   * @event onUserScreenUnmute
   * @~chinese
   * @brief 回调用户恢复屏幕共享的事件。
   * @event onUserScreenUnmute
   */
  onUserScreenUnmute: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when whiteboard is available.
   * @event onWhiteboardAvailable
   * @~chinese
   * @brief 回调白板可用的事件。
   * @event onWhiteboardAvailable
   */
  onWhiteboardAvailable: EmptyCallback;

  /**
   * @~english
   * @brief Callback the event when whiteboard is unavailable.
   * @event onWhiteboardUnavailable
   * @~chinese
   * @brief 回调白板不可用的事件。
   * @event onWhiteboardUnavailable
   */
  onWhiteboardUnavailable: EmptyCallback;

  /**
   * @~english
   * @brief Callback the event when default whiteboard is started.
   * @event onWhiteboardStart
   * @~chinese
   * @brief 回调默认白板开启的事件。
   * @event onWhiteboardStart
   */
  onWhiteboardStart: EmptyCallback;

  /**
   * @~english
   * @brief Callback the event when default whiteboard is stopped.
   * @event onWhiteboardStop
   * @~chinese
   * @brief 回调默认白板停止的事件。
   * @event onWhiteboardStop
   */
  onWhiteboardStop: EmptyCallback;

  /**
   * @~english
   * @brief Callback the event when whiteboard is started.
   * @event onWhiteboardStartWithId
   * @~chinese
   * @brief 回调白板开启的事件。
   * @event onWhiteboardStartWithId
   */
  onWhiteboardStartWithId: WhiteboardIdCallback;

  /**
   * @~english
   * @brief Callback the event when whiteboard is stopped.
   * @event onWhiteboardStopWithId
   * @~chinese
   * @brief 回调白板停止的事件。
   * @event onWhiteboardStopWithId
   */
  onWhiteboardStopWithId: WhiteboardIdCallback;

  /**
   * @~english
   * @brief Callback the event when the first audio packet is received.
   * @event onFirstAudioDataReceived
   * @~chinese
   * @brief 回调接收到首个音频数据包的事件。
   * @event onFirstAudioDataReceived
   */
  onFirstAudioDataReceived: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when the first video packet is received.
   * @event onFirstVideoDataReceived
   * @~chinese
   * @brief 回调接收到首个视频数据包的事件。
   * @event onFirstVideoDataReceived
   */
  onFirstVideoDataReceived: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when the first screen sharing packet is received.
   * @event onFirstScreenDataReceived
   * @~chinese
   * @brief 回调接收到首个屏幕共享数据包的事件。
   * @event onFirstScreenDataReceived
   */
  onFirstScreenDataReceived: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when the first video frame is rendered.
   * @event onFirstVideoFrameRendered
   * @~chinese
   * @brief 回调渲染首个视频帧的事件。
   * @event onFirstVideoFrameRendered
   */
  onFirstVideoFrameRendered: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when the first screen sharing frame is rendered.
   * @event onFirstScreenFrameRendered
   * @~chinese
   * @brief 回调渲染首个屏幕共享帧的事件。
   * @event onFirstScreenFrameRendered
   */
  onFirstScreenFrameRendered: UserIdCallback;

  /**
   * @~english
   * @brief Callback video capture state change.
   * @event onVideoCaptureStateChanged
   * @~chinese
   * @brief 回调视频采集状态变更。
   * @event onVideoCaptureStateChanged
   */
  onVideoCaptureStateChanged: DeviceIdWithVideoCaptureStateCallback;

  /**
   * @~english
   * @brief Callback the state of failovering the channel.
   * @event onChannelFailover
   * @~chinese
   * @brief 回调频道的故障转移状态。
   * @event onChannelFailover
   */
  onChannelFailover: FailoverStateCallback;

  /**
   * @~english
   * @brief Notification of active speaker list updating
   * @note The userId list sorted by users' audio energy.
   * @event onActiveSpeakerListUpdated
   * @~chinese
   * @brief 活跃用户列表变更通知
   * @note 用户 ID 列表按声音能量值排序。
   * @event onActiveSpeakerListUpdated
   */
  onActiveSpeakerListUpdated: UserIdListCallback;

  /**
   * @~english
   * @brief Callback the event when state of audio mixing task changed.
   * @event onAudioMixingStateChanged
   * @~chinese
   * @brief 回调混音任务状态改变的事件。
   * @event onAudioMixingStateChanged
   */
  onAudioMixingStateChanged: TaskIdWithAudioMixingStateCallback;

  /**
   * @~english
   * @brief Callback the event when video snapshot completed.
   * @event onVideoSnapshotCompleted
   * @~chinese
   * 用户视频快照完成通知
   * @event onVideoSnapshotCompleted
   */
  onVideoSnapshotCompleted: SnapshotCompletedWithUserIdCallback;

  /**
   * @~english
   * @brief Notification of audio start result
   * @event onAudioStartResult
   * @~chinese
   * @brief 音频开启成功与否的通知
   * @event onAudioStartResult
   */
  onAudioStartResult: ResultCallback;

  /**
   * @~english
   * @brief Notification of video start result
   * @event onVideoStartResult
   * @~chinese
   * @brief 视频开启成功与否的通知
   * @event onVideoStartResult
   */
  onVideoStartResult: ResultCallback;

  /**
   * @~english
   * @brief Notification of sharing start result
   * @event onScreenStartResult
   * @~chinese
   * @brief 共享开启成功与否的通知
   * @event onScreenStartResult
   */
  onScreenStartResult: ResultCallback;

  /**
   * @~english
   * Notification of screen capture state changed.
   * @event onScreenCaptureStateChanged
   * @~chinese
   * 屏幕采集状态变化的通知。
   * @event onScreenCaptureStateChanged
   */
  onScreenCaptureStateChanged: ScreenCaptureStateCallback;

  /**
   * @~english
   * @brief Notification of in-call network quality.
   * @event onNetworkQuality
   * @~chinese
   * @brief 通话中的网络质量通知。
   * @event onNetworkQuality
   */
  onNetworkQuality: UserIdWithNetworkQualityRatingCallback;

  /**
   * @~english
   * @brief Callback Audio Level.
   * @event onUserAudioLevel
   * @~chinese
   * @brief 回调音频强度。
   * @event onUserAudioLevel
   */
  onUserAudioLevel: AudioLevelCallback;

  /**
   * @~english
   * @brief Callback statistics of sent video.
   * @event onVideoSendStats
   * @~chinese
   * @brief 回调发送视频的统计。
   * @event onVideoSendStats
   */
  onVideoSendStats: VideoSendStatsCallback;

  /**
   * @~english
   * @brief Callback statistics of received video.
   * @event onVideoRecvStats
   * @~chinese
   * @brief 回调接收视频的统计。
   * @event onVideoRecvStats
   */
  onVideoRecvStats: VideoRecvStatsCallback;

  /**
   * @~english
   * @brief Callback statistics of sent audio.
   * @event onAudioSendStats
   * @~chinese
   * @brief 回调发送音频的统计。
   * @event onAudioSendStats
   */
  onAudioSendStats: AudioSendStatsCallback;

  /**
   * @~english
   * @brief Callback statistics of received audio.
   * @event onAudioRecvStats
   * @~chinese
   * @brief 回调接收音频的统计。
   * @event onAudioRecvStats
   */
  onAudioRecvStats: AudioRecvStatsCallback;

  /**
   * @~english
   * @brief Callback statistics of sent screen sharing.
   * @event onScreenSendStats
   * @~chinese
   * @brief 回调发送屏幕共享的统计。
   * @event onScreenSendStats
   */
  onScreenSendStats: ScreenSendStatsCallback;

  /**
   * @~english
   * @brief Callback statistics of received screen sharing.
   * @event onScreenRecvStats
   * @~chinese
   * @brief 回调接收屏幕共享的统计。
   * @event onScreenRecvStats
   */
  onScreenRecvStats: ScreenRecvStatsCallback;

  /**
   * @~english
   * @brief Callback bandwidth estimation information of sent video.
   * @note Total bandwidth evaluation including sent video and screen sharing.
   * @event onVideoSendBweStats
   * @~chinese
   * @brief 回调发送视频的带宽评估。
   * @note 包含发送视频和屏幕共享的总共带宽评估。
   * @event onVideoSendBweStats
   */
  onVideoSendBweStats: VideoSendBweStatsCallback;

  /**
   * @~english
   * @brief Callback bandwidth estimation information of received video.
   * @note Total bandwidth estimation including received video and screen sharing.
   * @event onVideoRecvBweStats
   * @~chinese
   * @brief 回调接收视频的带宽评估。
   * @note 包含接收视频和屏幕共享的总共带宽评估。
   * @event onVideoRecvBweStats
   */
  onVideoRecvBweStats: VideoRecvBweStatsCallback;

  /**
   * @~english
   * @brief Callback system statistics.
   * @event onSystemStats
   * @~chinese
   * @brief 回调系统统计信息。
   * @event onSystemStats
   */
  onSystemStats: SystemStatsCallback;
}

export interface RtcWhiteboardEventHandler {
  onStatusSynced: EmptyCallback;

  /**
   * @~english
   * @brief Notification of page number changed.
   * @event onPageNumberChanged
   * @~chinese
   * @brief 白板页码变化通知。
   * @event onPageNumberChanged
   */
  onPageNumberChanged: PageNumberChangedCallback;

  /**
   * @~english
   * @brief Notification of image state changed.
   * @event onImageStateChanged
   * @~chinese
   * @brief 图片状态变化通知。
   * @event onImageStateChanged
   */
  onImageStateChanged: ImageStateCallback;

  /**
   * @~english
   * @param scale     The scale factor.
   * @event onViewScaleChanged
   * @~chinese
   * @param scale     缩放比例。
   * @event onViewScaleChanged
   */
  onViewScaleChanged: ViewScaleCallback;

  /**
   * @~english
   * @brief Notification of whiteboard role type changed.
   * @event onRoleTypeChanged
   * @~chinese
   * @brief 白板角色类型变化通知。
   * @event onRoleTypeChanged
   */
  onRoleTypeChanged: NewRoleTypeCallback;

  /**
   * @~english
   * @brief Notification of whiteboard content update.
   * @event onContentUpdated
   * @~chinese
   * @brief 白板内容更新通知。
   * @event onContentUpdated
   */
  onContentUpdated: EmptyCallback;

  /**
   * @~english
   * Notification of whiteboard snapshot complete
   * @event onSnapshotComplete
   * @~chinese
   * 白板快照完成通知
   * @event onSnapshotComplete
   */
  onSnapshotComplete: SnapshotResultWithFileNameCallback;

  /**
   * @~english
   * @brief Callback the event when message is received.
   * @event onMessage
   * @~chinese
   * @brief 白板消息通知
   * @event onMessage
   */
  onMessage: MessageCallback;

  /**
   * @~english
   * @brief Notification of add background images
   * @event onAddBackgroundImages
   * @~chinese
   * @brief 添加一组背景图结果通知
   * @event onAddBackgroundImages
   */
  onAddBackgroundImages: ResultWithFileIdCallback;

  /**
   * @~english
   * @brief Notification of add H5 file
   * @event onAddH5File
   * @~chinese
   * @brief 添加H5文件结果通知
   * @event onAddH5File
   */
  onAddH5File: ResultWithFileIdCallback;

  /**
   * @~english
   * @brief Notification of doc transcode status
   * @event onDocTranscodeStatus
   * @~chinese
   * @brief 文档转码状态通知
   * @event onDocTranscodeStatus
   */
  onDocTranscodeStatus: DocTranscodeStatusCallback;

  /**
   * @~english
   * @brief Notification of create whiteboard file
   * @event onCreateDoc
   * @~chinese
   * @brief 创建白板文件通知
   * @event onCreateDoc
   */
  onCreateDoc: ResultWithFileIdCallback;

  /**
   * @~english
   * @brief Notification of delete whiteboard file
   * @event onDeleteDoc
   * @~chinese
   * @brief 删除白板文件通知
   * @event onDeleteDoc
   */
  onDeleteDoc: ResultWithFileIdCallback;

  /**
   * @~english
   * @brief Notification of switch whiteboard file.
   * @event onSwitchDoc
   * @~chinese
   * @brief 切换白板文件通知。
   * @event onSwitchDoc
   */
  onSwitchDoc: ResultWithFileIdCallback;

  /**
   * @~english
   * @brief Notification of save whiteboard file.
   * @event onSaveDoc
   * @~chinese
   * @brief 保存白板文件通知。
   * @event onSaveDoc
   */
  onSaveDoc: SaveDocCallback;

  /**
   * @~english
   * @brief Notification of whiteboard file thumbnail ready.
   * @event onDocThumbnailReady
   * @~chinese
   * @brief 白板文件缩略图完成通知。
   * @event onDocThumbnailReady
   */
  onDocThumbnailReady: DocThumbnailReadyCallback;

  /**
   * @~english
   * @brief Notification of vision share started.
   * @event onVisionShareStarted
   * @~chinese
   * @brief 视角共享开始通知。
   * @event onVisionShareStarted
   */
  onVisionShareStarted: UserIdCallback;

  /**
   * @~english
   * @brief Notification of vision share started.
   * @event onVisionShareStopped
   * @~chinese
   * @brief 视角共享开始通知。
   * @event onVisionShareStopped
   */
  onVisionShareStopped: UserIdCallback;

  /**
   * @~english
   * @brief Callback the event when a user joins the whiteboard.
   * @event onUserJoined
   * @~chinese
   * @brief 回调用户加入白板的事件。
   * @event onUserJoined
   */
  onUserJoined: UserIdWithUserNameCallback;

  /**
   * @~english
   * @brief Callback the event when a user leaves the whiteboard.
   * @event onUserLeft
   * @~chinese
   * @brief 回调用户离开白板的事件。
   * @event onUserLeft
   */
  onUserLeft: UserIdCallback;
}

export interface RtcAnnotationManagerEventHandler {
  /**
   * @~english
   * Notification of video annotation start.
   * @event onVideoAnnotationStart
   * @~chinese
   * 开始视频标注通知。
   * @event onVideoAnnotationStart
   */
  onVideoAnnotationStart: UserIdWithStreamIdCallback;

  /**
   * @~english
   * Notification of video annotation stop.
   * @event onVideoAnnotationStop
   * @~chinese
   * 终止视频标注通知。
   * @event onVideoAnnotationStop
   */
  onVideoAnnotationStop: UserIdWithStreamIdCallback;

  /**
   * @~english
   * Notification of share annotation start.
   * @event onShareAnnotationStart
   * @~chinese
   * 开始共享标注通知。
   * @event onShareAnnotationStart
   */
  onShareAnnotationStart: UserIdCallback;

  /**
   * @~english
   * Notification of share annotation stop.
   * @event onShareAnnotationStop
   * @~chinese
   * 终止共享标注通知。
   * @event onShareAnnotationStop
   */
  onShareAnnotationStop: UserIdCallback;
}

export interface RtcAnnotationEventHandler {
  /**
   * @~english
   * @brief Notification of annotation role type changed.
   * @event onAnnoRoleChanged
   * @~chinese
   * @brief 标注角色类型变化通知。
   * @event onAnnoRoleChanged
   */
  onAnnoRoleChanged: NewRoleTypeCallback;

  /**
   * @~english
   * Notification of annotation snapshot complete.
   * @event onSnapshotComplete
   * @~chinese
   * 标注快照完成通知。
   * @event onSnapshotComplete
   */
  onSnapshotComplete: SnapshotResultWithFileNameCallback;
}

export interface RtcVideoStreamManagerEventHandler {
  /**
   * @~english
   * @brief Callback the event when a user starts video.
   * @event onUserVideoStreamStart
   * @~chinese
   * @brief 回调用户开启视频的事件。
   * @event onUserVideoStreamStart
   */
  onUserVideoStreamStart: UserIdWithStreamIdAndMaxProfileCallback;

  /**
   * @~english
   * @brief Callback the event when a user stops video.
   * @event onUserVideoStreamStop
   * @~chinese
   * @brief 回调用户停止视频的事件。
   * @event onUserVideoStreamStop
   */
  onUserVideoStreamStop: UserIdWithStreamIdCallback;

  /**
   * @~english
   * @brief Notification of result to subscribe user video.
   * @event onUserVideoStreamSubscribe
   * @~chinese
   * @brief 用户视频订阅结果通知。
   * @event onUserVideoStreamSubscribe
   */
  onUserVideoStreamSubscribe: UserIdWithStreamIdAndSubscribeResultCallback;

  /**
   * @~english
   * @brief Callback the event when a user pauses video.
   * @event onUserVideoMute
   * @~chinese
   * @brief 回调用户暂停视频的事件。
   * @event onUserVideoMute
   */
  onUserVideoMute: UserIdWithStreamIdCallback;

  /**
   * @~english
   * @brief Callback the event when a user resumes video.
   * @event onUserVideoUnmute
   * @~chinese
   * @brief 回调用户恢复视频的事件。
   * @event onUserVideoUnmute
   */
  onUserVideoUnmute: UserIdWithStreamIdCallback;

  /**
   * @~english
   * @brief Callback the event when the first video packet is received.
   * @event onFirstVideoDataReceived
   * @~chinese
   * @brief 回调接收到首个视频数据包的事件。
   * @event onFirstVideoDataReceived
   */
  onFirstVideoDataReceived: UserIdWithStreamIdCallback;

  /**
   * @~english
   * @brief Callback the event when the first video frame is rendered.
   * @event onFirstVideoFrameRendered
   * @~chinese
   * @brief 回调渲染首个视频帧的事件。
   * @event onFirstVideoFrameRendered
   */
  onFirstVideoFrameRendered: UserIdWithStreamIdCallback;

  /**
   * @~english
   * @brief Callback the event when video snapshot completed.
   * @event onVideoStreamSnapshotCompleted
   * @~chinese
   * @brief 用户视频快照完成通知。
   * @event onVideoStreamSnapshotCompleted
   */
  onVideoStreamSnapshotCompleted: SnapshotCompletedWithUserIdAndStreamIdCallback;

  /**
   * @~english
   * @brief Callback video stream capture state change.
   * @event onVideoCaptureStateChanged
   * @~chinese
   * @brief 回调视频采集状态变更。
   * @event onVideoCaptureStateChanged
   */
  onVideoCaptureStateChanged: DeviceIdWithStreamIdAndVideoCaptureStateCallback;
}

export interface RtcNetworkManagerHandler {
  /**
   * @~english
   * @brief Callback the result of network test.
   * @event onNetworkTestComplete
   * @~chinese
   * @brief 回调网络检测的结果。
   * @event onNetworkTestComplete
   */
  onNetworkTestComplete: NetworkTestCallback;
}

export interface RtcMessageServiceEventHandler {
  /**
   * @~english
   * @brief Notification of message service state change
   * @event onServiceStateChanged
   * @note
   *  - Send the message when the callback service status is available,
   *    otherwise sending a message when the service is unavailable may cause the message to be lost.
   *  - The status callback will return immediately after joining the channel.
   *    It is recommended to set a callback before joining the channel to ensure
   *    that the service status is correctly obtained.
   * @~chinese
   * @brief 消息服务状态变更的通知
   * @event onServiceStateChanged
   * @note
   *  - 当回调服务状态可用后再发送消息，否则当服务不可用时发送消息可能造成消息丢失。
   *  - 状态回调会在加入频道后立即返回，建议在加入频道前设置回调，以确保正确获取服务状态。
   */
  onServiceStateChanged: MessageServiceStateCallback;

  /**
   * @~english
   * @brief Notification of user message
   * @event onUserMessage
   * @~chinese
   * @brief 用户消息通知
   * @event onUserMessage
   */
  onUserMessage: MessageCallback;

  /**
   * @~english
   * @brief Notification of topic message
   * @~chinese
   * @brief 用户主题消息通知
   */
  onSubscribeResult: SubscribeResultCallback;

  /**
   * @~english
   * @brief Notification of topic message
   * @~chinese
   * @brief 用户主题消息通知
   */
  onTopicMessage: TopicMessageCallback;

  /**
   * @~english
   * @brief Notification of message service property change.
   * @~chinese
   * @brief 消息服务属性变更通知。
   */
  onPropertyChanged: PropertyChangedCallback;
}
