import type { FC } from 'hono/jsx'
import { css, keyframes } from 'hono/css'
import FilterButtons from './components/filter-buttons.tsx'
import { Tools } from './components/tools.tsx'
import Book from './components/book.tsx'
import { AuthorBlock } from './components/author-block.tsx'
import { SeriesBlock } from './components/series-block.tsx'
import BookForm from './components/book-form.tsx'
import CloseButton from './components/close-button.tsx'
import Message from './components/message.tsx'

export type AuthorGroup = {
    id: number
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
const toolBar = css`
    position: sticky;
    top: 0;
    padding: 20px 10px;
    z-index:9999;
    display: flex;
    justify-content: space-between;
    background-color: var(--color-background-primary);
    transition: box-shadow .15s cubic-bezier(0.4, 0, 0.2, 1);

    &[data-stuck] {
        box-shadow: 0 3px 2px -2px rgba(0, 0, 0, .1);
    }
`
const sentinel = css`
    height: 0px;
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
    width: 100%;
    max-width: 555px;
    border: none;
    border-radius: 20px;
    overscroll-behavior: contain;

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

const spineColorLength = 7

const BookList: FC<{ books: AuthorGroup[], message?: string }> = ({ books, message }) => (
    <main class={main}>
        { message && <Message>{message}</Message> }
        <div class={sentinel} data-component='sentinel'></div>
        <div class={toolBar} data-component='toolbar'>
            <FilterButtons />
            <Tools />
        </div>
        <div data-component='book-list'>
            {books.map((a, ai) => (
                <AuthorBlock key={a.name} name={a.name} count={Object.values(a.series).reduce((acc, curr) => acc += curr.length, 0) + a.standalone.length} ai={ai}>
                    {Object.entries(a.series).map(([name, books], si) => (
                        <SeriesBlock name={name} count={books.length}>
                            {books.sort((a, b) => a.order - b.order).map((book) => (
                                <Book key={book.id} book={{...book, seriesOrder: book.order }} spineColor={si % spineColorLength} />
                            ))}
                        </SeriesBlock>
                    ))}
                    <SeriesBlock name={"Fristående"} count={(a.standalone.length)}>
                        {a.standalone.map((book, bi) => (
                            <Book key={book.id} book={book} spineColor={bi % spineColorLength} />
                        ))}
                    </SeriesBlock>
                </AuthorBlock>
            ))}
        </div>
        <dialog id="add-form" class={dialog}>
            <div class={dialogContainer}>
                <BookForm closeButton={<CloseButton commandfor="add-form" />}/>
            </div>
        </dialog>
    </main>
)

export default BookList
