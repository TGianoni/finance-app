import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId) {
        return await prisma.transactions.findMany({
            where: {
                id: userId,
            },
        })
    }
}
