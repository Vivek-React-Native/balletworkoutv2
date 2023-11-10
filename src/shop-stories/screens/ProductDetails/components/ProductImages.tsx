import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { WIDTH, PADDING_LEFT_RIGHT, PRIMARY_COLOR } from '../../../../utilities/Theme';

interface Props {
    images: any;
}
interface State { 
    activeSlide: number;
}

export default class ProductImages extends Component<Props, State> {

    state = {
        activeSlide: 0,
    }

    get pagination () {
        const { images } = this.props;
        const { activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={images.length}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: 'transparent' }}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
                  backgroundColor: 'rgba(70,76,110, 0.92)'
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
    }

    _renderItems({ item, index }) {
        return (
            <View key={index} style={styles.item}>
                <Image style={styles.carouselImage} source={{ uri: item }} />
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Carousel
                    data={this.props.images}
                    renderItem={this._renderItems}
                    sliderWidth={WIDTH-30}
                    itemWidth={WIDTH - (PADDING_LEFT_RIGHT * 2)} 
                    onSnapToItem={(index: number) => this.setState({ activeSlide: index }) }/>
                    { this.pagination }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: 'center'
    },
    item: {
        flex: 0,
        alignSelf: 'stretch',
        alignItems: 'center',
        height: 200,
    },
    carouselImage: {
        width: WIDTH - (PADDING_LEFT_RIGHT * 2),
        resizeMode: 'contain',
        height: 200,
    },
});
