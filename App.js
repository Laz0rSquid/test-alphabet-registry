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

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const contents = [
  'In magna et qui officia elit et est irure consequat commodo nulla. Consequat commodo nulla.',
  'Voluptate nisi mollit in nulla adipisicing ea laboris.',
  'Pariatur deserunt fugiat est ullamco amet voluptate tempor cillum. Eu adipisicing nostrud aliquip est laboris velit esse.',
  'Proident ut ipsum velit ipsum ipsum elit aliqua cillum veniam id mollit.\nCommodo eiusmod eiusmod reprehenderit magna eiusmod deserunt.\nAnim amet fugiat ut voluptate tempor.'
];

const sections = letters.map((title) => {
  let data = new Array(26).fill(`${title}-item\n\n${contents[getRandomInt(4)]}`);

  if (title === 'E') {
    data = [];
  }

  return {
    title,
    data
  };
});

const statBarHeight = 0; // TODO: dynamcially from app
const registryElemWidth = 20;
const registryElemHeight = (height - statBarHeight) / 29;

export default class App extends Component {
  refreshing = false;
  largeList;
  listSections;
  panResponder;

  constructor(props) {
    super(props);
    this.listSections = sections;

    this.state = {
      currentLetter: ''
    };

    // https://facebook.github.io/react-native/docs/panresponder.html
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const sectionIndex = this._getSectionIndex(gestureState);

        return sectionIndex == 0 || !!sectionIndex;
      },
      onPanResponderMove: (evt, gestureState) => {
        const sectionIndex = this._getSectionIndex(gestureState);

        if (
          sectionIndex !== false &&
          sectionIndex >= 0 &&
          sectionIndex < this.listSections.length
        ) {
          if (this.listSections[sectionIndex] && this.listSections[sectionIndex].data.length) {
            this.setState({ currentLetter: this.listSections[sectionIndex].title });
            this._scrollToSection(sectionIndex);
          }
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({ currentLetter: '' });
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this.setState({ currentLetter: '' });
      }
    });
  }

  _cellHeight = (section, row) => {
    const item = sections[section].data[row];

    if (item.length < 50) {
      return 50;
    } else if (item.length < 100) {
      return 80;
    } else if (item.length < 160) {
      return 120;
    }
    return item.length - 20;
  };

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
            numberOfRowsInSection={(sectionIndex) => this.listSections[sectionIndex].data.length}
            numberOfSections={() => this.listSections.length}
            numberOfSectionPoolSize={29}
            heightForCell={(sectionIndex, rowIndex) => this._cellHeight(sectionIndex, rowIndex)}
            renderCell={this._renderItem}
            renderSection={(sectionIndex) => {
              if (this.listSections[sectionIndex] && this.listSections[sectionIndex].data.length) {
                return (
                  <View style={{ backgroundColor: '#666' }}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {this.listSections[sectionIndex].title}
                    </Text>
                  </View>
                );
              }
            }}
            heightForSection={(section) =>
              this.listSections[section] && this.listSections[section].data.length ? 20 : 0
            }
            renderItemSeparator={() => (
              <View style={{ backgroundColor: '#EEE', height: 1, marginLeft: 16 }} />
            )}
          />
          <View {...this.panResponder.panHandlers}>
            {this.listSections.map((section, index) => (
              <TouchableOpacity
                key={`${index}${section.title}`}
                onPressIn={() => {
                  if (this.listSections[index] && this.listSections[index].data.length) {
                    this.setState({ currentLetter: this.listSections[index].title });
                  }
                }}
                onPressOut={() => this.setState({ currentLetter: '' })}
                onPress={() => this._scrollToSection(index)}
              >
                <View style={styles.regElem}>
                  <Text
                    style={
                      !this.listSections[index] || !this.listSections[index].data.length
                        ? styles.regElemInactive
                        : null
                    }
                  >
                    {section.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {this.state.currentLetter.length && (
          <View style={styles.currentLetter}>
            <Text>{this.state.currentLetter}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  regElem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    height: registryElemHeight,
    width: registryElemWidth
  },
  regElemInactive: {
    color: '#999'
  },
  listContainer: {
    flexDirection: 'row'
  },
  currentLetter: {
    position: 'absolute',
    height: 40,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5
  }
});
