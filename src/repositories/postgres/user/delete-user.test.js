import { prisma } from '../../../../prisma/prisma.js'
import { PostgresDeleteUserRepository } from './delete-user.js'
import { user } from '../../../tests/index.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { UserNotFoundError } from '../../../errors/user.js'

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
        await prisma.user.create({ data: user })
        const deleteSpy = jest.spyOn(prisma.user, 'delete')
        const sut = new PostgresDeleteUserRepository()

        await sut.execute(user.id)

        expect(deleteSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })
    it('should throw generic error if Prisma throws generic error', async () => {
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
    it('should throw UserNotFoundError if Prisma does not find record to delete', async () => {
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })
})
