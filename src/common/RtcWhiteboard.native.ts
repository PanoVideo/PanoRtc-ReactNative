import type {
  WBColor,
  WBConvertConfig,
  WBDocContents,
  WBDocInfo,
  WBStamp,
} from './Objects';
import {
  ResultCode,
  WBOptionType,
  WBClearType,
  WBFillType,
  WBFontStyle,
  WBImageScalingMode,
  WBRoleType,
  WBSnapshotMode,
  WBToolType,
} from './Enums';
import { NativeEventEmitter, NativeModules } from 'react-native';
import type {
  Listener,
  Subscription,
  RtcWhiteboardEventHandler,
} from './RtcEvents';
import type { RefObject } from 'react';
import type { RtcWhiteboardSurfaceView } from './RtcRenderView.native';

const {
  /**
   * @ignore
   */
  PanoRtcWhiteboardModule,
} = NativeModules;

/**
 * @ignore
 */
const Prefix = PanoRtcWhiteboardModule.prefix;
/**
 * @ignore
 */
const RtcWhiteboardEvent = new NativeEventEmitter(PanoRtcWhiteboardModule);

/**
 * The {@link RtcWhiteboard} class.
 */
export default class RtcWhiteboard implements RtcWhiteboardInterface {
  /**
   * The ID of RtcWhiteboard
   */
  public readonly whiteboardId: string;

  /**
   * @ignore
   */
  private _listeners = new Map<string, Map<Listener, Listener>>();

  /**
   * @ignore
   */
  constructor(whiteboardId: string) {
    this.whiteboardId = whiteboardId;
  }

  /**
   * @ignore
   */
  private _callMethod<T>(method: string, args?: {}): Promise<T> {
    return PanoRtcWhiteboardModule.callMethod(
      method,
      args === undefined
        ? { whiteboardId: this.whiteboardId }
        : { whiteboardId: this.whiteboardId, ...args }
    );
  }

  /**
   * @ignore
   */
  destroy() {
    this.removeAllListeners();
  }

  /**
   * Adds the [`RtcWhiteboardEventHandler`]{@link RtcWhiteboardEventHandler} handler.
   *
   * After setting the [`RtcWhiteboardEventHandler`]{@link RtcWhiteboardEventHandler} handler, you can listen for `RtcWhiteboard` events and receive the statistics of the corresponding RtcEngineKit instance.
   * @param event The event type.
   * @param listener The [`RtcWhiteboardEventHandler`]{@link RtcWhiteboardEventHandler} handler.
   */
  addListener<EventType extends keyof RtcWhiteboardEventHandler>(
    event: EventType,
    listener: RtcWhiteboardEventHandler[EventType]
  ): Subscription {
    const callback = (res: any) => {
      const { whiteboardId, data } = res;
      if (whiteboardId === this.whiteboardId) {
        // @ts-ignore
        listener(...data);
      }
    };
    let map = this._listeners.get(event);
    if (map === undefined) {
      map = new Map<Listener, Listener>();
      this._listeners.set(event, map);
    }
    RtcWhiteboardEvent.addListener(Prefix + event, callback);
    map.set(listener, callback);
    return {
      remove: () => {
        this.removeListener(event, listener);
      },
    };
  }

  /**
   * Removes the [`RtcWhiteboardEventHandler`]{@link RtcWhiteboardEventHandler} handler.
   *
   * For callback events that you only want to listen for once, call this method to remove the specific [`RtcWhiteboardEventHandler`]{@link RtcWhiteboardEventHandler} objects after you have received them.
   * @param event The event type.
   * @param listener The [`RtcWhiteboardEventHandler`]{@link RtcWhiteboardEventHandler} handler.
   */
  removeListener<EventType extends keyof RtcWhiteboardEventHandler>(
    event: EventType,
    listener: RtcWhiteboardEventHandler[EventType]
  ) {
    const map = this._listeners.get(event);
    if (map === undefined) return;
    RtcWhiteboardEvent.removeListener(
      Prefix + event,
      map.get(listener) as Listener
    );
    map.delete(listener);
  }

