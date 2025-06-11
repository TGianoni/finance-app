import { PostgresHelper } from '../../helper'

export class PostgresCreateUserRepository {
    async execute(createUserParams) {
        //create user in postgres database
        const results = await PostgresHelper.query(
            'INSERT INTO users (ID, first_name, last_name, e-mail, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
            [
                createUserParams.ID,
                createUserParams.first_name,
                createUserParams.last_name,
                createUserParams.email,
                createUserParams.password,
            ],
        )

        return results.rows[0] // Return the created user
    }
}
