import React, {Component} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import BlogPosts from './components/BlogPosts';
import {
  PADDING_LEFT_RIGHT,
  HEIGHT,
  SECONDARY_COLOR,
  PRIMARY_COLOR,
} from './../../../utilities/Theme';
import AppHeader from './../../../common/components/AppHeader/AppHeader';
import axios from 'axios';
import {Spinner} from 'native-base';
import i18n from '../../../common/i18n';
import SpanHeader from '../../../common/components/SpanHeader';
import BlogTabs from './components/BlogTabs';

interface Props {
  navigation: any;
  store: any;
}
interface State {
  posts: any;
  isLoading: boolean;
  filter: string;
}

export default class Blog extends Component<Props, State> {
  unSubscribeStore: Function;

  state = {
    posts: [],
    isLoading: true,
    filter: '',
  };

  language: string;

  componentWillMount() {
    const {store} = this.props;

    this.language = i18n.language;

    if (
      this.language &&
      (this.language === 'en-US' || this.language === 'ru-RU')
    ) {
      axios
        .get(
          // 'https://www.balletworkout.be/en/wp-json/wp/v2/posts?categories=30&filter[orderby]=date&order=desc',
          'https://www.balletworkout.be/en/wp-json/wp/v2/posts?per_page=50&categories=30&filter[orderby]=date&order=desc',
        )
        .then(({data}) => {
          // console.log('Tips:', data.length);
          this.setState({posts: data, isLoading: false});
        })
        .catch(({response}) => {
          // console.log('Tips error:', response);
          this.setState({isLoading: false});
        });
    } else if (this.language && this.language === 'nl-BE') {
      axios
        .get(
          // 'https://www.balletworkout.be/wp-json/wp/v2/posts?categories=31&filter[orderby]=date&order=desc',
          'https://www.balletworkout.be/wp-json/wp/v2/posts?per_page=50&categories=31&filter[orderby]=date&order=desc',
        )
        .then(({data}) => {
          this.setState({posts: data, isLoading: false});
        })
        .catch(({response}) => {
          this.setState({isLoading: false});
        });
    }

    this.unSubscribeStore = store.subscribe(() => {
      if (this.language !== i18n.language) {
        this.language = i18n.language;
        if (
          this.language &&
          (this.language === 'en-US' || this.language === 'ru-RU')
        ) {
          axios
            .get(
              // 'https://www.balletworkout.be/en/wp-json/wp/v2/posts?categories=30&filter[orderby]=date&order=desc',
              'https://www.balletworkout.be/en/wp-json/wp/v2/posts?per_page=50&categories=30&filter[orderby]=date&order=desc',
            )
            .then(({data}) => {
              this.setState({posts: data, isLoading: false});
            })
            .catch(({response}) => {
              this.setState({isLoading: false});
            });
        } else if (this.language && this.language === 'nl-BE') {
          axios
            .get(
              // 'https://www.balletworkout.be/wp-json/wp/v2/posts?categories=31&filter[orderby]=date&order=desc',
              'https://www.balletworkout.be/wp-json/wp/v2/posts?per_page=50&categories=31&filter[orderby]=date&order=desc',
            )
            .then(({data}) => {
              this.setState({posts: data, isLoading: false});
            })
            .catch(({response}) => {
              this.setState({isLoading: false});
            });
        }
      }
    });
  }

  componentWillUnmount() {
    this.unSubscribeStore();
  }

  render() {
    const {posts, isLoading} = this.state;
    // console.log('rerendering blog');
    if (isLoading) {
      return (
        <View style={styles.container}>
          <SpanHeader
            title={'Tips'}
            navigation={this.props.navigation}
            hideBack
            hideMenu
          />
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Spinner color={SECONDARY_COLOR} />
          </View>
        </View>
      );
    }

    if (!isLoading && posts.length <= 0) {
      return (
        <View style={styles.container}>
          <SpanHeader
            title={'Tips'}
            navigation={this.props.navigation}
            hideBack
            hideMenu
          />
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{fontFamily: 'Montserrat-Medium', color: PRIMARY_COLOR}}>
              No Blog Posts
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <SpanHeader
          title={'Tips'}
          navigation={this.props.navigation}
          hideBack
          hideMenu
        />
        <View style={styles.postsContainer}>
          {/*<BlogTabs*/}
          {/*    selected={this.state.filter}*/}
          {/*    onBalletCallBack={() => this.setState({filter: 'ballet'})}*/}
          {/*    onFoodCallBack={() => this.setState({filter: 'food'})}*/}
          {/*/>*/}
            <BlogPosts
              navigation={this.props.navigation}
              isLoading={this.state.isLoading}
              posts={posts}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blogScrollView: {
    flex: 1,
    // minHeight: HEIGHT,
    marginBottom: 10,
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: PADDING_LEFT_RIGHT,
  },
});
