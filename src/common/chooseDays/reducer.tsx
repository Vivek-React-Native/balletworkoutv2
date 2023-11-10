import CHOOSEDAYS from "./constants";
import AUTH from "../auth/constants";

const initialState = {
    changed: true,
    chooseDays: 3,
    isFirst: true,
};

export default function (state: any = initialState, action: any) {
    let newState = state;
    switch (action.type) {
        case CHOOSEDAYS.CHOOSE: {
            const data = action.payload;
            newState = Object.assign({}, newState, {
                chooseDays: action.payload,
                changed: false,
                isFirst: false,
            });
            break;
        }
        case AUTH.USER_LOGOUT: {
            newState = Object.assign({}, newState, {...initialState});
            break;
        }
    }

    return newState;
}
