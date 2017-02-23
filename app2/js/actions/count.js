import {
  IS_DRIVER,
  START_TIME,
  END_TIME,
  ORIGIN_LOCATION,
  DEST_LOCATION
  } from '../constants'

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

export function setOriginLocation(location) {
    return {
        type: ORIGIN_LOCATION,
        originLocation: location
    }
}

export function setDestLocation(location) {
    return {
        type: DEST_LOCATION,
        destLocation: location
    }
}
