import moment from 'moment';
import jwtDecode from 'jwt-decode';
import { refreshToken } from './../auth/actions';

interface Config {
    except?: any;
};

const tokenRefresher = (config?: Config) => {

    return ({dispatch, getState}) => (next: Function) => (action: any) => {
        // if (typeof action === 'function') {
            if (getState().auth && getState().auth.tokenData !== null) {

                // decode jwt so that we know if and when it expires
                var tokenExpiration: number = jwtDecode(getState().auth.tokenData.token).exp;
                if ((moment(tokenExpiration) - moment(Date.now()) / 1000) < 1170200) {
                    // make sure we are not already refreshing the token
                    if (typeof action.freshTokenPromise === 'undefined') {
                        return refreshToken(dispatch, getState).then(() => { next(action) }).catch((e: any) => {});
                    } else {
                        return action.freshTokenPromise.then(() => {}).catch((e: any) => {});
                    }
                }
            }
        // }
        return next(action);
    }
}

export default tokenRefresher;
