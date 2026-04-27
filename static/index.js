const labelMaker = {
    owned: [ "Ägarskap", "Äger", "Äger inte" ],
    read: [ "Läst | Oläst", "Läst", "Inte läst" ]
}

const stateMachine = {
    owned: ['all', 'owned', 'not-owned'],
    read: ['all', 'read', 'not-read']
}

currentState = {
    owned: undefined,
    read: undefined
}

function enableClicker(node) {
    const buttonActiveClass = node.dataset.classActive;
    const filterType = node.id.split('-').shift();
    currentState[filterType] = node.dataset.state;
    node.addEventListener('click', () => {
        const nextState = (stateMachine[filterType].indexOf(node.dataset.state) + 1) % stateMachine[filterType].length
        node.textContent = labelMaker[filterType][nextState]
        currentState[filterType] = node.dataset.state = stateMachine[filterType][nextState]
        if (nextState > 0) { node.classList.add(buttonActiveClass) } else node.classList.remove(buttonActiveClass)
        filterBooks()
    })
}

function enableToggler(node) {
    const chevron = node.getElementsByTagName('svg')[0]
    const children = node.nextElementSibling
    node.addEventListener('click', () => {
        chevron.toggleAttribute('data-open')
        children.toggleAttribute('data-open')
    })
}

function filterBooks() {
    const bookNodes = document.querySelectorAll('[data-component="book-row"]')
    bookNodes.forEach(book => {
        const ownedMatch = currentState.owned === 'all' || (currentState.owned === 'owned' && book.dataset.owned === 'true') || (currentState.owned === 'not-owned' && book.dataset.owned === 'false')
        const readMatch = currentState.read === 'all' || (currentState.read === 'read' && book.dataset.read === 'true') || (currentState.read === 'not-read' && book.dataset.read === 'false')

        if (ownedMatch && readMatch) return book.style.display = "flex";

        return book.style.display = "none"
    })
}

function enableSeriesFilter(bookAuthorSelector, seriesSelector, seriesOptions, seriesOrderInput) {
    bookAuthorSelector.addEventListener('change', () => {
        seriesSelector.value = ''
        seriesOrderInput.disabled = true
        seriesOrderInput.value = null
        seriesOptions.forEach(o => o.hidden = o.dataset.authorId !== bookAuthorSelector.value)
    })

}

function enableSeriesOrderEnabler(seriesOrderInput, seriesSelector, seriesOptions) {
    const stuff = Array.from(seriesOptions)
    seriesSelector.addEventListener('change', () => {
        seriesOrderInput.disabled = seriesSelector.value === ''
        seriesOrderInput.value = stuff.find(so => so.value === seriesSelector.value)?.dataset.nextPart || null
    })
}

function enableObserver(sentinel, toolbar) {
    const observer = new IntersectionObserver(([e]) => { toolbar.toggleAttribute('data-stuck', !e.isIntersecting) });
    observer.observe(sentinel);
}

function hello() {
    const toolbar = document.querySelector('[data-component="toolbar"]');
    const sentinel = document.querySelector('[data-component="sentinel"]');
    const bookForm = document.querySelector('#book-form');
    const bookAuthorSelector = document.querySelector('#book-author')
    const seriesSelector = document.querySelector('#book-series')
    const seriesOrderInput = document.querySelector('#series-order')
    const seriesOptions = document.querySelectorAll('#book-series option[data-author-id]')

    bookForm.addEventListener('submit', () => sessionStorage.setItem('scrollY', window.scrollY))
    document.querySelectorAll('#owned-status, #read-status').forEach(enableClicker)
    document.querySelectorAll('[data-component="author-row"]').forEach(enableToggler)
    document.querySelectorAll('[data-component="series-row"]').forEach(enableToggler)
    enableSeriesFilter(bookAuthorSelector, seriesSelector, seriesOptions, seriesOrderInput)
    enableSeriesOrderEnabler(seriesOrderInput, seriesSelector, seriesOptions)
    enableObserver(sentinel, toolbar);
}

function scrollRestore() {
    const scrollY = sessionStorage.getItem('scrollY')
    if (scrollY) {
        window.scrollTo({ top: parseInt(scrollY), behavior: 'instant' })
        sessionStorage.removeItem('scrollY')
    }
}

window.addEventListener('DOMContentLoaded', scrollRestore)
window.addEventListener('DOMContentLoaded', hello)
