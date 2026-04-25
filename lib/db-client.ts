import pg from 'pg'

interface DbClientParams {
    user?: string
    password?: string
    host?: string
    port?: number
    database?: string
}

const createDbClient = ({ user, password, host, port, database }: DbClientParams) => {
    const pool = new pg.Pool({
        user,
        password,
        host,
        port,
        database
    })

    return pool
}

export default createDbClient