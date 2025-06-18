import { PostgresDeleteUserRepository } from '../repositories/postgres/delete-user'

export class DeleteUserUseCase {
    async execute(userId) {
        const postgresDeleteUserRepository = new PostgresDeleteUserRepository()

        const deletedUser = await postgresDeleteUserRepository.execute(userId)

        return deletedUser
    }
}
