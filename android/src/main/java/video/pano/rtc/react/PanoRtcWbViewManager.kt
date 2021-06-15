package video.pano.rtc.react

import com.facebook.react.bridge.*
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import video.pano.rtc.native.RtcEngineManager
import video.pano.rtc.native.RtcWhiteboardView

class PanoRtcWbViewManager : SimpleViewManager<RtcWhiteboardView>() {

    companion object {
        const val REACT_CLASS = "RCTPanoRtcWhiteboardSurfaceView"
        const val COMMAND_ID_DEFAULT = 0
    }

    private lateinit var reactContext: ThemedReactContext

    override fun createViewInstance(reactContext: ThemedReactContext): RtcWhiteboardView {
        this.reactContext = reactContext
        return RtcWhiteboardView(reactContext)
    }

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf("prefix" to PanoRtcWhiteboardSurfaceViewEventEmitter.PREFIX
        )
    }

    private fun getEngine(): RtcEngineManager? {
        return reactContext.getNativeModule(PanoRtcEngineModule::class.java)?.engineManager()
    }

    private fun eventEmitter(): PanoRtcWhiteboardSurfaceViewEventEmitter {
        return reactContext.getNativeModule(PanoRtcWhiteboardSurfaceViewEventEmitter::class.java)
    }

    override fun getCommandsMap(): MutableMap<String, Int> {
        return MapBuilder.of("callMethod", COMMAND_ID_DEFAULT);
    }

    override fun receiveCommand(root: RtcWhiteboardView, commandId: Int, args: ReadableArray?) {
        if (commandId == COMMAND_ID_DEFAULT) {
            val methodName = args?.getString(0)
            val requestId = args?.getInt(1)
            val params = args?.getMap(2)
            callMethod(root, methodName, requestId, params)
        }
    }

    private fun callMethod(view: RtcWhiteboardView, methodName: String?, requestId: Int?, params: ReadableMap?) {

        if ("open" == methodName) {
            val whiteboardId = params?.getString("whiteboardId")
            whiteboardId?.let {
                view.open(getEngine()?.getRtcWhiteboardEngine(whiteboardId),
                        mapOf("view" to view.attachRtcWbView),
                        PromiseCallback(CustomPromise({ reactTag, id, result, error ->
                            eventEmitter().onResultReturned(reactTag, id, result, error)
                        }, view.id, requestId)))
            }

        } else if ("startAnnotation" == methodName) {

            val annotationId = params?.getString("annotationId")
            annotationId?.let {
                val annotation = reactContext
                        .getNativeModule(PanoRtcEngineModule::class.java)?.engineManager()
                        ?.annotationMgr?.getAnnotationById(annotationId)
                view.startAnnotation(annotation,
                        mapOf("view" to view.attachRtcWbView),
                        PromiseCallback(CustomPromise({ reactTag, id, result, error ->
                            eventEmitter().onResultReturned(reactTag, id, result, error)
                        }, view.id, requestId)))
            }
        }
    }
}

@ReactModule(name = PanoRtcWhiteboardSurfaceViewEventEmitter.REACT_CLASS)
class PanoRtcWhiteboardSurfaceViewEventEmitter(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val REACT_CLASS = "PanoRtcWhiteboardSurfaceViewEventEmitter"
        const val PREFIX = "video.pano.rtc."
    }

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf(
                "prefix" to PREFIX
        )
    }

    fun onResultReturned(reactTag: Int?, requestId: Int?, result: Any?, error: String?) {
        val map = mapOf(
                "reactTag" to reactTag,
                "requestId" to requestId,
                "result" to result,
                "error" to error
        )
        reactApplicationContext.getJSModule(
                DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("${PREFIX}onResultReturned", Arguments.makeNativeMap(map))
    }
}