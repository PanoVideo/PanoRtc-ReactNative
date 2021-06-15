package video.pano.rtc.react

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.pano.rtc.api.*
import video.pano.rtc.native.*
import video.pano.rtc.native.api.IRtcManagerCreator

import video.pano.rtc.native.events.RtcEngineEvent
import video.pano.rtc.react.PanoRtcEngineModule.Companion.REACT_CLASS
import kotlin.reflect.full.declaredMemberFunctions
import kotlin.reflect.jvm.javaMethod

@ReactModule(name = REACT_CLASS)
class PanoRtcEngineModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext), IRtcManagerCreator {

    companion object {
        const val REACT_CLASS = "PanoRtcEngineModule"
    }

    private val manager = RtcEngineManager(this, this@PanoRtcEngineModule::emit)

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf("prefix" to RtcEngineEvent.PREFIX)
    }

    fun engineManager(): RtcEngineManager? {
        return manager
    }

    private fun emit(methodName: String, data: Map<String, Any?>?) {
        reactApplicationContext.getJSModule(
                DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("${RtcEngineEvent.PREFIX}$methodName",
                        Arguments.makeNativeMap(data))
    }

    @ReactMethod
    fun callMethod(methodName: String, params: ReadableMap?, callback: Promise?) {
        manager::class.declaredMemberFunctions.find { it.name == methodName }?.let { function ->
            function.javaMethod?.let { method ->
                try {
                    val parameters = mutableListOf<Any?>()
                    params?.toHashMap()?.toMutableMap()?.let {
                        if (methodName == "create") {
                            it["context"] = reactApplicationContext.applicationContext
                        }
                        parameters.add(it)
                    }
                    method.invoke(manager, *parameters.toTypedArray(), PromiseCallback(callback))
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    override fun createWhiteboardEngine(whiteboardId: String, whiteboard: RtcWhiteboard?): RtcWhiteboardEngine? {
        val whiteboardEngine = reactApplicationContext
                .getNativeModule(PanoRtcWhiteboardModule::class.java)?.whiteboardEngine()
        whiteboardEngine?.setInnerWhiteboard(whiteboardId, whiteboard)
        return whiteboardEngine
    }

    override fun createAnnotationMgr(manager: PanoAnnotationManager?): RtcAnnotationMgr? {
        val annotationMgr = reactApplicationContext
                .getNativeModule(PanoRtcAnnotationManagerModule::class.java)?.manager()
        annotationMgr?.setInnerMgr(manager)
        return annotationMgr
    }

    override fun createNetworkMgr(manager: RtcNetworkManager?): RtcNetworkMgr? {
        val networkMgr = reactApplicationContext
                .getNativeModule(PanoRtcNetworkManagerModule::class.java)?.manager()
        networkMgr?.setInnerMgr(manager)
        return networkMgr
    }

    override fun createVideoStreamMgr(manager: RtcVideoStreamManager?): RtcVideoStreamMgr? {
        val videoStreamMgr = reactApplicationContext
                .getNativeModule(PanoRtcVideoStreamManagerModule::class.java)?.manager()
        videoStreamMgr?.setInnerMgr(manager)
        return videoStreamMgr
    }

    override fun createRtcMessageSrv(service: RtcMessageService?): RtcMessageSrv? {
        val videoStreamMgr = reactApplicationContext
                .getNativeModule(PanoRtcMessageModule::class.java)?.service()
        videoStreamMgr?.setInnerMgr(service)
        return videoStreamMgr
    }
}
