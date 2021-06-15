package video.pano.rtc.react

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import video.pano.rtc.native.RtcMessageSrv
import video.pano.rtc.native.events.RtcMessageServiceEvent
import kotlin.reflect.full.declaredMemberFunctions
import kotlin.reflect.jvm.javaMethod

@ReactModule(name = PanoRtcMessageModule.REACT_CLASS)
class PanoRtcMessageModule (reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val REACT_CLASS = "PanoRtcMessageModule"
    }

    private var service = RtcMessageSrv(this@PanoRtcMessageModule::emit)

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf("prefix" to RtcMessageServiceEvent.PREFIX)
    }

    fun service(): RtcMessageSrv? {
        return service
    }

    private fun emit(methodName: String, data: Map<String, Any?>?) {
        if (methodName == "onUserMessage") {
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
                    .emit("${RtcMessageServiceEvent.PREFIX}$methodName",
                            Arguments.makeNativeMap(newData))
        } else {
            reactApplicationContext.getJSModule(
                    DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("${RtcMessageServiceEvent.PREFIX}$methodName",
                            Arguments.makeNativeMap(data))
        }
    }

    @ReactMethod
    fun callMethod(methodName: String, params: ReadableMap?, callback: Promise?) {
        service::class.declaredMemberFunctions.find { it.name == methodName }?.let { function ->
            function.javaMethod?.let { method ->
                try {
                    val parameters = mutableListOf<Any?>()
                    params?.toHashMap()?.toMutableMap()?.let {
                        val messageStr = it["message"] as String
                        it["message"] = messageStr.encodeToByteArray()
                        parameters.add(it)
                    }
                    method.invoke(service, *parameters.toTypedArray(), PromiseCallback(callback))
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }

    }
}