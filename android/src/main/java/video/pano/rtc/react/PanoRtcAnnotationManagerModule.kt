package video.pano.rtc.react

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.pano.rtc.api.PanoAnnotation
import video.pano.rtc.native.RtcAnnotation
import video.pano.rtc.native.RtcAnnotationMgr
import video.pano.rtc.native.api.IRtcAnnotationCreator
import video.pano.rtc.native.events.RtcAnnotationManagerEvent
import kotlin.reflect.full.declaredMemberFunctions
import kotlin.reflect.jvm.javaMethod

@ReactModule(name = PanoRtcAnnotationManagerModule.REACT_CLASS)
class PanoRtcAnnotationManagerModule(reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext), IRtcAnnotationCreator {

    companion object {
        const val REACT_CLASS = "PanoRtcAnnotationManagerModule"
    }

    private var manager = RtcAnnotationMgr(this, this@PanoRtcAnnotationManagerModule::emit)

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf("prefix" to RtcAnnotationManagerEvent.PREFIX)
    }

    fun manager(): RtcAnnotationMgr? {
        return manager
    }

    private fun emit(methodName: String, data: Map<String, Any?>?) {
        reactApplicationContext.getJSModule(
                DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("${RtcAnnotationManagerEvent.PREFIX}$methodName",
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

    override fun createAnnotation(annotationId: String, panoAnnotation: PanoAnnotation?): RtcAnnotation? {
        val annotation = reactApplicationContext
                .getNativeModule(PanoRtcAnnotationModule::class.java)?.annotation()
        annotation?.setInnerAnnotation(annotationId, panoAnnotation)
        return annotation
    }
}