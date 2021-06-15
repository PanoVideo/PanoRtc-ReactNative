/**
 * @~english
 * @brief Result value.
 * @details The result value returned by PANO methods, indicating the execution status.
 * @~chinese
 * @brief 返回。
 * @details PANO方法返回值，指示执行的情况。
 */
export enum ResultCode {
  /**
   * @~english Execution succeed. @~chinese 执行成功。
   */
  OK = 0,
  /**
   * @~english Execution failed. @~chinese 执行失败。
   */
  Failed = -1,
  /**
   * @~english Fatal error. @~chinese 致命错误。
   */
  Fatal = -2,
  /**
   * @~english Invalid argument. @~chinese 非法参数。
   */
  InvalidArgs = -3,
  /**
   * @~english Invalid state. @~chinese 非法状态。
   */
  InvalidState = -4,
  /**
   * @~english Invalid index. @~chinese 无效索引。
   */
  InvalidIndex = -5,
  /**
   * @~english The object already exists. @~chinese 对象已存在。
   */
  AlreadyExist = -6,
  /**
   * @~english The object does not exist. @~chinese 对象不存在。
   */
  NotExist = -7,
  /**
   * @~english The object is not found. @~chinese 对象没发现。
   */
  NotFound = -8,
  /**
   * @~english The method is not supported. @~chinese 方法不支持。
   */
  NotSupported = -9,
  /**
   * @~english The method is not implemented. @~chinese 方法未实现。
   */
  NotImplemented = -10,
  /**
   * @~english The object is not initialized. @~chinese 对象未初始化。
   */
  NotInitialized = -11,
  /**
   * @~english The resource limit is reached. @~chinese 已达上限。
   */
  LimitReached = -12,
  /**
   * @~english No privilege to do. @~chinese 没有权限执行该操作。
   */
  NoPrivilege = -13,
  /**
   * @~english Operation in progress. @~chinese 操作正在进行中。
   */
  InProgress = -14,
  /**
   * @~english The operation thread is wrong. @~chinese 操作的线程错误。
   */
  WrongThread = -15,

  /**
   * @~english Authentication failed. @~chinese 认证失败。
   */
  AuthFailed = -101,
  /**
   * @~english The user is rejected. @~chinese 用户被拒绝。
   */
  UserRejected = -102,
  /**
   * @~english The user is expelled. @~chinese 用户被驱逐。
   */
  UserExpelled = -103,
  /**
   * @~english The user ID is duplicate. @~chinese 用户 ID 重复。
   */
  UserDuplicate = -104,

  /**
   * @~english The channel is closed. @~chinese 频道被关闭。
   */
  ChannelClosed = -151,
  /**
   * @~english The channel capacity is full. @~chinese 频道容量已满。
   */
  ChannelFull = -152,
  /**
   * @~english The channel is locked. @~chinese 频道被锁定。
   */
  ChannelLocked = -153,
  /**
   * @~english The channel mode is mismatch. @~chinese 频道模式不匹配。
   */
  ChannelModeMismatch = -154,

  /**
   * @~english A network error occurred. @~chinese 出现网络错误。
   */
  NetworkError = -301,
}

/**
 * @brief @~english Failover state. @~chinese 故障转移状态。
 */
export enum FailoverState {
  /**
   * @~english Failover is reconnecting. @~chinese 发生故障转移，正在重新连接。
   */
  Reconnecting = 0,
  /**
   * @~english Failover succeeded. @~chinese 故障转移成功。
   */
  Success = 1,
  /**
   * @~english Failover failed. @~chinese 故障转移失败。
   */
  Failed = 2,
}

/**
 * @brief @~english Channel mode. @~chinese 频道模式。
 */
export enum ChannelMode {
  /**
   * @~english 1-on-1 channel mode. @~chinese 1对1频道模式。
   */
  OneOnOne = 0,
  /**
   * @~english Meeting channel mode. @~chinese 会议频道模式。
   */
  Meeting = 1,
}

/**
 * @brief @~english Channel service flag. @~chinese 频道服务标志。
 */
export enum ChannelService {
  /**
   * @~english Channel enable media service. @~chinese 频道启用媒体服务。
   */
  Media = 0x00000001,
  /**
   * @~english Channel enable whiteboard service. @~chinese 频道启用白板服务。
   */
  Whiteboard = 0x00000002,
}

/**
 * @brief @~english User leave reason. @~chinese 用户离开原因。
 */
