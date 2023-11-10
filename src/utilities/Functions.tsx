import DefaultPreference from 'react-native-default-preference';
import moment from 'moment-timezone';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);
import {
    Platform,
    UIManager,
    LayoutAnimation,
    PixelRatio,
    Dimensions,
    I18nManager,
} from 'react-native';
import {trainings} from "../common/training/selectors";
const toHHMMSS = (secs: any) => {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600) % 24
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60
    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":")
}
const scaleValue = PixelRatio.get() / 2;
export const scaleWithPixel = (size, limitScale = 1.2) => {
    /* setting default upto 20% when resolution device upto 20% with defalt iPhone 7 */
    const value = scaleValue > limitScale ? limitScale : scaleValue;
    return size * value;
};
export const heightHeader = () => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const landscape = width > height;

    if (Platform.OS === 'android') {
        return 215;
    } else {
        return 230;
    }
    // if (Platform.isPad) {
    //     return 65;
    // }
    // switch (height) {
    //     case 375:
    //     case 414:
    //     case 812:
    //     case 896:
    //         return landscape ? 155 : 170;
    //     default:
    //         return landscape ? 155 : 170;
    // }
};

export const debounce = (func: Function, wait: number) => {
    let timeout: any;
    return function() {
        const context: any = this;
        const args = arguments;
        const later = () => {
            timeout = null;
            func.apply(context, args);
        }
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    }
}

export const getTrainingTime = (trainings: any, catId: string, exId: string, date: string) => {
    // console.log('trainings:', trainings);
    // console.log('catId:', catId);
    // console.log('exId:', exId);
    // console.log('date:', date);
    const id = `${catId}_${exId}_${date}`;
    return (trainings[id]) ? trainings[id].time : 0;
}

export const groupBy = (arr: any[], key: string) => {
    return arr.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

export const heightHeightHeader = () => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const landscape = width > height;
    if (Platform.OS === 'android') {
        return 155;
    } else {
        switch (height) {
        case 375:
        case 414:
        case 812:
            return 150;
        case 896:
            return 170;
        default:
            return 170;
    }
    }
    // if (Platform.isPad) {
    //     return 65;
    // }

};

export const heightTabView = () => {
    const height = Dimensions.get('window').height;
    let size = height - heightHeader();
    switch (height) {
        case 375:
        case 414:
        case 812:
        case 896:
            size -= 30;
            break;
        default:
            break;
    }

    return size;
};

const findArray = (data: any, condition: any) => {
    if (data.length === 0) {
        return [];
    }
    return data.filter(function (item: any) {
        for (var key in condition) {
            if (item[key] === undefined || item[key] != condition[key]) {
                return false;
            }
        }
        return true;
    });
}

const hexToRGBA = (hex: string, alpha: number = 1) => {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

const toDateHoursLeft = (dateFuture: string) => {
    const duration = moment.duration(moment(dateFuture).diff(moment()));
    return duration.format('D [day], H [hour]');
}

const isDatePast = (date: string) => {
    return moment(date).isBefore(moment());
}

const fromToTimezone = (date: string, from = 'UTC', to = "Europe/Brussels") => {
    return moment.tz(date, from).tz(to);
}

const setToDefaultPref = async (key: string, value: any) => {
    if (await DefaultPreference.get(key) === null) {
        await DefaultPreference.set(key, value.toString());
    }
}

const getDefaultPref = async (key: string) => {
    return await DefaultPreference.get(key);
};

export {
    toHHMMSS,
    findArray,
    hexToRGBA,
    toDateHoursLeft,
    isDatePast,
    fromToTimezone,
    setToDefaultPref,
    getDefaultPref,
};
