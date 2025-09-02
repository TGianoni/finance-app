import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user'
import { user } from '../../tests/index.js'

describe('GetTransactionsByUserIdUseCase', () => {
    class GetTransactionByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionByUserIdRepository =
            new GetTransactionByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionByUserIdRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getTransactionByUserIdRepository,
            getUserByIdRepository,
        }
    }
    it('should get transactions by user id successfully', async () => {
        // arrange
        const { sut } = makeSut()
        const userId = faker.string.uuid()

        // act
        const result = await sut.execute(userId)

        // assert
        expect(result).toEqual([])
    })
    it('should throw UserNotFoundError if user does not exist', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null)
        const id = faker.string.uuid()

        // act
        const promise = sut.execute(id)

        // assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(id))
    })
    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        const id = faker.string.uuid()

        // act
        await sut.execute(id)

        // assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(id)
    })
    it('should call GetTransactionByUserId with correct params', async () => {
        // arrange
        const { sut, getTransactionByUserIdRepository } = makeSut()
        const getTransactionByUserIdRepositorySpy = import.meta.jest.spyOn(
            getTransactionByUserIdRepository,
            'execute',
        )
        const userId = faker.string.uuid()

        // act
        await sut.execute(userId)

        // assert
        expect(getTransactionByUserIdRepositorySpy).toHaveBeenCalledWith(userId)
    })
    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const id = faker.string.uuid()

        // act
        const promise = sut.execute(id)

        // assert
        await expect(promise).rejects.toThrow()
    })
    it('should throw if GetTransactionByUserIdRespository throws', async () => {
        // arrange
        const { sut, getTransactionByUserIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getTransactionByUserIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const id = faker.string.uuid()

        // act
        const promise = sut.execute(id)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
