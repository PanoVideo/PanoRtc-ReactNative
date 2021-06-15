import React, { Component } from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import RtcEngineKit, {
  RtcEngineConfig,
  RtcChannelConfig,
  RtcSurfaceView,
  ChannelMode,
  ChannelService,
} from '@pano.video/panortc-react-native-sdk';
import { ChannelInfo } from './ChannelInfo';
const config = require('../../pano.config.json');

interface State {
  channelId: string;
  isJoined: boolean;
  remoteUid: string[];
  switchCamera: boolean;
}

export default class JoinChannelVideo extends Component<{}, State, any> {
  _engine: RtcEngineKit | undefined;

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
          ?.startVideo(this.localViewRef)
          .then((result) => {
            console.info('startVideo', result);
          })
          .catch((err) => {
            console.warn('startVideo', err);
          });
        this._engine
          ?.startAudio()
          .then((result) => {
            console.info('startAudio', result);
          })
          .catch((err) => {
            console.warn('startAudio', err);
          });
      });
    });
    this._engine?.addListener('onChannelLeaveIndication', (result) => {
      console.info('onChannelLeaveIndication', result);
      this.setState({ isJoined: false, remoteUid: [] });
    });
    this._engine?.addListener('onUserJoinIndication', (userId, userName) => {
      console.info('onUserJoinIndication', userId, userName);
      this.setState({ remoteUid: [...this.state.remoteUid, userId] }, () => {
        this._engine
          ?.subscribeVideo(userId, this.remoteViewRef)
          .then((result) => {
            console.info('subscribeVideo', result);
          })
          .catch((err) => {
            console.warn('subscribeVideo', err);
          });
        this._engine
          ?.subscribeAudio(userId)
          .then((result) => {
            console.info('subscribeAudio', result);
          })
          .catch((err) => {
            console.warn('subscribeAudio', err);
          });
      });
    });
    this._engine?.addListener('onUserLeaveIndication', (userId, reason) => {
      console.info('onUserLeaveIndication', userId, reason);
      this.setState(
        { remoteUid: this.state.remoteUid.filter((value) => value !== userId) },
        () => {
          this._engine
            ?.unsubscribeVideo(userId)
            .then((result) => {
              console.info('unsubscribeVideo', result);
            })
            .catch((err) => {
              console.warn('unsubscribeVideo', err);
            });
        }
      );
    });
    this._engine?.addListener('onActiveSpeakerListUpdated', (result) => {
      console.info('onActiveSpeakerListUpdated', result);
    });
  };

  _joinChannel = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }

    let serviceFlags = new Set([
      ChannelService.Media,
      ChannelService.Whiteboard,
    ]);
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

  _switchCamera = () => {
    const { switchCamera } = this.state;
    this._engine
      ?.switchCamera()
      .then(() => {
        this.setState({ switchCamera: !switchCamera });
      })
      .catch((err) => {
        console.warn('switchCamera', err);
      });
  };

  render() {
    const { channelId, isJoined, switchCamera } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({ channelId: text })}
            value={'Channel ID: ' + channelId}
          />
          <Button
            onPress={isJoined ? this._leaveChannel : this._joinChannel}
            title={`${isJoined ? 'Leave' : 'Join'} channel`}
          />
        </View>
        {this._renderVideo()}
        <View style={styles.float}>
          <Button
            onPress={this._switchCamera}
            title={`Camera ${switchCamera ? 'front' : 'rear'}`}
          />
        </View>
      </View>
    );
  }

  private localViewRef = React.createRef<RtcSurfaceView>();
  private remoteViewRef = React.createRef<RtcSurfaceView>();

  _renderVideo = () => {
    const { remoteUid } = this.state;
    return (
      <View style={styles.container}>
        <RtcSurfaceView ref={this.localViewRef} style={styles.local} />
        {remoteUid !== undefined && (
          <ScrollView horizontal={true} style={styles.remoteContainer}>
            <RtcSurfaceView ref={this.remoteViewRef} style={styles.remote} />
          </ScrollView>
        )}
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
