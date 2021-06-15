package video.pano.rtc.react

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.pano.rtc.api.Constants
import video.pano.rtc.native.Callback

class PromiseCallback(private val promise: Promise?) : Callback() {
    override fun success(data: Any?) {
        when (data) {
            null, is Boolean, is Int, is String -> promise?.resolve(data)
            is Constants.QResult -> promise?.resolve(data.value)
            is Number -> promise?.resolve(data.toDouble())
            is Array<*> -> promise?.resolve(Arguments.makeNativeArray<Any>(arrayOf(data)))
            is List<*> -> promise?.resolve(Arguments.makeNativeArray(data))
            is Map<*, *> -> {
                val map = mutableMapOf<String, Any?>()
                data.forEach {
                    if (it.key is String) {
                        map[it.key as String] = it.value
                    }
                }
                promise?.resolve(Arguments.makeNativeMap(map))
            }
            else -> promise?.reject(IllegalArgumentException("Could not convert " + data.javaClass))
        }
    }

    override fun failure(code: String, message: String) {
        promise?.reject(code, message)
    }
}
