import request from 'supertest'
import { app } from '../..'
import { user } from '../tests/fixtures/user.js'

describe('User Router E2E Tests', () => {
    it('POST /api/users should return 201 when user is created', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        expect(response.status).toBe(201)
    })
})
