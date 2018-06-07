import React, { Component } from 'react';
import {
  Dimensions,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { LargeList } from 'react-native-largelist';

const { height, width } = Dimensions.get('window');

const letters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'Ä',
  'Ö',
  'Ü'
];
const sections = letters.map((title) => {
  const data = new Array(26).fill(`${title}-item`);

  return {
    title,
    data
  };
});

const statBarHeight = 0; // TODO: dynamcially from app
const registryElemWidth = 20;
const registryElemHeight = (height - statBarHeight) / 29;

export default class App extends Component {
  cellHeight = 148;
  refreshing = false;
  largeList;
  listSections;
  panResponder;

  constructor(props) {
    super(props);
    this.listSections = sections;

    // https://facebook.github.io/react-native/docs/panresponder.html
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const sectionIndex = this._getSectionIndex(gestureState);

        return sectionIndex == 0 || !!sectionIndex;
      },
      onPanResponderMove: (evt, gestureState) => {
        const sectionIndex = this._getSectionIndex(gestureState);

        if (sectionIndex < this.listSections.length) {
          this._scrollToSection(sectionIndex);
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true
    });
  }

  _renderItem(section, row) {
    const item = sections[section].data[row];
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Text>{item}</Text>
      </View>
    );
  }

  /**
   * ...0-29 because of alphabet a-z (26) + ä,ö,ü (3)
   *
   * @param {number} moveX the latest screen x coordinate of the recently-moved touch
   * @param {number} moveY the latest screen y coordinate of the recently-moved touch
   * @param {number} counter current section index
   * @return {number} a number from 0 to 29
   */
  _getSectionIndexHelper = (moveX, moveY, counter, sectionLength) => {
    if (counter > sectionLength) return false;

    const elementY = statBarHeight + counter * registryElemHeight;
    const nextElementY = statBarHeight + (counter + 1) * registryElemHeight;

    if (moveY >= elementY && moveY < nextElementY) {
      return counter;
    }

    return this._getSectionIndexHelper(moveX, moveY, counter + 1);
  };

  /**
   * ...
   *
   * @param {*} params
   * @param {number} counter
   * @return {boolean|number} ...
   */
  _getSectionIndex = ({ moveX, moveY, dx, dy }, counter = 0, sectionLength) => {
    if (moveX < width - registryElemWidth) return false;

    return this._getSectionIndexHelper(moveX, moveY, counter, sectionLength);
  };

  _scrollToSection = (sectionIndex) => {
    this.largeList.scrollToIndexPath({ section: sectionIndex, row: 0 }, false);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.listContainer}>
          <LargeList
            style={{ backgroundColor: '#fff', flex: 1, height: height }}
            ref={(ref) => (this.largeList = ref)}
            numberOfRowsInSection={(section) => this.listSections[section].data.length}
            numberOfSections={() => this.listSections.length}
            heightForCell={(section, row) => (row % 2 ? this.cellHeight : this.cellHeight * 1.5)}
            renderCell={this._renderItem}
            renderSection={(section) => (
              <View style={{ backgroundColor: '#666' }}>
                <Text style={{ fontWeight: 'bold' }}>{this.listSections[section].title}</Text>
              </View>
            )}
            heightForSection={(section) => 20}
            renderItemSeparator={() => (
              <View style={{ backgroundColor: '#EEE', height: 1, marginLeft: 16 }} />
            )}
          />
          <View {...this.panResponder.panHandlers}>
            {this.listSections.map((section, index) => (
              <TouchableOpacity
                key={`${index}${section.title}`}
                onPress={() => this._scrollToSection(index)}
              >
                <View style={[{ backgroundColor: '#fff' }, styles.regElem]}>
                  <Text>{section.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  regElem: {
    alignItems: 'center',
    height: registryElemHeight,
    width: registryElemWidth
  },
  listContainer: {
    flexDirection: 'row'
  }
});
