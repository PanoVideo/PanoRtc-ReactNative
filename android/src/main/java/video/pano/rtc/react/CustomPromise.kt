package video.pano.rtc.react

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap

class CustomPromise(
        private val onResultReturned: (reactTag: Int?, requestId: Int?, result: Any?, error: String?) -> Unit,
        private val reactTag: Int?,
        private val requestId: Int?,
) : Promise {

    override fun resolve(value: Any?) {
        onResultReturned(reactTag, requestId, value, null)
    }

    override fun reject(code: String?, message: String?) {
        onResultReturned(reactTag, requestId, code, message)
    }

    override fun reject(code: String?, throwable: Throwable?) {
        onResultReturned(reactTag, requestId, code, throwable?.message)
    }

    override fun reject(code: String?, message: String?, throwable: Throwable?) {
        onResultReturned(reactTag, requestId, code, message + "#" + throwable?.message)
    }

    override fun reject(throwable: Throwable?) {
        onResultReturned(reactTag, requestId, null, throwable?.message)
    }

    override fun reject(throwable: Throwable?, userInfo: WritableMap?) {
        onResultReturned(reactTag, requestId, null, throwable?.message)
    }

    override fun reject(code: String?, userInfo: WritableMap) {
        onResultReturned(reactTag, requestId, null, code)
    }

    override fun reject(code: String?, throwable: Throwable?, userInfo: WritableMap?) {
        onResultReturned(reactTag, requestId, code, throwable?.message)
    }

    override fun reject(code: String?, message: String?, userInfo: WritableMap) {
        onResultReturned(reactTag, requestId, code, message)
    }

    override fun reject(code: String?, message: String?, throwable: Throwable?, userInfo: WritableMap?) {
        onResultReturned(reactTag, requestId, code, message + "#" + throwable?.message)
    }

    override fun reject(message: String?) {
        onResultReturned(reactTag, requestId, null, message)
    }
}