export enum UserLeaveReason {
  /**
   * @~english The user leaves normally. @~chinese 用户正常离开。
   */
  Normal = 0,
  /**
   * @~english The user is expelled. @~chinese 用户被驱逐。
   */
  Expelled = 1,
  /**
   * @~english The user is disconnected. @~chinese 用户掉线。
   */
  Disconnected = 2,
  /**
   * @~english Channel is end. @~chinese 频道结束
   */
  ChannelEnd = 3,
  /**
   * @~english The user ID is duplicate. @~chinese 用户 ID 重复
   */
  DuplicateUserID = 4,
}

/**
 * @brief @~english The result to subscribe user media. @~chinese 用户媒体订阅结果。
 */
export enum SubscribeResult {
  /**
   * @~english subscribe success. @~chinese 订阅成功。
   */
  Success = 0,
  /**
   * @~english subscribe failed. @~chinese 订阅失败。
   */
  Failed = 1,
  /**
   * @~english the user is not found. @~chinese 被订阅的用户不存在。
   */
  UserNotFound = 2,
  /**
   * @~english the subscribe limit is reached. @~chinese 达到订阅上限。
   */
  LimitReached = 3,
}

/**
 * @brief @~english Video profile type. @~chinese 视频设定类型。
 */
export enum VideoProfileType {
  /**
   * @~english The lowest video profile. Resolution：160 x 90 or 160 x 120, frame rate: 15 fps.
   * @~chinese 最低档视频设定。分辨率：160 x 90 或 160 x 120，帧率：15 帧/秒。
   */
  Lowest = 0,
  /**
   * @~english The lower video profile. 320 x 180 or 320 x 240, frame rate: 15 fps.
   * @~chinese 低档视频设定。分辨率：320 x 180 或 320 x 240，帧率：15 帧/秒。
   */
  Low = 1,
  /**
   * @~english The standard video profile. 640 x 360 or 640 x 480, frame rate: 30 fps.
   * @~chinese 标准档视频设定。分辨率：640 x 360 或 640 x 480，帧率：30 帧/秒。
   */
  Standard = 2,
  /**
   * @~english The 720P video profile. 1280 x 720, frame rate: 30 fps.
   * @~chinese 高清档视频设定。分辨率：1280 x 720，帧率：30 帧/秒。
   */
  HD720P = 3,
  /**
   * @~english The 1080P video profile. 1920 x 1080, frame rate: 30 fps.
   * @~chinese 全高清档视频设定。分辨率：1920 x 1080，帧率：30 帧/秒。
   */
  HD1080P = 4,
  /**
   * @~english None video profile. @~chinese 无视频设定。
   */
  None = 5,
  /**
   * @~english The max video profile. @~chinese 最高档视频设定。
   */
  Max = HD1080P,
}

/**
 * @brief @~english Video scaling mode. @~chinese 视频缩放模式。
 */
export enum VideoScalingMode {
  /**
   * @~english Fit the view, maintaining aspect ratio.
   * @~chinese 适合视图，保持宽高比。
   */
  Fit = 0,
  /**
   * @~english Fully fill the view, without maintaining aspect ratio.
   * @~chinese 全填充视图，不保持宽高比。
   */
  FullFill = 1,
  /**
   * @~english Crop and fill the view, maintaining aspect ratio.
   * @~chinese 裁剪并填充视图，保持宽高比。
   */
  CropFill = 2,
}

/**
 * @brief @~english Audio type. @~chinese 音频类型。
 */
export enum AudioType {
  /**
   * @~english The standard form of digital audio. @~chinese 数字音频的标准形式。
   */
  PCM = 0,
}

/**
 * @brief @~english Video type. @~chinese 视频类型。
 */
export enum VideoType {
  /**
   * @~english The YUV standard format 4:2:0. @~chinese YUV标准格式4:2:0。
   */
  I420 = 0,
}

/**
 * @brief @~english Video rotation value. @~chinese 视频旋转值。
 */
export enum VideoRotation {
  /**
   *  @~english The video is rorated 0 degrees. @~chinese 视频旋转0度。
   */
  Rotation0 = 0,
  /**
   *  @~english The video is rorated 90 degrees. @~chinese 视频旋转90度。
   */
  Rotation90 = 90,
  /**
   * @~english The video is rorated 180 degrees. @~chinese 视频旋转180度。
   */
  Rotation180 = 180,
  /**
   * @~english The video is rorated 270 degrees. @~chinese 视频旋转270度。
   */
  Rotation270 = 270,
}

