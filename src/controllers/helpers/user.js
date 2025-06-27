import { badRequest } from './http.js'

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
