# panortc-react-native-sdk

[![npm](https://img.shields.io/npm/v/@pano.video/panortc-react-native-sdk.svg)](https://www.npmjs.com/package/@pano.video/panortc-react-native-sdk)
[![npm](https://img.shields.io/npm/dm/@pano.video/panortc-react-native-sdk.svg)](https://www.npmjs.com/package/@pano.video/panortc-react-native-sdk)
[![npm](https://img.shields.io/npm/dt/@pano.video/panortc-react-native-sdk.svg)](https://www.npmjs.com/package/@pano.video/panortc-react-native-sdk)
[![npm](https://img.shields.io/npm/l/@pano.video/panortc-react-native-sdk.svg)](LICENSE)

[English](README.md)

此 SDK 是基于 [Pano SDK](https://developer.pano.video/getting-started/intro/) 的实现。

## 发版说明

[变更日志](CHANGELOG.md)

## 集成文档

### 安装

安装 `panortc-react-native-sdk`：

```shell script
yarn add @pano.video/panortc-react-native-sdk
```

或者

```shell script
npm i --save @pano.video/panortc-react-native-sdk
```

前往您的 **ios** 目录并执行:

```shell script
pod install
```

## 快速开始

* 参阅 [example](example) 目录，这是一个多人高清音视频通话的示例。

## 如何使用

```typescript
import RtcEngineKit { RtcEngineConfig } from '@pano.video/panortc-react-native-sdk';
let config = new RtcEngineConfig('YOUR_APP_ID');
this._engine = await RtcEngineKit.create(config);
```

## 设备权限

Pano SDK 需要 `摄像头` 和 `麦克风` 权限来开始视频通话。

### Android

打开 `AndroidManifest.xml` 文件并且添加必备的权限到此文件中.

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

打开 `info.plist` 文件并且添加：

- `Privacy - Microphone Usage Description`，并且在 `Value` 列中添加描述。
- `Privacy - Camera Usage Description`, 并且在 `Value` 列中添加描述。

您的程序可以在后台运行音视频通话，前提是您开启了后台模式。在 Xcode 中选择您的 app target，点击 **Capabilities** 标签，开启 **Background Modes**，并且勾选 **Voice over IP**。

## 使用 TypeScript

我们建议您使用 TypeScript 进行开发，或者使用 TypeScript eslint 来检查您的代码。

- [快速开始 TypeScript](https://reactnative.dev/docs/typescript#getting-started-with-typescript)
- [将 TypeScript 添加至现有项目](https://reactnative.dev/docs/typescript#adding-typescript-to-an-existing-project)

## API 文档

- [Android API](https://developer.pano.video/sdk/javasdk/)
- [iOS API](https://developer.pano.video/sdk/ocsdk/)

## 资源

- [开发者中心](https://developer.pano.video/) 
- [FAQ](https://developer.pano.video/faq/)
- [React Native 快速开始](https://facebook.github.io/react-native/docs/getting-started.html)

## 参与贡献

请参考 [contributing guide](CONTRIBUTING.md) 学习如何参与贡献并熟悉开发流程.

## 开源许可

BSD