/**
 * @brief @~english Audio Device type. @~chinese 音频设备类型。
 */
export enum AudioDeviceType {
  /**
   * @~english The unknown device. @~chinese 未知设备。
   */
  Unknown = 0,
  /**
   * @~english The audio record device. @~chinese 录音设备。
   */
  Record = 1,
  /**
   * @~english The audio playout device. @~chinese 音频播放设备。
   */
  Playout = 2,
}

/**
 * @brief @~english Device state. @~chinese 设备状态。
 */
export enum AudioDeviceState {
  /**
   * @~english The device is actived. @~chinese 设备激活。
   */
  Active = 0,
  /**
   * @~english The device is inactived. @~chinese 设备未激活。
   */
  Inactive = 1,
}

/**
 * @brief @~english Video device type. @~chinese 视频设备类型。
 */
export enum VideoDeviceType {
  /**
   * @~english The unknown device. @~chinese 未知设备。
   */
  Unknown = 0,
  /**
   * @~english The video camera device. @~chinese 摄像设备。
   */
  Capture = 1,
}

/**
 * @brief @~english Video device state. @~chinese 视频设备状态。
 */
export enum VideoDeviceState {
  /**
   * @~english The device is added. @~chinese 设备添加。
   */
  Added = 0,
  /**
   * @~english The device is removed. @~chinese 设备移除。
   */
  Removed = 1,
}

/**
 * @brief @~english Video capture state. @~chinese 视频采集状态。
 */
export enum VideoCaptureState {
  /**
   * @~english Unknown video capture state. @~chinese 未知视频采集状态。
   */
  Unknown = 0,
  /**
   * @~english Video capture is normal. @~chinese 视频采集正常。
   */
  Normal = 1,
  /**
   * @~english Video capture is suspended. @~chinese 视频采集暂停。
   */
  Suspended = 2,
}

/**
 * @brief @~english Screen Capture State. @~chinese 屏幕采集状态。
 */
export enum ScreenCaptureState {
  /**
   * @~english Unknown screen capture state. @~chinese 未知屏幕采集状态。
   */
  Unknown = 0,
  /**
   * @~english Screen capture is normal. @~chinese 屏幕采集正常。
   */
  Normal = 1,
  /**
   * @~english Screen capture is stopped. @~chinese 屏幕采集停止。
   */
  Stopped = 2,
}

/**
 * @brief @~english Screen source type. @~chinese 屏幕源类型。
 */
export enum ScreenSourceType {
  /**
   * @~english The source type is screen. @~chinese 屏幕型。
   */
  Screen = 0,
  /**
   * @~english The source type is application. @~chinese 应用型。
   */
  Applicaition = 1,
  /**
   * @~english The source type is window. @~chinese 窗口型。
   */
  Window = 2,
}

/**
 * @brief @~english Screen scaling ratio type. @~chinese 屏幕缩放比例类型。
 */
export enum ScreenScalingRatio {
  /**
   * @~english The image ratio fitted for view. @~chinese 适合视图的图像比例。
   */
  FitRatio = 0,
  /**
   * @~english The image original ratio. @~chinese 图像原始比例。
   */
  OriginalRatio = 1,
}

/**
 * @brief @~english Whiteboard role type. @~chinese 白板角色类型。
 */
export enum WBRoleType {
  /**
   * @~english The admin role. @~chinese 白板管理员。
   */
  Admin = 0,
  /**
   * @~english The normal attendee. @~chinese 普通白板参与者。
   */
  Attendee = 1,
  /**
   * @~english The view only attendee. @~chinese 只看白板参与者。
   */
  Viewer = 2,
}

/**
 * @brief @~english Whiteboard tool type. @~chinese 白板工具类型。
 */
