import {
  ChannelMode,
  ChannelService,
  VideoProfileType,
  VideoScalingMode,
  AudioType,
  VideoType,
  VideoRotation,
  AudioSampleRate,
  AudioChannel,
  AudioProfileQuality,
  AudioCodecType,
  VideoCodecType,
  WBFontStyle,
  QuadIndex,
  FeedbackType,
  ImageFileFormat,
  QualityRating,
  WBConvertType,
  WBDocType,
  ActionType,
} from './Enums';

/**
 * @brief @~english The configurations class of the PanoRtcEngineKit object.
 *        @~chinese PanoRtcEngineKit 对象的配置类。
 */
export class RtcEngineConfig {
  /**
   * @brief @~english The application ID applied from PANO.
   *        @~chinese 从PANO申请的应用标识。
   */
  appId: string;
  /**
   * @brief @~english The PANO server address. Format: <"domain name">[:port].
   *        @~chinese PANO服务器地址。格式：<"域名">[:端口]
   */
  rtcServer: string;
  /**
   * @brief @~english Whether the video codec is enabled for hardware acceleration. Default: NO.
   *        @~chinese 视频编解码器是否启用硬件加速。默认值：否。
   */
  videoCodecHwAcceleration: boolean;
  /**
   * @brief @~english The audio Scenario. Default: 0(voip).
   *        @~chinese 音频场景。默认值：0(voip)
   */
  audioScenario: number;

  constructor(
    appId: string,
    rtcServer: string = 'api.pano.video',
    videoCodecHwAcceleration: boolean = false,
    audioScenario: number = 0
  ) {
    this.appId = appId;
    this.rtcServer = rtcServer;
    this.videoCodecHwAcceleration = videoCodecHwAcceleration;
    this.audioScenario = audioScenario;
  }
}

/**
 * @brief @~english The configurations class for joinning a channel.
 *        @~chinese 用于加入频道的配置类。
 */
export class RtcChannelConfig {
  /**
   * @brief @~english Channel working mode. Default: kPanoChannel1v1.
   *        @~chinese 频道工作模式。默认值：kPanoChannel1v1。
   */
  mode: ChannelMode;
  /**
   * @brief @~english Channel service serviceFlags. Default: kPanoChannelServiceMedia | kPanoChannelServiceWhiteboard.
   *        @~chinese 频道服务标志。默认值：kPanoChannelServiceMedia | kPanoChannelServiceWhiteboard。
   */
  serviceFlags: Array<ChannelService>;
  /**
   * @brief @~english Whether to subscribe audio automatically. Default: YES.
   *        @~chinese 是否自动订阅所有音频。默认值：是。
   */
  subscribeAudioAll: boolean;
  /**
   * @brief @~english The user display name. It must compliance with the following rules:
   *                   - max length is 128 bytes.
   *                   - UTF8 string.
   *        @~chinese 用户显示名字。必须符合以下规则:
   *                   - 最大长度是128字节；
   *                   - UTF8 字符串。
   */
  userName?: string;

  constructor(
    mode: ChannelMode = ChannelMode.OneOnOne,
    serviceFlags: Array<ChannelService> = [
      ChannelService.Media,
      ChannelService.Whiteboard,
      ChannelService.Message,
    ],
    subscribeAudioAll: boolean = true,
    userName?: string
  ) {
    this.mode = mode;
    this.serviceFlags = serviceFlags;
    this.subscribeAudioAll = subscribeAudioAll;
    this.userName = userName;
  }
}

/**
 * @brief @~english The configurations class of the video renderer. @~chinese 视频渲染器的配置类。
 */
export class RtcRenderConfig {
  /**
   * @brief @~english The video profile. Default: Standard.
   *        @~chinese 视频设定档。默认值：Standard。
   */
  profileType: VideoProfileType;
  /**
   * @~english Enable Video Source Mirror. Default: NO @~chinese  启用视频源镜像, 默认值: NO。
   */
  sourceMirror: boolean;
  /**
   * @brief @~english The video scaling mode. Default: kPanoScalingFit.
   *        @~chinese 视频缩放模式。默认值：kPanoScalingFit。
   */
  scalingMode: VideoScalingMode;
  /**
   * @brief @~english Whether to enable video mirroring. Default: NO.
   *        @~chinese 是否启用视频镜像。默认值：NO。
   */
  mirror: boolean;

  constructor(
    profileType: VideoProfileType = VideoProfileType.Standard,
    sourceMirror: boolean = false,
    scalingMode: VideoScalingMode = VideoScalingMode.Fit,
    mirror: boolean = false
  ) {
    this.profileType = profileType;
    this.sourceMirror = sourceMirror;
    this.scalingMode = scalingMode;
    this.mirror = mirror;
  }
}

/**
 * @brief @~english The audio format class. @~chinese 音频格式类。
 */
export class RtcAudioFormat {
  /**
   * @brief @~english The audio type. Default: kPanoPCM.
   *        @~chinese 音频类型。默认值：kPanoPCM。
   */
  type: AudioType;
  /**
   * @brief @~english The number of audio channels.
   *        @~chinese 音频通道数。
   */
  channels: number;
  /**
   * @brief @~english The audio sample rate.
   *        @~chinese 音频采样率。
   */
  sampleRate: number;
  /**
   * @brief @~english The bytes per audio frame.
   *        @~chinese 音频每帧的字节数。
   */
  bytesPerSample: number;

  constructor(
    type: AudioType = AudioType.PCM,
    channels: number = 0,
    sampleRate: number = 0,
    bytesPerSample: number = 0
  ) {
    this.type = type;
    this.channels = channels;
    this.sampleRate = sampleRate;
    this.bytesPerSample = bytesPerSample;
  }
}