  /**
   * Removes all the [`RtcWhiteboardEventHandler`]{@link RtcWhiteboardEventHandler} handlers.
   * @param event The event type.
   */
  removeAllListeners<EventType extends keyof RtcWhiteboardEventHandler>(
    event?: EventType
  ) {
    if (event === undefined) {
      this._listeners.forEach((_, key) => {
        RtcWhiteboardEvent.removeAllListeners(Prefix + key);
      });
      this._listeners.clear();
      return;
    }
    RtcWhiteboardEvent.removeAllListeners(Prefix + event);
    this._listeners.delete(event as string);
  }

  /**
   * @~english
   * @brief Open the whiteboard.
   * @param view The whiteboard display view provided by customer.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 打开白板。
   * @param view 客户提供的白板显示视图。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  open(view: RefObject<RtcWhiteboardSurfaceView>): Promise<ResultCode> {
    if (view.current === undefined) {
      return Promise.resolve(ResultCode.InvalidArgs);
    } else {
      return view.current!._callMethod('open', {
        whiteboardId: this.whiteboardId,
      });
    }
  }

  /**
   * @~english
   * @brief Close the whiteboard.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 关闭白板。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  close(): Promise<ResultCode> {
    return this._callMethod('close');
  }

  /**
   * @~english
   * @brief Leave the whiteboard.
   * @return
   *    - kPanoResultOK: Success
   *    - Others: Fail
   * @~chinese
   * @brief leave白板
   * @return
   *   - kPanoResultOK: 成功
   *   - 其他: 失败
   */
  leave(): Promise<ResultCode> {
    return this._callMethod('leave');
  }

  /**
   * @~english
   * @brief Stop the whiteboard.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @note default whiteboard can't be stopped.
   * @~chinese
   * @brief 停止白板。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   * @note 默认白板不能被停止。
   */
  stop(): Promise<ResultCode> {
    return this._callMethod('stop');
  }

  /**
   * @~english
   * @brief get current Whiteboard Id
   * @return
   *    - Whiteboard Id
   * @~chinese
   * @brief 获取当前白板Id
   * @return
   *   - 白板Id
   */
  getCurrentWhiteboardId(): Promise<string> {
    return this._callMethod('getCurrentWhiteboardId');
  }

  /**
   * @~english
   * @brief Set whiteboard role type.
   * @param role The whiteboard role type.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置白板角色类型。
   * @param role 白板角色。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setRoleType(type: WBRoleType): Promise<ResultCode> {
    return this._callMethod('setRoleType', { type });
  }

  /**
   * @~english
   * @brief set tool type.
   * @param type tool type.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置工具类型。
   * @param type 工具类型。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setToolType(type: WBToolType): Promise<ResultCode> {
    return this._callMethod('setToolType', { type });
  }

  /**
   * @~english
   * @brief get tool type
   * @return
   *    - tool type
   * @~chinese
   * @brief 获取工具类型
   * @return
   *   - 工具类型
   */
  getToolType(): Promise<WBToolType> {
    return this._callMethod('getToolType');
  }

  /**
   * @~english
   * @brief set line width.
   * @param size line width.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置线宽。
   * @param size 线宽。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setLineWidth(width: number): Promise<ResultCode> {
    return this._callMethod('setLineWidth', { width });
  }

  /**
   * @~english
   * @brief Set fill type.
   * @param type Fill type.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置填充类型。
   * @param type 填充类型。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setFillType(type: WBFillType): Promise<ResultCode> {
    return this._callMethod('setFillType', { type });
  }

  /**
   * @~english
   * @brief Set fill color.
   * @param color r g b a color and alpha. Valid value range: [0, 1].
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置填充颜色。
   * @param color r g b a 填充颜色值。有效值范围：[0, 1]。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setFillColor(color: WBColor): Promise<ResultCode> {
    return this._callMethod('setFillColor', { color });
  }

  /**
   * @~english
   * @brief Set the whiteboard foreground color.
   * @param color r g b a color and alpha. Valid value range: [0, 1].
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置白板前景色。
   * @param color r g b a 前景颜色值。有效值范围：[0, 1]。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setForegroundColor(color: WBColor): Promise<ResultCode> {
    return this._callMethod('setForegroundColor', { color });
  }

  /**
   * @~english
   * @brief Set the whiteboard background color.
   * @param color r g b a color and alpha. Valid value range: [0, 1].
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置白板背景色。
   * @param color r g b a 背景颜色值。有效值范围：[0, 1]。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setBackgroundColor(color: WBColor): Promise<ResultCode> {
    return this._callMethod('setBackgroundColor', { color });
  }

  /**
   * @~english
   * @brief Set font style.
   * @param style font style.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置字体样式。
   * @param style 字体样式。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setFontStyle(style: WBFontStyle): Promise<ResultCode> {
    return this._callMethod('setFontStyle', { style });
  }

  /**
   * @~english
   * @brief Set font size.
   * @param size font size.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置字体大小。
   * @param size 字体大小。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setFontSize(size: number): Promise<ResultCode> {
    return this._callMethod('setFontSize', { size });
  }

  /**
   * @~english
   * @brief Add Stamp Resource
   * @param stamp stamp resource
   * @return
   *    - OK: Success
   *    - Others: Fail
   * @~chinese
   * @brief 添加图章资源
   * @param stamp 图章资源
   * @return
   *   - OK： 成功
   *   - Others: 失败
   */
  addStamp(stamp: WBStamp): Promise<ResultCode> {
    return this._callMethod('addStamp', { stamp });
  }

