package video.pano.rtc.react

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import video.pano.rtc.native.RtcWhiteboardEngine
import video.pano.rtc.native.events.RtcWhiteboardEvent
import kotlin.reflect.full.declaredMemberFunctions
import kotlin.reflect.jvm.javaMethod

@ReactModule(name = PanoRtcWhiteboardModule.REACT_CLASS)
class PanoRtcWhiteboardModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val REACT_CLASS = "PanoRtcWhiteboardModule"
    }

    private var whiteboardEngine = RtcWhiteboardEngine(this@PanoRtcWhiteboardModule::emit)

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf("prefix" to RtcWhiteboardEvent.PREFIX)
    }

    fun whiteboardEngine(): RtcWhiteboardEngine {
        return whiteboardEngine
    }

    private fun emit(methodName: String, data: Map<String, Any?>?) {
        if (methodName == "onMessage") {
            val dataList = data?.let {
                data["data"] as List<*>
            }?.toMutableList()
            dataList?.let {
                val byteArray = dataList[1] as ByteArray
                dataList[1] = String(byteArray)
            }
            val newData = data?.toMutableMap()
            newData?.set("data", dataList)
            reactApplicationContext.getJSModule(
                    DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("${RtcWhiteboardEvent.PREFIX}$methodName",
                            Arguments.makeNativeMap(newData))
        } else {
            reactApplicationContext.getJSModule(
                    DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("${RtcWhiteboardEvent.PREFIX}$methodName",
                            Arguments.makeNativeMap(data))
        }
    }

    private fun getWhiteboardEngine(whiteboardId: String?): RtcWhiteboardEngine? {
        whiteboardId?.let {
            return reactApplicationContext.getNativeModule(PanoRtcEngineModule::class.java)
                    ?.engineManager()?.getRtcWhiteboardEngine(whiteboardId)
        }
        return null

    }

    @ReactMethod
    fun callMethod(methodName: String, params: ReadableMap?, callback: Promise?) {
        val argumentsMap = params?.toHashMap()
        val whiteboardId = argumentsMap?.get("whiteboardId") as String
        val whiteboard = getWhiteboardEngine(whiteboardId)
        argumentsMap.remove("whiteboardId")
        if (methodName == "sendMessage" || methodName == "broadcastMessage") {
            val messageStr = argumentsMap["message"] as String
            argumentsMap["message"] = messageStr.encodeToByteArray()
        }
        whiteboard?.let {
            whiteboard::class.declaredMemberFunctions.find { it.name == methodName }?.let { function ->
                function.javaMethod?.let { method ->
                    try {
                        val parameters = mutableListOf<Any?>()
                        if (argumentsMap.isNotEmpty()) {
                            parameters.add(argumentsMap)
                        }
                        method.invoke(whiteboard, *parameters.toTypedArray(), PromiseCallback(callback))
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        }
    }
}