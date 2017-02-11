import { INCREASE, DECREASE, IS_DRIVER } from '../constants'

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
