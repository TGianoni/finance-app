import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdRespository, getUserByIdRepository) {
        this.getTransactionsByUserIdRespository =
            getTransactionsByUserIdRespository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(userId) {
        //validar se o usuário existe
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }
        //chamar o repository
        const transactions =
            await this.getTransactionsByUserIdRespository.execute(userId)

        return transactions
    }
}
