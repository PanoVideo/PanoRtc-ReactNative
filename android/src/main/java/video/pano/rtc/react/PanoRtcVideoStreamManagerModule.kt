package video.pano.rtc.react

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import video.pano.rtc.native.RtcVideoStreamMgr
import video.pano.rtc.native.events.RtcVideoStreamEvent
import kotlin.reflect.full.declaredMemberFunctions
import kotlin.reflect.jvm.javaMethod

@ReactModule(name = PanoRtcVideoStreamManagerModule.REACT_CLASS)
class PanoRtcVideoStreamManagerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val REACT_CLASS = "PanoRtcVideoStreamManagerModule"
    }

    private var manager = RtcVideoStreamMgr(this@PanoRtcVideoStreamManagerModule::emit)

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf("prefix" to RtcVideoStreamEvent.PREFIX)
    }

    fun manager(): RtcVideoStreamMgr? {
        return manager
    }

    private fun emit(methodName: String, data: Map<String, Any?>?) {
        reactApplicationContext.getJSModule(
                DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("${RtcVideoStreamEvent.PREFIX}$methodName",
                        Arguments.makeNativeMap(data))
    }

    @ReactMethod
    fun callMethod(methodName: String, params: ReadableMap?, callback: Promise?) {
        manager::class.declaredMemberFunctions.find { it.name == methodName }?.let { function ->
            function.javaMethod?.let { method ->
                try {
                    val parameters = mutableListOf<Any?>()
                    params?.toHashMap()?.toMutableMap()?.let {
                        parameters.add(it)
                    }
                    method.invoke(manager, *parameters.toTypedArray(), PromiseCallback(callback))
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }
}