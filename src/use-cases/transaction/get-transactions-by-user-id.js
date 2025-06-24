import { UserNotFoundError } from '../../errors/user'

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
            throw new UserNotFoundError(params.userId)
        }
        //chamar o repository
        const transactions =
            await this.getTransactionsByUserIdRespository.execute(params.userId)

        return transactions
    }
}