  /**
   * @~english
   * @brief Set Stamp Resource
   * @param stampId stamp resource ID
   * @return
   *    - OK: Success
   *    - Others: Fail
   * @~chinese
   * @brief 设置图章资源
   * @param stampId 图章资源ID
   * @return
   *   - OK： 成功
   *   - Others: 失败
   */
  setStamp(stampId: string): Promise<ResultCode> {
    return this._callMethod('setStamp', { stampId });
  }

  /**
   * @~english
   * @brief set background image scaling mode.
   * @param mode background image scaling mode.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置白板背景图缩放模式。
   * @param mode 背景图缩放模式。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setBackgroundImageScalingMode(mode: WBImageScalingMode): Promise<ResultCode> {
    return this._callMethod('setBackgroundImageScalingMode', { mode });
  }

  /**
   * @~english
   * @brief set background image.
   * @param imageUrl image URL.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置白板背景图片。
   * @param imageUrl 背景图 URL，可为本地路径或远程 URL。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setBackgroundImage(imageUrl: string): Promise<ResultCode> {
    return this._callMethod('setBackgroundImage', { imageUrl });
  }

  /**
   * @~english
   * @brief set background image of specified whiteboard page.
   * @param imageUrl image URL.
   * @param pageNo the page number.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置白板指定页背景图片。
   * @param imageUrl 背景图 URL，可为本地路径或远程 URL。
   * @param pageNo 白板页码。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setBackgroundImageWithPage(
    imageUrl: string,
    pageNo: number
  ): Promise<ResultCode> {
    return this._callMethod('setBackgroundImageWithPage', {
      imageUrl,
      pageNo,
    });
  }

  /**
   * @~english
   * @brief get current page number.
   * @return
   *    - -1: no page.
   *    - Others: page number.
   * @~chinese
   * @brief 获取当前白板页码。
   * @return
   *   - -1：白板未打开。
   *   - 其他：白板页码。
   */
  getCurrentPageNumber(): Promise<number> {
    return this._callMethod('getCurrentPageNumber');
  }

  /**
   * @~english
   * @brief get total number of pages.
   * @return number of pages.
   * @~chinese
   * @brief 获取总白板页码数。
   * @return 页码数。
   */
  getTotalNumberOfPages(): Promise<number> {
    return this._callMethod('getTotalNumberOfPages');
  }

