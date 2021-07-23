import React, { Component } from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import RtcEngineKit, {
  RtcEngineConfig,
  RtcChannelConfig,
  ChannelMode,
  ChannelService,
  WBToolType,
  RtcWhiteboardSurfaceView,
  RtcWhiteboard,
  RtcAnnotationManager,
  RtcAnnotation,
} from '@pano.video/panortc-react-native-sdk';
import { ChannelInfo } from './ChannelInfo';

const config = require('../../pano.config.json');

interface State {
  channelId: string;
  isJoined: boolean;
  remoteUid: string[];
  switchCamera: boolean;
}

export default class Whiteboard extends Component<{}, State, any> {
  _engine: RtcEngineKit | undefined;
  _whiteboard: RtcWhiteboard | undefined;
  _annotationManager: RtcAnnotationManager | undefined;
  _annotation: RtcAnnotation | undefined;

  constructor(props: {}) {
    super(props);
    this.state = {
      channelId: config.channelId,
      isJoined: false,
      remoteUid: [],
      switchCamera: true,
    };
  }

  UNSAFE_componentWillMount() {
    this._initEngine();
  }

  componentWillUnmount() {
    this._engine?.destroy();
  }

  _initEngine = async () => {
    let engineConfig = new RtcEngineConfig(config.appId);
    this._engine = await RtcEngineKit.create(engineConfig);
    this._addListeners();
  };

  _addListeners = () => {
    this._engine?.addListener('onChannelJoinConfirm', (result) => {
      console.info('onChannelJoinConfirm', result);
      this.setState({ isJoined: true }, () => {
        this._engine
          ?.whiteboardEngine()
          .then((result) => {
            console.info('whiteboardEngine', result);
            this._whiteboard = result;
            this._whiteboard?.open(this.whiteboardView).then((result) => {
              console.info('open whiteboard ', result);
              this._whiteboard?.setToolType(WBToolType.Path).then((result) => {
                console.info('setToolType ', result);
              });
              this._whiteboard
                ?.addImageFile(
                  'https://www.pano.video/assets/img/optimized_logo-pano.png'
                )
                .then((result) => {
                  console.info('addImageFile ', result);
                });
              this._whiteboard?.startShareVision().then((result) => {
                console.info('startShareVision ', result);
              });
            });
            this._whiteboard?.addListener('onVisionShareStarted', (userId) => {
              console.info('onVisionShareStarted', userId);
              //this._whiteboard?.startFollowVision()
            });
            this._whiteboard?.addListener('onVisionShareStopped', (userId) => {
              console.info('onVisionShareStopped', userId);
              //this._whiteboard?.stopFollowVision()
            });
            this._whiteboard?.addListener('onMessage', (userId, message) => {
              console.info('onMessage userId : ', userId);
              console.info('onMessage message : ', message);
            });
          })
          .catch((err) => {
            console.warn('whiteboardEngine', err);
          });
      });
    });
    this._engine?.addListener('onChannelLeaveIndication', (result) => {
      console.info('onChannelLeaveIndication', result);
      this.setState({ isJoined: false, remoteUid: [] });
    });
    this._engine?.addListener('onUserJoinIndication', (userId, userName) => {
      console.info('onUserJoinIndication', userId, userName);
      this._whiteboard?.sendMessage('test', userId);
    });
    this._engine?.addListener('onUserLeaveIndication', (userId, reason) => {
      console.info('onUserLeaveIndication', userId, reason);
    });
  };

  _joinChannel = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }

    let serviceFlags = [ChannelService.Media, ChannelService.Whiteboard];
    let channelConfig = new RtcChannelConfig(
      ChannelMode.Meeting,
      serviceFlags,
      true,
      ChannelInfo.userName
    );
    await this._engine?.joinChannel(
      config.token,
      ChannelInfo.channelId,
      config.userId,
      channelConfig
    );
  };

  _leaveChannel = async () => {
    await this._engine?.leaveChannel();
    this.setState({ isJoined: false, remoteUid: [] });
  };

  render() {
    const { channelId, isJoined } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({ channelId: text })}
            placeholder={'Channel ID'}
            value={channelId}
          />
          <Button
            onPress={isJoined ? this._leaveChannel : this._joinChannel}
            title={`${isJoined ? 'Leave' : 'Join'} channel`}
          />
        </View>
        {this._renderVideo()}
      </View>
    );
  }

  private whiteboardView = React.createRef<RtcWhiteboardSurfaceView>();

  _renderVideo = () => {
    return (
      <View style={styles.container}>
        <RtcWhiteboardSurfaceView
          ref={this.whiteboardView}
          style={styles.local}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  float: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  top: {
    width: '100%',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
  },
  local: {
    flex: 1,
  },
  remoteContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  remote: {
    width: 120,
    height: 120,
  },
});
