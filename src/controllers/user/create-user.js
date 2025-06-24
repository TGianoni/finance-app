import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUseResponse,
    invalidPasswordResponse,
    created,
    serverError,
    badRequest,
    validateRequiredFields,
} from '../helpers/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            // validar a requisição (campos obrigatórios, tamanho de senha e tamanho de senha)
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const { ok: requiredFieldsWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldsWereProvided) {
                return badRequest({
                    message: `The field ${missingField} is required.`,
                })
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password)

            if (!passwordIsValid) {
                return invalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)
            if (!emailIsValid) {
                return emailIsAlreadyInUseResponse()
            }

            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser) // Retornar o usuário criado

            // Retornar a resposta para o usuário (status code)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
