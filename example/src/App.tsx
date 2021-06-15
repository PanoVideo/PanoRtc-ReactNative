/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { WelcomePage } from './WelcomePage';
import { Example } from './Example';
import JoinChannelAudio from './basic/JoinChannelAudio';
import Whiteboard from './basic/Whiteboard';
import JoinChannelVideo from './basic/JoinChannelVideo';
import ScreenShare from './basic/ScreenShare';

const AppNavigator = createStackNavigator({
  Welcome: {
    screen: WelcomePage,
  },
  Example: {
    screen: Example,
  },
  JoinChannelAudio: {
    screen: JoinChannelAudio,
  },
  JoinChannelVideo: {
    screen: JoinChannelVideo,
  },
  Whiteboard: {
    screen: Whiteboard,
  },
  ScreenShare: {
    screen: ScreenShare,
  },
});

const AppContainer = createAppContainer(AppNavigator);

const App = () => <AppContainer />;

export default App;
