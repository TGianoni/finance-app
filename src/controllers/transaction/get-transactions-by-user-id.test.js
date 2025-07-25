import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('GetTransactionsByUserIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return [
                {
                    user_id: faker.string.uuid(),
                    name: faker.string.alphanumeric(10),
                    date: faker.date.anytime().toISOString(),
                    type: 'EXPENSE',
                    amount: Number(faker.finance.amount()),
                },
            ]
        }
    }
    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    it('should return 200 when finding transaction by user id sucessfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when missing userId param', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            query: { userId: undefined },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when user id param is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            query: { userId: 'invalid_user_id' },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when user is not found', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        // act
        const result = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 when GetUserByIdUseCase throws generic error', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const result = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        // assert
        expect(result.statusCode).toBe(500)
    })
})
