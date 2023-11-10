import GOALS from './constants';

export function addingGoal() {
    return {
        type: GOALS.GOALS_SAVING,
    };
}

export function addingGoalSuccessful(goal:any) {
    return {
        type: GOALS.GOALS_SAVE_SUCCESSFUL,
        payload: goal
    };
}

export function addingGoalFailure(error: any) {
    return {
        type: GOALS.GOALS_SAVE_FAILURE,
        payload: error,
    }
}

export default function saveAndStartGoal(goal: any) {
    return (dispatch: Function) => {
        dispatch(addingGoal());
        dispatch(addingGoalSuccessful(goal));
    }
}

export function updatingGoal(subCategory: any) {
    return {
        type: GOALS.GOALS_UPDATING,
        payload: subCategory,
    };
}

export function updatingGoalSuccessful() {
    return {
        type: GOALS.GOALS_UPDATE_SUCCESS,
    };
}

export function updatingGoalFailure(error: any) {
    return {
        type: GOALS.GOALS_UPDATE_FAILURE,
        payload: error,
    };
}

export function updateGoalProgress(subCategory: any) {
    return (dispatch: Function) => {
        dispatch(updatingGoal(subCategory));
        dispatch(updatingGoalSuccessful());

    }
}

export function turnOffGoalNotification(notifId: any) {
    return {
        type: GOALS.CANCEL_NOTIFICATION,
        payload: notifId,
    }
}

export function turnOnGoalNotification(notifId: any) {
    return {
        type: GOALS.TURN_ON_NOTIFICATION,
        payload: notifId,
    }
}
