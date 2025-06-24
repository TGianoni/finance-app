import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => {
    return validator.isUUID(id)
}

export const invalidIdResponse = () => {
    return badRequest({
        message: 'The provided user ID is not valid.',
    })
}
