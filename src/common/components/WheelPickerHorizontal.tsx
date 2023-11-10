import React, {Component} from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Platform,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class WheelPickerHorizontal extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    dataSource: PropTypes.array.isRequired,
    selectedIndex: PropTypes.number,
    animateToSelectedIndex: PropTypes.bool,
    onValueChange: PropTypes.func,
    renderItem: PropTypes.func,
    highlightColor: PropTypes.string,
    opacityIndex: PropTypes.number,

    itemHeight: PropTypes.number,
    wrapperHeight: PropTypes.number,
    wrapperColor: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.itemHeight = this.props.itemHeight || 30;
    this.wrapperHeight =
      this.props.wrapperHeight ||
      (this.props.style ? this.props.style.height : 0) ||
      this.itemHeight * 5;

    this.state = {
      selectedIndex: this.props.selectedIndex || 0,
      opacityIndex: 0
    };
  }

  componentDidMount() {
    // console.log('deviceWidth', deviceWidth);
    if (this.props.selectedIndex) {
      setTimeout(() => {
        this.scrollToIndex(
          this.props.selectedIndex,
          this.props.animateToSelectedIndex,
        );
      }, 0);
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    let {header, footer} = this._renderPlaceHolder();
    let highlightWidth =
      (this.props.style ? this.props.style.width : 0) || deviceWidth;
    let highlightColor = this.props.highlightColor || '#333';
    let wrapperStyle = {
      width: this.wrapperHeight,
      height: this.itemHeight,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    };

    let highlightStyle = {
      position: 'absolute',
      left: (this.wrapperHeight - this.itemHeight) / 2,
      height: this.itemHeight,
      width: this.itemHeight,
      backgroundColor: '#D2959F',
      borderRadius: 33,
    };

    return (
      <View style={wrapperStyle}>
        <View style={highlightStyle} />
        <ScrollView
          ref={sview => {
            this.sview = sview;
          }}
          bounces={false}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onScroll={(e)=> {
            const opacityIndex = Math.floor(e.nativeEvent.contentOffset.x / 95)
            this.setState({ opacityIndex })
          }}
          decelerationRate={0}
          snapToInterval={this.itemHeight}
          snapToAlignment={'center'}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          horizontal={true}
          onMomentumScrollBegin={this._onMomentumScrollBegin.bind(this)}
          onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this)}
          onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
          onScrollEndDrag={this._onScrollEndDrag.bind(this)}>
          {header}
          {this.props.dataSource.map(this._renderItem.bind(this))}
          {footer}
        </ScrollView>
      </View>
    );
  }

  _renderPlaceHolder() {
    let h = (this.wrapperHeight - this.itemHeight) / 2;
    let header = <View style={{width: h, flex: 1}} />;
    let footer = <View style={{width: h, flex: 1}} />;
    return {header, footer};
  }

  _renderItem(data, index) {
    let isSelected = index === this.state.selectedIndex;
    // console.log('state index.......',this.state.selectedIndex)
    // console.log('selected bool.......',isSelected)
    // console.log('index.......',index)
    // console.log('data.......',data)
    // console.log('Opacity Index.......',this.state.opacityIndex)
    let item = (
      <Text
        style={
          isSelected
            ? [styles.itemText, styles.itemTextSelected]
            : styles.itemText
        }>
        {data}
      </Text>
    );

    if (this.props.renderItem) {
      item = this.props.renderItem(data, index, isSelected);
    }

    return (
      <View
        style={[
          styles.itemWrapper,
          {width: this.itemHeight, height: this.itemHeight, opacity: (this.state.opacityIndex - 2) == index || (this.state.opacityIndex + 2) == index ? 0.4 : 1},
        ]}
        key={index}>
        {item}
      </View>
    );
  }

  _scrollFix(e) {
    let y = 0;
    let h = this.itemHeight;
    if (e.nativeEvent.contentOffset) {
      y = e.nativeEvent.contentOffset.x;
    }
    let selectedIndex = Math.round(y / h);
    let _y = selectedIndex * h;
    if (_y !== y) {
      // using scrollTo in ios, onMomentumScrollEnd will be invoked
      if (Platform.OS === 'ios') {
        this.isScrollTo = true;
      }
      this.sview.scrollTo({x: _y});
    }
    if (this.state.selectedIndex === selectedIndex) {
      return;
    }
    // onValueChange
    if (this.props.onValueChange) {
      let selectedValue = this.props.dataSource[selectedIndex];
      this.setState({
        selectedIndex: selectedIndex,
      });
      this.props.onValueChange(selectedValue, selectedIndex);
    }
  }

  _onScrollBeginDrag() {
    this.dragStarted = true;
    if (Platform.OS === 'ios') {
      this.isScrollTo = false;
    }
    this.timer && clearTimeout(this.timer);
  }

  _onScrollEndDrag(e) {
    this.dragStarted = false;
    // if not used, event will be garbaged
    let _e = {
      nativeEvent: {
        contentOffset: {
          y: e.nativeEvent.contentOffset.y,
        },
      },
    };
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (!this.momentumStarted && !this.dragStarted) {
        this._scrollFix(_e, 'timeout');
      }
    }, 10);
  }

  _onMomentumScrollBegin(e) {
    this.momentumStarted = true;
    this.timer && clearTimeout(this.timer);
  }

  _onMomentumScrollEnd(e) {
    this.momentumStarted = false;
    if (!this.isScrollTo && !this.momentumStarted && !this.dragStarted) {
      this._scrollFix(e);
    }
  }

  scrollToIndex(ind, animated = true) {
    this.setState({
      selectedIndex: ind,
    });
    let y = this.itemHeight * ind;
    this.sview.scrollTo({x: y, animated});
  }

  getSelected() {
    let selectedIndex = this.state.selectedIndex;
    let selectedValue = this.props.dataSource[selectedIndex];
    return selectedValue;
  }
}

let styles = StyleSheet.create({
  itemWrapper: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: '#999',
  },
  itemTextSelected: {
    color: '#333',
  },
});
