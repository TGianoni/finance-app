import { userNotFoundResponse } from '../../controllers/helpers/index.js'

export class GetTransactionsByUserId {
    constructor(getTransactionsByUserIdRespository, getUserByIdRepository) {
        this.getTransactionsByUserIdRespository =
            getTransactionsByUserIdRespository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(params) {
        //validar se o usuário existe
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            return userNotFoundResponse()
        }
        //chamar o repository
        const transactions =
            await this.getTransactionsByUserIdRespository.execute(params.userId)

        return transactions
    }
}