/**
 * @brief @~english The video format class. @~chinese 视频格式类。
 */
export class RtcVideoFormat {
  /**
   * @brief @~english The video type. Default: kPanoI420.
   *        @~chinese 视频类型。默认值：kPanoI420。
   */
  type: VideoType;
  /**
   * @brief @~english The video width.
   *        @~chinese 视频宽度。
   */
  width: number;
  /**
   * @brief @~english The video height.
   *        @~chinese 视频高度。
   */
  height: number;
  /**
   * @~english @brief The count of video block array.
   * @details If the video type is kPanoI420, the count should be 3.
   * @~chinese @brief 视频块数组的项目数。
   * @details 如果视频类型为kPanoI420，则计数应为3。
   */
  count: number;
  /**
   * @~english @brief The video block offset array. Item type: UInt32.
   * @details The offsets are for the first address of the video block.
   * @~chinese @brief 视频块偏移量数组。项目类型：UInt32。
   * @details 偏移量都是针对视频块首地址的。
   */
  offset: number[];
  /**
   * @brief @~english The video block stride array. Item type: UInt32.
   *        @~chinese 视频块步幅数组。项目类型：UInt32。
   */
  stride: number[];
  /**
   * @brief @~english The video rotation degrees. Default: kPanoRotation0.
   *        @~chinese 视频旋转角度。默认值：kPanoRotation0。
   */
  rotation: VideoRotation;

  constructor(
    type: VideoType = VideoType.I420,
    width: number = 0,
    height: number = 0,
    count: number = 0,
    offset: number[],
    stride: number[],
    rotation: VideoRotation = VideoRotation.Rotation0
  ) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.count = count;
    this.offset = offset;
    this.stride = stride;
    this.rotation = rotation;
  }
}

/**
 * @brief @~english The statistics class of user audio level. @~chinese 音频接收统计类。
 */
export class RtcAudioLevel {
  /**
   * @~english @brief The user ID of received audio.
   * @details The propertie is the user of the audio that has been subscribed.
   * @~chinese @brief 音频接收用户标识。
   * @details 此属性是已被订阅音频的用户。
   */
  userId: string;
  /**
   * @~english @brief The audio output strength level. Valid value range:[0, 32768].
   * @details The propertie is the instantaneous value when callbacking statistics.
   * @~chinese @brief 音频输出强度级别。有效值范围：[0, 32768]。
   * @details 此属性是回调统计时的瞬时值。
   */
  level: number;
  /**
   * @~english @brief The audio active flag.
   * @details The propertie is the instantaneous flag when callbacking statistics.
   * @~chinese @brief 音频活跃标志。
   * @details 此属性是回调统计时的瞬时音频活跃标志。
   * */
  active: boolean;

  constructor(userId: string, level: number = 0, active: boolean = false) {
    this.userId = userId;
    this.level = level;
    this.active = active;
  }
}

/**
 * @brief @~english Audio profile. @~chinese 音频配置。
 */
export class RtcAudioProfile {
  /**
   * @~english @brief The audio sample rate.
   * @~chinese @brief 音频采样率。
   */
  sampleRate: AudioSampleRate;
  /**
   * @~english @brief The audio channel.
   * @~chinese @brief 音频通道数。
   */
  channel: AudioChannel;
  /**
   * @~english @brief The audio quality Profile.
   * @~chinese @brief 音频质量。
   */
  profileQuality: AudioProfileQuality;

  constructor(
    sampleRate: AudioSampleRate = AudioSampleRate.Rate48KHz,
    channel: AudioChannel = AudioChannel.Mono,
    profileQuality: AudioProfileQuality = AudioProfileQuality.Default
  ) {
    this.sampleRate = sampleRate;
    this.channel = channel;
    this.profileQuality = profileQuality;
  }
}

/**
 * @brief @~english The statistics class of sent audio. @~chinese 音频发送统计类。
 */
export class RtcAudioSendStats {
  /**
   * @~english @brief The audio sent bytes.
   * @details The propertie is the total bytes after the audio is started.
   * @~chinese @brief 音频发送字节数。
   * @details 此属性是音频开启之后的累计字节。
   */
  bytesSent: number;
  /**
   * @~english @brief The audio sent bitrate. Unit: bps.
   * @details The propertie is the instantaneous bitrate when callbacking statistics.
   * @~chinese @brief 音频发送比特率。单位：比特每秒。
   * @details 此属性是回调统计时的瞬时比特率。
   */
  sendBitrate: number;
  /**
   * @~english @brief The numnber of audio sent lost packets.
   * @details The propertie is the total packets after the audio is started.
   * @~chinese @brief 音频发送丢包数。
   * @details 此属性是音频开启之后的累计包数。
   */
  packetsLost: number;
  /**
   * @~english @brief The audio sent loss ratio.
   * @details The propertie is the instantaneous ratio when callbacking statistics.
   * @~chinese @brief 音频发送丢包率。
   * @details 此属性是回调统计时的瞬时比率。
   */
  lossRatio: number;
  /**
   * @~english @brief The audio round-trip time.
   * @details The propertie is the recent RTT value when callbacking statistics.
   * @~chinese @brief 音频往返时延。
   * @details 此属性是回调统计时的最近往返时延值。
   */
  rtt: number;
  /**
   * @~english @brief The audio input strength level. Valid value range:[0, 32767].
   * @details The propertie is the instantaneous value when callbacking statistics.
   * @~chinese @brief 音频输入强度级别。有效值范围：[0, 32767]。
   * @details 此属性是回调统计时的瞬时值。
   */
  inputLevel: number;
  /**
   * @~english @brief The local audio input active detection
   * @details The propertie is the instantaneous value when callbacking statistics.
   * @~chinese @brief 本地用户(麦克风采集)说话检测。
   * @details 此属性是回调统计时的瞬时值。
   */
  inputActiveFlag: boolean; //  YES: active, NO: inactive
  /**
   * @~english @brief The type of audio codec.
   * @details The propertie is the dynamic value during audio sending.
   * @~chinese @brief 音频编码器类型。
   * @details 此属性是在音频发送期间是个动态值。
   */
  codecType: AudioCodecType;

