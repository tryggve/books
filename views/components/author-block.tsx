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
        right: 13px;
        display: inline-block;
        border-right: 1.5px solid var(--color-text-primary);
        border-bottom: 1.5px solid var(--color-text-primary);
        border-radius: 1px;
        width: 5.5px;
        height: 5.5px;
        transform: rotate(-45deg);
        transition: transform 0.2s;
    }
`

const authorBlock = css`
    &[open] > ${authorRow} {
        &::after {
            transform: rotate(45deg);
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
    &[data-stuff='0'] {
        background-color: #eeedfe;
        color: #3c3489;
    }
    &[data-stuff='1'] {
        background-color: #e1f5ee;
        color: #085041;
    }
    &[data-stuff='2'] {
        background-color: #faece7;
        color: #712b13;
    }
    &[data-stuff='3'] {
        background-color: #e6f1fb;
        color: #0c447c;
    }
    &[data-stuff='4'] {
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

export const AuthorBlock: FC<PropsWithChildren<{name: string, count: number, ai: number}>> = ({name, count, children, ai}) => {
    const av = ai % 5
    return (
        <details class={authorBlock}>
            <summary class={authorRow}>
                <span class={authorAvatar} data-stuff={av}>{initials(name)}</span>
                <span class={authorName}>{name}</span>
                <span class={authorCount}>{count} {count !== 1 ? 'böcker' : 'bok'}</span>
            </summary>
            {children}
        </details>
    )
} 
