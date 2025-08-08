import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './create-transaction.js'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        user_id: faker.string.uuid(),
        name: faker.string.alphanumeric(10),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }
    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }
    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }
    class IdGeneratorAdapterStub {
        execute() {
            return 'valid_user_id'
        }
    }
    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        }
    }
    it('should create a transaction sucessfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(createTransactionParams)

        // assert
        expect(result).toEqual({
            ...createTransactionParams,
            id: 'valid_user_id',
        })
    })
    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        // act
        await sut.execute(createTransactionParams)

        // assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })
    it('should call IdGeneratorAdapter', async () => {
        // arrange
        const { sut, idGeneratorAdapter } = makeSut()
        const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        // act
        await sut.execute(createTransactionParams)

        // assert
        expect(idGeneratorAdapterSpy).toHaveBeenCalledWith()
    })
    it('should call CreateTransactionRepository with correct params', async () => {
        // arrange
        const { sut, createTransactionRepository } = makeSut()
        const createTransactionRepositorySpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        )

        // act
        await sut.execute(createTransactionParams)

        // assert
        expect(createTransactionRepositorySpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'valid_user_id',
        })
    })
})
