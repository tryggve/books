import pg from 'pg'
import { hashPassword } from '../lib/password.ts'

const createUserRepository = (db: pg.Pool) => ({
    createUser: async (username: string, password: string) => {
        const passwordHash = await hashPassword(password)
        const res = await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
           [username, passwordHash]
        )
        return res.rows[0]
    },
    findByUsername: async (username: string) => {
        const res = await db.query(
            'SELECT * from users WHERE username = $1',
            [username]
        )
        return res.rows[0] ?? null
    }
})

export type UserRepository = ReturnType<typeof createUserRepository>
export default createUserRepository