  /**
   * @~english
   * @brief add new page to the end.
   * @param autoSwitch auto switch to the new page.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 添加一个新页面到最后。
   * @param autoSwitch 自动切换到新添加的页面。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  addPage(autoSwitch: boolean): Promise<ResultCode> {
    return this._callMethod('addPage', { autoSwitch });
  }

  /**
   * @~english
   * @brief add new page after the pageNo.
   * @param pageNo the page number.
   * @param autoSwitch auto switch to the new page.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 添加一个新页面到 pageNo 之后。
   * @param pageNo 页码。
   * @param autoSwitch 自动切换到新添加的页面。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  insertPage(pageNo: number, autoSwitch: boolean): Promise<ResultCode> {
    return this._callMethod('insertPage', { pageNo, autoSwitch });
  }

  /**
   * @~english
   * @brief goto the page pageNo.
   * @param pageNo the page.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 删除页 pageNo。
   * @param pageNo 被删除的页码。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  removePage(pageNo: number, switchNext: boolean = false): Promise<ResultCode> {
    return this._callMethod('removePage', { pageNo, switchNext });
  }

  /**
   * @~english
   * @brief switch to page pageNo.
   * @param pageNo the page.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 切换到页 pageNo。
   * @param pageNo 页码。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  gotoPage(pageNo: number): Promise<ResultCode> {
    return this._callMethod('gotoPage', { pageNo });
  }

  /**
   * @~english
   * @brief switch to next page.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 切换到下一页。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  nextPage(): Promise<ResultCode> {
    return this._callMethod('nextPage');
  }

  /**
   * @~english
   * @brief switch to previous page.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 切换到前一页。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  prevPage(): Promise<ResultCode> {
    return this._callMethod('prevPage');
  }

  /**
   * @~english
   * @brief next step for H5 doc
   * @return
   *    - OK: Success
   *    - Others: Fail
   * @~chinese
   * @brief 执行H5文件下一步
   * @return
   *   - OK： 成功
   *   - Others: 失败
   */
  nextStep(): Promise<ResultCode> {
    return this._callMethod('nextStep');
  }

  /**
   * @~english
   * @brief previous step for H5 doc
   * @return
   *    - OK: Success
   *    - Others: Fail
   * @~chinese
   * @brief 执行H5文件上一步
   * @return
   *   - OK： 成功
   *   - Others: 失败
   */
  prevStep(): Promise<ResultCode> {
    return this._callMethod('prevStep');
  }

  /**
   * @~english
   * @brief add image file to current whiteboard page
   * @param imageUrl  image URL
   * @return
   *    - ResultCode.OK: Success
   *    - Others: Fail
   * @~chinese
   * @brief 添加图片到当前白板页
   * @param imageUrl  图像 URL，可为本地路径或远程 URL
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  addImageFile(imageUrl: string): Promise<ResultCode> {
    return this._callMethod('addImageFile', { imageUrl });
  }

  /**
   * @~english
   * @brief add audio media file to current whiteboard page
   * @param mediaUrl  media URL
   * @return
   *    - ResultCode.OK: Success
   *    - Others: Fail
   * @~chinese
   * @brief 添加音频媒体文件到当前白板页
   * @param mediaUrl  媒体 URL，可为本地路径或远程 URL
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  addAudioFile(mediaUrl: string): Promise<ResultCode> {
    return this._callMethod('addAudioFile', { mediaUrl });
  }

  /**
   * @~english
   * @brief add video media file to current whiteboard page
   * @param mediaUrl  media URL
   * @return
   *    - ResultCode.OK: Success
   *    - Others: Fail
   * @~chinese
   * @brief 添加视频媒体文件到当前白板页
   * @param mediaUrl  媒体 URL，可为本地路径或远程 URL
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  addVideoFile(mediaUrl: string): Promise<ResultCode> {
    return this._callMethod('addVideoFile', { mediaUrl });
  }

  /**
   * @~english
   * @brief Add some background images to current whiteboard file.
   * @param urls Background image url array (remote url only).
   * @return
   *    - Current whiteboard file ID, if fail return empty string.
   * @note PanoWhiteboard has created doc with whiteboard file ID "default" when created.
   * @~chinese
   * @brief 添加指定数量的背景图到当前白板文件。
   * @param urls 背景图url数组（仅支持远程URL）。
   * @return
   *    - 当前白板文件ID，如果失败返回空串。
   * @note PanoWhiteboard创建时会生成白板文件ID为"default"的白板文件。
   */
  addBackgroundImages(urls: string[]): Promise<string> {
    return this._callMethod('addBackgroundImages', { urls });
  }

