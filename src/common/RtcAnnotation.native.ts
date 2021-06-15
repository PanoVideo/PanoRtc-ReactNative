import type { RefObject } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { ResultCode, WBFontStyle, WBRoleType, WBToolType } from './Enums';
import type { WBColor } from './Objects';

import type {
  Listener,
  RtcAnnotationEventHandler,
  Subscription,
} from './RtcEvents';
import type { RtcSurfaceView } from './RtcRenderView.native';

const {
  /**
   * @ignore
   */
  PanoRtcAnnotationModule,
} = NativeModules;
/**
 * @ignore
 */
const Prefix = PanoRtcAnnotationModule.prefix;
/**
 * @ignore
 */
const RtcAnnotationEvent = new NativeEventEmitter(PanoRtcAnnotationModule);

/**
 * The {@link RtcAnnotation} class.
 */
export default class RtcAnnotation implements RtcAnnotationInterface {
  /**
   * The ID of RtcAnnotation
   */
  public readonly annotationId: string;
  /**
   * @ignore
   */
  private _listeners = new Map<string, Map<any, Listener>>();

  /**
   * @ignore
   */
  constructor(annotationId: string) {
    this.annotationId = annotationId;
  }

  /**
   * @ignore
   */
  private _callMethod<T>(method: string, args?: {}): Promise<T> {
    return PanoRtcAnnotationModule.callMethod(
      method,
      args === undefined
        ? { annotationId: this.annotationId }
        : { annotationId: this.annotationId, ...args }
    );
  }

  /**
   * @ignore
   */
  destroy() {
    this.removeAllListeners();
  }

  /**
   * Adds the [`RtcAnnotationEventHandler`]{@link RtcAnnotationEventHandler} handler.
   *
   * After setting the [`RtcAnnotationEventHandler`]{@link RtcAnnotationEventHandler} handler, you can listen for annotation events and receive the statistics of the corresponding [`RtcAnnotation`]{@link RtcAnnotation} instance.
   * @param event The event type.
   * @param listener The [`RtcAnnotationEventHandler`]{@link RtcAnnotationEventHandler} handler.
   */
  addListener<EventType extends keyof RtcAnnotationEventHandler>(
    event: EventType,
    listener: RtcAnnotationEventHandler[EventType]
  ): Subscription {
    const callback = (res: any) => {
      const { annotationId, data } = res;
      if (annotationId === this.annotationId) {
        // @ts-ignore
        listener(...data);
      }
    };
    let map = this._listeners.get(event);
    if (map === undefined) {
      map = new Map<Listener, Listener>();
      this._listeners.set(event, map);
    }
    RtcAnnotationEvent.addListener(Prefix + event, callback);
    map.set(listener, callback);
    return {
      remove: () => {
        this.removeListener(event, listener);
      },
    };
  }

  /**
   * Removes the [`RtcAnnotationEventHandler`]{@link RtcAnnotationEventHandler} handler.
   *
   * For callback events that you only want to listen for once, call this method to remove the specific [`RtcEngineEvents`]{@link RtcEngineEvents} objects after you have received them.
   * @param event The event type.
   * @param listener The [`RtcAnnotationEventHandler`]{@link RtcAnnotationEventHandler} handler.
   */
  removeListener<EventType extends keyof RtcAnnotationEventHandler>(
    event: EventType,
    listener: RtcAnnotationEventHandler[EventType]
  ) {
    const map = this._listeners.get(event);
    if (map === undefined) return;
    RtcAnnotationEvent.removeListener(
      Prefix + event,
      map.get(listener) as Listener
    );
    map.delete(listener);
  }

  /**
   * Removes all the [`RtcAnnotationEventHandler`]{@link RtcAnnotationEventHandler} handlers.
   * @param event The event type.
   */
  removeAllListeners<EventType extends keyof RtcAnnotationEventHandler>(
    event?: EventType
  ) {
    if (event === undefined) {
      this._listeners.forEach((_, key) => {
        RtcAnnotationEvent.removeAllListeners(Prefix + key);
      });
      this._listeners.clear();
      return;
    }
    RtcAnnotationEvent.removeAllListeners(Prefix + event);
    this._listeners.delete(event as string);
  }

  /**
   * @~english
   * @brief Start the annotation.
   * @param view  The annotation display view provided by customer.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 开始标注。
   * @param view  客户提供的标注显示视图。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  startAnnotation(view: RefObject<RtcSurfaceView>): Promise<ResultCode> {
    if (view.current === undefined) {
      return Promise.resolve(ResultCode.InvalidArgs);
    } else {
      return view.current!._callMethod('startAnnotation', {
        annotationId: this.annotationId,
      });
    }
  }

  /**
   * @~english
   * @brief Stop the annotation.
   * @return
   *    - ResultCode.OK: Success
   *    - Others: Fail
   * @~chinese
   * @brief 停止标注
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  stopAnnotation(): Promise<ResultCode> {
    return this._callMethod('stopAnnotation');
  }

  /**
   * @~english
   * @brief Set annotation view visible/invisible.
   * @param visible visible or not
   * @return
   *    - ResultCode.OK: Success
   *    - Others: Fail
   * @note annotation view is visible default
   * @~chinese
   * @brief 设置标注视图是否可见
   * @param visible 是否可见
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   * @note 标注视图默认是可见的
   */
  setVisible(visible: boolean): Promise<ResultCode> {
    return this._callMethod('setVisible', { visible });
  }

