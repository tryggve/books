import type { FC } from "hono/jsx";
import { css } from "hono/css";
import { EditBookForm } from "./book-form.tsx";

const badgeStyle = css`
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 99px;
    border: 0.5px solid;
    white-space: nowrap;
`
const badgeReadStyle = css`
    ${badgeStyle}
    background: #EAF3DE;
    color: #27500A;
    border-color: #97C459;
`
const badgeOwnedStyle = css`
    ${badgeStyle}
    background: #E6F1FB;
    color: #0C447C; 
    border-color: #85B7EB;
`
const badgesContainerStyle = css`
    display: flex;
    gap: 6px;
    flex-shrink: 0;
`
const bookRowStyle = css`
    appearance: none;
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    color: inherit;
    text-align: left;
    width: 100%;

    display: flex;
    align-items: center;
    gap: 20px;
    padding: 10px 8px 10px 20px;
    border-bottom: 0.5px solid var(--color-border-tertiary);
    &:last-child {
        border-bottom: none;
    }
`
const bookSpineStyle = css`
    width: 4px;
    height: 38px;
    border-radius: 2px;
    flex-shrink: 0;
    &[data-spine-color='0'] {
        background-color: #afa9ec;
    }
    &[data-spine-color='1'] {
        background-color: #5dcaa5;
    }
    &[data-spine-color='2'] {
        background-color: #f0997b;
    }
    &[data-spine-color='3'] {
        background-color: #85b7eb;
    }
    &[data-spine-color='4'] {
        background-color: #fac775;
    }
    &[data-spine-color='5'] {
        background-color: #97c459;
    }
    &[data-spine-color='6'] {
        background-color: #ed93b1;
    }
`
const bookInfoStyle = css`
    flex: 1;
    min-width: 0;
`
const bookTitleStyle = css`
    font-weight: 500;
    font-size: 14px;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
const bookAuthorStyle = css`
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-top: 2px;
`
const bookNumberStyle = css`
    font-size: 11px;
    color: var(--color-text-tertiary);
`

const popover = css`
    border: 2px solid var(--color-border-secondary);
    border-radius: 8px;
    background-color: var(--color-background-primary);
    padding: 20px;
    position-area: block-start;
    position-try-fallbacks: block-end;
    display: none;
    opacity: 0;
    transition: opacity 300ms, display 300ms allow-discrete, overlay 300ms allow-discrete;
    &:popover-open {
        display: block;
        opacity: 1;

        @starting-style {
            opacity: 0;
        }
    }
`

export type SingleBookType = {
    id: number
    title: string
    authors: {id: number, name: string}[]
    seriesOrder?: number
    owned: boolean
    read: boolean
}

const Book: FC<{ book: SingleBookType, spineColor: number }> = ({book, spineColor}) => {
    const readBadge = book.read
        ? <span class={badgeReadStyle}>Läst</span>
        : null
    const ownedBadge = book.owned
        ? <span class={badgeOwnedStyle}>Har</span>
        : null
    const numLabel = book.seriesOrder
        ? <div class={bookNumberStyle}>Del {book.seriesOrder}</div>
        : null

    const popoverId = `book-${book.id}`
    return (
        <>
        <button popovertarget={popoverId} class={bookRowStyle} data-component="book-row" data-read={book.read} data-owned={book.owned} style={`anchor-name: --anchor_${popoverId};`}>
            <div class={bookSpineStyle} data-spine-color={spineColor}></div>
            <div class={bookInfoStyle}>
                <div class={bookTitleStyle}>{book.title}</div>
                <div class={bookAuthorStyle}>{book.authors.map(({name}) => name).join(', ')}</div>
                {numLabel}
            </div>
            <div class={badgesContainerStyle}>{readBadge}{ownedBadge}</div>
        </button>
        <div popover={'auto'} id={popoverId} class={popover} style={`position-anchor: --anchor_${popoverId}`}>
            <EditBookForm book={book} />
        </div>
        </>
    )
}

export default Book