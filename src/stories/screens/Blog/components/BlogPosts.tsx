import React, { Component } from 'react';
import {View, FlatList} from 'react-native';
import BlogPost from './BlogPost';

interface Props {
    posts: any;
    navigation: any;
    isLoading: boolean;
}

interface State {}

export default class BlogPosts extends Component<Props, State> {

    render() {
        const { posts, navigation, isLoading } = this.props;

        return (
            <View style={{flex:1}}>
                <FlatList
                    data={posts}
                    contentContainerStyle={{paddingVertical: 15}}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(v,index)=> index.toString()}
                    renderItem={({item, index}) => (
                        <BlogPost key={index} navigation={navigation} post={item}/>
                    )}
                />
            </View>
        );
    }

}