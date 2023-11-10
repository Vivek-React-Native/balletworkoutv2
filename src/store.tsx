import { createStore, applyMiddleware, compose } from "redux";
// import axios from 'axios';
// import axiosMiddleware from 'redux-axios-middleware';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import rootReducer from './reducers';
import screenLogGoogleAnalytics from './common/reduxMiddlewares/screenLogGoogleAnalytics';

let exportedStore: any;

function logger({ getState }) {
    return (next) => (action) => {
        // console.log('will dispatch', action.type, getState());
        return next(action);
    }
}

export default function configureStore(onPersistCompletion: () => void): any {

    const middlewares = [
        // logger,
        thunk,
        screenLogGoogleAnalytics
    ];

    const enhancer = compose(
        applyMiddleware(...middlewares)
    );
    const store = createStore(rootReducer, enhancer);

    const persistor = persistStore(store, {}, onPersistCompletion);

    exportedStore = store;

    return { store, persistor };
}

export { exportedStore };
