package video.pano.rtc

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import video.pano.rtc.react.*

class PanoRtcPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
                PanoRtcEngineModule(reactContext),
                PanoRtcWhiteboardModule(reactContext),
                PanoRtcAnnotationManagerModule(reactContext),
                PanoRtcAnnotationModule(reactContext),
                PanoRtcNetworkManagerModule(reactContext),
                PanoRtcVideoStreamManagerModule(reactContext),
                PanoRtcMessageModule(reactContext),
                PanoRtcSurfaceViewEventEmitter(reactContext),
                PanoRtcWhiteboardSurfaceViewEventEmitter(reactContext)
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(
                PanoRtcViewManager(),
                PanoRtcWbViewManager()
        )
    }
}