  /**
   * @~english
   * @brief Add H5 file URL to current whiteboard file as background
   * @param url H5 URL (remote URL only)
   * @param downloadUrl URL of download H5 files, should be packed as .zip file
   * @return
   *    - Current whiteborad file ID, if fail return null
   * @note PanoWhiteboard has created doc with whiteboard file ID "default" when created
   * @~chinese
   * @brief 添加H5文件URL到当前白板文件作为背景
   * @param url 网络URL（仅支持远程URL）
   * @param downloadUrl H5文件的下载URL, 所有文件需要打包为zip文件
   * @return
   *    - 当前白板文件ID，如果失败返回null
   * @note PanoWhiteboard创建时会生成白板文件ID为"default"的白板文件
   */
  addH5File(url: string, downloadUrl?: string): Promise<string> {
    return this._callMethod(
      'addH5File',
      downloadUrl === undefined ? { url } : { url, downloadUrl }
    );
  }

  /**
   * @~english
   * @brief Add a new whiteboard file
   * @param contents Whiteboard file contents with converted result
   * @return
   *    - Current whiteborad file ID, if fail return nullptr
   * @note PanoWhiteboard has created doc with whiteboard file ID "default" when created
   * @~chinese
   * @brief 添加新的白板文件
   * @param contents 根据转码结果指定的白板文件内容
   * @return
   *    - 当前白板文件ID，如果失败返回nullptr
   * @note PanoWhiteboard创建时会生成白板文件ID为"default"的白板文件
   */
  addDoc(contents: WBDocContents): Promise<string> {
    return this._callMethod('addDoc', { contents });
  }

  /**
   * @~english
   * @brief Create new whiteboard file with some background images.
   * @param imageUrls Background image url array (remote url only).
   * @return
   *    - Whiteboard file ID created, if fail return empty string.
   * @note PanoWhiteboard has created doc with whiteboard file ID "default" when created.
   * @~chinese
   * @brief 导入指定数量的背景图并创建新的白板文件。
   * @param imageUrls 背景图url数组（仅支持远程URL）。
   * @return
   *    - 新创建的白板文件ID，如果失败返回空串。
   * @note PanoWhiteboard 创建时会生成白板文件ID为"default"的白板文件。
   */
  createDocWithImages(urls: string[]): Promise<string> {
    return this._callMethod('createDocWithImages', { urls });
  }

  /**
   * @~english
   * @brief Upload local file for transcode and create new whiteboard file
   * @param filePath Local file path
   * @param config File convert configuration
   * @return
   *    - Whiteborad file ID created, if fail return empty string
   * @note PanoWhiteboard has created doc with whiteboard file ID "default" when created
   * @~chinese
   * @brief 上传本地需转码的文件并创建新的白板文件
   * @param filePath 本地文件路径
   * @param config 转码配置
   * @return
   *    - 新创建的白板文件ID，如果失败返回空串
   * @note PanoWhiteboard 创建时会生成白板文件ID为"default"的白板文件
   */
  createDocWithFilePath(
    filePath: string,
    config?: WBConvertConfig
  ): Promise<string> {
    return this._callMethod(
      'createDocWithFilePath',
      config === undefined ? { filePath } : { filePath, config }
    );
  }

  /**
   * @~english
   * @brief Delete whiteboard file.
   * @param fileId Whiteboard file ID.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @note "default" whiteboard file could not be deleted.
   * @~chinese
   * @brief 删除白板文件。
   * @param fileId 白板文件ID。
   * @return
   *    - ResultCode.OK：成功。
   *    - Others: 失败。
   * @note "default" 白板文件不能被删除。
   */
  deleteDoc(fileId: string): Promise<ResultCode> {
    return this._callMethod('deleteDoc', { fileId });
  }

  /**
   * @~english
   * @brief Switch whiteboard file.
   * @param fileId Whiteboard file ID.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 切换白板文件。
   * @param fileId 白板文件ID。
   * @return
   *    - ResultCode.OK：成功。
   *    - 其他：失败。
   */
  switchDoc(fileId: string): Promise<ResultCode> {
    return this._callMethod('switchDoc', { fileId });
  }

  /**
   * @~english
   * @brief Save whiteboard file to multiple images. Save each page to one image.
   * Image name format is like whiteboard_[fileId]_[page number].png, eg. whiteboard_default_1.png.
   * @param fileId Whiteboard file ID.
   * @param outputDir output directory.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 保存白板文件为多张图片。每个白板页存为一张图。
   * 图像名称格式为whiteboard_[fileId]_[page number].png, 例如：whiteboard_default_1.png。
   * @param fileId 白板文件ID。
   * @param outputDir 输出路径。
   * @return
   *    - ResultCode.OK：成功。
   *    - 其他：失败。
   */
  saveDocToImages(fileId: string, outputDir: string): Promise<ResultCode> {
    return this._callMethod('saveDocToImages', { fileId, outputDir });
  }