export enum WBToolType {
  /**
   * @~english None tool. @~chinese 空。
   */
  None = 0,
  /**
   * @~english Select tool. @~chinese 选择工具。
   */
  Select = 1,
  /**
   * @~english Path tool. @~chinese 路径工具。
   */
  Path = 2,
  /**
   * @~english Line tool. @~chinese 线条工具。
   */
  Line = 3,
  /**
   * @~english Rectangle tool. @~chinese 矩形工具。
   */
  Rect = 4,
  /**
   * @~english Ellipse tool. @~chinese 椭圆工具。
   */
  Ellipse = 5,
  /**
   * @~english Image tool. @~chinese 图像工具。
   */
  Image = 6,
  /**
   * @~english Text tool. @~chinese 文本工具。
   */
  Text = 7,
  /**
   * @~english Eraser tool. @~chinese 橡皮擦工具。
   */
  Eraser = 8,
  /**
   * @~english Brush tool. @~chinese 刷子工具。
   */
  Brush = 9,
  /**
   * @~english Arrow tool. @~chinese 箭头工具。
   */
  Arrow = 10,
  /**
   * @~english Polyline tool. Windows&MacOS only. @~chinese 折线工具。仅支持Windows及macOS平台。
   */
  Polyline = 11,
  /**
   * @~english Polygon tool. Windows&MacOS only. @~chinese 多边形工具。仅支持Windows及macOS平台。
   */
  Polygon = 12,
  /**
   * @~english Arc tool. Windows&MacOS only. @~chinese 弧线工具。仅支持Windows及macOS平台。
   */
  Arc = 13,
  /**
   * @~english Curve tool. Windows&MacOS only. @~chinese 曲线工具。仅支持Windows及macOS平台。
   */
  Curve = 14,
  /**
   * @~english LASER. @~chinese 激光笔。
   */
  Laser = 15,
}

/**
 * @brief @~english Whiteboard fill type. @~chinese 白板填充类型。
 */
export enum WBFillType {
  /**
   * @~english Fill none. @~chinese 不填充。
   */
  None = 0,
  /**
   * @~english Fill color. @~chinese 填色。
   */
  Color = 1,
}

/**
 * @brief @~english Whiteboard font style. @~chinese 白板字体样式。
 */
export enum WBFontStyle {
  /**
   * @~english Normal font. @~chinese 正常字体。
   */
  Normal = 0,
  /**
   * @~english Bold font. @~chinese 粗体。
   */
  Bold = 1,
  /**
   * @~english Italic font. @~chinese 斜体。
   */
  Italic = 2,
  /**
   * @~english Bold italic font. @~chinese 粗斜体。
   */
  BoldItalic = 3,
}

/**
 * @brief @~english Whiteboard image scaling mode. @~chinese 白板图片缩放模式。
 */
export enum WBImageScalingMode {
  /**
   * @~english Fit the view, maintaining aspect ratio.
   * @~chinese 适合视图，保持宽高比。
   */
  Fit = 0,
  /**
   * @~english Fill the view automatically, maintaining aspect ratio, align top and left.
   * @~chinese 自动填充视图，保持宽高比，左上对齐。
   */
  AutoFill = 1,
  /**
   * @~english Fill the view width, maintaining aspect ratio, align top.
   * @~chinese 按宽填充视图，保持宽高比，顶侧对齐。
   */
  FillWidth = 2,
  /**
   * @~english Fill the view height, maintaining aspect ratio, align left.
   * @~chinese 按高填充视图，保持宽高比，左侧对齐。
   */
  FillHeight = 3,
  /**
   * @~english Fit the view, maintaining aspect ratio, align center.
   * @~chinese 适合视图，保持宽高比，居中。
   */
  FitCenter = 4,
}

/**
 * @brief @~english Whiteboard image state. @~chinese 白板图片状态码。
 */
export enum WBImageState {
  /**
   * @~english Start to load the image. @~chinese 开始加载图片。
   */
  LoadStart = 0,
  /**
   * @~english The image load complete. @~chinese 图片加载成功。
   */
  LoadComplete = 1,
  /**
   * @~english The image load failed. @~chinese 图片加载失败。
   */
  LoadFail = 2,
}

/**
 * @brief @~english Whiteboard file convert type. @~chinese 白板文件转码类型。
 */
export enum WBConvertType {
  /**
   * @~english JPG image. @~chinese JPG图像。
   */
  JPG = 1,
  /**
   * @~english PNG image. @~chinese PNG图像。
   */
  PNG = 2,
  /**
   * @~english H5 page. @~chinese H5页面。
   */
  H5 = 3,
}

/**
 * @brief @~english Whiteboard file type. @~chinese 白板文件类型。
 */
export enum WBDocType {
  /** @~english Normal type. @~chinese 普通类型。 */
  Normal = 1,
  /** @~english H5 type. @~chinese H5类型。 */
  H5 = 2,
}

/**
 * @brief @~english Whiteboard clear type. @~chinese 白板清除类型。
 */
