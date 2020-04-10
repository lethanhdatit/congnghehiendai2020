import * as React from 'react';
import { StyleSheet, Text  } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class HistoryScreen extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
       <Text style={styles.getStartedText}>History screen</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  }
});
