import { Hono } from 'hono'
import { createContext } from 'hono/jsx'
import { safeParse, z } from 'zod'

import type { Env } from '../types.ts'
import { requireAuth } from '../middlewares/auth.ts'

import BookList from '../views/book-list.tsx'
import type { AuthorGroup, AuthorType, BookType, SeriesType } from '../views/book-list.tsx'
import { getFlash, setFlash, type MessageFlash } from '../lib/flash.ts'

const NewBookRequestSchema = z.object({
    title: z.string(),
    author: z.preprocess(
        (val) => (val === "" || val === "null" ? null : val),
        z.coerce.number().int().nullable()
    ),
    newAuthor: z.preprocess(
        (val) => (val === "" || val === "null" ? null : val),
        z.string().nullable()
    ),
    newSeries: z.preprocess(
        (val) => (val === "" || val === "null" ? null : val),
        z.string().nullable()
    ),
    series: z.preprocess(
        (val) => (val === "" || val === "null" ? null : val),
        z.coerce.number().int().nullable()
    ),
    order: z.preprocess(
        (val) => (val === "" || val === "0" ? null : val),
        z.coerce.number().int().nullable()
    ),
    year: z.preprocess(
        (val) => (val === "" || val === "0" ? null : val),
        z.coerce.number().int().nullable()
    ),
    owned: z.stringbool().default(false),
    read: z.stringbool().default(false)
}).refine((data) => !data.series || !!data.order, { message: 'Series order is required when book is part of a series', path: ['order'] })

export type NewBookType = z.infer<typeof NewBookRequestSchema>;

const groupByAuthor = (books: BookType[]): AuthorGroup[] => {
    const authorMap: Record<string, AuthorGroup> = {}

    for (const book of books) {
        for (const author of book.authors) {
            if (!authorMap[author.id]) authorMap[author.id] = { name: author.name, series: {}, standalone: [] }
            if (book.series?.length) {
                book.series.map(s => {
                    if (s.primaryAuthorId === author.id) {
                        (authorMap[author.id].series[s.name] ??= []).push({...book, order: s.order})
                    }
                })
            } else {
                authorMap[author.id].standalone.push(book)
            }
        }
    }

    return Object.values(authorMap).sort((a, b) => (a.name.split(' ').pop()! as any) - (b.name.split(' ').pop()! as any))
}

type RepoContextType = {
    authors: AuthorType[], books: BookType[], series: SeriesType[]
}

export const RepoContext = createContext<RepoContextType>({ authors: [], books: [], series: [] })

const index = new Hono<Env>()

index.get('/', requireAuth, async (c) => {
    const { userId } = c.get('user')
    const bookRepo = c.get('books')
    const userBooks = await bookRepo.getUserBooksWithRelations(userId)
    const authors = await bookRepo.getAuthors()
    const repoSeries = await bookRepo.getSeries()

    const { message } = getFlash<MessageFlash>(c)

    const books = userBooks.map(b => ({
        id: b.book_id,
        title: b.title,
        authors: b.authors.map(a => ({ id: a.id, name: a.name, sortName: a.sort_name })),
        series: b.series.map(s => ({ id: s.id, name: s.name, order: s.series_order, primaryAuthorId: s.primary_author_id })),
        owned: b.owned,
        read: b.read,
        yearPublished: b.year_published
    } as BookType))

    const series = repoSeries.map(s => ({
        id: s.id,
        name: s.name,
        primaryAuthorId: s.primary_author_id,
        nextPart: s.next_part
    } as SeriesType))

    return c.html(
        <>
            <RepoContext value={{authors, books, series }}>
                <BookList books={groupByAuthor(books)} message={message} />
            </RepoContext>
        </>
    )
})

index.post('/books',
    requireAuth,
    async (c) => {
        const stuff = await c.req.formData()
        const { success, data, error } = safeParse(NewBookRequestSchema, Object.fromEntries(stuff.entries()))
        if (!success) {
            console.log(error)
            setFlash<MessageFlash>(c, { message: 'Någonting gick fel' })
            return c.redirect('/')
        }

        const { userId } = c.get('user')
        await c.get('books').insertNewBookForUser(userId, data)

        setFlash<MessageFlash>(c, { message: `${data.title} sparades` })

        return c.redirect('/')
    }
)

export default index