import {
  INCREASE,
  DECREASE,
  IS_DRIVER,
  START_TIME,
  END_TIME } from '../constants'

export function increase(n) {
    return {
        type: INCREASE,
        amount: n
    }
}

export function decrease(n) {
    return {
        type: DECREASE,
        amount: n
    }
}

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
