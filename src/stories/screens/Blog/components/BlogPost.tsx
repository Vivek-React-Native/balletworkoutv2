import React, { Component } from 'react';
import { Card, CardItem, Left, Body } from 'native-base';
import {View, StyleSheet, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import HTML from 'react-native-render-html';
import axios from 'axios';
import {PRIMARY_COLOR, WIDTH} from '../../../../utilities/Theme';
import {Text} from "@balletworkout/components";
import Loader from '../../../../common/components/Loader';

interface Props {
    post: any;
    navigation: any;
}
interface State {
    imageUrl: string;
    bigImage: string;
}

export default class BlogPost extends Component<Props, State> {

    state = {
        imageUrl: 'NO URL',
        bigImage: 'NO URL',
    };

    _isMounted = true;

    renderedImage = 0;

    renderPostImage(postImageUrl: string) {

        if (this.renderedImage === 0) {
            axios.get(postImageUrl)
                .then(({ data }) => {

                    let mediaDetails = data.media_details;
                    let bigImage = typeof mediaDetails.sizes.full !== 'undefined' ? mediaDetails.sizes.full.source_url : 'NO URL';//typeof mediaDetails.sizes.large !== 'undefined' ? mediaDetails.sizes.large.source_url : typeof mediaDetails.sizes.medium_large !== 'undefined' ? mediaDetails.sizes.medium_large.source_url : mediaDetails.sizes.full.source_url

                    if (this._isMounted) {
                        this.setState({
                            imageUrl: typeof mediaDetails.sizes.medium === 'undefined' ? bigImage : mediaDetails.sizes.medium.source_url,
                            bigImage: bigImage,
                        });
                    }

                    this.renderedImage++;

                })
                .catch((errors) => {
                });
        }
    }

    reduceExcerpt(dom: any, RNElement: any) {

        const modified = {
            ...RNElement[0],
            children: [
                {
                    ...RNElement[0].children[0],
                    data: RNElement[0].children[0].data.trim().substring(0, 105) + '...'
                }
            ]
        }

        RNElement.splice(0, 1, modified);

        return RNElement;

    }

    componentWillReceiveProps() {
        this.renderedImage = 0;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        const { post } = this.props;

        if (typeof post._links['wp:featuredmedia'] !== 'undefined') {
            this.renderPostImage(post._links['wp:featuredmedia'][0].href);
        } else if (typeof post._links['wp:attachment'] !== 'undefined') {
            this.renderPostImage(post._links['wp:attachment'][0].href);
        }

        return (
            <TouchableOpacity
                style={styles.listContainer}
                onPress={() => this.props.navigation.navigate('postView', {
                    postContent: post.content.rendered,
                    postTitle: post.title.rendered,
                    postImage: this.state.bigImage === 'NO URL' ? '' : this.state.bigImage,
                    postDate: post.date_gmt,
                })}
            >
                {this.state.imageUrl !== 'NO URL'
                    ? <Image source={{ uri: this.state.imageUrl }} resizeMode={'cover'} style={styles.avatarImage} />
                    : <View style={styles.avatarImage}>
                        <ActivityIndicator size={WIDTH * 0.1} color={'#A45A79'}  />
                    </View>
                }
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>
                        {post.title.rendered.substring(0, 25)}
                    </Text>
                    <HTML
                        tagsStyles={tagsStyles}
                        html={post.excerpt.rendered}
                        onParsed={(dom: any, elem: any) => this.reduceExcerpt(dom, elem)} />
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    listContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: "#F7F7F7",
        borderRadius: 15,
        marginTop: WIDTH * 0.03,
        height: WIDTH * 0.3
    },
    avatarImage: {
        height: '100%',
        width: WIDTH * 0.3,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: '#fff',
        alignItems:"center",
        justifyContent:'center'
    },
    descriptionContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        margin: WIDTH * 0.025,
    },
    descriptionTitle: {
        fontSize: WIDTH * 0.036,
    }
});
const tagsStyles = {
    p: {
        fontFamily: 'Poppins-Regular',
        color: PRIMARY_COLOR,
        fontSize: WIDTH * 0.029,
    }
};
