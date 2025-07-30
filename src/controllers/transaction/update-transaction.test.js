import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction.js'
import { transaction } from './update-transaction.js'

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }
    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return { sut, updateTransactionUseCase }
    }

    const baseHttpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }
    it('should return 200 when updating a transaction sucessfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(baseHttpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })
    it('should return 400 when transaction id is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: { transactionId: 'invalid-id' },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })
    it('should return 400 when unallowed field is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest,
                body: {
                    ...baseHttpRequest.body,
                    unallowed_field: 'unallowed_field',
                },
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })
    it('should return 400 when amount is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest,
                body: {
                    ...baseHttpRequest.body,
                    amount: 'invalid_amount',
                },
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })
})