  /**
   * @~english
   * @brief Enumerate whiteboard files.
   * @return fileId array.
   * @~chinese
   * @brief 枚举白板文件。
   * @return fileId数组。
   */
  enumerateFiles(): Promise<string[]> {
    return this._callMethod('enumerateFiles');
  }

  /**
   * @~english
   * @brief get current whiteboard file ID.
   * @return
   *    - current whiteboard file ID, if fail return null.
   * @~chinese
   * @brief 获取当前白板文件ID。
   * @return
   *    - 当前白板文件ID, 失败则返回null。
   */
  getCurrentFileId(): Promise<string> {
    return this._callMethod('getCurrentFileId');
  }

  /**
   * @~english
   * @brief get whiteboard file information with specific fileId
   * @param fileId Whiteboard file ID
   * @return
   *    - non-null: whiteborad file information
   *    - others: Failure
   * @note DO NOT delete this pointer,  RtcEngine can handle its life cycle.
   * @~chinese
   * @brief 获取指定白板文件ID的白板文件信息
   * @param fileId 白板文件ID
   * @return
   *    - 非空：白板文件信息
   *    - 空：失败
   */
  getFileInfo(fileId: string): Promise<WBDocInfo> {
    return this._callMethod('getFileInfo', { fileId });
  }

  /**
   * @~english
   * @brief clear whiteboard content.
   * @param curPage true: clear current page only; false: clear all pages.
   * @param type WBClearType enum type.
   * @return
   *    - ResultCode.OK: Success.
   *    - ResultCode.NoPrivilege: need ADMIN role to call this API.
   *    - Others: Fail.
   * @note this API need ADMIN role.
   * @~chinese
   * @brief 清除白板内容，需要 ADMIN 角色才可调用成功。
   * @param curPage true: 只清除当前页内容；false: 清除所有页内容。
   * @param type WBClearType 枚举类型。
   * @return
   *   - ResultCode.OK：成功。
   *   - ResultCode.NoPrivilege: 没有权限。
   *   - 其他：失败。
   * @note 此接口只有 ADMIN 角色才可调用。
   */
  clearContents(curPage: boolean, type: WBClearType): Promise<ResultCode> {
    return this._callMethod('clearContents', { curPage, type });
  }

  /**
   * @~english
   * @brief clear whiteboard content by specific user ID.
   * @param userId user ID.
   * @param curPage true: clear current page only; false: clear all pages.
   * @param type WBClearType enum type.
   * @return
   *    - ResultCode.OK: Success.
   *    - ResultCode.NoPrivilege: need ADMIN role to call this API.
   *    - Others: Fail.
   * @note ADMIN role is required if the userId is not local user.
   * @~chinese
   * @brief 清除指定用户的白板内容。
   * @param userId 用户ID。
   * @param curPage true: 只清除当前页内容；false: 清除所有页内容。
   * @param type WBClearType 枚举类型。
   * @return
   *   - ResultCode.OK：成功。
   *   - ResultCode.NoPrivilege: 没有权限。
   *   - 其他：失败。
   * @note 只有 ADMIN 角色才可以清除非本地用户的内容。
   */
  clearUserContents(
    userId: string,
    curPage: boolean,
    type: WBClearType
  ): Promise<ResultCode> {
    return this._callMethod('clearUserContents', {
      userId,
      curPage,
      type,
    });
  }

  /**
   * @~english
   * @brief undo.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 撤消上一次操作。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  undo(): Promise<ResultCode> {
    return this._callMethod('undo');
  }

  /**
   * @~english
   * @brief redo.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 重做白板的上一次被撤销操作。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  redo(): Promise<ResultCode> {
    return this._callMethod('redo');
  }

  /**
   * @~english
   * @brief get current whiteboard scale factor.
   * @return scale factor.
   * @~chinese
   * @brief 获取当前白板视图的缩放比例。
   * @return 缩放比例值。
   */
  getCurrentScaleFactor(): Promise<number> {
    return this._callMethod('redo');
  }