export enum WBClearType {
  /**
   * @~english clear whiteboard draws objects. @~chinese 清除白板绘制对象
   */
  Draws = 1,
  /**
   * @~english clear whiteboard background image. @~chinese 清除白板背景图。
   */
  BackgroundImage = 2,
  /**
   * @~english clear whiteboard all content. @~chinese 清除全部白板内容。
   */
  All = 255,
}

/**
 * @brief @~english Whiteboard snapshot mode. @~chinese 白板快照模式。
 */
export enum WBSnapshotMode {
  /**
   * @~english snapshot whiteboard view area. @~chinese 截取白板视图区域
   */
  View = 0,
  /**
   * @~english snapshot area with all objects.
   * @~chinese 截取所有白板对象。
   */
  All = 1,
}

/**
 * @brief @~english Whiteboard option type. @~chinese 白板可选项类型。
 */
export enum WBOptionType {
  /**
   * @~english Whiteboard file cache path, object type is String.
   * @~chinese 白板文件缓存路径，对象类型是 String 。
   */
  FileCachePath = 1,
  /**
   * @~english Enable whiteboard response UI event flag, object type is boolean value. Default is true
   * @~chinese 启用白板响应UI事件，对象类型是boolean。默认启用
   */
  EnableUIResponse = 2,
  /**
   * @~english show or hide whiteboard draws, object type is boolean value. Default is show
   * @note Background image or H5 contents are not affected by this option
   * @~chinese 显示或隐藏白板涂鸦，对象类型是boolean。默认显示
   * @note 背景图和H5内容不受此选项影响
   */
  ShowDraws = 3,
  /**
   * @~english enable whiteboard canvas scale and move, object type is boolean value. Default is true
   * @~chinese 启用白板画布缩放移动，对象类型是boolean。默认启用 */
  ScaleMove = 4,
  /**
   * @~english set image or audio/video object's default status is selected or not, object type is boolean value. Default is true
   * @~chinese 设置图片或音视频对象默认选中状态，对象类型是boolean。默认启用 */
  AutoSelected = 5,
}

/**
 * @brief @~english Option type. @~chinese 可选项类型。
 */
export enum OptionType {
  /**
   * @~english Face beacutify option, object type is PanoFaceBeautifyOption.
   * @~chinese 美颜可选项，对象类型是 PanoFaceBeautifyOption 。
   */
  FaceBeautify = 0,
  /**
   * @~english Logs upload option, object type is NSNumber with BOOL value.
   * @~chinese 日志上传可选项，对象类型是带 BOOL 值的 NSNumber 。
   */
  UploadLogs = 1,
  /**
   * @~english Audio dump file upload option, object type is NSNumber with BOOL value.
   * @~chinese 音频转储文件上传选项，对象类型是带 BOOL 值的 NSNumber 。
   */
  UploadAudioDump = 2,
  /**
   * @~english Audio equalization option, object type is NSNumber with PanoAudioEqualizationMode value.
   * @~chinese 音频均衡器选项，对象类型是带 PanoAudioEqualizationMode 值的 NSNumber 。
   */
  AudioEqualizationMode = 3,
  /**
   * @~english Audio reverb option, object type is NSNumber with PanoAudioReverbMode value.
   * @~chinese 音频混响器选项，对象类型是带 PanoAudioReverbMode 值的 NSNumber 。
   */
  AudioReverbMode = 4,
  /**
   * @~english Adjust video capture frame rate option, object type is NSNumber with PanoVideoFrameRateType value.
   * @~chinese 调整视频采集帧率选项，对象类型是带 PanoVideoFrameRateType 值的 NSNumber 。
   */
  VideoFrameRate = 5,
  /**
   * @~english Audio ear Monitoring enable option, object type is NSNumber with BOOL value.
   * @~chinese 音频耳返开关选项，对象类型是带 BOOL 值的 NSNumber 。
   */
  AudioEarMonitoring = 6,
  /**
   * @deprecated
   * @~english (Deprecated) Internal video transform option, object type is PanoBuiltinTransformOption.
   * @~chinese (已废弃)视频内嵌变换可选项，对象类型是 PanoBuiltinTransformOption 。
   */
  BuiltinTransform = 7,
  /**
   * @~english Enable upload PANO SDK logs when failed to join channel, object type is NSNumber with BOOL value.
   * @note This flag has been set by default.
   * @~chinese 允许加会失败时上传PANO日志，对象类型是带 BOOL 值的 NSNumber 。
   * @note 此标记设置后会一直有效。默认已经启用。
   */
  UploadLogsAtFailure = 8,
  /**
   * @~english Allow SDK to adjust video quality according to CPU performance.
   *           Object type is NSNumber with BOOL value. Default value is ture. Configurable before join room.
   * @note We do not recommend disabling CPU adaption in general case.
   * @~chinese 允许SDK根据CPU性能调整视频质量。对象类型是带 BOOL 值的 NSNumber 。默认值是true。仅在加入房间前可以配置。
   * @note 通常场景下不建议关闭此功能。
   */
  CpuAdaption = 9,
  /**
   * @~english Audio profile option, object type is PanoRtcAudioProfile.
   * @~chinese 音频配置选项，对象类型是 PanoRtcAudioProfile 。
   */
  AudioProfile = 10,
  /**
   * @~english Quadrilateral video transform option, object type is PanoQuadTransformOption.
   * @~chinese 视频四边形变换可选项，对象类型是 PanoQuadTransformOption 。
   */
  QuadTransform = 11,
  /**
   * @~english Screen Capture Frame Rate. Default value is false, true to enable high frame rate capture, for motion scenario.
   * @~chinese 屏幕采集帧率模式。参数类型是Boolean，默认是false, 高帧率采集用于内容变化剧烈场景。
   */
  ScreenOptimization = 17,
}

