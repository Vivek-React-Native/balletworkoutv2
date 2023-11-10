import CHOOSEDAYS from './constants';

export function savingChooseDays(data: any) {
    return {
        type: CHOOSEDAYS.CHOOSE,
        payload: data,
    };
}

export function saveChooseDays(days: any) {
    return async (dispatch: Function) => {
        await dispatch(savingChooseDays(days));
    };
}
