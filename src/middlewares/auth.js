import jwt from 'jsonwebtoken'

export const auth = (request, response, next) => {
    try {
        // pegar o access token do header
        const accessToken = request.headers?.authorization?.split('Bearer ')[1]
        if (!accessToken) {
            return response.status(401).send({ message: 'Unauthorized' })
        }

        // verificar se o access token é válido
        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        )
        if (!decodedToken) {
            return response.status(401).send({ message: 'Unauthorized' })
        }
        request.userId = decodedToken.userId

        // se for válido, deixar a requisição continuar
        next()

        // se não for válido, retornar um erro 401
    } catch (error) {
        console.log(error)
        return response.status(401).send({ message: 'Unauthorized' })
    }
}
