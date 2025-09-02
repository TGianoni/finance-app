import { PostgresGetUserByEmailRepository } from './get-user-by-email'
import { user as fakeUser, user } from '../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma'

describe('PostgresGetUserByEmailRepository', () => {
    it('should get user by email on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresGetUserByEmailRepository()

        const result = await sut.execute(user.email)

        expect(result).toStrictEqual(user)
    })
    it('shoudl call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByEmailRepository()

        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(user.email)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                email: user.email,
            },
        })
    })
    it('shoudl throw if prisma throws', async () => {
        const sut = new PostgresGetUserByEmailRepository()
        import.meta.jest
            .spyOn(prisma.user, 'findUnique')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(fakeUser.email)

        expect(promise).rejects.toThrow()
    })
})
