// =============================================================================
// branches/index.ts — Интерактивная карта филиалов (ООП, TypeScript)
// =============================================================================

interface CityData {
    name: string;
    address: string;
    phone: string;
    link: string;
}

const BREAKPOINT_DESKTOP = 1200;
const TOOLTIP_OFFSET_Y = 24;

const PIN_ACTIVE_CLASS = 'branch-map__pin--active';
const CARD_TOOLTIP_CLASS = 'branch-card--tooltip';
const CARD_VISIBLE_CLASS = 'branch-card--visible';

class BranchesMap {
    private readonly breakpoint: number;

    private readonly tooltipOffsetY: number;

    private mapEl: HTMLElement | null = null;

    private pointsContainer: HTMLElement | null = null;

    private card: HTMLElement | null = null;

    private cardOriginalParent: HTMLElement | null = null;

    private activePoint: HTMLElement | null = null;

    private mediaQuery: MediaQueryList | null = null;

    private boundHandlePinClick: (event: Event) => void;

    private boundHandleMediaChange: (e: MediaQueryListEvent) => void;

    constructor() {
        this.breakpoint = BREAKPOINT_DESKTOP;
        this.tooltipOffsetY = TOOLTIP_OFFSET_Y;

        this.boundHandlePinClick = this.handlePinClick.bind(this);
        this.boundHandleMediaChange = this.handleMediaChange.bind(this);
    }

    // ===========================================================================
    // Публичные методы
    // ===========================================================================

    /**
     * Инициализирует карту: находит DOM-элементы, вешает обработчики,
     * показывает дефолтный город
     * */
    public init(): void {
        this.mapEl = document.querySelector('[data-branch="map"]');
        this.pointsContainer = document.querySelector('[data-branch="points"]');
        this.card = document.querySelector('[data-branch="card"]');

        if (!this.mapEl || !this.pointsContainer || !this.card) {
            return;
        }

        this.cardOriginalParent = this.card.parentElement;
        this.pointsContainer.addEventListener('click', this.boundHandlePinClick);

        this.mediaQuery = window.matchMedia(`(min-width: ${this.breakpoint}px)`);
        this.mediaQuery.addEventListener('change', this.boundHandleMediaChange);

        this.showDefaultCity();
    }

    /**
     * Снимает обработчики событий, скрывает tooltip и
     * сбрасывает ссылки на DOM-элементы
     * */
    public destroy(): void {
        if (this.pointsContainer) {
            this.pointsContainer.removeEventListener('click', this.boundHandlePinClick);
        }
        if (this.mediaQuery) {
            this.mediaQuery.removeEventListener('change', this.boundHandleMediaChange);
        }
        this.hideAsTooltip();
        this.mapEl = null;
        this.pointsContainer = null;
        this.card = null;
        this.cardOriginalParent = null;
        this.activePoint = null;
    }

    // ===========================================================================
    // Приватные методы — утилиты
    // ===========================================================================

    /**
     * Возвращает true, если текущая ширина вьюпорта соответствует
     * десктопному брейкпоинту
     * */
    private isDesktop(): boolean {
        return window.matchMedia(`(min-width: ${this.breakpoint}px)`).matches;
    }

    /** Извлекает данные города из data-атрибутов элемента точки */
    private readCityData(pointEl: HTMLElement): CityData {
        return {
            name: pointEl.dataset.name || '',
            address: pointEl.dataset.address || '',
            phone: pointEl.dataset.phone || '',
            link: pointEl.dataset.link || '#',
        };
    }

    /** Снимает активное состояние со всех пинов */
    private deactivateAllPins(): void {
        this.pointsContainer!.querySelectorAll(`.${PIN_ACTIVE_CLASS}`).forEach((pin) => {
            pin.classList.remove(PIN_ACTIVE_CLASS);
        });
    }

    // ===========================================================================
    // Приватные методы — работа с карточкой
    // ===========================================================================

    /**
     * Заполняет карточку филиала переданными
     * данными (название, адрес, телефон, ссылка)
     * */
    private updateCardContent(data: CityData): void {
        if (!this.card) {
            return;
        }

        const title = this.card.querySelector('.branch-card__title');
        const detailValues = this.card.querySelectorAll<HTMLElement>('.branch-card__detail-value');
        const link = this.card.querySelector<HTMLAnchorElement>('.btn');

        if (title) {
            title.textContent = data.name;
        }
        if (detailValues.length >= 2) {
            detailValues[0].textContent = data.address;
            detailValues[1].textContent = data.phone;
        }
        if (link) {
            link.href = data.link;
        }
    }

