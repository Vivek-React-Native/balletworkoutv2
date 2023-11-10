import TRAINING from "./constants";

const initialState = {
    changed: true,
    trainings: {},
};

export default function (state: any = initialState, action: any) {
    let newState = state;
    let _training = state.trainings || {};
    switch (action.type) {
        case TRAINING.BEFORE_PROGRESS: {
            const data = action.payload;
            const id = `${data['categoryId']}_${data['exerciseId']}_${data['date']}`
            delete _training[id];
            newState = Object.assign({}, newState, {
                trainings: _training,
                changed: false
            });
            break;
        }
        case TRAINING.PROGRESS: {
            const data = action.payload;
            const id = `${data['categoryId']}_${data['exerciseId']}_${data['date']}`
            _training[id] = data;
            newState = Object.assign({}, newState, {
                trainings: _training,
                changed: true
            });
            break;
        }
    }

    return newState;
}
