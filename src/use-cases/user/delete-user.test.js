import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user.js'

describe('DeleteUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserRepository)

        return {
            sut,
            deleteUserRepository,
        }
    }
    it('should sucessfully delete a user', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid())

        // assert
        expect(result).toEqual(user)
    })
})
