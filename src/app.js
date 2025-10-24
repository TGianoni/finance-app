import express from 'express'
import { usersRouter, transactionsRouter } from './routes/index.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// 1. LISTA DE ORIGENS PERMITIDAS
const allowedOrigins = [
    'http://localhost:5173', // Para o ambiente de desenvolvimento local (Vite)
    'https://www.gianoniseguros.com.br', // Seu domínio de produção na Hostinger
]

// 2. CONFIGURAÇÃO E USO DO CORS
app.use(
    cors({
        origin: (origin, callback) => {
            // Permite requisições sem 'origin' (ex: Postman, Docker) ou se a origem estiver na lista
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true)
            }
            // Bloqueia outras origens não autorizadas
            const msg = `CORS blocked: Origin ${origin} not allowed`
            callback(new Error(msg), false)
        },
        // Métodos que sua API usa. OPTIONS é essencial para o preflight.
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true, // Se você usa cookies ou headers de autorização
    }),
)

app.use(express.json())

app.use('/api/users', usersRouter)

app.use('/api/transactions', transactionsRouter)

const swaggerDocument = JSON.parse(
    fs.readFileSync(join(__dirname, '../docs/swagger.json'), 'utf-8'),
)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export { app }