  /**
   * @~english
   * @brief Set annotation role type.
   * @param type  The annotation role type, PanoWBToolType enum type.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 设置标注角色类型。
   * @param type  标注角色，PanoWBRoleType 枚举类型。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  setRoleType(type: WBRoleType): Promise<ResultCode> {
    return this._callMethod('setRoleType', { type });
  }

  /**
   * @~english
   * @brief Set the annotation tool.
   * @param type  PanoWBToolType enum type.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 设置标注工具。
   * @param view  PanoWBToolType 枚举类型。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  setToolType(type: WBToolType): Promise<ResultCode> {
    return this._callMethod('setToolType', { type });
  }

  /**
   * @~english
   * @brief Set the annotation line width.
   * @param width   Valid value range: [1, 20].
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 设置标注线条宽度。
   * @param width   有效值范围：[1, 20]。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  setLineWidth(size: number): Promise<ResultCode> {
    return this._callMethod('setLineWidth', { size });
  }

  /**
   * @~english
   * @brief Set the annotation color.
   * @param color   PanoWBColor object.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 设置标注颜色。
   * @param color   PanoWBColor 对象。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  setColor(color: WBColor): Promise<ResultCode> {
    return this._callMethod('setColor', { color });
  }

  /**
   * @~english
   * @brief Set the annotation font style.
   * @param style   PanoWBFontStyle enum type.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 设置标注字体样式。
   * @param color   PanoWBFontStyle 枚举类型。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  setFontStyle(style: WBFontStyle): Promise<ResultCode> {
    return this._callMethod('setFontStyle', { style });
  }

  /**
   * @~english
   * @brief Set the font size.
   * @param size  Valid value range: [10, 96].
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 设置字体大小。
   * @param size  有效值范围：[10, 96]。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  setFontSize(size: number): Promise<ResultCode> {
    return this._callMethod('setFontSize', { size });
  }

  /**
   * @~english
   * @brief Undo the last operation of the annotation.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 撤销标注上一次操作。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  undo(): Promise<ResultCode> {
    return this._callMethod('undo');
  }

  /**
   * @~english
   * @brief Redo the last undone operation of the annotation.
   * @return
   *   - ResultCode.OK: Success
   *   - others: Failure
   * @~chinese
   * @brief 重做标注的上一次被撤销操作。
   * @return
   *   - ResultCode.OK: 成功
   *   - 其他: 失败
   */
  redo(): Promise<ResultCode> {
    return this._callMethod('redo');
  }

  /**
   * @~english
   * @brief clear annotation content by specific user ID
   * @param userId user ID
   * @return
   *    - ResultCode.OK: Success
   *    - Others: Fail
   * @note If the user isn't current user, the operation requires admin role.
   * @~chinese
   * @brief 清除指定用户绘制的标注内容
   * @param userId 用户ID
   * @return
   *   - OK： 成功
   *   - Others: 失败
   * @note 如果指定用户不是当前用户，此操作需要管理员角色。
   */
  clearUserContents(userId: string): Promise<ResultCode> {
    return this._callMethod('clearUserContents', { userId });
  }

  /**
   * @~english
   * @brief clear annotation content
   * @return
   *    - ResultCode.OK: Success
   *    - Others: Fail
   * @note The operation requires admin role.
   * @~chinese
   * @brief 清除标注内容
   * @return
   *   - OK： 成功
   *   - Others: 失败
   * @note 此操作需要管理员角色。
   */
  clearContents(): Promise<ResultCode> {
    return this._callMethod('clearContents');
  }

  snapshot(outputDir: string): Promise<ResultCode> {
    return this._callMethod('snapshot', { outputDir });
  }
}

/**
 * @ignore
 */
interface RtcAnnotationInterface {
  startAnnotation(view: RefObject<RtcSurfaceView>): Promise<ResultCode>;

  stopAnnotation(): Promise<ResultCode>;

  setVisible(visible: boolean): Promise<ResultCode>;

  setRoleType(type: WBRoleType): Promise<ResultCode>;

  setToolType(type: WBToolType): Promise<ResultCode>;

  setLineWidth(size: number): Promise<ResultCode>;

  setColor(color: WBColor): Promise<ResultCode>;

  setFontStyle(style: WBFontStyle): Promise<ResultCode>;

  setFontSize(size: number): Promise<ResultCode>;

  undo(): Promise<ResultCode>;

  redo(): Promise<ResultCode>;

  clearUserContents(userId: string): Promise<ResultCode>;

  clearContents(): Promise<ResultCode>;

  snapshot(outputDir: string): Promise<ResultCode>;
}
