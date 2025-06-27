import { EmailAlreadyInUseError } from '../../errors/user.js'
import bcrypt from 'bcrypt'

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserRepository) {
        this.updateUserRepository = updateUserRepository
        this.getUserByEmailRepository = getUserByEmailRepository
    }
    async execute(userId, updateUserParams = {}) {
        // se o e-mail estiver sendo atualizado, verificar se já existe um usuário com esse e-mail
        if (updateUserParams.email) {
            const userWithProvideEmail =
                await this.getUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProvideEmail && userWithProvideEmail.id != userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = {
            ...updateUserParams,
        }

        // se a senha estiver sendo atualizada, verificar se a senha atende aos critérios de segurança

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )

            user.password = hashedPassword
        }
        // chamar o repositório de atualização de usuário
        const updatedUser = await this.updateUserRepository.execute(
            userId,
            user,
        )

        return updatedUser
    }
}
