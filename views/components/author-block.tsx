import { css } from 'hono/css'
import type { FC, PropsWithChildren } from 'hono/jsx'

const authorRow = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    position: sticky;
    top: 73px;
    z-index: 9998;
    background-color: var(--color-background-primary);
    cursor: pointer;
    user-select: none;
    padding: 20px 32px 8px 5px;
    border-bottom: 1px solid var(--color-border-secondary);
    &::after {
        content: "";
        position: absolute;
        right: 8px;
        display: inline-block;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='5,3 9,7 5,11' /%3E%3C/svg%3E");
        background-repeat: no-repeat;
        width: 14px;
        height: 14px;
        transition: transform 0.2s;
    }
`

const authorBlock = css`
    &[open] > ${authorRow} {
        &::after {
            transform: rotate(90deg);
        }
    }

    &:last-child:not([open]) {
        ${authorRow} {
            border-color: transparent;
        }
    }
`
const authorAvatar = css`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 500;
    flex-shrink: 0;
    &[data-av='0'] {
        background-color: #eeedfe;
        color: #3c3489;
    }
    &[data-av='1'] {
        background-color: #e1f5ee;
        color: #085041;
    }
    &[data-av='2'] {
        background-color: #faece7;
        color: #712b13;
    }
    &[data-av='3'] {
        background-color: #e6f1fb;
        color: #0c447c;
    }
    &[data-av='4'] {
        background-color: #faeeda;
        color: #633806;
    }
`
const authorName = css`
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-primary);
    flex: 1;
`
const authorCount = css`
    font-size: 11px;
    color: var(--color-text-tertiary);
`

function initials(name: string) {
    return name.split(',')[0].split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

export const AuthorBlock: FC<PropsWithChildren<{authorId: number, name: string, count: number, ai: number}>> = ({authorId, name, count, children, ai}) => {
    const av = ai % 5
    return (
        <details class={authorBlock} data-component='author-block' data-author-id={authorId}>
            <summary class={authorRow}>
                <span class={authorAvatar} data-av={av}>{initials(name)}</span>
                <span class={authorName}>{name}</span>
                <span class={authorCount}>{count} {count !== 1 ? 'böcker' : 'bok'}</span>
            </summary>
            {children}
        </details>
    )
} 
