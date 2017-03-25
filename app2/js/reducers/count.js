import {
  IS_DRIVER,
  START_TIME,
  END_TIME,
  ORIGIN_LOCATION,
  DEST_LOCATION,
  LAST_PAGE
  } from '../constants'

const initialState = {
  number: 1,
  isDriver: false
}

export default function update(state = initialState, action) {
  if (action.type === IS_DRIVER) {
    state.isDriver = action.isDriver
  } else if (action.type === START_TIME) {
    state.startTime = action.startTime
  } else if (action.type === END_TIME) {
    state.endTime = action.endTime
  } else if (action.type === ORIGIN_LOCATION) {
    state.originLocation = action.originLocation
  } else if (action.type === DEST_LOCATION) {
    state.destLocation = action.destLocation
  } else if (action.type === LAST_PAGE) {
    state.lastPage = action.lastPage
  }
  return state
}
