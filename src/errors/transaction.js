export class TransactionNotFoundError extends Error {
    constructor(userId) {
        super(`Transaction with ID ${userId} was not found.`)
        this.name = 'TransactionNotFoundError'
    }
}