    /**
     * Вычисляет и применяет left/top для позиционирования карточки над пином,
     * вместе с позицией стрелки
     * */
    private positionCardAsTooltip(pointEl: HTMLElement): void {
        if (!this.card || !this.mapEl) {
            return;
        }

        const mapRect = this.mapEl.getBoundingClientRect();
        const pointRect = pointEl.getBoundingClientRect();

        const pointCenterX = pointRect.left + pointRect.width / 2 - mapRect.left;
        const pointTop = pointRect.top - mapRect.top;

        let left = pointCenterX - this.card.offsetWidth / 2;
        const top = pointTop - this.card.offsetHeight - this.tooltipOffsetY;

        if (left < 4) {
            left = 4;
        }
        if (left + this.card.offsetWidth > mapRect.width - 4) {
            left = mapRect.width - this.card.offsetWidth - 4;
        }

        this.card.style.left = `${left}px`;
        this.card.style.top = `${top}px`;

        const arrowLeft = pointCenterX - left;
        this.card.style.setProperty('--arrow-left', `${arrowLeft}px`);
    }

    /**
     * Показывает карточку как tooltip над указанной точкой
     * */
    private showAsTooltip(pointEl: HTMLElement): void {
        if (!this.card) {
            return;
        }

        this.card.classList.add(CARD_TOOLTIP_CLASS, CARD_VISIBLE_CLASS);
        requestAnimationFrame(() => {
            this.positionCardAsTooltip(pointEl);
        });
    }

    /**
     * Возвращает карточку в поток документа (мобильный вид)
     * */
    private resetCardToMobile(): void {
        if (!this.card || !this.cardOriginalParent) {
            return;
        }

        this.card.classList.remove(CARD_TOOLTIP_CLASS, CARD_VISIBLE_CLASS);
        this.card.style.left = '';
        this.card.style.top = '';
        this.card.style.removeProperty('--arrow-left');
        this.cardOriginalParent.appendChild(this.card);
    }

    // ===========================================================================
    // Приватные методы — показать/скрыть
    // ===========================================================================

    /**
     * Показывает карточку для выбранного города.
     * На десктопе — tooltip над пином, на мобильных — в потоке
     * */
    private show(pointEl: HTMLElement, pin: HTMLElement): void {
        const data = this.readCityData(pointEl);

        this.deactivateAllPins();
        pin.classList.add(PIN_ACTIVE_CLASS);
        this.updateCardContent(data);

        if (this.isDesktop()) {
            if (this.card && this.card.parentElement !== this.mapEl) {
                this.mapEl!.appendChild(this.card);
            }
            this.showAsTooltip(pointEl);
        } else {
            this.resetCardToMobile();
        }

        this.activePoint = pointEl;
    }

    /**
     * Скрывает tooltip (снимает класс видимости)
     * */
    private hideAsTooltip(): void {
        if (!this.card) {
            return;
        }
        this.card.classList.remove(CARD_VISIBLE_CLASS);
    }

    // ===========================================================================
    // Приватные методы — обработчики событий
    // ===========================================================================

    /**
     * Обработчик клика по пину: находит родительскую точку
     * и показывает карточку
     * */
    private handlePinClick(event: Event): void {
        const pin = (event.target as HTMLElement).closest<HTMLElement>('[data-branch="pin"]');

        if (!pin) {
            return;
        }

        const pointEl = pin.closest<HTMLElement>('[data-branch="point"]');

        if (!pointEl) {
            return;
        }

        this.show(pointEl, pin);
    }

    /**
     * Обработчик изменения ширины вьюпорта: переключает карточку
     * между tooltip и потоком
     * */
    private handleMediaChange(e: MediaQueryListEvent): void {
        if (!this.activePoint) {
            return;
        }

        if (e.matches) {
            if (this.card && this.card.parentElement !== this.mapEl) {
                this.mapEl!.appendChild(this.card);
            }
            const activePin = this.activePoint.querySelector<HTMLElement>(`.${PIN_ACTIVE_CLASS}`);
            if (!activePin) {
                const firstPin = this.activePoint.querySelector<HTMLElement>('[data-branch="pin"]');
                if (firstPin) {
                    firstPin.classList.add(PIN_ACTIVE_CLASS);
                }
            }
            this.showAsTooltip(this.activePoint);
        } else {
            this.resetCardToMobile();
            this.updateCardContent(this.readCityData(this.activePoint));
        }
    }

    // ===========================================================================
    // Приватные методы — инициализация
    // ===========================================================================

    /**
     * Показывает город по умолчанию при первой загрузке карты
     * */
    private showDefaultCity(): void {
        if (!this.mapEl) {
            return;
        }

        const defaultCity = this.mapEl.dataset.defaultCity;
        if (!defaultCity) {
            return;
        }

        const defaultPoint = this.pointsContainer!.querySelector<HTMLElement>(
            `[data-branch="point"][data-city="${defaultCity}"]`,
        );
        if (!defaultPoint) {
            return;
        }

        const defaultPin = defaultPoint.querySelector<HTMLElement>('[data-branch="pin"]');
        if (defaultPin) {
            this.show(defaultPoint, defaultPin);
        }
    }
}

// =============================================================================
// Публичный API
// =============================================================================

let instance: BranchesMap | null = null;

/**
 * Создаёт и инициализирует экземпляр BranchesMap
 * */
export function initBranches(): void {
    instance = new BranchesMap();
    instance.init();
}

/** Уничтожает текущий экземпляр BranchesMap */
export function destroyBranches(): void {
    if (instance) {
        instance.destroy();
        instance = null;
    }
}