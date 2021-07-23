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
  MessageServiceState,
  RtcMessageService,
} from '@pano.video/panortc-react-native-sdk';
import { ChannelInfo } from './ChannelInfo';

const config = require('../../pano.config.json');

interface State {
  channelId: string;
  isJoined: boolean;
  openMicrophone: boolean;
  enableSpeakerphone: boolean;
}

export default class JoinChannelAudio extends Component<{}, State, any> {
  _engine: RtcEngineKit | undefined;
  _messageService: RtcMessageService | undefined;

  constructor(props: {}) {
    super(props);
    this.state = {
      channelId: ChannelInfo.channelId,
      isJoined: false,
      openMicrophone: true,
      enableSpeakerphone: true,
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
    this._messageService = await this._engine.messageService();
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

    this._messageService?.addListener(
      'onServiceStateChanged',
      (state, reason) => {
        console.info('onServiceStateChanged : ', state, reason);
        if (state == MessageServiceState.Available) {
          this._messageService?.subscribe('test topic').then((result) => {
            console.info('subscribe result', result);
          });
        }
      }
    );
    this._messageService?.addListener('onUserMessage', (userId, message) => {
      console.info('onUserMessage userId : ', userId);
      console.info('onUserMessage message : ', message);
    });
    this._messageService?.addListener(
      'onTopicMessage',
      (topic, userId, data) => {
        console.info('onTopicMessage topic : ', topic);
        console.info('onTopicMessage userId : ', userId);
        console.info('onTopicMessage data : ', data);
      }
    );
    this._messageService?.addListener('onPropertyChanged', (props) => {
      console.info('onPropertyChanged props : ', props);
    });
  };

  _joinChannel = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }

    let serviceFlags = [
      ChannelService.Media,
      ChannelService.Whiteboard,
      ChannelService.Message,
    ];
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

  _broadcastMessage = () => {
    this._messageService
      ?.broadcastMessage('test message', true)
      .then((result) => {
        console.info('broadcastMessage result', result);
      });
  };

  _sendTopicMessage = () => {
    this._messageService
      ?.publish('test topic', 'test message')
      .then((result) => {
        console.info('publish result', result);
      });
  };

  _setProperty = () => {
    this._messageService
      ?.setProperty('test name', 'test value')
      .then((result) => {
        console.info('setProperty result', result);
        this._messageService?.setProperty('test name', '').then((result) => {
          console.info('delete setProperty result', result);
        });
      });
  };

  _unjoinHandle = () => {
    console.info('Please join channel.');
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
          <Button
            onPress={isJoined ? this._broadcastMessage : this._unjoinHandle}
            title={`Broadcast Message`}
          />
          <Button
            onPress={isJoined ? this._sendTopicMessage : this._unjoinHandle}
            title={`Publish Message`}
          />
          <Button
            onPress={isJoined ? this._setProperty : this._unjoinHandle}
            title={`Set Property`}
          />
        </View>
      </View>
    );
  }
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
});
