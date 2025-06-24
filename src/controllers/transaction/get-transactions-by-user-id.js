import { UserNotFoundError } from '../../errors/user'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    requiredFieldIsMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../helpers'

export class GetTransactionsByUserId {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId
            //verificar se o userId foi passado como parametro
            if (!userId) {
                return requiredFieldIsMissingResponse('userId')
            }

            //verificar se o userId é um Id Válido
            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            //chamar o useCase
            const transactions =
                await this.getTransactionsByUserIdUseCase.execute(userId)

            //  retornar resposta HTTP
            return ok(transactions)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError()
        }
    }
}
