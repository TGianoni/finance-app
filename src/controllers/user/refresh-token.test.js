import { UnauthorizedError } from '../../errors'
import { RefreshTokenController } from './refresh-token'

describe('RefreshTokenController', () => {
    class RefreshTokenUseCaseStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }
    const makeSut = () => {
        const refreshTokenUseCase = new RefreshTokenUseCaseStub()
        const sut = new RefreshTokenController(refreshTokenUseCase)

        return { refreshTokenUseCase, sut }
    }
    it('should return 400 if refresh token is invalid', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                refreshToken: 2,
            },
        }
        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
    it('should return 200 if refresh token is valid', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                refreshToken: 'any_refresh_token',
            },
        }
        const result = await sut.execute(httpRequest)
        expect(result.statusCode).toBe(200)
    })
    it('shoudl return 401 if use case throws UnauthorizedError', async () => {
        const { sut, refreshTokenUseCase } = makeSut()
        import.meta.jest
            .spyOn(refreshTokenUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new UnauthorizedError()
            })
        const httpRequest = {
            body: {
                refreshToken: '1',
            },
        }
        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(401)
    })
})
