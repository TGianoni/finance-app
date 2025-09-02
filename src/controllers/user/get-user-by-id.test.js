import { faker } from '@faker-js/faker'
import { GetUserByIdController } from '../../controllers/user/get-user-by-id.js'
import { user } from '../../tests/index.js'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserbyIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserbyIdUseCase)

        return { sut, getUserbyIdUseCase }
    }

    const baseHttpRequest = {
        params: { userId: faker.string.uuid() },
    }
    it('should return 200 if user is found', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(baseHttpRequest)

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
        import.meta.jest
            .spyOn(getUserbyIdUseCase, 'execute')
            .mockReturnValueOnce(null)

        // act
        const result = await sut.execute(baseHttpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdUseCase throws', async () => {
        // arrange
        const { sut, getUserbyIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserbyIdUseCase, 'execute')
            .mockRejectedValue(new Error())

        // act
        const result = await sut.execute(baseHttpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })
    it('shoudl call GetUserByIdUseCase with correct params', async () => {
        // arrange
        const { sut, getUserbyIdUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(getUserbyIdUseCase, 'execute')

        // act
        await sut.execute(baseHttpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.params.userId)
    })
})
