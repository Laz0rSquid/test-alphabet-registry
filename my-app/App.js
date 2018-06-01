import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Dimensions,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const getDirectionAndColor = ({moveX, moveY, dx, dy }) => {
  const isA = moveY > 50 && moveY <= 150 && moveX > 0 && moveX < 50;
  const isB = moveY > 150 && moveY <= 250 && moveX > 0 && moveX < 50;
  const isC = moveY > 250 && moveY <= 350 && moveX > 0 && moveX < 50;

  if (isA) return 'Magenta'; else if (isB) return 'Orange'; else if (isC) return 'Blue';
};

export default class App extends Component {
  state = {
    zone: 'Still Touchable'
  };


  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => !!getDirectionAndColor(gestureState),
      onPanResponderMove: (evt, gestureState) => {
        const drag = getDirectionAndColor(gestureState);
        this.setState({
          zone: drag
        });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true
    });
  }

  onPress = () => {
    this.setState({
      zone: 'I got touched with a parent pan responder'
    });
  };

  render() {
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <StatusBar hidden />
        <View style={styles.center}>
          <TouchableOpacity onPress={this.onPress}>
            <Text>{this.state.zone}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.zone1} />
        <View style={styles.zone2} />
        <View style={styles.zone3} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  zone1: {
    top: 50,
    left: 0,
    right: 0,
    width: 50,
    height: 100,
    position: 'absolute',
    backgroundColor: 'magenta'
  },
  zone2: {
    top: 150,
    left: 0,
    right: 0,
    width: 50,
    height: 100,
    position: 'absolute',
    backgroundColor: 'orange'
  },
  zone3: {
    top: 250,
    left: 0,
    right: 0,
    width: 50,
    height: 100,
    position: 'absolute',
    backgroundColor: 'blue'
  }
});
