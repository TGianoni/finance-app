import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

export class CreateUserUseCase {
    async execute(createUserParams) {
        // TODO: verificar se o e-mail já está em uso

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
        const postgresCreateUserRepository = new postgresCreateUserRepository()

        const createdUser = await postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
