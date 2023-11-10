import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';
import AppHeaderNewTheme from './../../common/components/AppHeader/AppHeaderNewTheme';
import Profile, {VIEW_CALLBACK_ENUM} from './../../stories/screens/Profile';
import {uploadPicture} from './actions';
import NoConnection from '../../common/components/NoConnection';

interface Props {
  navigation: any;
  screenProps: any;
  uploadPicture: Function;
}
interface State {}

export class ProfileContainer extends Component<Props, State> {
  viewCallbackHandler(type: string, data: any) {
    switch (type) {
      case VIEW_CALLBACK_ENUM.UPLOAD_PROFILE_PICTURE:
        this.props.uploadPicture(data);
    }
  }

  render() {
    const {store} = this.props.screenProps;
    return (
      <View style={styles.container}>
        {this.props.screenProps.isConnectedToNetwork ? null : <NoConnection />}
        <AppHeaderNewTheme navigation={this.props.navigation} />
        <Profile
          callbackHandler={this.viewCallbackHandler.bind(this)}
          store={store}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

const mapStateToProps = state => {
  const {profile} = state;

  return profile;
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    uploadPicture: (data: any) => dispatch(uploadPicture(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileContainer);
