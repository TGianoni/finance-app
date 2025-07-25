import { createUserSchema } from '../../schemas/user.js'
import { badRequest, created, serverError } from '../helpers/index.js'
import { ZodError } from 'zod'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await createUserSchema.parseAsync(params)

            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser) // Retornar o usuário criado

            // Retornar a resposta para o usuário (status code)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }
            console.error(error)
            return serverError()
        }
    }
}
