import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'
import { transaction } from '../../tests/index.js'

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
        }
    }
    it('should delete a transaction sucessfully', async () => {
        // arrange
        const { sut } = makeSut()
        const id = faker.string.uuid()

        // act
        const result = await sut.execute(id)

        // assert
        expect(result).toEqual(transaction)
    })
    it('should call DeleteTransactionRepository with correct params', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        const id = faker.string.uuid()

        // act
        await sut.execute(id)

        // assert
        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(id)
    })
    it('should throw if DeleteTransactionRepository throws', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const id = faker.string.uuid()

        // act
        const promise = sut.execute(id)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
