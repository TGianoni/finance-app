import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.createUserRepository = createUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
        this.idGeneratorAdapter = idGeneratorAdapter
    }
    async execute(createUserParams) {
        const userWithProvideEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email)

        if (userWithProvideEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        // Gerar ID do usuário
        const userId = await this.idGeneratorAdapter.execute()

        //criptografar a senha
        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        )

        //criar o usuário no banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        const createdUser = await this.createUserRepository.execute(user)

        return createdUser
    }
}
