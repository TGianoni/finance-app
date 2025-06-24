import { badRequest } from './http.js'
import validator from 'validator'

export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characters long.',
    })
}

export const emailIsAlreadyInUseResponse = () => {
    return badRequest({
        message: 'Invalid email format. Please provide a valid email address.',
    })
}

export const userNotFoundResponse = () => {
    return badRequest({
        message: 'User not found.',
    })
}

export const checkIfPasswordIsValid = (password) => {
    return password.length >= 6
}

export const checkIfEmailIsValid = (email) => {
    return validator.isEmail(email)
}
