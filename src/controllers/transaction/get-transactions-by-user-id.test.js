import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'

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
})
