import { prisma } from '../../../../prisma/prisma.js'
import { PostgresDeleteUserRepository } from './delete-user.js'
import { user } from '../../../tests/index.js'

describe('PostgresDeleteUserRepository', () => {
    it('should delete a user on db', async () => {
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresDeleteUserRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })
    it('should call prisma with correct params', async () => {
        const deleteSpy = jest.spyOn(prisma.user, 'delete')
        const sut = new PostgresDeleteUserRepository()

        await sut.execute(user.id)

        expect(deleteSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })
})
