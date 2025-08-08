import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'

describe('GetTransactionsByUserIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }
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
})
