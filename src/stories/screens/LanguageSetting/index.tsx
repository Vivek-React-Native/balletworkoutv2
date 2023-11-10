import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { List, ListItem, Left, Right, Radio } from 'native-base';
import { connect } from 'react-redux';
import languages from '../../../common/data/languages';
import { fetchAccountDetails, saveAccountDetails } from '../../../container/ProfileContainer/actions';
import { exportedStore } from '../../../store';
import Loader from '../../../common/components/Loader';
import { PRIMARY_COLOR } from '../../../utilities/Theme';

interface Props {
    fetchAccount: Function;
    saveAccountDetails: Function;
    profile: any;
}
interface State {
    languageSelected: string;
    isLoading: boolean;
}

export class LanguageSetting extends Component<Props, State> {

    languageSelected: string;
    unSubscribeStore: Function;

    state = {
       languageSelected: this.props.profile.langauge,
       isLoading: false,
    }

    componentWillMount() {
        this.props.fetchAccount();
        this.setState({ languageSelected: this.props.profile.langauge });
        this.languageSelected = this.props.profile.langauge;
    }

    componentDidMount() {
        this.unSubscribeStore = exportedStore.subscribe(() => {
            let state = exportedStore.getState();
            let language = state.profile.profile.language;
            let isLoading = state.auth.isLoading || state.profile.isSaving || state.profile.isFetching;
            this.setState({ isLoading });

            if (this.languageSelected !== language) {
                this.setState({ languageSelected: language });
                this.languageSelected = language;
            }
        });
    }

    selectLanguage(language: string) {
        if (this.state.languageSelected !== language) {
            this.setState({ languageSelected: language }, () => this.props.saveAccountDetails({ language: this.state.languageSelected }));
        }
    }

    renderLanguage(language: any) {
        return (
            <ListItem key={language.code} onPress={() => this.selectLanguage(language.code)}>
                <Left><Text>{language.desc}</Text></Left>
                <Right>
                    <Radio selected={this.state.languageSelected === language.code} />
                </Right>
            </ListItem>
        );
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        return (
            <View style={styles.container}>
                {!this.state.isLoading || <Loader />}
                <ScrollView>
                    <List>
                        <ListItem itemHeader first>
                            <Text style={styles.listHeader}>Select Language</Text>
                        </ListItem>
                        {
                            languages.map((language) => this.renderLanguage(language))
                        }
                    </List>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listHeader: {
        fontFamily: 'Montserrat-SemiBold',
        color: PRIMARY_COLOR,
        fontSize: 18,
    }
});

const mapStateToProps = (state: any) => {
    const { profile: { profile } } = state;

    return { profile };
}

const mapDispatchToProps = (dispatch: Function) => {
    return {
        fetchAccount: () => { dispatch(fetchAccountDetails()) },
        saveAccountDetails: (values: any) => { dispatch(saveAccountDetails(values)) },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSetting);
