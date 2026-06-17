// =============================================================================
// tabs/index.ts — Логика переключения табов (ООП, TypeScript)
// =============================================================================

const ITEM_ACTIVE_CLASS = 'tabs__item--active';
const BTN_ACTIVE_CLASS = 'tabs__btn--active';
const PANEL_ACTIVE_CLASS = 'tabs__panel--active';

class Tabs {
    private boundHandleClick: (event: Event) => void;

    constructor() {
        this.boundHandleClick = this.handleClick.bind(this);
    }

    // ===========================================================================
    // Публичные методы
    // ===========================================================================

    /**
     * Инициализирует все группы табов: вешает обработчики клика
     * через делегирование на каждый [data-tabs]
     * */
    public init(): void {
        const containers = document.querySelectorAll<HTMLElement>('[data-tabs]');

        containers.forEach((container) => {
            container.addEventListener('click', this.boundHandleClick);
        });
    }

    /**
     * Снимает обработчики клика со всех групп табов
     * */
    public destroy(): void {
        const containers = document.querySelectorAll<HTMLElement>('[data-tabs]');

        containers.forEach((container) => {
            container.removeEventListener('click', this.boundHandleClick);
        });
    }

    // ===========================================================================
    // Приватные методы — переключение
    // ===========================================================================

    /**
     * Деактивирует все табы внутри переданного контейнера:
     * снимает модификаторы --active с tabs__item и tabs__btn
     * */
    private deactivateAll(container: HTMLElement): void {
        const items = container.querySelectorAll<HTMLElement>('.tabs__item');
        const btns = container.querySelectorAll<HTMLElement>('.tabs__btn');

        items.forEach((el) => el.classList.remove(ITEM_ACTIVE_CLASS));
        btns.forEach((el) => el.classList.remove(BTN_ACTIVE_CLASS));
    }

    /**
     * Активирует переданный таб: добавляет --active на родительский
     * tabs__item и на саму кнопку
     * */
    private activate(item: HTMLElement, trigger: HTMLElement): void {
        item.classList.add(ITEM_ACTIVE_CLASS);
        trigger.classList.add(BTN_ACTIVE_CLASS);
    }

    /**
     * Переключает видимость панелей внутри контейнера:
     * показывает панель, чей data-tabs-panel совпадает с переданным значением
     * */
    private switchPanels(container: HTMLElement, value: string): void {
        const panels = container.querySelectorAll<HTMLElement>('[data-tabs-panel]');
        if (!panels.length) {
            return;
        }

        panels.forEach((panel) => {
            const isActive = panel.dataset.tabsPanel === value;
            panel.classList.toggle(PANEL_ACTIVE_CLASS, isActive);
        });
    }

    // ===========================================================================
    // Приватные методы — обработчики событий
    // ===========================================================================

    /**
     * Обработчик клика: при клике на [data-tabs-trigger]
     * переключает активный таб и панель по значению атрибута
     * */
    private handleClick(event: Event): void {
        const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-tabs-trigger]');
        if (!trigger) {
            return;
        }

        const value = trigger.dataset.tabsTrigger;
        if (!value) {
            return;
        }

        const container = trigger.closest<HTMLElement>('[data-tabs]');
        if (!container) {
            return;
        }

        const item = trigger.closest<HTMLElement>('.tabs__item');
        if (!item) {
            return;
        }

        this.deactivateAll(container);
        this.activate(item, trigger);
        this.switchPanels(container, value);
    }
}

// =============================================================================
// Публичный API
// =============================================================================

let instance: Tabs | null = null;

/**
 * Создаёт и инициализирует экземпляр Tabs
 * */
export function initTabs(): void {
    instance = new Tabs();
    instance.init();
}

/** Уничтожает текущий экземпляр Tabs */
export function destroyTabs(): void {
    if (instance) {
        instance.destroy();
        instance = null;
    }
}