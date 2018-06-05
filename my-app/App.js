import React, { Component } from 'react';
import {
  Dimensions,
  PanResponder,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import AtoZList from 'react-native-atoz-list';

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
  'Z'
];

const sections = {};
for (let letter of letters) {
  sections[letter] = new Array(26).fill('item');
}

// const sections = letters.map((title) => {
//   const data = new Array(26).fill('item');

//   return {
//     title,
//     data
//   };
// });

const statBarHeight = 0; // TODO: dynamcially from app
const registryElemWidth = 20;
const registryElemHeight = (height - statBarHeight) / 29;

/**
 * ...
 *
 * @param {*} param0
 * @param {number} counter
 * @return {boolean|number} ...
 */
const getSectionIndex = ({ moveX, moveY, dx, dy }, counter = 0, sectionLength) => {
  if (moveX < width - registryElemWidth) return false;

  return getSectionIndexHelper(moveX, moveY, counter, sectionLength);
};

/**
 * ...0-29 because of alphabet a-z + ä,ö,ü
 *
 * @param {number} moveX the latest screen x coordinate of the recently-moved touch
 * @param {number} moveY the latest screen y coordinate of the recently-moved touch
 * @param {number} counter current section index
 * @return {number} a number from 0 to 29
 */
const getSectionIndexHelper = (moveX, moveY, counter, sectionLength) => {
  if (counter > sectionLength) return false;

  const elementY = statBarHeight + counter * registryElemHeight;
  const nextElementY = statBarHeight + (counter + 1) * registryElemHeight;

  if (moveY >= elementY && moveY < nextElementY) {
    return counter;
  }

  return getSectionIndexHelper(moveX, moveY, counter + 1);
};

export default class App extends Component {
  // https://facebook.github.io/react-native/docs/panresponder.html
  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const sectionIndex = getSectionIndex(gestureState);

      return sectionIndex == 0 || !!sectionIndex;
    },
    onPanResponderMove: (evt, gestureState) => {
      const sectionIndex = getSectionIndex(gestureState);

      if (sectionIndex < this.sectionListRef.props.sections.length) {
        this.scrollToSection(sectionIndex);
      }
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true
  });

  // _getItemLayout = (data, index) => ({
  //   length: registryElemHeight,
  //   offset: registryElemHeight * index,
  //   index
  // });

  scrollToSection = (sectionIndex) => {
    this.sectionListRef.scrollToLocation({
      animated: false,
      itemIndex: 0,
      sectionIndex,
      viewOffset: +20,
      viewPosition: 0
    });
  };

  _renderHeader(data) {
    return (
      <View style={{ justifyContent: 'center', backgroundColor: '#eee', paddingLeft: 10 }}>
        <Text>{data.sectionId}</Text>
      </View>
    );
  }

  _renderCell(data) {
    return (
      <View style={styles.cell}>
        <View />
        <Text style={styles.name}>
          {data}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.listContainer}>
          {/* <SectionList
            initialNumToRender={700}
            ref={(ref) => (this.sectionListRef = ref)}
            renderItem={({ item }) => <Text>{item}</Text>}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={{ fontWeight: 'bold' }}>{title}</Text>
            )}
            sections={sections}
            keyExtractor={(item, index) => item + index}
            // getItemLayout={this._getItemLayout}
          /> */}
          {/* <View {...this._panResponder.panHandlers}>
            {sections.map((section, index) => (
              <TouchableWithoutFeedback
                key={`${index}${section.title}`}
                onPress={() => this.scrollToSection(index)}
                style={{}}
              >
                <View style={[{ backgroundColor: '#f0f' }, styles.regElem]}>
                  <Text>{section.title}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View> */}
        </View>
        <AtoZList
          sectionHeaderHeight={20}
          cellHeight={95}
          data={sections}
          renderCell={this._renderCell}
          renderSection={this._renderHeader}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: height
  },
  regElem: {
    borderBottomColor: '#777',
    borderBottomWidth: 1,
    height: registryElemHeight,
    width: registryElemWidth
  },
  listContainer: {
    flexDirection: 'row'
  },
  name: {
    fontSize: 15
  },
  cell: {
    height: 95,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center'
  }
});