  constructor(
    bytesSent: number,
    sendBitrate: number,
    packetsLost: number,
    lossRatio: number,
    rtt: number,
    inputLevel: number,
    inputActiveFlag: boolean,
    codecType: AudioCodecType
  ) {
    this.bytesSent = bytesSent;
    this.sendBitrate = sendBitrate;
    this.packetsLost = packetsLost;
    this.lossRatio = lossRatio;
    this.rtt = rtt;
    this.inputLevel = inputLevel;
    this.inputActiveFlag = inputActiveFlag;
    this.codecType = codecType;
  }
}

/**
 * @brief @~english The statistics class of received audio. @~chinese 音频接收统计类。
 */
export class RtcAudioRecvStats {
  /**
   * @~english @brief The user ID of received audio.
   * @details The propertie is the user of the audio that has been subscribed.
   * @~chinese @brief 音频接收用户标识。
   * @details 此属性是已被订阅音频的用户。
   */
  userId: string;
  /**
   * @~english @brief The audio received bytes.
   * @details The propertie is the total bytes after the audio is subscribed.
   * @~chinese @brief 音频接收字节数。
   * @details 此属性是音频订阅之后的累计字节。
   */
  bytesRecv: number;
  /**
   * @~english @brief The audio received bitrate. Unit: bps.
   * @details The propertie is the instantaneous bitrate when callbacking statistics.
   * @~chinese @brief 音频接收比特率。单位：比特每秒。
   * @details 此属性是回调统计时的瞬时比特率。
   */
  recvBitrate: number;
  /**
   * @~english @brief The numnber of audio received lost packets.
   * @details The propertie is the total packets after the audio is subscribed.
   * @~chinese @brief 音频接收丢包数。
   * @details 此属性是音频订阅之后的累计包数。
   */
  packetsLost: number;
  /**
   * @~english @brief The audio received loss ratio.
   * @details The propertie is the instantaneous ratio when callbacking statistics.
   * @~chinese @brief 音频接收丢包率。
   * @details 此属性是回调统计时的瞬时比率。
   */
  lossRatio: number;
  /**
   * @~english @brief The audio output strength level. Valid value range:[0, 32767].
   * @details The propertie is the instantaneous value when callbacking statistics.
   * @~chinese @brief 音频输出强度级别。有效值范围：[0, 32767]。
   * @details 此属性是回调统计时的瞬时值。
   */
  outputLevel: number;
  /**
   * @~english @brief The type of audio codec.
   * @details The propertie is the dynamic value during audio receiving.
   * @~chinese @brief 音频解码器类型。
   * @details 此属性是在音频接收期间是个动态值。
   */
  codecType: AudioCodecType;

  constructor(
    userId: string,
    bytesRecv: number,
    recvBitrate: number,
    packetsLost: number,
    lossRatio: number,
    outputLevel: number,
    codecType: AudioCodecType
  ) {
    this.userId = userId;
    this.bytesRecv = bytesRecv;
    this.recvBitrate = recvBitrate;
    this.packetsLost = packetsLost;
    this.lossRatio = lossRatio;
    this.outputLevel = outputLevel;
    this.codecType = codecType;
  }
}

/**
 * @brief @~english The statistics class of sent video. @~chinese 视频发送统计类。
 */
export class RtcVideoSendStats {
  /**
   * @~english @brief The stream ID of received video.
   * @~chinese @brief 视频流标识。
   */
  streamId: number;
  /**
   * @~english @brief The video sent bytes.
   * @details The propertie is the total bytes after the video is started.
   * @~chinese @brief 视频发送字节数。
   * @details 此属性是视频开启之后的累计字节。
   */
  bytesSent: number;
  /**
   * @~english @brief The video sent bitrate. Unit: bps.
   * @details The propertie is the instantaneous bitrate when callbacking statistics.
   * @~chinese @brief 视频发送比特率。单位：比特每秒。
   * @details 此属性是回调统计时的瞬时比特率。
   */
  sendBitrate: number;
  /**
   * @~english @brief The numnber of video sent lost packets.
   * @details The propertie is the total packets after the video is started.
   * @~chinese @brief 视频发送丢包数。
   * @details 此属性是视频开启之后的累计包数。
   */
  packetsLost: number;
  /**
   * @~english @brief The video sent loss ratio.
   * @details The propertie is the instantaneous ratio when callbacking statistics.
   * @~chinese @brief 视频发送丢包率。
   * @details 此属性是回调统计时的瞬时比率。
   */
  lossRatio: number;
  /**
   * @~english @brief The with of video sent resolution.
   * @details The propertie is the dynamic value during video sending.
   * @~chinese @brief 视频发送分辨率的宽度值。
   * @details 此属性是在视频发送期间是个动态值。
   */
  width: number;
  /**
   * @~english @brief The height of video sent resolution.
   * @details The propertie is the dynamic value during video sending.
   * @~chinese @brief 视频发送分辨率的高度值。
   * @details 此属性是在视频发送期间是个动态值。
   */
  height: number;
  /**
   * @~english @brief The video sent frame rate.
   * @details The propertie is the dynamic value during video sending.
   * @~chinese @brief 视频发送帧率。
   * @details 此属性是在视频发送期间是个动态值。
   */
  framerate: number;
  /**
   * @~english @brief The number of received PLI packets during video sending.
   * @details The propertie is the total packets after the video is started.
   * @~chinese @brief 视频发送期间接收到的PLI包数。
   * @details 此属性是视频开启之后的累计包数。
   */
  plisReceived: number;
  /**
   * @~english @brief The video round-trip time.
   * @details The propertie is the recent RTT value when callbacking statistics.
   * @~chinese @brief 视频往返时延。
   * @details 此属性是回调统计时的最近往返时延值。
   */
  rtt: number;
  /**
   * @~english @brief The type of video codec.
   * @details The propertie is the dynamic value during video sending.
   * @~chinese @brief 视频编码器类型。
   * @details 此属性是在视频发送期间是个动态值。
   */
  codecType: VideoCodecType;

