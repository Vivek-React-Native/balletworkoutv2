import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, Platform} from 'react-native';
import {
  Item,
  Input,
  Icon,
  Form,
  Picker,
  Label,
  Button,
  Toast,
} from 'native-base';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import timezones from './../../../../common/data/timezones';
import languages from './../../../../common/data/languages';
import countries from './../../../../common/data/countries';
import {
  saveAccountDetails,
  fetchAccountDetails,
} from './../../../../container/ProfileContainer/actions';
import {
  PRIMARY_COLOR,
  PADDING_LEFT_RIGHT,
  PRIMARY_COLOR_NEW,
  WIDTH,
  HEIGHT,
} from '../../../../utilities/Theme';
import i18n from '../../../../common/i18n';
import AsyncStorage from '@react-native-community/async-storage';

/* Validation Rules */
const required = value => (value ? undefined : 'Required');
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
const maxLength15 = maxLength(15);
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
const minLength8 = minLength(8);
const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined;
/* !Validation Rules */

interface Props {
  navigation: any;
  handleSubmit: Function;
  fetchAccount: Function;
  saveAccountDetails: Function;
}
interface State {}
export class ProfileForm extends Component<Props, State> {
  textInput: any;

  componentWillMount() {
    this.props.fetchAccount();
    //this.renderCountryInputItem(countries);
  }

  renderInput({input, meta: {touched, error}}, label) {
    // console.log('input==============', input);
    return (
      //   <Item style={styles.inputItem} error={error && touched} stackedLabel>
      //     {/* <Label>{label}</Label> */}
      //     <Input
      //       ref={c => (this.textInput = c)}
      //       //placeholder={input.name === "email" ? "Email" : "Password"}
      //       secureTextEntry={input.name === 'password' ? true : false}
      //       {...input}
      //     />
      //   </Item>
      <View style={[{paddingHorizontal: 10}]}>
        <Label style={styles.inputText}>{label}</Label>
        <View style={[styles.pickerStyle, {paddingHorizontal: 10}]}>
          <Input
            placeholder={label}
            ref={c => (this.textInput = c)}
            //placeholder={input.name === "email" ? "Email" : "Password"}
            secureTextEntry={input.name === 'password' ? true : false}
            {...input}
            style={styles.textInput}
          />
        </View>
      </View>
    );
  }

  async ChangeLanguage(language: any, onChange: any){
    await AsyncStorage.setItem('language', language)
    onChange(language)
  }

  renderPickerInput(props: any, label: string) {
    const {
      input: {onChange, value, inputProps},
      meta: {touched, error},
      children,
      ...pickerProps
    } = props;
    return (
      //   <Item
      //     style={styles.inputItem}
      //     picker
      //     error={error && touched}
      //     stackedLabel>
      //     {/* <Label>{label}</Label> */}
      //     <Picker
      //       mode="dialog"
      //       selectedValue={value}
      //       onValueChange={(value, index) => onChange(value)}
      //       placeholder={label}
      //       style={styles.pickerStyle}
      //       // itemTextStyle={{textAlign: 'left'}}
      //       // textStyle={{textAlign: 'left'}}
      //       children={children}
      //       {...inputProps}
      //       {...pickerProps}
      //     />
      //   </Item>
      <View style={[{marginHorizontal: 10}]}>
        <Label style={styles.inputText}>{label}</Label>
        <Picker
          style={styles.pickerStyle}
          mode="dialog"
          selectedValue={value}
          onValueChange={(value, index) => this.ChangeLanguage(value, onChange)}
          placeholder={label}
          children={children}
          textStyle={styles.textInput}
        />
      </View>
    );
  }

  renderTimezoneInputItem(timezonesList: any) {
    return timezonesList.map((group: any, index: number) => {
      let zones = group.zones;

      if (zones.length > 0) {
        return zones.map((zone: any, index: number) => (
          <Picker.Item
            key={index}
            label={group.group + ': ' + zone.name}
            value={zone.value}
          />
        ));
      }
    });
  }

  renderLanguageInputItem(languageList: any) {
    return languageList.map((language: any, index: number) => (
      <Picker.Item key={index} label={language.desc} value={language.code} />
    ));
  }

  renderCountryInputItem(countryList: any) {
    return Object.keys(countryList).map((country, index) => (
      <Picker.Item key={country} label={countryList[country]} value={country} />
    ));
  }

  handleFormSubmit(values: any) {
    console.log('Save details.....')
    this.props.saveAccountDetails(values);
  }

  render() {
    const {handleSubmit} = this.props;
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Form style={styles.form}>
            <Field
              name="first_name"
              component={props =>
                this.renderInput(props, i18n.t('common.first_name'))
              }
            />
            {/* <Field
              name="last_name"
              component={props =>
                this.renderInput(props, i18n.t('common.last_name'))
              }
            /> */}
            <Field
              name="email"
              component={props =>
                this.renderInput(props, i18n.t('common.email'))
              }
              validate={[email]}
            />
            {/* <Field name="password" component={(props) => this.renderInput(props, 'Password')} validate={[alphaNumeric, minLength8, maxLength15]} /> */}

            <Field
              name="country"
              placeholder="Country"
              placeholder="Select Country"
              component={props =>
                this.renderPickerInput(props, i18n.t('common.country'))
              }>
              {this.renderCountryInputItem(countries)}
            </Field>

            <Field
              name="language"
              placeholder="Select Language"
              component={props =>
                this.renderPickerInput(props, i18n.t('common.language'))
              }>
              {this.renderLanguageInputItem(languages)}
            </Field>

            <Field
              name="timezone"
              mode="dropdown"
              placeholder="Select Timezone"
              component={props =>
                this.renderPickerInput(props, i18n.t('common.timezone'))
              }>
              {this.renderTimezoneInputItem(timezones)}
            </Field>

            <Button
              style={styles.submitButton}
              block
              onPress={handleSubmit((values: any) => this.handleFormSubmit(values))}>
              <Text style={styles.submitButtonText}>
                {i18n.t('settings.profile.submit_profile').toUpperCase()}
              </Text>
            </Button>
          </Form>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: PADDING_LEFT_RIGHT,
    paddingRight: PADDING_LEFT_RIGHT,
  },
  form: {
    marginBottom: 15,
  },
  inputText: {
    textAlign: 'left',
    fontSize: 14,
    color: '#000000',
  },
  textInput: {
    fontSize: WIDTH * 0.04,
    color: '#000',
    marginLeft: -WIDTH * 0.015,
    fontWeight: Platform.OS=='android' ? '600' : 'normal'
  },
  inputItem: {
    marginLeft: 0,
    //width: '100%',
    backgroundColor: '#F7F7F7',
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 25,
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR_NEW,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
  },
  pickerStyle: {
    // flex: 0,
    // width: '100%',
    // alignSelf: 'flex-start',
    backgroundColor: 'rgba(173, 173, 173, 0.1)', //'#F7F7F7',
    // backgroundColor: '#f00', //'#F7F7F7',
    marginBottom: 10,
    borderRadius: 5,
    height: HEIGHT * 0.05,
    // paddingVertical: 5,
    marginTop: 5,
  },
});

let profileForm = reduxForm({
  form: 'profileForm', // a unique identifier for this form
  enableReinitialize: true,
})(ProfileForm);

const mapStateToProps = (state: any) => {
  const {
    profile: {profile},
  } = state;
  const initialValues = profile; // pull initial values from account reducer
  return {profile, initialValues};
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    fetchAccount: () => {
      dispatch(fetchAccountDetails());
    },
    saveAccountDetails: (values: any) => {
      dispatch(saveAccountDetails(values));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(profileForm);
