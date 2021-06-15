import React, { Component } from 'react';
import type { NavigationStackProp } from 'react-navigation-stack';
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Basic from './basic';

const DATA = [Basic];

export class Example extends Component {
  render() {
    // @ts-ignore
    const { navigation }: { navigation: NavigationStackProp } = this.props;
    return (
      <View style={styles.flex}>
        <SafeAreaView style={styles.flex}>
          <SectionList
            // @ts-ignore
            sections={DATA}
            keyExtractor={(item, index) => item.name + index}
            renderItem={({ item }) => (
              <Item item={item} navigation={navigation} />
            )}
          />
        </SafeAreaView>
      </View>
    );
  }
}

// @ts-ignore
const Item = ({ item, navigation }) => (
  <View style={styles.item}>
    <TouchableOpacity onPress={() => navigation.navigate(item.name)}>
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    padding: 10,
    fontSize: 24,
    color: 'white',
    backgroundColor: 'grey',
  },
  item: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: 'black',
  },
});
