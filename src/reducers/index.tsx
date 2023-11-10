// reducers/index.tsx

import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import AsyncStorage from '@react-native-community/async-storage';

// Auth Reducers
import authReducer from './../common/auth/reducer';
import shopAuthReducer from './../common/shop/shopAuth/reducer';
import shopCustomerAuthReducer from './../common/shop/shopCustomerAuth/reducer';
import AUTH from './../common/auth/constants';

// Reducers
import homeReducer from '../container/HomeContainer/reducer';
import subCategoryReducer from './../container/SubCategoriesContainer/reducer';
import exercisesReducer from './../container/ExercisesContainer/reducer';
import goalsReducer from './../container/GoalsContainer/reducer';
import recipesReducer from './../container/RecipesContainer/reducer';
import profileReducer from './../container/ProfileContainer/reducer';
import scheduleReducer from './../container/ScheduleContainer/reducer';
import PhotoProgress from './../container/PhotoProgressContainer/reducer';
import InAppPurchase from './../common/components/InAppPurchaseModal/reducer';
import TempReducer from './../common/temp/reducer';
import NotificationCenterReducer from './../container/NotificationCenterContainer/reducer';
import TrainingProgressCore from '../common/training';
import ChooseDaysCore from '../common/chooseDays';
// App Navigation Reducer
import NavigationReducer from './../Navigator/reducer'

// Shop Reducers
import shopHomeReducer from './../shop-containers/ShopHomeContainer/reducer';
import CartReducer from './../common/shop/shopActions/cart/reducer';
import CartSettingsReducer from './../shop-containers/CartContainer/reducer';

// Third Party Reducers
import { reducer as formReducer } from 'redux-form';

const sensitiveStorage = createSensitiveStorage({
	keychainService: "balletWorkoutKeychain",
	sharedPreferencesName: "balletWorkoutSharedPrefs",
});

/**
 * root persistor config
 * @type {Object}
 */
const rootPersistConfig = {
	key: 'root',
	// storage: FilesystemStorage,
	storage: AsyncStorage,
	blacklist: [
		'auth',
		'form',
		'shopAuth',
		'shopCustomerAuth',
		'inAppPurchase',
		'temp',
		'navigation',
	]
};

/**
 * auth persistor config
 * @type {Object}
 */
const tokenPersistConfig = {
	key: "auth",
	storage: sensitiveStorage,
	blacklist: ['freshTokenPromise'],
};

/**
 * shop auth persistor config
 */
const shopAuthPersistConfig = {
	key: "shopAuth",
	storage: sensitiveStorage,
}

/**
 * shop customer auth persistor config
 */
const shopCustomerAuthPersistConfig = {
	key: "shopCustomerAuth",
	storage: sensitiveStorage,
}

const inAppPurchasePersistConfig = {
	key: "inAppPurchase",
	storage: sensitiveStorage,
}

/**
 * root reducer combination of all the reducers
 * @type {[type]}
 */
const rootReducer = combineReducers({
	home: homeReducer,
	subCategories: subCategoryReducer,
	exercises: exercisesReducer,
	goals: goalsReducer,
	recipes: recipesReducer,
	profile: profileReducer,
	form: formReducer,
	schedule: scheduleReducer,
	shopHome: shopHomeReducer,
	auth: persistReducer(tokenPersistConfig, authReducer),
	shopAuth: persistReducer(shopAuthPersistConfig, shopAuthReducer),
	shopCustomerAuth: persistReducer(shopCustomerAuthPersistConfig, shopCustomerAuthReducer),
	cart: CartReducer,
	cartSettings: CartSettingsReducer,
	photoProgress: PhotoProgress,
	[TrainingProgressCore.constants.NAME]: TrainingProgressCore.reducer,
	[ChooseDaysCore.constants.NAME]: ChooseDaysCore.reducer,
	inAppPurchase: persistReducer(inAppPurchasePersistConfig, InAppPurchase),
	temp: TempReducer,
	navigation: NavigationReducer,
	notificationCenter: NotificationCenterReducer,
});

const appReducer = (state, action) => {
	if (action.type == AUTH.USER_LOGOUT) {
		// FilesystemStorage.clear().then(() => {
		// 	state = undefined;
		// });
		// AsyncStorage.removeItem('persist:root').then();
		// state = undefined;
	}
	return rootReducer(state, action);
}

export default persistReducer(rootPersistConfig, appReducer);
