import {
  IS_DRIVER,
  START_TIME,
  END_TIME } from '../constants'

export function isDriver(value) {
    return {
        type: IS_DRIVER,
        isDriver: value
    }
}

export function setStartTime(time) {
    return {
        type: START_TIME,
        startTime: time
    }
}

export function setEndTime(time) {
    return {
        type: END_TIME,
        endTime: time
    }
}
