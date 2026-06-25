// =============================================================================
// header/index.ts — Логика скролл-состояний хедера (ООП, TypeScript)
// =============================================================================
// Добавляет классы is-sticky / is-scrolling-up на [data-header] при скролле.
// position: sticky обеспечивает само прилипание, JS — только состояние видимости.

const CLASS_STICKY = 'is-sticky';
const CLASS_SCROLLING_UP = 'is-scrolling-up';
const CLASS_INIT = 'is-init';

type State = 'top' | 'compact' | 'expanded';

interface HeaderOptions {
    threshold?: number;
    directionSensitivity?: number;
    scrollUpSensitivity?: number;
    /** Длительность CSS-перехода в мс. ДОЛЖНА совпадать с $transition-base */
    transitionDuration?: number;
}

class Header {
    private readonly header: HTMLElement;
    private readonly config: Required<HeaderOptions>;

    private lastY = 0;
    private anchorY = 0; // точка последнего разворота направления
    private direction: 'up' | 'down' = 'down';

    private currentState: State = 'top';
    private pendingState: State = 'top';
    private locked = false;
    private lockTimer = 0;
    private ticking = false;

    private boundOnScroll: () => void;

    constructor(header: HTMLElement, options: HeaderOptions = {}) {
        this.header = header;

        this.config = {
            threshold: 5,
            directionSensitivity: 8,
            scrollUpSensitivity: 24,
            transitionDuration: 300,
            ...options,
        };

        this.boundOnScroll = this.onScrollThrottled.bind(this);
    }

    // ===========================================================================
    // Публичные методы
    // ===========================================================================

    /**
     * Инициализирует скролл-обработчик и выставляет стартовое состояние
     * */
    public init(): void {
        this.lastY = this.getScrollY();
        this.anchorY = this.lastY;

        // Стартовое состояние без анимации — убирает рывок при reload в середине
        this.header.classList.add(CLASS_INIT);

        if (this.lastY > this.config.threshold) {
            this.direction = 'down';
            this.currentState = 'compact';
            this.pendingState = 'compact';
            this.applyState('compact');
        }

        // Снимаем флаг через два кадра, дальше переходы уже анимируются
        requestAnimationFrame(() =>
            requestAnimationFrame(() => this.header.classList.remove(CLASS_INIT)),
        );

        window.addEventListener('scroll', this.boundOnScroll, { passive: true });
    }

    /**
     * Снимает обработчик и очищает классы
     * */
    public destroy(): void {
        window.removeEventListener('scroll', this.boundOnScroll);
        window.clearTimeout(this.lockTimer);
        this.header.classList.remove(CLASS_STICKY, CLASS_SCROLLING_UP, CLASS_INIT);
        this.currentState = 'top';
        this.pendingState = 'top';
        this.locked = false;
    }

    // ===========================================================================
    // Приватные методы — скролл-логика
    // ===========================================================================

    private getScrollY(): number {
        return window.scrollY || document.documentElement.scrollTop || 0;
    }

    private onScroll(): void {
        const y = this.getScrollY();

        // У самого верха — всегда полный хедер
        if (y <= this.config.threshold) {
            this.requestState('top');
            this.direction = 'down';
            this.anchorY = y;
            this.lastY = y;
            return;
        }

        // Фиксируем точку разворота при смене направления (гистерезис)
        if (y > this.lastY && this.direction !== 'down') {
            this.direction = 'down';
            this.anchorY = y;
        } else if (y < this.lastY && this.direction !== 'up') {
            this.direction = 'up';
            this.anchorY = y;
        }

        // Накопленная дистанция от точки разворота
        const travelled = Math.abs(y - this.anchorY);

        if (this.direction === 'down' && travelled >= this.config.directionSensitivity) {
            this.requestState('compact');
        } else if (this.direction === 'up' && travelled >= this.config.scrollUpSensitivity) {
            this.requestState('expanded');
        }

        this.lastY = y;
    }

    // ===========================================================================
    // Управление состоянием с блокировкой на время анимации
    // ===========================================================================

    /**
     * Запоминает желаемое состояние. Применяет сразу, если не заблокировано;
     * иначе применит после завершения текущего перехода.
     * */
    private requestState(state: State): void {
        this.pendingState = state;

        if (!this.locked) {
            this.commitPending();
        }
    }

    private commitPending(): void {
        if (this.pendingState === this.currentState) {
            return;
        }

        this.applyState(this.pendingState);
        this.currentState = this.pendingState;

        // Блокируем смену состояния, пока CSS-переход не доиграет
        this.locked = true;
        window.clearTimeout(this.lockTimer);
        this.lockTimer = window.setTimeout(() => {
            this.locked = false;
            this.commitPending(); // применяем накопленное состояние, если изменилось
        }, this.config.transitionDuration);
    }

    private applyState(state: State): void {
        switch (state) {
            case 'top':
                this.header.classList.remove(CLASS_STICKY, CLASS_SCROLLING_UP);
                break;
            case 'compact':
                this.header.classList.remove(CLASS_SCROLLING_UP);
                this.header.classList.add(CLASS_STICKY);
                break;
            case 'expanded':
                this.header.classList.remove(CLASS_STICKY);
                this.header.classList.add(CLASS_SCROLLING_UP);
                break;
        }
    }

    // ===========================================================================
    // Throttle
    // ===========================================================================

    private onScrollThrottled(): void {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.onScroll();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }
}

// =============================================================================
// Публичный API
// =============================================================================

let instance: Header | null = null;

/**
 * Создаёт и инициализирует экземпляр Header
 * */
export function initHeader(options?: HeaderOptions): void {
    if (instance) {
        return;
    }

    const header = document.querySelector<HTMLElement>('[data-header]');
    if (!header) {
        return;
    }

    instance = new Header(header, options);
    instance.init();
}

/** Уничтожает текущий экземпляр Header */
export function destroyHeader(): void {
    if (instance) {
        instance.destroy();
        instance = null;
    }
}