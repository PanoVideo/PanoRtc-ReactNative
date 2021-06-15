package video.pano.rtc.react

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import video.pano.rtc.native.RtcAnnotation
import video.pano.rtc.native.RtcAnnotationMgr
import video.pano.rtc.native.events.RtcAnnotationEvent
import kotlin.reflect.full.declaredMemberFunctions
import kotlin.reflect.jvm.javaMethod

@ReactModule(name = PanoRtcAnnotationModule.REACT_CLASS)
class PanoRtcAnnotationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val REACT_CLASS = "PanoRtcAnnotationModule"
    }
    private var annotation = RtcAnnotation(this@PanoRtcAnnotationModule::emit)

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf("prefix" to RtcAnnotationEvent.PREFIX)
    }

    fun annotation(): RtcAnnotation {
        return annotation
    }

    private fun annotationMgr(): RtcAnnotationMgr? {
        return reactApplicationContext
                .getNativeModule(PanoRtcEngineModule::class.java)?.engineManager()?.annotationMgr
    }

    private fun emit(methodName: String, data: Map<String, Any?>?) {
        reactApplicationContext.getJSModule(
                DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("${RtcAnnotationEvent.PREFIX}$methodName",
                        Arguments.makeNativeMap(data))
    }

    @ReactMethod
    fun callMethod(methodName: String, params: ReadableMap?, callback: Promise?) {
        val argumentsMap = params?.toHashMap()
        val annotationId = argumentsMap?.get("annotationId") as String
        val annotation = annotationMgr()?.getAnnotationById(annotationId)
        argumentsMap.remove("annotationId")
        annotation?.let {
            annotation::class.declaredMemberFunctions.find { it.name == methodName }?.let { function ->
                function.javaMethod?.let { method ->
                    try {
                        val parameters = mutableListOf<Any?>()
                        if (argumentsMap.isNotEmpty()) {
                            parameters.add(argumentsMap)
                        }
                        method.invoke(annotation, *parameters.toTypedArray(), PromiseCallback(callback))
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        }
    }
}