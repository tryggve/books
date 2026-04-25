import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'

const KEYLEN = 64

const hashPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const salt = randomBytes(16).toString('hex')
        scrypt(password, salt, KEYLEN, (err, derivedKey) => {
            if (err) reject(err)
            else resolve(`${salt}:${derivedKey.toString('hex')}`)
        })
    })
}

const verifyPassword = (password: string, hash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const [ salt, storedKey ] = hash.split(':')
        scrypt(password, salt, KEYLEN, (err, derivedKey) => {
            if (err) reject(err)
            else resolve(timingSafeEqual(Buffer.from(storedKey, 'hex'), derivedKey))
        })
    })
}

export { hashPassword, verifyPassword }