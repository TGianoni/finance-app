import 'dotenv/config.js'
import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
    user: process.env.POSTGRE_USER,
    password: process.env.POSTGRESPASSWORD,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
})

export const PostgresHelper = {
    query: async (query, params) => {
        const client = await pool.connect()

        const results = await client.query(query, params)

        await client.release()

        return results.rows
    },
}
