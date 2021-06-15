import React, { Component } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type { NavigationStackProp } from 'react-navigation-stack';
import { ChannelInfo } from './basic/ChannelInfo';

export class WelcomePage extends Component {
  channelId: string = '';
  userName: string = '';

  render() {
    // @ts-ignore
    const { navigation }: { navigation: NavigationStackProp } = this.props;
    return (
      <View style={styles.flex}>
        <TextInput
          style={styles.input1}
          placeholder="Channel ID"
          placeholderTextColor={'#CCC'}
          returnKeyType="done"
          clearButtonMode="while-editing"
          enablesReturnKeyAutomatically={true}
          editable={true}
          maxLength={100}
          keyboardType="default"
          onChangeText={(e) => (this.channelId = e)}
        />
        <TextInput
          style={styles.input2}
          placeholder="User Name"
          placeholderTextColor={'#CCC'}
          returnKeyType="done"
          clearButtonMode="while-editing"
          enablesReturnKeyAutomatically={true}
          editable={true}
          maxLength={100}
          keyboardType="default"
          onChangeText={(e) => (this.userName = e)}
        />
        {
          <SafeAreaView style={styles.btnContainer}>
            <Button
              title="Enter"
              onPress={() => {
                if (isEmpty(this.channelId) || isEmpty(this.userName)) {
                  Alert.alert('Channel ID or User Name cannot be empty!');
                } else {
                  ChannelInfo.channelId = this.channelId;
                  ChannelInfo.userName = this.userName;
                  navigation.navigate('Example');
                }
              }}
            />
          </SafeAreaView>
        }
      </View>
    );
  }
}

function isEmpty(obj: any) {
  return typeof obj == 'undefined' || obj == null || obj == '';
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  input1: {
    height: 45,
    borderWidth: 1,
    marginTop: 180,
    marginRight: 20,
    marginLeft: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 4,
  },
  input2: {
    height: 45,
    borderWidth: 1,
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 4,
  },
  btnContainer: {
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 4,
  },
});