  /**
   * @~english
   * @brief set current whiteboard scale factor.
   * @param scale scale factor. Valid value range [0.1, 5.0].
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 设置当前白板视图的缩放比例。
   * @param scale 缩放比例值。有效值范围 [0.1, 5.0]。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setCurrentScaleFactor(scale: number): Promise<ResultCode> {
    return this._callMethod('setCurrentScaleFactor', { scale });
  }

  /**
   * @~english
   * @brief save whiteboard contents to image.
   * @param mode snapshot mode.
   * @param outputDir output directory.
   * @note snapshot result and image filename is returned in callback onSnapshotComplete.
   * @return
   *    - ResultCode.OK: Success.
   *    - Others: Fail.
   * @~chinese
   * @brief 保存白板内容到图像。
   * @param mode 快照模式。
   * @param outputDir 输出路径。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   * @note 快照结果和图像文件名通过回调函数onSnapshotComplete返回。
   */
  snapshot(mode: WBSnapshotMode, outputDir: string): Promise<ResultCode> {
    return this._callMethod('snapshot', { mode, outputDir });
  }

  /**
   * @~english
   * Start share vision
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * 开始共享视角
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  startShareVision(): Promise<ResultCode> {
    return this._callMethod('startShareVision');
  }

  /**
   * @~english
   * Stop share vision
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * 停止共享视角
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  stopShareVision(): Promise<ResultCode> {
    return this._callMethod('stopShareVision');
  }

  /**
   * @~english
   * Start follow vision
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * 开始跟随视角
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  startFollowVision(): Promise<ResultCode> {
    return this._callMethod('startFollowVision');
  }

  /**
   * @~english
   * Stop follow vision
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * 停止跟随视角
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  stopFollowVision(): Promise<ResultCode> {
    return this._callMethod('stopFollowVision');
  }
  /**
   * @~english
   * @brief Sync vision of current page
   * @return
   *   - kPanoResultOK: Success
   *   - others: Failure
   * @~chinese
   * @brief 同步当前页视角
   * @return
   *   - kPanoResultOK: 成功
   *   - 其他: 失败
   */
  syncVision(): Promise<ResultCode> {
    return this._callMethod('syncVision');
  }

  /**
   * @~english
   * @brief Send message to the user specified by userId.
   * @param userId The user who will receive the message.
   * @param message The message, max size is 16KB.
   * @return
   *   - ResultCode.OK： Success.
   *   - Others: Fail.
   * @~chinese
   * @brief 发送消息给某个指定用户。
   * @param userId 用户 ID。
   * @param message 要发送的消息，最大为 16KB。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  sendMessage(message: string, userId: string): Promise<ResultCode> {
    return this._callMethod('sendMessage', { message, userId });
  }

  /**
   * @~english
   * @brief Broadcast message to all users.
   * @param message The message, max size is 16KB.
   * @return
   *   - ResultCode.OK：Success.
   *   - Others: Fail.
   * @~chinese
   * @brief 广播消息给所有用户。
   * @param message 要广播的消息，最大为 16KB。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  broadcastMessage(message: string): Promise<ResultCode> {
    return this._callMethod('broadcastMessage', { message });
  }

  /**
   * @~english
   * @brief Set option object to Whiteboard.
   * @param option The Option object.
   * @param type WBOptionType enum type.
   * @return
   *   - ResultCode.OK: Success.
   *   - others: Failure.
   * @~chinese
   * @brief 设置选项对象给白板。
   * @param option 选项对象。
   * @param type WBOptionType 枚举类型。
   * @return
   *   - ResultCode.OK：成功。
   *   - 其他：失败。
   */
  setOption(option: any, type: WBOptionType): Promise<ResultCode> {
    let isValid = false;
    switch (type) {
      case WBOptionType.FileCachePath: {
        if (typeof option === 'string') {
          isValid = true;
        }
        break;
      }
      case WBOptionType.EnableUIResponse: {
        if (typeof option === 'boolean') {
          isValid = true;
        }
        break;
      }
      case WBOptionType.ShowDraws: {
        if (typeof option === 'boolean') {
          isValid = true;
        }
        break;
      }
      case WBOptionType.ScaleMove: {
        if (typeof option === 'boolean') {
          isValid = true;
        }
        break;
      }
      case WBOptionType.AutoSelected: {
        if (typeof option === 'boolean') {
          isValid = true;
        }
        break;
      }
    }
    if (!isValid) {
      return Promise.resolve(ResultCode.InvalidArgs);
    } else {
      return this._callMethod('setOption', { option, type });
    }
  }
}

