import React, { Component } from "react";
import { View, StyleSheet, Linking, Image, BackHandler } from "react-native";
import HTML from 'react-native-render-html';
import 'moment-timezone';

import { WIDTH, PRIMARY_COLOR, SECONDARY_COLOR, PADDING_LEFT_RIGHT, HEIGHT } from "../../../utilities/Theme";
import AutoScaleImage from "../../../common/components/AutoScaleImage";
import ScrollabeHeader from "../../../common/components/ScrollabeHeader";


interface Props {
    navigation: any;
}
interface State {
    postContent: string;
    postTitle: string;
    postImage: string;
    imageHeight: number;
    imageWidth: number;
    postDate: string;
}
export default class Post extends Component<Props, State> {

    componentWillMount() {
        const { navigation: { getParam } } = this.props;
        let postContent = getParam('postContent');
        let postTitle = getParam('postTitle');
        let postImage = getParam('postImage');
        let postDate = getParam('postDate');
        this.setState({ postContent, postTitle, postImage, postDate });
        //console.log(postContent);
    }

    handleLinkClick(link: string) {
        Linking.openURL(link);
    }

    render() {
        // console.log('this.state.postContent....',this.state.postContent)
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <ScrollabeHeader
                    navigation={()=> navigation.navigate('blog')}
                    image={{uri: this.state.postImage}}
                    title={this.state.postTitle}
                >
                    <HTML html={this.state.postContent}
                          tagsStyles={tagsStyles}
                          renderers={{
                              img: (htmlAttribs: any) => {
                                  return (
                                      <View style={styles.imageWrapper} key={'img'}>
                                          <AutoScaleImage uri={htmlAttribs.src} width={WIDTH - (PADDING_LEFT_RIGHT * 2)} height={null} />
                                      </View>
                                  );
                              }
                          }}
                          imagesInitialDimensions={{ width: WIDTH - (PADDING_LEFT_RIGHT * 2) }}
                          imagesMaxWidth={(WIDTH - (PADDING_LEFT_RIGHT * 2))}
                          onLinkPress={(ref: any, link: string) => this.handleLinkClick(link)} />
                </ScrollabeHeader>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    postScrollView: {
        flex: 1,
        paddingRight: 15,
        paddingLeft: 15,
    },
    postTitle: {
        fontSize: 22,
        fontFamily: 'Poppins-SemiBold',
        color: SECONDARY_COLOR,
        marginBottom: 10,
    },
    postDate: {
        color: PRIMARY_COLOR,
    },
    postInfo: {
        color: '#bebebe',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        marginBottom: 15,
    },
    postImage: {
        flex: 1,
        alignSelf: 'center',
        marginBottom: 25,
    },
    separator: {
        borderBottomColor: '#eeeeee',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        marginBottom: 15,
    },
    imageWrapper: {
        flex: 0,
        alignItems: 'center',
    }
});

const tagsStyles = {
    img: {
        // width: 200,
        alignSelf: 'center',
        // marginTop: 15,
        // marginBottom: 20,
        // height: 'auto',
        // resizeMode: 'contain',
    },
    p: {
        fontSize: WIDTH * 0.04,
        fontFamily: 'Poppins-Regular',
        marginBottom: HEIGHT * 0.015 ,
        color: PRIMARY_COLOR,
        paddingHorizontal: WIDTH * 0.07,
    },
    h1: {
        fontFamily: 'Poppins-Bold',
        fontSize: 23,
        paddingHorizontal: 20
    },
    h2: {
        fontFamily: 'Poppins-Bold',
        fontSize: 21,
        paddingHorizontal: 20
    },
    h3: {
        fontFamily: 'Poppins-Medium',
        fontSize: 20,
        paddingHorizontal: 20
    },
    h4: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        paddingHorizontal: 20
    },
    h5: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        paddingHorizontal: 20
    },
    h6: {
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
        paddingHorizontal: 20
    },
}
