import { faker } from '@faker-js/faker'
import { GetUserByIdController } from '../../controllers/user/get-user-by-id.js'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            }
        }
    }

    const makeSut = () => {
        const getUserbyIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserbyIdUseCase)

        return { sut, getUserbyIdUseCase }
    }
    it('should return 200 if user is found', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if userId is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: { userId: 'invalid-id' },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found', async () => {
        // arrange
        const { sut, getUserbyIdUseCase } = makeSut()
        jest.spyOn(getUserbyIdUseCase, 'execute').mockReturnValueOnce(null)

        // act
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        // assert
        expect(result.statusCode).toBe(404)
    })
})