  constructor(
    streamId: number,
    bytesSent: number,
    sendBitrate: number,
    packetsLost: number,
    lossRatio: number,
    width: number,
    height: number,
    framerate: number,
    plisReceived: number,
    rtt: number,
    codecType: VideoCodecType
  ) {
    this.streamId = streamId;
    this.bytesSent = bytesSent;
    this.sendBitrate = sendBitrate;
    this.packetsLost = packetsLost;
    this.lossRatio = lossRatio;
    this.width = width;
    this.height = height;
    this.framerate = framerate;
    this.plisReceived = plisReceived;
    this.rtt = rtt;
    this.codecType = codecType;
  }
}

/**
 * @brief @~english The statistics class of received video. @~chinese 视频接收统计类。
 */
export class RtcVideoRecvStats {
  /**
   * @~english @brief The user ID of received video.
   * @details The propertie is the user of the video that has been subscribed.
   * @~chinese @brief 视频接收用户标识。
   * @details 此属性是已被订阅视频的用户。
   */
  userId: string;
  /**
   * @~english @brief The stream ID of received video.
   * @~chinese @brief 视频流标识。
   */
  streamId: number;
  /**
   * @~english @brief The video received bytes.
   * @details The propertie is the total bytes after the video is subscribed.
   * @~chinese @brief 视频接收字节数。
   * @details 此属性是视频订阅之后的累计字节。
   */
  bytesRecv: number;
  /**
   * @~english @brief The video received bitrate. Unit: bps.
   * @details The propertie is the instantaneous bitrate when callbacking statistics.
   * @~chinese @brief 视频接收比特率。单位：比特每秒。
   * @details 此属性是回调统计时的瞬时比特率。
   */
  recvBitrate: number;
  /**
   * @~english @brief The numnber of video received lost packets.
   * @details The propertie is the total packets after the video is subscribed.
   * @~chinese @brief 视频接收丢包数。
   * @details 此属性是视频订阅之后的累计包数。
   */
  packetsLost: number;
  /**
   * @~english @brief The video received loss ratio.
   * @details The propertie is the instantaneous ratio when callbacking statistics.
   * @~chinese @brief 视频接收丢包率。
   * @details 此属性是回调统计时的瞬时比率。
   */
  lossRatio: number;
  /**
   * @~english @brief The width of video received resolution.
   * @details The propertie is the dynamic value during video receiving.
   * @~chinese @brief 视频接收分辨率的宽度值。
   * @details 此属性是在视频接收期间是个动态值。
   */

  width: number;
  /**
   * @~english @brief The height of video received resolution.
   * @details The propertie is the dynamic value during video receiving.
   * @~chinese @brief 视频接收分辨率的高度值。
   * @details 此属性是在视频接收期间是个动态值。
   */
  height: number;
  /**
   * @~english @brief The video received frame rate.
   * @details The propertie is the dynamic value during video receiving.
   * @~chinese @brief 视频接收帧率。
   * @details 此属性是在视频接收期间是个动态值。
   */
  framerate: number;
  /**
   * @~english @brief The number of sent PLI packets during video receiving.
   * @details The propertie is the total packets after the video is subscribed.
   * @~chinese @brief 视频接收期间发送出的PLI包数。
   * @details 此属性是视频订阅之后的累计包数。
   */
  plisSent: number;
  /**
   * @~english @brief The type of video codec.
   * @details The propertie is the dynamic value during video receiving.
   * @~chinese @brief 视频解码器类型。
   * @details 此属性是在视频接收期间是个动态值。
   */
  codecType: VideoCodecType;

  constructor(
    userId: string,
    streamId: number,
    bytesRecv: number,
    recvBitrate: number,
    packetsLost: number,
    lossRatio: number,
    width: number,
    height: number,
    framerate: number,
    plisSent: number,
    codecType: VideoCodecType
  ) {
    this.userId = userId;
    this.streamId = streamId;
    this.bytesRecv = bytesRecv;
    this.recvBitrate = recvBitrate;
    this.packetsLost = packetsLost;
    this.lossRatio = lossRatio;
    this.width = width;
    this.height = height;
    this.framerate = framerate;
    this.plisSent = plisSent;
    this.codecType = codecType;
  }
}

/**
 * @typedef RtcScreenRecvStats
 * @~english @brief The statistics class of sent screen sharing.
 * @details The properties of this class are same as the RtcScreenRecvStats class.
 * @~chinese @brief 屏幕共享发送的统计类。
 * @details 此类所有属性和 RtcScreenRecvStats 类相同。
 */
export type RtcScreenSendStats = RtcVideoSendStats;

