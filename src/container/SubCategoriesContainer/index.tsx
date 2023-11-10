import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import SubCategories from './../../stories/screens/SubCategories';
import fetchSubCategories from './actions';
import AppHeader from '../../common/components/AppHeader/AppHeader';
import NoConnection from '../../common/components/NoConnection';
// import { AFLogEvent } from '../../utilities/AppsFlyer'
import appsFlyer from 'react-native-appsflyer';
import { AFLogEvent } from '../../utilities/AppsFlyer';
import Loader from '../../common/components/Loader';

interface Props {
    fetchSubCategories: Function;
    subCategories: any;
    screenProps: any;
    navigation: any;
}
interface State {
    subCategories: any;
    params: any
}

export class SubCategoriesContainer extends Component<Props, State> {

    unSubscribeStore: Function;

    state = {
        subCategories: [],
        params: []
    };

    _param(value: any){
        this.setState({ params: value })
    }

    componentWillMount() {
        const { store } = this.props.screenProps;
        // console.log('this.props.navigation.getParam ===================', this.props.navigation?.getParam('category'));
        const category = this.props.navigation?.getParam('category');
        // console.log('category data........',category)
        this._param(category)
        this.props.fetchSubCategories(category?.id, category?.type);
        this.unSubscribeStore = store.subscribe(() => {
            let subCategories = store.getState().subCategories.subCategories;
            this.setState({ subCategories });
        });
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    constructor(props: any) {
        super(props);
    }

    render() {
        const { store } = this.props.screenProps;
        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                    null :
                    <NoConnection />
                }
                {/*<AppHeader navigation={this.props.navigation} />*/}
                {this.state.subCategories.length < 1 && <Loader/>}
                <SubCategories store={store} subCategories={this.state.subCategories} category={this.state.params} navigation={this.props.navigation} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

const mapStateToProps = state => {
    const { subCategories } = state;

    return subCategories;
};
export default connect(mapStateToProps, { fetchSubCategories })(SubCategoriesContainer);
