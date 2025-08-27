import { CreateUserController } from './create-user.js'
import { faker } from '@faker-js/faker'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { user } from '../../tests/index.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute() {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)

        return { createUserUseCase, sut }
    }

    const httpRequest = {
        body: {
            ...user,
            id: undefined, // id should not be provided in the request body
        },
    }

    it('should return 201 when creating a user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
            },
        })

        //assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toStrictEqual(user)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act (Executing the controller with an invalid request)
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                first_name: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: faker.internet.password({
                    length: 5,
                }),
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        // arrange
        const { createUserUseCase, sut } = makeSut()
        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        // arrange
        const { createUserUseCase, sut } = makeSut()
        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error('Internal Server Error')
        })

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)

        // Quando queremos que o useCase lance um erro, você mocka a implementação do método execute
        // para lançar um erro

        // stub x mock = Stub quando cria a classe por completo, mock é quando você pega uma classe
        // que já existe e você altera algum comportamento dela, como o método execute
    })

    it('should return 400 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
        // arrange
        const { createUserUseCase, sut } = makeSut()
        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new EmailAlreadyInUseError(httpRequest.body.email)
        })

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
