import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Tabs, Tab, TabHeading, Card, CardItem, Left, Body, Icon } from 'native-base';
import i18n from '../../../../common/i18n';
import HTML from 'react-native-render-html';
import { PRIMARY_COLOR, SECONDARY_COLOR, GREY } from '../../../../utilities/Theme';

interface Props {
    productDescription: string;
    reviews: any;
}
interface State {
    currentTab: number;
}

export default class ProductInfo extends Component<Props, State> {

    state = {
        currentTab: 0,
    }

    renderTabHeading(title: string, index: number) {
        return (
            <TabHeading style={this.state.currentTab === index ? styles.activeTabHeading : styles.tabHeading}>
                <Text style={styles.tabTitle}>{title}</Text>
            </TabHeading>
        );
    }

    renderReview(review: any) {
        return (
            <Card noShadow key={review.author}>
                <CardItem style={styles.reviewBodyItem}>
                    <Text style={styles.ratingsWrapper}><Text style={styles.ratings}>{i18n.t('shop.ratings_title_text')}: {review.rating}</Text> <Icon name="ios-star" style={styles.reviewStar} /></Text>
                    <HTML html={`<p>` + review.text + `</p>`} tagsStyles={tagsStyles} style={styles.reviewBody}/>
                    <Text style={styles.reviewAuthor}>{review.author} - {review.date_added}</Text>
                </CardItem>
            </Card>
        );
    }

    render() {
        const { productDescription, reviews } = this.props;

        return (
            <View style={styles.container}>
                <Tabs
                    tabBarUnderlineStyle={styles.productInfoTabsUnderline}
                    onChangeTab={({ i }) => this.setState({ currentTab: i })}>

                    <Tab heading={this.renderTabHeading(i18n.t('shop.description_title_text'), 0)}>
                        <View style={styles.tabStyle}><HTML html={productDescription} /></View>
                    </Tab>

                    <Tab heading={this.renderTabHeading(i18n.t('shop.reviews_title_text') + ` (${reviews.review_total})`, 1)}>
                        <View style={styles.tabStyle}>
                            {
                                reviews.review_total > 0 ?
                                    reviews.reviews.map((review: any, index: number) => this.renderReview(review))
                                    : null
                            }
                        </View>
                    </Tab>
                </Tabs>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        marginTop: 25,
        marginBottom: 15,
    },
    productInfoTabsUnderline: {
        opacity: 0,
    },
    tabHeading: {
        backgroundColor: PRIMARY_COLOR,
    },
    activeTabHeading: {
        backgroundColor: SECONDARY_COLOR,
    },
    tabTitle: {
        color: '#ffffff',
        fontFamily: 'Montserrat-Medium'
    },
    tabStyle: {
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
    },
    reviewBodyItem: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    reviewStar: {
        fontSize: 15,
        color: PRIMARY_COLOR,
    },
    ratings: {
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-Regular',
    },
    ratingsWrapper: {
        fontFamily: 'Montserrat-Regular',
        marginBottom: 10,
    },
    reviewBody: {        
        marginBottom: 10,
    },
    reviewAuthor: {
        fontFamily: 'Montserrat-Medium',
        color: GREY,
        marginTop: 10,
    }
});

const tagsStyles = {
    p: {
        fontFamily: 'Montserrat-Regular'
    }
}
