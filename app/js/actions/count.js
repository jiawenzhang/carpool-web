import {
  IS_DRIVER,
  START_TIME,
  END_TIME,
  ORIGIN_LOCATION,
  DEST_LOCATION,
  LAST_PAGE,
  NEW_OFFER_ID
  } from '../constants'

export function setIsDriver(value) {
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

export function setLastPage(page) {
    return {
        type: LAST_PAGE,
        lastPage: page
    }
}

export function setNewOfferId(id) {
    return {
        type: NEW_OFFER_ID,
        newOfferId: id
    }
}
