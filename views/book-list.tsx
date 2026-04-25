import type { FC } from 'hono/jsx'
import { css, keyframes } from 'hono/css'
import Layout from './layout.tsx'
import FilterButtons from './components/filter-buttons.tsx'
import { Tools } from './components/tools.tsx'
import Book from './components/book.tsx'
import { AuthorBlock } from './components/author-block.tsx'
import { SeriesBlock } from './components/series-block.tsx'
import BookForm from './components/book-form.tsx'
import CloseButton from './components/close-button.tsx'
import Message from './components/message.tsx'

export type AuthorGroup = {
    name: string
    series: Record<string, (BookType & { order: number })[]>
    standalone: BookType[]
}

export type BookAuthor = {
    id: number
    name: string
    sortName: string | null
}

export type BookSeries = {
    id: number
    name: string
    order: number
    primaryAuthorId: number
}

export type BookType = {
    id: number
    title: string
    authors: BookAuthor[]
    series: BookSeries[]
    owned: boolean
    read: boolean
    yearPublished: number
}

export type AuthorType = {
    id: number
    name: string
    sortName?: string | null
}

export type SeriesType = {
    id: number
    name: string
    primaryAuthorId: number
    nextPart: number
}

const main = css`
    margin: 0 auto;
    max-width: 555px;
    background-color: var(--color-background-primary);
`

const ul = css`
    list-style-type: none;
`

const toolBar = css`
    position: sticky;
    top: 0;
    padding: 20px 10px;
    margin-bottom: 10px; 
    z-index:9999;
    display: flex;
    justify-content: space-between;
    background-color: var(--color-background-primary);
`

const fadein = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: revert-rule;
  }
`

const dialog = css`
    position: fixed;
    top: 35%;
    transform: translateY(-35%);
    margin: 0 auto;
    max-width: 555px;
    border: none;
    border-radius: 20px;

    &[open] {
        animation: ${fadein} 200ms ease-in forwards;
    }
    &[open]::backdrop {
        animation: fadein 100ms ease-in forwards;
        opacity: 0.75;
    }

    &::backdrop {
        background-color: var(--color-background-tertiary);
        opacity: 0.75;
    }
`

const dialogContainer = css`
    display: flex;
    flex-direction: column;
`
const spineColors = ['#AFA9EC', '#5DCAA5', '#F0997B', '#85B7EB', '#FAC775', '#97C459', '#ED93B1'];

type Props = { books: AuthorGroup[], message?: string }

const BookList: FC<Props> = ({ books, message }) => (
    <Layout title="Mina Böcker" script='/static/index.js'>
        <main class={main}>
            {message && <Message>{message}</Message>}
            <div class={toolBar}>
                <FilterButtons />
                <Tools />
            </div>
            <ul class={ul}>
                {books.map((a, ai) => (
                    <li key={a.name}>
                        <AuthorBlock name={a.name} count={Object.values(a.series).reduce((acc, curr) => acc += curr.length, 0) + a.standalone.length} ai={ai}>
                            {Object.entries(a.series).map(([name, books], si) => (
                                <SeriesBlock name={name} count={books.length}>
                                    {books.sort((a, b) => a.order - b.order).map((book) => (
                                        <Book key={book.id} book={{...book, seriesOrder: book.order }} spineColor={spineColors[si % spineColors.length]} />
                                    ))}
                                </SeriesBlock>
                            ))}
                            <SeriesBlock name={"Fristående"} count={(a.standalone.length)}>
                                {a.standalone.map((book, bi) => (
                                    <Book key={book.id} book={book} spineColor={`${spineColors[bi % spineColors.length]}`} />
                                ))}
                            </SeriesBlock>
                        </AuthorBlock>
                    </li>
                ))}
            </ul>
            <dialog id="add-form" class={dialog}>
                <div class={dialogContainer}>
                    <BookForm closeButton={<CloseButton commandfor="add-form" />}/>
                </div>
            </dialog>
        </main>
    </Layout>
)

export default BookList