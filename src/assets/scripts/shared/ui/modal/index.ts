// =============================================================================
// modal/index.ts — Управление модальными окнами (ООП, TypeScript)
// =============================================================================

import './index.scss';

const ANIMATION_DURATION = 300; // должно совпадать с $transition-slow в SCSS
const SCROLL_LOCK_CLASS = 'is-modal-open';

class ModalManager {
    #active: HTMLElement | null = null;
    #onClick = (e: MouseEvent) => this.#handleClick(e);
    #onKeydown = (e: KeyboardEvent) => this.#handleKeydown(e);

    // =========================================================================
    // Публичные методы
    // =========================================================================

    init(): void {
        document.addEventListener('click', this.#onClick);
        document.addEventListener('keydown', this.#onKeydown);
    }

    destroy(): void {
        document.removeEventListener('click', this.#onClick);
        document.removeEventListener('keydown', this.#onKeydown);

        if (this.#active) {
            this.#close(this.#active);
        }
    }

    open(el: HTMLElement): void {
        this.#open(el);
    }

    close(): void {
        if (this.#active) {
            this.#close(this.#active);
        }
    }

    // =========================================================================
    // Приватные методы
    // =========================================================================

    #handleClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        // 1. Кнопка/оверлей закрытия внутри модалки
        const closeTrigger = target.closest('[data-modal-close]');
        if (closeTrigger) {
            event.preventDefault();
            const modal = closeTrigger.closest<HTMLElement>('[data-active]');
            if (modal) {
                this.#close(modal);
            }
            return;
        }

        // 2. Триггер открытия
        const trigger = target.closest<HTMLElement>('[data-modal-trigger]');
        if (trigger) {
            event.preventDefault();
            const id = trigger.getAttribute('data-modal-target');
            const content = id ? document.getElementById(id) : null;
            if (!content) {
                console.error('Modal target not found:', id, trigger);
                return;
            }
            this.#open(content);
        }
    }

    #handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && this.#active) {
            this.#close(this.#active);
        }
    }

    #open(el: HTMLElement): void {
        if (this.#active && this.#active !== el) {
            this.#close(this.#active);
        }

        document.body.classList.add(SCROLL_LOCK_CLASS);

        el.setAttribute('data-active', '');
        this.#active = el;
        requestAnimationFrame(() => el.setAttribute('data-visible', ''));
    }

    #close(el: HTMLElement): void {
        if (this.#active === el) {
            this.#active = null;
        }

        // Снимаем безусловно — classList.remove идемпотентен
        document.body.classList.remove(SCROLL_LOCK_CLASS);

        el.removeAttribute('data-visible'); // запуск анимации закрытия
        setTimeout(() => el.removeAttribute('data-active'), ANIMATION_DURATION); // размонтирование
    }
}

// =============================================================================
// Публичный API — как initDropdown()/destroyDropdown()
// =============================================================================

let instance: ModalManager | null = null;

/** Создаёт и инициализирует экземпляр ModalManager */
export function initModal(): void {
    instance = new ModalManager();
    instance.init();
}

/** Уничтожает текущий экземпляр ModalManager */
export function destroyModal(): void {
    if (instance) {
        instance.destroy();
        instance = null;
    }
}

export { ModalManager };