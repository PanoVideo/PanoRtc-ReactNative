package video.pano.rtc.react

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import video.pano.rtc.native.RtcMessageSrv
import video.pano.rtc.native.events.RtcMessageServiceEvent
import kotlin.reflect.full.declaredMemberFunctions
import kotlin.reflect.jvm.javaMethod

@ReactModule(name = PanoRtcMessageModule.REACT_CLASS)
class PanoRtcMessageModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

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

    @Suppress("UNCHECKED_CAST")
    private fun emit(methodName: String, data: Map<String, Any?>?) {
        when (methodName) {
            "onUserMessage" -> {
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
            }
            "onTopicMessage" -> {
                val dataList = data?.let {
                    data["data"] as List<*>
                }?.toMutableList()
                dataList?.let {
                    val byteArray = dataList[2] as ByteArray
                    dataList[2] = String(byteArray)
                }
                val newData = data?.toMutableMap()
                newData?.set("data", dataList)
                reactApplicationContext.getJSModule(
                        DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("${RtcMessageServiceEvent.PREFIX}$methodName",
                                Arguments.makeNativeMap(newData))
            }
            "onPropertyChanged" -> {
                val dataList = data?.let {
                    data["data"] as List<*>
                }?.toMutableList()
                dataList?.let {
                    val newProps = ArrayList<Map<*, *>>()
                    val props = dataList[0] as ArrayList<Map<*, *>>
                    props.forEach {
                        it.toMutableMap().let { map ->
                            val byteArray = map["propValue"] as ByteArray
                            val propValue = String(byteArray)
                            map["propValue"] = propValue
                            newProps.add(map)
                        }
                    }
                    dataList[0] = newProps
                }
                val newData = data?.toMutableMap()
                newData?.set("data", dataList)
                reactApplicationContext.getJSModule(
                        DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("${RtcMessageServiceEvent.PREFIX}$methodName",
                                Arguments.makeNativeMap(newData))
            }
            else -> {
                reactApplicationContext.getJSModule(
                        DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("${RtcMessageServiceEvent.PREFIX}$methodName",
                                Arguments.makeNativeMap(data))
            }
        }
    }

    @ReactMethod
    fun callMethod(methodName: String, params: ReadableMap?, callback: Promise?) {
        service::class.declaredMemberFunctions.find { it.name == methodName }?.let { function ->
            function.javaMethod?.let { method ->
                try {
                    val parameters = mutableListOf<Any?>()
                    val newParams = params?.toHashMap()?.toMutableMap()
                    newParams?.let {
                        it.keys.forEach { paramKey ->
                            if (paramKey.startsWith("str_")) {
                                val strValue = newParams.remove(paramKey) as String
                                newParams[paramKey.substring(4, paramKey.length)] =
                                        strValue.encodeToByteArray()
                            }
                        }
                    }
                    parameters.add(newParams)
                    method.invoke(service, *parameters.toTypedArray(), PromiseCallback(callback))
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }

    }
}