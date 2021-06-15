import React, { Component } from 'react';
import {
  View,
  TextInput,
  PermissionsAndroid,
  StyleSheet,
  Button,
  Platform,
} from 'react-native';

import RtcEngineKit, {
  RtcEngineConfig,
  RtcChannelConfig,
  ChannelMode,
  ChannelService,
  OptionType,
  RtcSurfaceView,
} from '@pano.video/panortc-react-native-sdk';
import { ChannelInfo } from './ChannelInfo';

const config = require('../../pano.config.json');

interface State {
  channelId: string;
  isJoined: boolean;
  openMicrophone: boolean;
  enableSpeakerphone: boolean;
  remoteUid: string[];
}

export default class ScreenShare extends Component<{}, State, any> {
  _engine: RtcEngineKit | undefined;

  constructor(props: {}) {
    super(props);
    this.state = {
      channelId: ChannelInfo.channelId,
      isJoined: false,
      openMicrophone: true,
      enableSpeakerphone: true,
      remoteUid: [],
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
      this.setState({ isJoined: true });
      this._engine
        ?.startAudio()
        .then((result) => {
          console.info('startAudio', result);
        })
        .catch((err) => {
          console.warn('startAudio', err);
        });
      this._engine?.setOption(true, OptionType.ScreenOptimization);
      this._engine
        ?.startScreen()
        .then((result) => {
          console.info('startScreen', result);
        })
        .catch((err) => {
          console.warn('startScreen', err);
        });
    });
    this._engine?.addListener('onChannelLeaveIndication', (result) => {
      console.info('onChannelLeaveIndication', result);
      this.setState({ isJoined: false });
    });
    this._engine?.addListener('onUserJoinIndication', (userId) => {
      this._engine
        ?.subscribeAudio(userId)
        .then((result) => {
          console.info('subscribeAudio', result);
        })
        .catch((err) => {
          console.warn('subscribeAudio', err);
        });
    });

    this._engine?.addListener('onActiveSpeakerListUpdated', (result) => {
      console.info('onActiveSpeakerListUpdated', result);
    });

    this._engine?.addListener('onUserScreenStart', (userId) => {
      console.info('onUserScreenStart', userId);
      this.setState({ remoteUid: [...this.state.remoteUid, userId] }, () => {
        this._engine
          ?.subscribeScreen(userId, this.screenViewRef)
          .then((result) => {
            console.info('subscribeScreen', result);
          })
          .catch((err) => {
            console.warn('subscribeScreen', err);
          });
      });
    });

    this._engine?.addListener('onUserScreenStop', (userId) => {
      console.info('onUserScreenStop', userId);
      this.setState(
        { remoteUid: this.state.remoteUid.filter((value) => value !== userId) },
        () => {
          // subscribe next user.
        }
      );
    });
  };

  _joinChannel = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
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
  };

  render() {
    const { channelId, isJoined } = this.state;
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
      </View>
    );
  }

  private screenViewRef = React.createRef<RtcSurfaceView>();

  _renderVideo = () => {
    const { remoteUid } = this.state;
    return (
      <View style={styles.container}>
        {remoteUid !== undefined && (
          <RtcSurfaceView ref={this.screenViewRef} style={styles.screen} />
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
  screen: {
    flex: 1,
  },
});
