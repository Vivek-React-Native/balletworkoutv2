import GOALS from './constants';

const initialSate = {
    goalsStarted: [],
};

export default function (state: any = initialSate, action: any) {

    if(action.type === GOALS.GOALS_SAVING) {
        return {
            ...state
        };
    }

    if(action.type === GOALS.GOALS_SAVE_SUCCESSFUL) {
        let goalsStarted = state.goalsStarted;
        goalsStarted.push(action.payload);
        
        return {
            ...state,
            goalsStarted: goalsStarted,
        };
    }

    if(action.type === GOALS.GOALS_UPDATING) {
        let goalsStarted = state.goalsStarted.map((goal: any) => {
            if(goal.goal_id === action.payload.id && goal.is_finished === 0) {
                return {
                    ...goal,
                    times_performed: goal.times_performed + 1,
                    is_finished: goal.times_performed < (goal.duration - 1) ? 0: 1
                }
            } else {
                return goal;
            }
        });

        return {
            ...state,
            goalsStarted: goalsStarted,
        }
    }

    if(action.type === GOALS.CANCEL_NOTIFICATION) {
        let goalsStarted = state.goalsStarted.map((goal: any) => {
            if(goal.notifId === action.payload) {
                return {
                    ...goal,
                    notification_on: false,
                }
            } else {
                return goal;
            }
        });

        return {
            ...state,
            goalsStarted,
        }
    }

    if(action.type === GOALS.TURN_ON_NOTIFICATION) {
        let goalsStarted = state.goalsStarted.map((goal: any) => {
            if(goal.notifId === action.payload && goal.is_finished !== 1) {
                return {
                    ...goal,
                    notification_on: false,
                }
            } else {
                return goal;
            }
        });

        return {
            ...state,
            goalsStarted,
        }
    }

    return state;
}