/**
 * @typedef RtcScreenRecvStats
 * @~english @brief The statistics class of received screen sharing.
 * @details The properties of this class are same as the RtcScreenRecvStats class.
 * @~chinese @brief 屏幕共享接收的统计信息类。
 * @details 此类所有属性和 RtcScreenRecvStats 类相同。
 */
export type RtcScreenRecvStats = RtcVideoRecvStats;

/**
 * @brief @~english The statistics class of bandwidth estimation of sent video.
 *        @~chinese 视频发送带宽评估统计类。
 */
export class RtcVideoSendBweStats {
  /**
   * @~english @brief The evaluated bandwidth of sent video.
   * @details The propertie is the total bandwidth of video and screen sharing.
   * @~chinese @brief 视频发送的评估带宽。
   * @details 此属性是视频和屏幕共享的总带宽。
   */
  bandwidth: number;
  /**
   * @~english @brief The encode bitrate of sent video. Unit: bps.
   * @details The propertie is the total encode bitrate of video and screen sharing.
   * @~chinese @brief 视频发送的编码比特率。单位：比特每秒。
   * @details 此属性是视频和屏幕共享的总编码比特率。
   */
  encodeBitrate: number;
  /**
   * @~english @brief The transmit bitrate of sent video. Unit: bps.
   * @details The propertie is the total transmit bitrate of video and screen sharing.
   * @~chinese @brief 视频发送的传输比特率。单位：比特每秒。
   * @details 此属性是视频和屏幕共享的总传输比特率。
   */
  transmitBitrate: number;
  /**
   * @~english @brief The retransmit bitrate of sent video. Unit: bps.
   * @details The propertie is the total retransmit bitrate of video and screen sharing.
   * @~chinese @brief 视频发送的重传比特率。单位：比特每秒。
   * @details 此属性是视频和屏幕共享的总重传比特率。
   */
  retransmitBitrate: number;

  constructor(
    bandwidth: number,
    encodeBitrate: number,
    transmitBitrate: number,
    retransmitBitrate: number
  ) {
    this.bandwidth = bandwidth;
    this.encodeBitrate = encodeBitrate;
    this.transmitBitrate = transmitBitrate;
    this.retransmitBitrate = retransmitBitrate;
  }
}

/**
 * @brief @~english The statistics class of bandwidth estimation of received video.
 *        @~chinese 视频接收带宽评估统计类。
 */
export class RtcVideoRecvBweStats {
  /**
   * @~english @brief The user ID of received video.
   * @details The propertie is the user of the video that has been subscribed.
   * @~chinese @brief 视频接收用户标识。
   * @details 此属性是已被订阅视频的用户。
   */
  userId: string;
  /**
   * @~english @brief The evaluated bandwidth of received video.
   * @details The propertie is the total bandwidth of video and screen sharing.
   * @~chinese @brief 视频接收的评估带宽。
   * @details 此属性是视频和屏幕共享的总带宽。
   */
  bandwidth: number;

  constructor(userId: string, bandwidth: number) {
    this.userId = userId;
    this.bandwidth = bandwidth;
  }
}

/**
 * @brief @~english The statistics class of system information. @~chinese 系统信息统计类。
 */
export class RtcSystemStats {
  /**
   * @~english @brief The total cpu usage. Unit: percentage.
   * @~chinese @brief 总CPU负载。单位：百分比。
   */
  totalCpuUsage: number;
  /**
   * @~english @brief The total physical memory. Unit: KByte.
   * @~chinese @brief 总物理内存。单位：千字节。
   */
  totalPhysMemory: number;
  /**
   * @~english @brief The memory used by current process. Unit: KByte.
   * @~chinese @brief 当前进程使用内存。单位：千字节。
   */
  workingSetSize: number;
  /**
   * @~english @brief The total memory usage. Unit: percentage.
   * @~chinese @brief 总内存负载。单位：百分比。
   */
  memoryUsage: number;

  constructor(
    totalCpuUsage: number,
    totalPhysMemory: number,
    workingSetSize: number,
    memoryUsage: number
  ) {
    this.totalCpuUsage = totalCpuUsage;
    this.totalPhysMemory = totalPhysMemory;
    this.workingSetSize = workingSetSize;
    this.memoryUsage = memoryUsage;
  }
}

/**
 * @brief @~english The device information class. @~chinese 设备信息类。
 */
export class RtcDeviceInfo {
  /**
   * @brief @~english The device unque ID. @~chinese 设备唯一标识。
   */
  deviceId: string;
  /**
   * @brief @~english The device display name. @~chinese 设备可显示名字。
   */
  deviceName: string;

  constructor(deviceId: string, deviceName: string) {
    this.deviceId = deviceId;
    this.deviceName = deviceName;
  }
}

type ScreenSourceID = number;

/**
 * @brief @~english The screen source information class. @~chinese 屏幕源信息类。
 */
export class RtcScreenSourceInfo {
  /**
   * @brief @~english The screen source unque ID. @~chinese 屏幕源唯一标识。
   */
  sourceId: ScreenSourceID;
  /**
   * @brief @~english The screen source display name. @~chinese 屏幕源可显示名字。
   */
  sourceName: string;

  constructor(sourceId: ScreenSourceID, sourceName: string) {
    this.sourceId = sourceId;
    this.sourceName = sourceName;
  }
}

/**
 * @brief @~english The whiteboard color class. @~chinese 白板颜色类。
 */
