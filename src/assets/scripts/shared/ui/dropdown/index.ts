// =============================================================================
// dropdown/index.ts — Управление выпадающими элементами (ООП, TypeScript)
// =============================================================================

import './index.scss';

const BREAKPOINT_DESKTOP = 992;
const ANIMATION_DURATION = 300; // должно совпадать с $transition-slow в SCSS
const SCROLL_LOCK_CLASS = 'is-dropdown-open';

class DropdownManager {
    #active: HTMLElement | null = null;
    #onClick = (e: MouseEvent) => this.#handleClick(e);

    // =========================================================================
    // Публичные методы
    // =========================================================================

    init(): void {
        document.addEventListener('click', this.#onClick);
    }

    destroy(): void {
        document.removeEventListener('click', this.#onClick);
        if (this.#active) {
            this.#close(this.#active);
        }
    }

    // =========================================================================
    // Приватные методы
    // =========================================================================

    #handleClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        // 1. Кнопка закрытия внутри dropdown
        const closeTrigger = target.closest('[data-dropdown-close]');
        if (closeTrigger) {
            event.preventDefault();
            const dropdown = closeTrigger.closest<HTMLElement>('[data-active]');
            if (dropdown) {
                this.#close(dropdown);
            }
            return;
        }

        // 2. Триггер открытия/закрытия
        const trigger = target.closest<HTMLElement>('[data-dropdown-trigger]');
        if (trigger) {
            event.preventDefault();
            const id = trigger.getAttribute('data-dropdown-target');
            const content = id ? document.getElementById(id) : null;
            if (!content) {
                console.error('Dropdown target not found:', id, trigger);
                return;
            }
            content.hasAttribute('data-active')
                ? this.#close(content)
                : this.#open(content, trigger);
            return;
        }

        // 3. Клик вне активного dropdown — закрыть
        if (this.#active && !this.#active.contains(target)) {
            this.#close(this.#active);
        }
    }

    #open(el: HTMLElement, trigger: HTMLElement): void {
        if (this.#active && this.#active !== el) {
            this.#close(this.#active);
        }

        if (window.innerWidth >= BREAKPOINT_DESKTOP) {
            // Десктоп: координаты для тултипа (мобильный CSS их не читает)
            const rect = trigger.getBoundingClientRect();
            el.style.setProperty('--dropdown-top', `${rect.bottom + 4}px`);
            el.style.setProperty('--dropdown-left', `${rect.left}px`);
        } else {
            // Мобилка: блокируем прокрутку фона под шторкой
            document.body.classList.add(SCROLL_LOCK_CLASS);
        }

        el.setAttribute('data-active', '');
        this.#active = el;
        requestAnimationFrame(() => el.setAttribute('data-visible', ''));
    }

    #close(el: HTMLElement): void {
        if (this.#active === el) {
            this.#active = null;
        }

        // Снимаем безусловно — classList.remove идемпотентен и страхует
        // от смены ширины/ориентации между открытием и закрытием
        document.body.classList.remove(SCROLL_LOCK_CLASS);

        el.removeAttribute('data-visible'); // запуск анимации закрытия
        setTimeout(() => el.removeAttribute('data-active'), ANIMATION_DURATION); // размонтирование
    }
}

// =============================================================================
// Публичный API — как initTabs()/destroyTabs()
// =============================================================================

let instance: DropdownManager | null = null;

/**
 * Создаёт и инициализирует экземпляр DropdownManager
 * */
export function initDropdown(): void {
    instance = new DropdownManager();
    instance.init();
}

/**
 * Уничтожает текущий экземпляр DropdownManager
 * */
export function destroyDropdown(): void {
    if (instance) {
        instance.destroy();
        instance = null;
    }
}

export {DropdownManager};