import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'
import { transaction } from '../../tests/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }
    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return { sut, deleteTransactionUseCase }
    }

    it('should return 200 when deleting a transaction sucessfully', async () => {
        // arange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        })

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if transctionId is invalid', async () => {
        // arange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: {
                transactionId: 'invalid-id',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 when  transction is notFound', async () => {
        // arange
        const { sut, deleteTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError())

        // act
        const result = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        })

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when DeleteTransactionUseCase throws', async () => {
        // arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error('Internal Server Error'))

        // act
        const result = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        })

        // assert
        expect(result.statusCode).toBe(500)
    })
    it('should call DeleteTransactionUseCase with correct params', async () => {
        // arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionUseCase,
            'execute',
        )

        const transactionId = faker.string.uuid()

        // act
        await sut.execute({
            params: {
                transactionId,
            },
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(transactionId)
    })
})
