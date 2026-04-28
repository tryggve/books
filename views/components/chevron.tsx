import type { FC } from 'hono/jsx'

export const Chevron: FC<{className: Promise<string>, open?: boolean}> = ({className, open}) => {
    const props = { ...(open && {'data-open': ''}) }
    return (
        <svg class={className} {...props} viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="5,3 9,7 5,11" /></svg>
    )
}