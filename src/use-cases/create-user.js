import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import {
    PostgresCreateUserRepository,
    PostgresGetUserByEmailRepository,
} from '../repositories/postgres/index.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        // TODO: verificar se o e-mail já está em uso
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()

        const userWithProvideEmail =
            await postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userWithProvideEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        // Gerar ID do usuário
        const userId = uuidv4()

        //criptografar a senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

        //criar o usuário no banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        // Chamar o repositório para salvar o usuário
        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createdUser = await postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
