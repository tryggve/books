import pg from 'pg'
import { NewBookType } from '../routes/index.tsx'

interface Book {
    id: number
    title: string
    year_published: string
    isbn: string
}

interface Author {
    id: number
    name: string
    sort_name: string | null
}

interface Series {
    id: number
    name: string
    description: string
    primary_author_id: number
    next_part: number
}

interface BookSeries {
    id: number
    name: string
    series_order: number | null
    primary_author_id: number
}

interface BookAuthor {
    author_id: number
    book_id: number
}

interface UserBooks {
    book_id: number
    owned: boolean
    read: boolean
}

interface BookResult {
    book_id: number
    title: string
    isbn: string | null
    year_published: number | null
    owned: boolean
    read: boolean
    authors: Author[]
    series: BookSeries[]
}

interface IncomingBook {
    title: string;
    part: number | null;
    year: number | null;
    owned: boolean;
    read: boolean;
}

interface IncomingSeries {
    name: string;
    books: IncomingBook[];
}

interface IncomingAuthor {
    name: string;
    series: IncomingSeries[];
}

const createBookRepository = (db: pg.Pool) => ({
    getBooks: async () => {
        const result = await db.query<Book>('SELECT * from books')
        return result.rows
    },
    getAuthors: async () => {
        const result = await db.query<Author>('SELECT * from authors ORDER BY name ASC')
        return result.rows
    },
    insertAuthor: async (author: { name: string, sortName: string | null }) => {
        const result = await db.query<Author>('INSERT INTO authors (name, sort_name) VALUES ($1, $2) RETURNING *', [author.name, author.sortName])
        return result.rows[0]
    },
    getSeries: async () => {
        const result = await db.query<Series>('SELECT s.id, s.name, s.description, s.primary_author_id, MAX(bs.series_order) + 1 as next_part from series s LEFT JOIN book_series bs on s.id = bs.series_id GROUP BY s.id, s.name ORDER BY s.id')
        return result.rows
    },
    insertSeries: async (series: { name: string, description: string | null, primaryAuthorId: number }) => {
        const result = await db.query<Series>('INSERT INTO series (name, description, primary_author_id) VALEUS ($1, $2, $3) RETURNING *', [ series.name, series.description, series.primaryAuthorId ])
        return result.rows[0]
    },
    getUserBooks: async (userId: number) => {
        const result = await db.query<UserBooks>(
            'SELECT * from user_books WHERE user_id = $1',
            [userId]
        )
        return result.rows
    },
    getUserBooksWithRelations: async (userId: number) => {
        const query = `
SELECT
    b.id              AS book_id,
    b.title,
    b.year_published,
    ub.owned,
    ub.read,
    JSON_AGG(
        JSON_BUILD_OBJECT('id', a.id, 'name', a.name, 'sort_name', a.sort_name)
        ORDER BY a.sort_name
    ) AS authors,
    CASE
        WHEN bs.series_id IS NULL THEN '[]'
        ELSE JSON_AGG(
            JSON_BUILD_OBJECT('id', s.id, 'name', s.name, 'series_order', bs.series_order, 'primary_author_id', s.primary_author_id)
            ORDER BY s.name
        )
    END AS series
FROM user_books ub
JOIN books b        ON b.id = ub.book_id
LEFT JOIN book_series bs ON bs.book_id = b.id
LEFT JOIN series s  ON s.id = bs.series_id
JOIN book_authors ba ON ba.book_id = b.id
JOIN authors a      ON a.id = ba.author_id
WHERE ub.user_id = $1
GROUP BY
    b.id, b.title, b.year_published,
    a.sort_name, a.name,
    s.name, ub.owned, ub.read, bs.series_id
ORDER BY
    LOWER(COALESCE(a.sort_name, SPLIT_PART(a.name, ' ', -1)))
`

        const results = await db.query<BookResult>(query, [userId])
        return results.rows
    },
    insertBookInSeriesWithAuthorForUser: async (userId: number, authors: IncomingAuthor[]) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN')

            for (const author of authors) {
                const authorRes = await client.query<{ id: number }>(
                    `INSERT INTO authors (name)
                     VALUES ($1)
                     RETURNING id`,
                    [author.name]
                );
                const authorId = authorRes.rows[0].id;

                for (const series of author.series) {
                    let seriesId
                    if (series.name != '_standalone') {
                        const seriesRes = await client.query<{ id: number }>(
                            `INSERT INTO series (name, primary_author_id)
                             VALUES ($1, $2)
                             RETURNING id`,
                            [series.name, authorId]
                        );
                        seriesId = seriesRes.rows[0].id;
                    }

                    for (const book of series.books) {
                        const bookRes = await client.query(
                            `INSERT INTO books (title, year_published)
                             VALUES ($1, $2)
                             RETURNING id`,
                            [book.title, book.year]
                        );

                        const bookId = bookRes.rows[0].id

                        await client.query(`INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)`, [bookId, authorId])
                        if (series.name != '_standalone') await client.query(`INSERT INTO book_series (book_id, series_id, series_order) VALUES ($1, $2, $3)`, [bookId, seriesId, book.part])
                        await client.query(`INSERT INTO user_books (user_id, book_id, owned, read) VALUES ($1, $2, $3, $4)`, [userId, bookId, book.owned, book.read])
                    }
                }
              }

            await client.query('COMMIT')
        } catch (e) {
            console.log(e)
            await client.query('ROLLBACK')
        } finally {
            client.release()
        }
    },
    insertNewBookForUser: async (userId: number, newBookStuff: NewBookType) => {
        const client = await db.connect()
        try {
            await client.query('BEGIN')
            const bookRes = await client.query<Book>(
                `INSERT INTO books (title, year_published)
                 VALUES ($1, $2)
                 RETURNING id`,
                [newBookStuff.title, newBookStuff.year]
            );

            const bookId = bookRes.rows[0].id

            if (newBookStuff.newAuthor) {
                const authorRes = await client.query<Author>('INSERT INTO authors (name) VALUES ($1)', [newBookStuff.newAuthor])
                newBookStuff.author = authorRes.rows[0].id
            }

            await client.query<BookAuthor>(`INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)`, [bookId, newBookStuff.author])

            if (newBookStuff.newSeries) {
                const seriesRes = await client.query<Series>('INSERT INTO series (name, primary_author_id) VALUES ($1,$2)', [newBookStuff.newSeries, newBookStuff.author])
                newBookStuff.series = seriesRes.rows[0].id
            }

            if (newBookStuff.series) {
                await client.query<BookSeries>(`INSERT INTO book_series (book_id, series_id, series_order) VALUES ($1, $2, $3)`, [bookId, newBookStuff.series, newBookStuff.order])
            }

            await client.query<UserBooks>(`INSERT INTO user_books (user_id, book_id, owned, read) VALUES ($1, $2, $3, $4)`, [userId, bookId, newBookStuff.owned, newBookStuff.read])

            await client.query('COMMIT')
        } catch (e) {
            console.log(e)
            await client.query('ROLLBACK')
        } finally {
            client.release()
        }
    }
})

export type BookRepository = ReturnType<typeof createBookRepository>
export default createBookRepository