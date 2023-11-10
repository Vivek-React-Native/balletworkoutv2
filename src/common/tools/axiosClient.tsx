import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { baseUrlApi } from '../appConstants';
import { exportedStore } from './../../store';
import { loginSuccess, logOutUser } from './../auth/actions';
import { NavigationActions } from 'react-navigation';

const urlExceptions = [
    'refresh-user-token',
    'register',
    'signup-with-facebook',
    'refresh-user-token',
    'signin-with-facebook',
    'login',
];
let instance: any;
const http = (type: string = 'api'): any => {

    if (type === 'api') {
        instance = axios.create({
            baseURL: baseUrlApi,
            headers: { 'Content-Type': 'application/json' }
        });

        instance.interceptors.request.use(requestInterceptor, (error: any) => {
            // Do something with request error
            return Promise.reject(error);
        });

        instance.interceptors.response.use(undefined, responseInterceptor);
    }

    return instance;
}

/**
 * Request Interceptor
 * @param config
 */
function requestInterceptor(config: any) {
    let originalRequest = config;

    let tokenExpiration: number = jwtDecode(exportedStore.getState().auth.tokenData.token).exp;

    let exceptions = new RegExp('(' + urlExceptions.join('|') + ')', 'i');

    if (exceptions.test(config.url)) {
        return config;
    }

    if (tokenExpiration < (Date.now() / 1000) || tokenExpiration - (Date.now() / 1000) < 42000) {

        let refresToken = exportedStore.getState().auth.userData.refresh_token;
        let userId = exportedStore.getState().auth.userData.id;

        let issueTokenData = { refresh_token: refresToken, id: userId };

        // make sure we are not already refreshing the token
        return issueToken(issueTokenData).then(({ data }) => {

            let decodedToken = jwtDecode(data.access_token);

            exportedStore.dispatch(loginSuccess({
                tokenData: {
                    token: data.access_token,
                    tokenInfo: decodedToken,
                },
                userData: data.user
            }));

            return Promise.resolve(originalRequest);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    return config;
}

function responseInterceptor(error: any) {
    if (typeof error.response === 'undefined') {
        return delay(2500).then(() => instance(error.config));
    }
    if(error.response.status === 401) {
        exportedStore.dispatch(logOutUser());
        exportedStore.dispatch(NavigationActions.navigate({ routeName: 'auth' }));
        return Promise.reject(error);
    }
    return Promise.reject(error);
}

function delay(t:number, v?:any) {
    return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, v), t);
    });
}

function issueToken(data: any) {
    return new Promise((resolve: Function, reject: Function) => {
        return axios.post(`${baseUrlApi}user/refresh-user-token`, data).then((response: any) => {
            resolve(response);
        }).catch((error: any) => {
            if (typeof error.response !== 'undefined' && error.response.data.status === 403) {
                exportedStore.dispatch(logOutUser());
                exportedStore.dispatch(NavigationActions.navigate({ routeName: 'auth' }));
            }
            reject(error);
        });
    });
}

export default http;
