import defaultRules from 'react-native-form-validator/defaultRules';
import defaultMessages from 'react-native-form-validator/defaultMessages';

const formValidationRules = {
    ...defaultRules,

    confirmPassword: (password: Function, value: any) => {
        if (password === void(0) || typeof password !== 'function') {
            throw 'ERROR: It is not a valid callback value function, checkout your settings.';
        }

        if (password() !== value) {
            return false;
        }

        return true;
    },
    booleanRequired: (apply:boolean, value: string) => {
        if(apply) {
            return value === "1";
        }
    } 

};

const validationMassages = {
    ...defaultMessages,
};

validationMassages['en']['confirmPassword'] = 'The field "{0}" must match with password field';
validationMassages['en']['booleanRequired'] = 'You must "{0}" with terms and conditions';

export default formValidationRules;
export { validationMassages };