export class WBColor {
  /**
   * @brief @~english The red component, valid value range:[0.0, 1.0]. Default: 0.0.
   *        @~chinese 红色成分，有效值范围：[0.0, 1.0]。默认值：0.0。
   */
  red: number;
  /**
   * @brief @~english The green component, valid value range:[0.0, 1.0]. Default: 0.0.
   *        @~chinese 绿色成分，有效值范围：[0.0, 1.0]。默认值：0.0。
   */
  green: number;
  /**
   * @brief @~english The blue component, valid value range:[0.0, 1.0]. Default: 0.0.
   *        @~chinese 蓝色成分，有效值范围：[0.0, 1.0]。默认值：0.0。
   */
  blue: number;
  /**
   * @brief @~english The alpha component, valid value range:[0.0, 1.0]. Default: 1.0.
   *        @~chinese 透明度成分，有效值范围：[0.0, 1.0]。默认值：1.0。
   */
  alpha: number;

  constructor(
    red: number = 0.0,
    green: number = 0.0,
    blue: number = 0.0,
    alpha: number = 1.0
  ) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }
}

/**
 * @brief @~english The whiteboard text format class. @~chinese 白板文本格式类。
 */
export class WBTextFormat {
  /**
   * @brief @~english The font style, PanoWBFontStyle enum type. Default: kPanoWBFontNormal.
   *        @~chinese 字体样式，PanoWBFontStyle 枚举类型。默认值：kPanoWBFontNormal。
   */
  style: WBFontStyle;
  /**
   * @brief @~english The font size, valid value range:[10, 96]. Default: 12.
   *        @~chinese 字体大小，有效值范围：[10, 96]。默认值：12。
   */
  size: number;

  constructor(style: WBFontStyle = WBFontStyle.Normal, size: number = 12) {
    this.style = style;
    this.size = size;
  }
}

/** @brief @~english The whiteboard stamp class. @~chinese 白板图章类。 */
export class WBStamp {
  /**
   * @brief @~english Stamp resource ID.
   *        @~chinese 图章资源ID
   */
  stampId: string;
  /**
   * @brief @~english Stamp resource local path.
   *        @~chinese 图章资源本地路径
   */
  path: string;
  /**
   * @brief @~english stamp could be resized or not. Default: false.
   *        @~chinese 图章是否可以改变大小。默认值：false。
   */
  resizable: boolean;

  constructor(stampId: string, path: string, resizable: boolean = false) {
    this.stampId = stampId;
    this.path = path;
    this.resizable = resizable;
  }
}

/**
 * @brief @~english Whiteboard doc content class. @~chinese 白板文件内容类。
 * @note
 * @~english Use Pano whiteboard convert service result to fill urls and count
 * For H5 convert result, The first url is H5 file url, the second is file download url.
 * @~chinese 使用Pano白板转码服务结果填充urls和count参数
 * 对H5转码结果，第一个参数为H5文件url，第二个参数为下载url。
 */
export class WBDocContents {
  /**
   * @brief @~english Whiteboard file name
   *        @~chinese 白板文件名称。
   */
  name: string;
  /**
   * @brief @~english url array (remote url only)
   *        @~chinese url地址数组（仅支持远程url）。
   */
  urls: string[];

  constructor(name: string, urls: string[]) {
    this.name = name;
    this.urls = urls;
  }
}

/**
 * @brief @~english The configurations class of whiteboard doc convert.
 *        @~chinese 白板文件转码配置类。
 */
export class WBConvertConfig {
  /**
   * @brief @~english Whiteboard doc convert type, WBConvertType enum type. Default: WBConvertType.JPG.
   *        @~chinese 白板文件转码类型 WBConvertType 枚举类型。默认值：WBConvertType.JPG。
   */
  type: WBConvertType;
  /**
   * @brief @~english Whether need thumbnails. Default: false.
   *        @~chinese 是否需要缩略图。默认值：false。
   */
  needThumb: boolean;

  constructor(
    type: WBConvertType = WBConvertType.JPG,
    needThumb: boolean = false
  ) {
    this.type = type;
    this.needThumb = needThumb;
  }
}

/**
 * @brief @~english The whiteboard file information class.
 *        @~chinese 白板文件信息类。
 */
export interface WBDocInfo {
  /**
   * @brief @~english The whiteboard file ID.
   *        @~chinese 白板文件ID。
   */
  fileId: string;
  /**
   * @brief @~english The whiteboard file name.
   *        @~chinese 白板文件名称。
   */
  name: string;
  /**
   * @brief @~english The whiteboard file creator userId.
   *        @~chinese 白板文件创建者用户ID。
   */
  creator: string;
  /**
   * @brief @~english Whiteboard file type.
   *        @~chinese 白板文件类型。
   */
  type: WBDocType;
}

/**
 * @brief @~english The whiteboard page number class. @~chinese 白板页码类。
 */
export type WBPageNumber = number;

/** @brief @~english The face beautify option class. @~chinese 美颜选项类。 */
export class FaceBeautifyOption {
  /**
   * @brief @~english Whether to enable face beautify. Default: NO.
   *        @~chinese 是否开启美颜。默认值：否。
   */
  enable: boolean;
  /**
   * @brief @~english The intensity of face beautify, valid value range:[0.0, 1.0]. Default: 0.5.
   *        @~chinese 美颜强度，有效值范围：[0.0, 1.0]。默认值：0.5。
   */
  intensity: number;

  constructor(enable: boolean = false, intensity: number = 0.5) {
    this.enable = enable;
    this.intensity = intensity;
  }
}

/**
 * @brief @~english (Deprecated) The built-in video transform option class. @~chinese （已废弃）视频内嵌变换选项类。
 */
