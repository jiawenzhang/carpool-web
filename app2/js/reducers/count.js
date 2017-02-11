import { INCREASE, DECREASE, IS_DRIVER } from '../constants'

const initialState = {
    number: 1,
    isDriver: false
}

export default function update(state = initialState, action) {
    if (action.type === INCREASE) {
        state.number = state.number + action.amount
    } else if (action.type === DECREASE) {
        state.number = state.number - action.amount
    } else if (action.type === IS_DRIVER) {
        state.isDriver = action.isDriver
    }
    return state
}