interface RtcWhiteboardInterface {
  open(view: RefObject<RtcWhiteboardSurfaceView>): Promise<ResultCode>;

  close(): Promise<ResultCode>;

  leave(): Promise<ResultCode>;

  stop(): Promise<ResultCode>;

  getCurrentWhiteboardId(): Promise<string>;

  setRoleType(type: WBRoleType): Promise<ResultCode>;

  setToolType(type: WBToolType): Promise<ResultCode>;

  getToolType(): Promise<WBToolType>;

  setLineWidth(width: number): Promise<ResultCode>;

  setFillType(type: WBFillType): Promise<ResultCode>;

  setFillColor(color: WBColor): Promise<ResultCode>;

  setForegroundColor(color: WBColor): Promise<ResultCode>;

  setBackgroundColor(color: WBColor): Promise<ResultCode>;

  setFontStyle(style: WBFontStyle): Promise<ResultCode>;

  setFontSize(size: number): Promise<ResultCode>;

  addStamp(stamp: WBStamp): Promise<ResultCode>;

  setStamp(stampId: string): Promise<ResultCode>;

  setBackgroundImageScalingMode(mode: WBImageScalingMode): Promise<ResultCode>;

  setBackgroundImage(imageUrl: string): Promise<ResultCode>;

  setBackgroundImageWithPage(
    imageUrl: string,
    pageNo: number
  ): Promise<ResultCode>;

  getCurrentPageNumber(): Promise<number>;

  getTotalNumberOfPages(): Promise<number>;

  addPage(autoSwitch: boolean): Promise<ResultCode>;

  insertPage(pageNo: number, autoSwitch: boolean): Promise<ResultCode>;

  removePage(pageNo: number, switchNext: boolean): Promise<ResultCode>;

  gotoPage(pageNo: number): Promise<ResultCode>;

  nextPage(): Promise<ResultCode>;

  prevPage(): Promise<ResultCode>;

  nextStep(): Promise<ResultCode>;

  prevStep(): Promise<ResultCode>;

  addImageFile(imageUrl: string): Promise<ResultCode>;

  addAudioFile(mediaUrl: string): Promise<ResultCode>;

  addVideoFile(mediaUrl: string): Promise<ResultCode>;

  addBackgroundImages(urls: string[]): Promise<string>;

  addH5File(url: string, downloadUrl?: string): Promise<string>;

  addDoc(contents: WBDocContents): Promise<string>;

  createDocWithImages(urls: string[]): Promise<string>;

  createDocWithFilePath(
    filePath: string,
    config?: WBConvertConfig
  ): Promise<string>;

  deleteDoc(fileId: string): Promise<ResultCode>;

  switchDoc(fileId: string): Promise<ResultCode>;

  saveDocToImages(fileId: string, outputDir: string): Promise<ResultCode>;

  enumerateFiles(): Promise<string[]>;

  getCurrentFileId(): Promise<string>;

  getFileInfo(fileId: string): Promise<WBDocInfo>;

  clearContents(curPage: boolean, type: WBClearType): Promise<ResultCode>;

  clearUserContents(
    userId: string,
    curPage: boolean,
    type: WBClearType
  ): Promise<ResultCode>;

  undo(): Promise<ResultCode>;

  redo(): Promise<ResultCode>;

  getCurrentScaleFactor(): Promise<number>;

  setCurrentScaleFactor(scale: number): Promise<ResultCode>;

  snapshot(mode: WBSnapshotMode, outputDir: string): Promise<ResultCode>;

  startShareVision(): Promise<ResultCode>;

  stopShareVision(): Promise<ResultCode>;

  startFollowVision(): Promise<ResultCode>;

  stopFollowVision(): Promise<ResultCode>;

  syncVision(): Promise<ResultCode>;

  sendMessage(message: string, userId: string): Promise<ResultCode>;

  broadcastMessage(message: string): Promise<ResultCode>;

  setOption(option: any, type: WBOptionType): Promise<ResultCode>;
}