export class BuiltinTransformOption {
  /**
   * @brief @~english Whether to enable built-in transform on video. Default: NO.
   *        @~chinese 是否开启视频内嵌变换。默认值：否。
   */
  enable: boolean;
  /**
   * @brief @~english True to reset all parameters， false don't reset parameters. Default: NO.
   *        @~chinese true 重置所有的视频形变参数， false 不重置视频形变参数。默认值：否。
   */
  bReset: boolean;
  /**
   * @brief @~english scaling factor in X axis (1.0: no scaling). Default: 1.0.
   *        @~chinese X轴缩放比例 （1.0：no scaling）。默认值：1.0。
   */
  xScaling: number;
  /**
   * @brief @~english scaling factor in Y axis (1.0: no scaling). Default: 1.0.
   *        @~chinese Y轴缩放比例 （1.0：no scaling）。默认值：1.0。
   */
  yScaling: number;
  /**
   * @brief @~english Delta angle of the rotation (in radians) in X axis. Default: 0.0
   *        @~chinese X轴旋转角度的差值。默认值：0.0。
   */
  xRotation: number;
  /**
   * @brief @~english Delta Angle of the rotation (in radians) in Y axis. Default: 0.0
   *        @~chinese Y轴旋转角度的差值。默认值：0.0。
   */
  yRotation: number;
  /**
   * @brief @~english Delta Angle of the rotation (in radians) in Z axis. Default: 0.0
   *        @~chinese Z轴旋转角度的差值。默认值：0.0。
   */
  zRotation: number;
  /**
   * @brief @~english Projection Depth along X axis. Default: 0.0.
   *        @~chinese X轴的投影深度。 默认值：0.0。
   */
  xProjection: number;
  /**
   * @brief @~english Projection Depth along Y axis. Default: 0.0.
   *        @~chinese Y轴的投影深度。 默认值：0.0。
   */
  yProjection: number;

  constructor(
    enable: boolean = false,
    bReset: boolean = false,
    xScaling: number = 1.0,
    yScaling: number = 1.0,
    xRotation: number = 0.0,
    yRotation: number = 0.0,
    zRotation: number = 0.0,
    xProjection: number = 0.0,
    yProjection: number = 0.0
  ) {
    this.enable = enable;
    this.bReset = bReset;
    this.xScaling = xScaling;
    this.yScaling = yScaling;
    this.xRotation = xRotation;
    this.yRotation = yRotation;
    this.zRotation = zRotation;
    this.xProjection = xProjection;
    this.yProjection = yProjection;
  }
}

/**
 * @brief @~english The quadrilateral video transform option class. @~chinese 视频四边形变换选项类。
 */
export class QuadTransformOption {
  /**
   * @brief @~english Whether to enable quadrilateral transform on video. Default: NO.
   *        @~chinese 是否开启视频四边形变换。默认值：否。
   */
  enable: boolean;
  /**
   * @brief @~english True to reset all quadrilateral transform parameters， false don't reset quadrilateral transform parameters. Default: NO.
   *        @~chinese true 重置所有的视频四边形形变参数， false 不重置视频四边形形变参数。默认值：否。
   */
  bReset: boolean;
  /**
   * @brief @~english Vertex index of a quadrilateral. TopLeft: 0, TopRight: 1, BottomLeft: 2, BottomRight: 3
   *        @~chinese 四边形顶点索引。 左上角：0，右上角：1，左下角：2，右下角：3
   */
  index: QuadIndex;
  /**
   * @brief @~english Delta of x axis, The origin (0,0) of the video is the top left, the whole size of video is 1x1, can be negative (top or left is out of view), and can be greater than 1 (bottom or right is out of view).
   *        @~chinese X坐标轴的差值，视频的左上角为坐标系的原点（0，0），视频完整大小为1x1，可以为负值（左侧超出屏幕），可以为大于1的值（右侧超出屏幕）
   */
  xDeltaAxis: number;
  /**
   * @brief @~english Delta of y axis, The origin (0,0) of the video is the top left, the whole size of video is 1x1, can be negative (top or left is out of view), and can be greater than 1 (bottom or right is out of view).
   *        @~chinese Y坐标轴的差值，视频的左上角为坐标系的原点（0，0），视频完整大小为1x1，可以为负值（左或上超出屏幕），可以为大于1的值（右或下超出屏幕）
   */
  yDeltaAxis: number;
  /**
   * @brief @~english Set Mirror mode for video transform (exchange left and right). Note: Set mirror mode to true when using front facing camera, false when using back facing camera. Reset doesn't reset this, but keeps last value.
   *        @~chinese 设置视频变换为镜像模式(左右交换）。注意：使用前置摄像头时需要设置为true，使用后置摄像头时需要设置为false。重置参数时，并不会改变mirror的值，仍将保持上次的设置。
   */
  bMirror: boolean;

  constructor(
    enable: boolean = false,
    bReset: boolean = false,
    index: QuadIndex = QuadIndex.TopLeft,
    xDeltaAxis: number = 0.0,
    yDeltaAxis: number = 0.0,
    bMirror: boolean = false
  ) {
    this.enable = enable;
    this.bReset = bReset;
    this.index = index;
    this.xDeltaAxis = xDeltaAxis;
    this.yDeltaAxis = yDeltaAxis;
    this.bMirror = bMirror;
  }
}

/**
 * @brief @~english Feedback info class, user can send feedback to PANO.
 *        @~chinese 用户反馈信息类，用于发送用户反馈。
 */