/**
 * @brief @~english Log output level. @~chinese 日志输出级别。
 */
export enum LogLevel {
  /**
   * @~english Outputs FATAL level log information.
   * @~chinese 输出FATAL级别日志信息。
   */
  Fatal = 0,
  /**
   * @~english Outputs FATAL and ERROR level log information.
   * @~chinese 输出FATAL和ERROR级别日志信息。
   */
  Error = 1,
  /**
   * @~english Outputs FATAL, ERROR and WARNING level log information.
   * @~chinese 输出FATAL、ERROR和WARNING级别日志信息。
   */
  Warning = 2,
  /**
   * @~english Outputs FATAL, ERROR, WARNING and INFO level log information.
   * @~chinese 输出FATAL、ERROR、WARNING和INFO级别日志信息。
   */
  Info = 3,
  /**
   * @~english Outputs FATAL, ERROR, WARNING, INFO and VERBOSE level log information.
   * @~chinese 输出FATAL、ERROR、WARNING、INFO和VERBOSE级别日志信息。
   */
  Verbose = 4,
  /**
   * @~english Outputs all level log information.
   * @~chinese 输出所有级别日志信息。
   */
  Debug = 5,
}

/**
 * @brief @~english Feedback type. @~chinese 用户反馈问题类型。
 */
export enum FeedbackType {
  /**
   * @~english General problem. @~chinese 通用类型。
   */
  General = 0,
  /**
   * @~english Audio problem. @~chinese 语音问题。
   */
  Audio = 1,
  /**
   * @~english Video problem. @~chinese 视频问题。
   */
  Video = 2,
  /**
   * @~english Whiteboard problem. @~chinese 白板问题。
   */
  Whiteboard = 3,
  /**
   * @~english Screen sharing problem. @~chinese 桌面共享问题。
   */
  Screen = 4,
}

/**
 * @brief @~english Audio mixing state. @~chinese 混音状态。
 */
export enum AudioMixingState {
  /**
   * @~english Mixing started.  @~chinese 混音开始。
   */
  Started = 0,
  /**
   * @~english Mixing finished. @~chinese 混音结束。
   */
  Finished = 1,
}

/**
 * @brief @~english Image file format. @~chinese 图片文件格式。
 */
export enum ImageFileFormat {
  /**
   * @~english JPEG. Lossy compression format. @~chinese JPEG。有损压缩格式。
   */
  JPEG = 0,
  /**
   * @~english PNG. Lossless compression format. @~chinese PNG。无损压缩格式。
   */
  PNG = 1,
  /**
   * @~english BMP. Uncompressed format.  @~chinese BMP。无压缩格式。
   */
  BMP = 2,
}

/**
 * @brief @~english Audio equalization option @~chinese 音频均衡器选项。
 */
