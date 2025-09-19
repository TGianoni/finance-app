import { CreateUserUseCase } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'
import { user as fixtureUser } from '../../tests/index.js'

describe('Create User Use Case', () => {
    const user = {
        ...fixtureUser,
        id: undefined, // id will be generated
    }
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class CreateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'generated_id'
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
            tokensGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
            tokensGeneratorAdapter,
        }
    }
    it('Should successfully create user', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const createdUser = await sut.execute(user)

        // assert
        expect(createdUser).toBeTruthy()
        expect(createdUser.tokens.accessToken).toBeDefined()
        expect(createdUser.tokens.refreshToken).toBeDefined()
    })
    it('shoudl throw an EmailAlreadyInUseErro if GetUserByEmailRepository returns a user', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockReturnValueOnce(user)

        // act
        const promise = sut.execute(user)

        // assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })
    it('should call IdGeneratorAdapter to generate a random id', async () => {
        // arrange
        const { sut, idGeneratorAdapter, createUserRepository } = makeSut()
        const idGeneratorSpy = import.meta.jest.spyOn(
            idGeneratorAdapter,
            'execute',
        )
        const createUserRepositorySpy = import.meta.jest.spyOn(
            createUserRepository,
            'execute',
        )

        // act
        await sut.execute(user)

        // assert
        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })
    it('should call PasswordHasherAdapter to cryptograph password', async () => {
        // arrange
        const { sut, passwordHasherAdapter, createUserRepository } = makeSut()
        const passwordHasherSpy = import.meta.jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )
        const createUserRepositorySpy = import.meta.jest.spyOn(
            createUserRepository,
            'execute',
        )

        // act
        await sut.execute(user)

        // assert
        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })
    it('should throw if GetUserByEmailRepository throws', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(user)

        // assert
        await expect(promise).rejects.toThrow()
    })
    it('should throw if IdGeneratorAdapter throws', async () => {
        // arrange
        const { sut, idGeneratorAdapter } = makeSut()
        import.meta.jest
            .spyOn(idGeneratorAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        // act
        const promise = sut.execute(user)

        // assert
        await expect(promise).rejects.toThrow()
    })
    it('should throw if PasswordHasherAdapter throws', async () => {
        // arrange
        const { sut, passwordHasherAdapter } = makeSut()
        import.meta.jest
            .spyOn(passwordHasherAdapter, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(user)

        // assert
        await expect(promise).rejects.toThrow()
    })
    it('should throw if CreateUserReposotory throws', async () => {
        // arrange
        const { sut, createUserRepository } = makeSut()
        import.meta.jest
            .spyOn(createUserRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(user)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
