// import firebase from 'react-native-firebase';
import analytics from '@react-native-firebase/analytics';

const screenLogGooleAnalytics = store => dispatch => action => {

    // console.log('store object.....',store);
    // console.log('dispatch object.....',dispatch);
    // console.log('action object.....',action);

    switch (action.type) {

        case 'Navigation/NAVIGATE':
            const { routeName } = action;
            // console.log('NAVIGATE....', action);
            analytics().logScreenView({
                screen_name: routeName + "1",
                screen_class: routeName + "1",
            });
            // do something
            dispatch(action)
            break;

        case 'Navigation/RESET':
            // const { routeName } = action.actions[action.index];
            // console.log('RESET....', action);
            // do something
            dispatch(action)
            break;

        default:
            // do nothing
            dispatch(action)
            break;
    }
}

export default screenLogGooleAnalytics;