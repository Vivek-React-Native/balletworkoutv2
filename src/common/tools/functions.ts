import moment from 'moment-timezone';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);

export function hexToRGBA(hex: string, alpha: number = 1) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

export function toDateHoursLeft(dateFuture: string) {
    const duration = moment.duration(moment(dateFuture).diff(moment()));
    return duration.format('D [day], H [hour]');
}

export function isDatePast(date: string) {
    return moment(date).isBefore(moment());
}

export function fromToTimezone(date: string, from = 'UTC', to = "Europe/Brussels") {
    return moment.tz(date, from).tz(to);
}