export enum AudioEqualizationMode {
  /**
   * @~english None.  @~chinese  无音效
   */
  None = 0,
  /**
   * @~english Bass.  @~chinese  低音
   */
  Bass = 1,
  /**
   * @~english Loud.  @~chinese  高音
   */
  Loud = 2,
  /**
   * @~english Vocal Music.  @~chinese  声乐
   */
  VocalMusic = 3,
  /**
   * @~english Strong.  @~chinese  增强
   */
  Strong = 4,
  /**
   * @~english Pop.  @~chinese  流行
   */
  Pop = 5,
  /**
   * @~english Live.  @~chinese 现场
   */
  Live = 6,
  /**
   * @~english Dance Music.  @~chinese  舞曲
   */
  DanceMusic = 7,
  /**
   * @~english Club.  @~chinese  俱乐部
   */
  Club = 8,
  /**
   * @~english Soft.  @~chinese 轻柔
   */
  Soft = 9,
  /**
   * @~english Rock.  @~chinese  摇滚
   */
  Rock = 10,
  /**
   * @~english Party.  @~chinese  聚会
   */
  Party = 11,
  /**
   * @~english Classical.  @~chinese 古典
   */
  Classical = 12,
  /**
   * @~english Test.  @~chinese 测试用例
   */
  Test = 13,
}

export enum AudioReverbMode {
  /**
   * @~english None.  @~chinese 无音效
   */
  None = 0,
  /**
   * @~english Vocal I.  @~chinese 人声 1
   */
  VocalI = 1,
  /**
   * @~english Vocal II.  @~chinese 人声 2
   */
  VocalII = 2,
  /**
   * @~english Bathroom.  @~chinese 浴室
   */
  Bathroom = 3,
  /**
   * @~english Small room bright.  @~chinese 明亮小房间
   */
  SmallRoomBright = 4,
  /**
   * @~english Small room dark.  @~chinese 黑暗小房间
   */
  SmallRoomDark = 5,
  /**
   * @~english Medium room.  @~chinese 中等房间
   */
  MediumRoom = 6,
  /**
   * @~english Large room.  @~chinese 大房间
   */
  LargeRoom = 7,
  /**
   * @~english Church hall.  @~chinese 教堂大厅
   */
  ChurchHall = 8,
  /**
   * @~english Cathedral.  @~chinese 大教堂
   */
  Cathedral = 9,
}

/**
 * @brief @~english Video frame rate type. @~chinese 视频帧率类型。
 */
export enum VideoFrameRateType {
  /**
   * @~english The max frame rate is 15 fps. @~chinese 最大帧率 15 fps。
   */
  Low = 0,
  /**
   * @~english The max frame rate is 30 fps. @~chinese 最大帧率 30 fps。
   */
  Standard = 1,
}

/**
 * @brief  @~english Video Codec Type. @~chinese 视频编解码器类型。
 */
export enum VideoCodecType {
  /**
   * @~english unknown Codec. @~chinese 未知编解码器.
   */
  Unknown = 0,
  /**
   * @~english H.264 Codec. @~chinese H.264编解码.
   */
  H264 = 1,
  /**
   * @~english AV1 Codec. @~chinese AV1编解码.
   */
  AV1 = 2,
}

/**
 * @brief  @~english Audio Codec Type. @~chinese 音频编解码器类型。
 */
export enum AudioCodecType {
  /**
   * @~english unknown Codec. @~chinese 未知编解码器.
   */
  Unknown = 0,
  /**
   * @~english G.711 Codec. @~chinese G.711编解码器.
   */
  G711 = 1,
  /**
   * @~english G.722 Codec. @~chinese G.722编解码器.
   */
  G722 = 2,
  /**
   * @~english iLBC Codec. @~chinese iLBC编解码器.
   */
  ILBC = 3,
  /**
   * @~english iSAC Codec. @~chinese iSAC编解码器.
   */
  ISAC = 4,
  /**
   * @~english Opus Codec. @~chinese Opus编解码器.
   */
  OPUS = 5,
}

/**
 * @brief  @~english Audio Sample Rate. @~chinese 音频采样率。
 */
export enum AudioSampleRate {
  /**
   * @~english Audio sample rate16000Hz. @~chinese 音频采样率16000Hz.
   */
  Rate16KHz = 16000,
  /**
   * @~english Audio sample rate48000Hz. @~chinese 音频采样率48000Hz.
   */
  Rate48KHz = 48000,
}

/**
 * @brief  @~english Audio Channel. @~chinese 音频采样率。
 */
