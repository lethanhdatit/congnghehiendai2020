import * as React from 'react';
import { View, StyleSheet, Text, AppState, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import * as Helper from "../services/helper";
import config from "../config";
import moment from "moment";
export default class HistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      history: [],
      refreshing: false,
      selectedItem: null
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.fetchData();
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this._unsubscribe();
  }

  fetchData = async () => {
    var data = [];
    data.reverse
    var dataStr = await Helper.getValueByKey(config.TTL_History);
    if (dataStr && dataStr != "") {
      data = JSON.parse(dataStr);
    }

    const dataDes = data.sort((a, b) =>
      new moment(new Date(a.createdDate)).format('DD/MM/YYYY HH:mm:ss')
      -
      new moment(new Date(b.createdDate)).format('DD/MM/YYYY HH:mm:ss')
    )
    .reverse();

    this.setState({
      history: dataDes
    });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  goToMap = (loc) => {   
    this.props.navigation.navigate('Home', { "historyLoc": loc });
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        {
          this.state.history && this.state.history != "" && this.state.history != "[]" ?
            this.state.history.map((item, index) => {
              return (
                <View key={`history-item-${index}`} >
                  <TouchableOpacity
                    style={{ marginBottom: 5, marginTop: 5 }}
                    onPress={() => this.goToMap(item.location)}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.titleText}>{item.name}</Text>
                      <Text style={styles.titleDateText}>{item.createdDate}</Text>
                    </View>
                    <View>
                      <Text style={styles.detailText}>{item.formatted_address}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.divider} />
                </View>
              )
            })
            :
            <Text>Trống ...</Text>
        }
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 10
  },
  divider: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titleText: {
    flex: 1,
    fontSize: 15,
    color: 'blue',
    lineHeight: 24,
    textAlign: 'left',
  },
  titleDateText: {
    flex: 1,
    fontSize: 11,
    color: 'black',
    lineHeight: 24,
    textAlign: 'right',
  },
  detailText: {
    fontSize: 12,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 18,
    textAlign: 'right',
    fontStyle: 'italic'
  }
});
