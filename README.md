# panortc-react-native-sdk

[![npm](https://img.shields.io/npm/v/@pano.video/panortc-react-native-sdk.svg)](https://www.npmjs.com/package/@pano.video/panortc-react-native-sdk)
[![npm](https://img.shields.io/npm/dm/@pano.video/panortc-react-native-sdk.svg)](https://www.npmjs.com/package/@pano.video/panortc-react-native-sdk)
[![npm](https://img.shields.io/npm/dt/@pano.video/panortc-react-native-sdk.svg)](https://www.npmjs.com/package/@pano.video/panortc-react-native-sdk)
[![npm](https://img.shields.io/npm/l/@pano.video/panortc-react-native-sdk.svg)](LICENSE)

[中文](README.zh.md)

This SDK is a wrapper for [Pano SDK](https://developer.pano.video/getting-started/intro/).

## Release Note

[Changelog](CHANGELOG.md)

## Installation

### Installing

Install `panortc-react-native-sdk`：

```shell script
yarn add @pano.video/panortc-react-native-sdk
```

or

```shell script
npm i --save @pano.video/panortc-react-native-sdk
```

Go to your **ios** folder and run:

```shell script
pod install
```

## Getting Started

* See the [example](example) directory for a sample about multi-person HD audio and video calls app which using `panortc-react-native-sdk`.

## General Usage

```typescript
import RtcEngineKit { RtcEngineConfig } from '@pano.video/panortc-react-native-sdk';
let config = new RtcEngineConfig('YOUR_APP_ID');
this._engine = await RtcEngineKit.create(config);
```

## Device Permission

Pano SDK requires `camera` and `microphone` permission to start video call.

### Android

Open the `AndroidManifest.xml` file and add the required device permissions to the file.

```xml
<manifest>
    ...
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-feature android:name="android.hardware.camera" />
    <uses-feature android:name="android.hardware.camera.autofocus" />
    ...
</manifest>
```

### iOS

Open the `info.plist` and add:

- `Privacy - Microphone Usage Description`, and add a note in the Value column.
- `Privacy - Camera Usage Description`, and add a note in the Value column.

Your application can still run the voice call when it is switched to the background if the background mode is enabled. Select the app target in Xcode, click the **Capabilities** tab, enable **Background Modes**, and check **Voice over IP**.

## Using TypeScript

We suggest you use TypeScript to develop, or use TypeScript eslint to lint your code.

* [Getting Started with TypeScript](https://reactnative.dev/docs/typescript#getting-started-with-typescript)
* [Adding TypeScript to an Existing Project](https://reactnative.dev/docs/typescript#adding-typescript-to-an-existing-project)

## API

- [Android API](https://developer.pano.video/sdk/javasdk/)
- [iOS API](https://developer.pano.video/sdk/ocsdk/)

## Resources

- [Developer Center](https://developer.pano.video/) 
- [FAQ](https://developer.pano.video/faq/)
- [React Native Getting Started](https://facebook.github.io/react-native/docs/getting-started.html)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

BSD