export enum AudioChannel {
  /**
   * @~english Audio channel mono. @~chinese 音频单通道.
   */
  Mono = 1,
  /**
   * @~english Audio channel stereo. @~chinese 音频双通道.
   */
  Stereo = 2,
}

/**
 * @brief  @~english Audio Profile Quality. @~chinese 音频质量配置。
 */
export enum AudioProfileQuality {
  /**
   * @~english Audio quality default: encode bitrate - 48kbps. @~chinese 音频默认质量: 编码最大码率 48kbps
   */
  Default = 0,
  /**
   * @~english Audio high quality: encode bitrate - 128kbps. @~chinese 音频质量: 编码最大码率 128kbps
   */
  High = 1,
}

/**
 * @brief @~english Quality rating values. @~chinese 质量评分分值。
 */
export enum QualityRating {
  /**
   * @~english Service not available. @~chinese 服务不可用。
   */
  Unavailable = 0,
  /**
   * @~english The quality is very bad. @~chinese 服务质量非常差，几乎不可用。
   */
  VeryBad = 1,
  /**
   * @~english The quality is bad. @~chinese 服务质量比较差，质量不稳定。
   */
  Bad = 2,
  /**
   * @~english The quality is poor. @~chinese 服务质量一般。
   */
  Poor = 3,
  /**
   * @~english The quality is good. @~chinese 服务质量很好。
   */
  Good = 4,
  /**
   * @~english The quality is excellent. @~chinese 服务质量非常好。
   */
  Excellent = 5,
}

/**
 * @brief @~english Media processor type. @~chinese 媒体处理类型。
 */
export enum MediaProcessorType {
  /**
   * @~english Audio Capture External Processor for data before local process.
   *           The processor must be PanoRtcAudioDataExProcessorDelegate pointer or nullptr.
   *           And the param shoubld be nullptr.
   * @~chinese 音频采集外部处理(位置位于本地采集后，前处理前)。
   *           对应的处理模块必须为 PanoRtcAudioDataExProcessorDelegate 指针类型或空，对应的处理模块参数必须为空。
   */
  AudioCaptureExProcessor = 1,
  /**
   * @~english Audio Capture External Effect Processor for data after local process and before encoder.
   *           The processor must be PanoRtcAudioDataExProcessorDelegate pointer or nullptr.
   *           And the param shoubld be nullptr.
   * @~chinese 音频采集外部处理(位置位于本地处理后，编码前)。
   *           对应的处理模块必须为 PanoRtcAudioDataExProcessorDelegate 指针类型或空，对应的处理模块参数必须为空。
   */
  AudioCaptureExEffectProcessor = 2,
  /**
   * @~english Audio Capture External Processor for before playback.
   *           The processor must be PanoRtcAudioDataExProcessorDelegate pointer or nullptr.
   *           And the param shoubld be nullptr.
   * @~chinese 音频采集外部处理(位置位于播放前)。
   *           对应的处理模块必须为 PanoRtcAudioDataExProcessorDelegate 指针类型或空，对应的处理模块参数必须为空。
   */
  AudioRenderExProcessor = 3,
  /**
   * @~english Video Preprocessor. The processor must be PanoRtcVideoFilterDelegate or nil.
   *           And the param should be nil.
   * @~chinese 视频前处理。对应的处理模块必须为 PanoRtcVideoFilterDelegate 代理或空，对应的处理模块参数必须为空。
   */
  VideoPreprocessor = 100,
}

/**
 * @brief @~english Quadrilateral vertex index. @~chinese 四边形顶点索引。
 */
export enum QuadIndex {
  /** @~english The top left of a quadrilateral.
   *  @~chinese 四边形左上角顶点。
   */
  TopLeft = 0,
  /** @~english The top right of a quadrilateral.
   *  @~chinese 四边形右上角顶点。
   */
  TopRight = 1,
  /** @~english The top right of a quadrilateral.
   *  @~chinese 四边形右上角顶点。
   */
  BottomLeft = 2,
  /** @~english The top right of a quadrilateral.
   *  @~chinese 四边形右上角顶点。
   */
  BottomRight = 3,
}

/**
 * @brief @~english Message service state. @~chinese 消息服务状态。
 */
export enum MessageServiceState {
  /** @~english The message service is unavailable.
   *  @~chinese 消息服务不可用。 */
  Unavailable = 0,
  /** @~english The message service is available.
   *  @~chinese 消息服务可用。 */
  Available = 1,
}