export class FeedbackInfo {
  /**
   * @brief @~english Feedback type. Default: kPanoFeedbackGeneral.
   *        @~chinese 反馈类型。默认值：kPanoFeedbackGeneral。
   */
  type: FeedbackType;
  /**
   * @brief @~english Product name, max length 128 bytes.
   *        @~chinese 产品名，最多128字节。
   */
  productName: string;
  /**
   * @brief @~english Detail description of problem, max length 1024 bytes.
   *        @~chinese 问题详细描述，最多1024字节。
   */
  detailDescription: string;
  /**
   * @brief @~english User contact, max length 128 bytes.
   *        @~chinese 联系信息，最多128字节。
   */
  contact?: string;
  /**
   * @brief @~english User extra info, max length 256 bytes.
   *        @~chinese 附加信息，最多256字节。
   */
  extraInfo?: string;
  /**
   * @brief @~english Whether to upload logs. Default: NO.
   *        @~chinese 是否上传日志。默认值：否。
   */
  uploadLogs: boolean;

  constructor(
    type: FeedbackType,
    productName: string,
    detailDescription: string,
    contact?: string,
    extraInfo?: string,
    uploadLogs: boolean = false
  ) {
    this.type = type;
    this.productName = productName;
    this.detailDescription = detailDescription;
    this.contact = contact;
    this.extraInfo = extraInfo;
    this.uploadLogs = uploadLogs;
  }
}

/**
 * @brief @~english The configurations class of audio mixing. @~chinese 音频混音配置类。
 */
export class RtcAudioMixingConfig {
  /**
   * @brief @~english Enable publish. Default: YES
   *        @~chinese 是否发送。默认值：是。
   */
  enablePublish: boolean;
  /**
   * @~english publish volume. 0~200. Default: 100.
   * @note There could be cracking sounds when the volume is larger than 100.
   * @~chinese 发送音量。0～200。默认值：100。
   * @note 音量超过100后可能产生破音。
   */
  publishVolume: number;
  /**
   * @brief @~english Enable loopback. Default: YES
   *    @~chinese 是否发送。默认值：是。
   */
  enableLoopback: boolean;
  /**
   * @~english loopback volume. 0~200. Default: 100.
   * @note There could be cracking sounds when the volume is larger than 100.
   * @~chinese 回放音量。0～200。默认值：100。
   * @note 音量超过100后可能产生破音。
   */
  loopbackVolume: number;
  /**
   * @brief @~english Times to play. 0 means loop forever. Default: 1.
   *        @~chinese 播放次数。0指无限循环。默认值：1。
   */
  cycle: number;
  /**
   * @brief @~english YES: Replace microphone data. NO: Mix with microphone data. Default: NO.
   *        @~chinese 是: 替换麦克风数据。否: 与麦克风数据混音。默认值：否。
   */
  replaceMicrophone: boolean;

  constructor(
    enablePublish: boolean = true,
    publishVolume: number = 100,
    enableLoopback: boolean = true,
    loopbackVolume: number = 100,
    cycle: number = 1,
    replaceMicrophone: boolean = false
  ) {
    this.enablePublish = enablePublish;
    this.publishVolume = publishVolume;
    this.enableLoopback = enableLoopback;
    this.loopbackVolume = loopbackVolume;
    this.cycle = cycle;
    this.replaceMicrophone = replaceMicrophone;
  }
}

/**
 * @brief @~english The option class of video snapshot. @~chinese 视频快照选项类。
 */
export class RtcSnapshotVideoOption {
  /**
   * @brief @~english The format of snapshot. Default: kPanoImageFileJPEG.
   *        @~chinese 快照格式。默认值：kPanoImageFileJPEG。
   */
  format: ImageFileFormat;
  /**
   * @brief @~english Whether to mirror. Default: NO.
   *        @~chinese 是否镜像。默认值：否。
   */
  mirror: boolean;

  constructor(
    format: ImageFileFormat = ImageFileFormat.JPEG,
    mirror: boolean = false
  ) {
    this.format = format;
    this.mirror = mirror;
  }
}

/**
 * @brief @~english Network quality report. @~chinese 网络质量报告。
 */
export class RtcNetworkQuality {
  /**
   * @brief @~english Quality rating. Default: kPanoQualityUnavailable.
   *        @~chinese 网络质量评分。默认值：kPanoQualityUnavailable。
   */
  rating: QualityRating;
  /**
   * @brief @~english Uplink loss rate. Default: 0.
   *        @~chinese 上行丢包率。默认值：0。
   */
  txLoss: number;
  /**
   * @brief @~english Downlink loss rate. Default: 0.
   *        @~chinese 下行丢包率。默认值：0。
   */
  rxLoss: number;
  /**
   * @brief @~english Round-Trip Time in millisecond. Default: 0.
   *        @~chinese RTT延迟, 单位：毫秒。默认值：0。
   */
  rtt: number;

  constructor(
    rating: QualityRating = QualityRating.Unavailable,
    txLoss: number = 0,
    rxLoss: number = 0,
    rtt: number = 0
  ) {
    this.rating = rating;
    this.txLoss = txLoss;
    this.rxLoss = rxLoss;
    this.rtt = rtt;
  }
}

export class RtcPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * @~english
 * @brief Property action type.
 * @~chinese
 * @brief 属性操作类型。
 */
export class RtcPropertyAction {
  /**
   * @~english
   * @brief Action type.
   * @~chinese
   * @brief 操作类型。
   */
  type: ActionType;
  /**
   * @~english
   * @brief The property name.
   * @~chinese
   * @brief 属性名字。
   */
  propName: string;
  /**
   * @~english
   * @brief The property value.
   * @~chinese
   * @brief 属性值。
   */
  propValue: string;

  constructor(type: ActionType, propName: string, propValue: string) {
    this.type = type;
    this.propName = propName;
    this.propValue = propValue;
  }
}
