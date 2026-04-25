import { css } from 'hono/css'
import type { FC, PropsWithChildren } from 'hono/jsx'


const authorBlock = css`margin-bottom: 28px;`
const authorRow = css`position: sticky; z-index: 9998; top: 71px; display: flex; align-items: center; gap: 10px; padding: 0 8px 0 5px; background-color: var(--color-background-primary); padding-bottom: 8px; border-bottom: 1px solid var(--color-border-secondary); cursor: pointer; user-select: none;`
const authorAvatar = css`width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; flex-shrink: 0;`
const authorName = css`font-size: 15px; font-weight: 500; color: var(--color-text-primary); flex: 1;`
const authorCount = css`font-size: 11px; color: var(--color-text-tertiary);`
const authorChildren = css`display: none;`
const authorChildrenOpen = css`display: block;`

const chevron = css`width: 14px; height: 14px; transition: transform 0.2s;`
const chevronOpen = css`transform: rotate(90deg);`

const avatarColors = [
    { bg: '#EEEDFE', color: '#3C3489' },
    { bg: '#E1F5EE', color: '#085041' },
    { bg: '#FAECE7', color: '#712B13' },
    { bg: '#E6F1FB', color: '#0C447C' },
    { bg: '#FAEEDA', color: '#633806' },
];

function initials(name: string) {
    return name.split(',')[0].split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

export const AuthorBlock: FC<PropsWithChildren<{name: string, count: number, ai: number}>> = ({name, count, children, ai}) => {
    const av = avatarColors[ai % avatarColors.length];
    return (
        <div class={authorBlock}>
            <div class={authorRow} data-component="author-row">
                <div class={authorAvatar} style={`background:${av.bg};color:${av.color}`}>{initials(name)}</div>
                <span class={authorName}>{name}</span>
                <span class={authorCount}>{count} {count !== 1 ? 'böcker' : 'bok'}</span>
                <svg class={chevron} data-class-toggle={chevronOpen} viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="5,3 9,7 5,11" /></svg>
            </div>
            <div class={authorChildren} data-class-toggle={authorChildrenOpen}>
                {children}
            </div>
        </div>
    )
} 
