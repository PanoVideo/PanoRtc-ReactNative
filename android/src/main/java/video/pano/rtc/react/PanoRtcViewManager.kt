package video.pano.rtc.react

import com.facebook.react.bridge.*
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import video.pano.rtc.native.RtcEngineManager
import video.pano.rtc.native.RtcSurfaceView
import kotlin.reflect.full.declaredMemberFunctions
import kotlin.reflect.jvm.javaMethod

class PanoRtcViewManager : SimpleViewManager<RtcSurfaceView>() {

    companion object {
        const val REACT_CLASS = "RCTPanoRtcSurfaceView"
        const val COMMAND_ID_DEFAULT = 0
    }

    private lateinit var reactContext: ThemedReactContext

    override fun createViewInstance(reactContext: ThemedReactContext): RtcSurfaceView {
        this.reactContext = reactContext
        return RtcSurfaceView(reactContext)
    }

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf("prefix" to PanoRtcSurfaceViewEventEmitter.PREFIX)
    }

    private fun getEngine(): RtcEngineManager? {
        return reactContext.getNativeModule(PanoRtcEngineModule::class.java)?.engineManager()
    }

    private fun eventEmitter(): PanoRtcSurfaceViewEventEmitter {
        return reactContext.getNativeModule(PanoRtcSurfaceViewEventEmitter::class.java)
    }

    override fun getCommandsMap(): MutableMap<String, Int> {
        return MapBuilder.of("callMethod", COMMAND_ID_DEFAULT);
    }

    override fun receiveCommand(root: RtcSurfaceView, commandId: Int, args: ReadableArray?) {
        if (commandId == COMMAND_ID_DEFAULT) {
            val methodName = args?.getString(0)
            val requestId = args?.getInt(1)
            val params = args?.getMap(2)
            callMethod(root, methodName, requestId, params)
        }
    }

    private fun callMethod(view: RtcSurfaceView, methodName: String?, requestId: Int?, params: ReadableMap?) {
        view::class.declaredMemberFunctions.find { it.name == methodName }?.let { function ->
            function.javaMethod?.let { method ->
                try {
                    val parameters = mutableListOf<Any?>()
                    params?.toHashMap()?.toMutableMap()?.let {
                        it["view"] = view.getChildAt(0)
                        parameters.add(it)
                    }
                    method.invoke(view, getEngine(), *parameters.toTypedArray(),
                            PromiseCallback(CustomPromise({reactTag, id, result, error ->
                                eventEmitter().onResultReturned(reactTag, id, result, error)
                            }, view.id, requestId)))
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }
}

@ReactModule(name = PanoRtcSurfaceViewEventEmitter.REACT_CLASS)
class PanoRtcSurfaceViewEventEmitter(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val REACT_CLASS = "PanoRtcSurfaceViewEventEmitter"
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