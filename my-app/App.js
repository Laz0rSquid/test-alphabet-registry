import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Dimensions,
  PanResponder,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const statBarHeight = 50;
const registryElemWidth = 30;
const registryElemHeight = (height - statBarHeight) / 30;

const getSection = ({moveX, moveY, dx, dy}, counter) => {
  if (moveX > registryElemWidth) return -1;
  else return getSectionHelper(moveX, moveY, counter);
};

const getSectionHelper = (moveX, moveY, counter) => {
  if (
    moveY > statBarHeight + counter * registryElemHeight &&
    moveY <= statBarHeight + (counter + 1) * registryElemHeight
  ) {
    return counter;
  } else return getSectionHelper(moveX, moveY, counter+1);
};

const getColor = ({ moveX, moveY, dx, dy }) => {
  const isA =
    moveY > statBarHeight &&
    moveY <= statBarHeight + registryElemHeight &&
    moveX > 0 &&
    moveX < registryElemWidth;
  const isB =
    moveY > statBarHeight + registryElemHeight &&
    moveY <= statBarHeight + 2 * registryElemHeight &&
    moveX > 0 &&
    moveX < registryElemWidth;
  const isC =
    moveY > statBarHeight + 2 * registryElemHeight &&
    moveY <= statBarHeight + 3 * registryElemHeight &&
    moveX > 0 &&
    moveX < registryElemWidth;
  const isD =
    moveY > statBarHeight + 3 * registryElemHeight &&
    moveY <= statBarHeight + 4 * registryElemHeight &&
    moveX > 0 &&
    moveX < registryElemWidth;
  const isE =
    moveY > statBarHeight + 4 * registryElemHeight &&
    moveY <= statBarHeight + 5 * registryElemHeight &&
    moveX > 0 &&
    moveX < registryElemWidth;
  const isF =
    moveY > statBarHeight + 5 * registryElemHeight &&
    moveY <= statBarHeight + 6 * registryElemHeight &&
    moveX > 0 &&
    moveX < registryElemWidth;
  const isG =
    moveY > statBarHeight + 6 * registryElemHeight &&
    moveY <= statBarHeight + 7 * registryElemHeight &&
    moveX > 0 &&
    moveX < registryElemWidth;
  const isH =
    moveY > statBarHeight + 7 * registryElemHeight &&
    moveY <= statBarHeight + 8 * registryElemHeight &&
    moveX > 0 &&
    moveX < registryElemWidth;
  const isI =
    moveY > statBarHeight + 8 * registryElemHeight &&
    moveY <= statBarHeight + 9 * registryElemHeight &&
    moveX > 0 &&
    moveX < registryElemWidth;
  const isJ =
    moveY > statBarHeight + 9 * registryElemHeight &&
    moveY <= statBarHeight + 10 * registryElemHeight &&
    moveX > 0 &&
    moveX < registryElemWidth;

  if (isA) return 'Magenta';
  else if (isB) return 'Orange';
  else if (isC) return 'Blue';
  else if (isD) return 'Green';
  else if (isE) return 'Red';
  else if (isF) return 'Yellow';
  else if (isG) return 'Teal';
  else if (isH) return 'Purple';
  else if (isI) return 'Pink';
  else if (isJ) return 'Plum';
  else return 'Color';
};

export default class App extends Component {
  state = {
    zone: 'Color'
  };

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => !!getColor(gestureState),
      onPanResponderMove: (evt, gestureState) => {
        const color = getColor(gestureState);
        this.setState({
          zone: color
        })
        const section = getSection(gestureState,0);
        if (section > 0 && section < this.sectionListRef.props.sections.length) {
          this.scrollToSection(section);
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true
    });
  }

  scrollToSection = (x) => {
    this.sectionListRef.scrollToLocation({
      sectionIndex: x,
      itemIndex: 0,
      viewPosition: 0.5
    });
  };

  render() {
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <StatusBar hidden />
        <View style={(styles.statBar, styles.skyblue)}>
          <Text style={styles.statBar}>{this.state.zone}</Text>
        </View>
        <View style={styles.listContainer}>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={[styles.regElem, styles.magenta]} />
            <View style={[styles.regElem, styles.orange]} />
            <View style={[styles.regElem, styles.blue]} />
            <View style={[styles.regElem, styles.green]} />
            <View style={[styles.regElem, styles.red]} />
            <View style={[styles.regElem, styles.yellow]} />
            <View style={[styles.regElem, styles.teal]} />
            <View style={[styles.regElem, styles.purple]} />
            <View style={[styles.regElem, styles.pink]} />
            <View style={[styles.regElem, styles.plum]} />
          </View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <SectionList
              ref={(ref) => (this.sectionListRef = ref)}
              renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={{ fontWeight: 'bold' }}>{title}</Text>
              )}
              sections={[
                { title: 'A', data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] },
                { title: 'B', data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] },
                { title: 'C', data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] },
                { title: 'D', data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] },
                { title: 'E', data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] },
                { title: 'F', data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] },
                { title: 'G', data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] },
                { title: 'H', data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] },
                { title: 'I', data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] },
                { title: 'J', data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] }
              ]}
              keyExtractor={(item, index) => item + index}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: height,
    backgroundColor: '#aff'
  },
  statBar: {
    height: statBarHeight
  },
  regElem: {
    width: registryElemWidth,
    height: registryElemHeight
  },
  listContainer: {
    flexDirection: 'row'
  },
  skyblue: {
    backgroundColor: '#0dd'
  },
  magenta: {
    backgroundColor: '#f0f'
  },
  orange: {
    backgroundColor: '#f70'
  },
  blue: {
    backgroundColor: '#00F'
  },
  green: {
    backgroundColor: '#0f0'
  },
  red: {
    backgroundColor: '#f00'
  },
  yellow: {
    backgroundColor: '#ff0'
  },
  teal: {
    backgroundColor: '#0af'
  },
  purple: {
    backgroundColor: '#70f'
  },
  pink: {
    backgroundColor: '#f07'
  },
  plum: {
    backgroundColor: '#707'
  }
});
