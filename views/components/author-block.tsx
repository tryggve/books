import { css } from 'hono/css'
import type { FC, PropsWithChildren } from 'hono/jsx'

import { Chevron } from './chevron.tsx'

const authorRow = css`
    position: sticky;
    z-index: 9998;
    top: 71px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 8px 8px 5px;
    background-color: var(--color-background-primary);
    border-bottom: 1px solid var(--color-border-secondary);
    cursor: pointer;
    user-select: none;
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
const authorChildren = css`
    display: none;
    &[data-open] {
        display: block;
    }
`

const chevron = css`
    width: 14px;
    height: 14px;
    transition: transform 0.2s;
    &[data-open] {
        transform: rotate(90deg);
    }
`

function initials(name: string) {
    return name.split(',')[0].split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

export const AuthorBlock: FC<PropsWithChildren<{name: string, count: number, ai: number}>> = ({name, count, children, ai}) => {
    const av = ai % 5
    return (
        <>
            <div class={authorRow} data-component="author-row">
                <div class={authorAvatar} data-stuff={av}>{initials(name)}</div>
                <span class={authorName}>{name}</span>
                <span class={authorCount}>{count} {count !== 1 ? 'böcker' : 'bok'}</span>
                <Chevron className={chevron} />
            </div>
            <div class={authorChildren}>
                {children}
            </div>
        </>
    )
} 
