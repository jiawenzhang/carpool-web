import {
  IS_DRIVER,
  START_TIME,
  END_TIME } from '../constants'

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
  }
  return state
}
