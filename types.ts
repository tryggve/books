import type { Jwt } from './lib/jwt.ts'
import type { BookRepository } from './repositories/book-repository.ts'
import type { UserRepository } from './repositories/user-respository.ts'

export type Env = {
  Variables: {
    jwt: Jwt
    user: { userId: number, username: string }
    books: BookRepository
    users: UserRepository
  }
}
