import {
    CreateTransactionController,
    DeleteTransactionController,
    UpdateTransactionController,
} from '../../controllers/index.js'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeUpdateTransactionController,
} from './transaction.js'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', async () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
    it('should return a valid updateTransactionController instance', async () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })
    it('should return a valid deleteTransactionController instance', async () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        )
    })
})
