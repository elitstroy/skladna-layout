// =============================================================================
// initSliders — Инициализация всех Swiper-слайдеров на странице
// =============================================================================
import Swiper from 'swiper';
import {Navigation, Pagination, Autoplay} from 'swiper/modules';
import 'swiper/swiper-bundle.css';

/**
 * Инициализирует все слайдеры на странице по data-атрибуту [data-slider].
 *
 * Поддерживаемые значения data-slider:
 *   "products"  — карточки товаров
 *   "promo"     — промо-карточки
 *   "team"      — менеджеры
 *   "awards"    — награды
 */
export function initSliders() {
    const sliders = document.querySelectorAll('[data-slider]');

    if (!sliders.length) {
        return;
    }

    /** Общие настройки для всех слайдеров */
    const defaults = {
        modules: [Navigation, Pagination, Autoplay],
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        },
        observer: true,
        observeParents: true,
    };

    /** Специфичные настройки по типу слайдера */
    const configs = {
        products: {
            slidesPerView: 2.2,
            breakpoints: {
                768: {
                    slidesPerView: 4,
                },

                992: {
                    slidesPerView: 5,
                },
            },
        },

        promo: {
            slidesPerView: 1.2,
            spaceBetween: 12,
            breakpoints: {
                768: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                },
            },
        },

        team: {
            slidesPerView: 1.2,
            spaceBetween: 12,
            breakpoints: {
                768: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                },
            },
        },

        awards: {
            slidesPerView: 2.2,
            spaceBetween: 12,
            autoplay: {
                delay: 2000,
                disableOnInteraction: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 4,
                },
                992: {
                    slidesPerView: 5,
                    spaceBetween: 24,
                },
            },
        },
    };

    sliders.forEach((el) => {
        const type = el.dataset.slider;
        const config = {...defaults, ...(configs[type] || {})};

        // Ищем кнопки навигации в пределах родительской секции (или ближайшего контейнера)
        const section = el.closest('section') || el.parentElement;
        const prevBtn = section.querySelector('.swiper-button-prev');
        const nextBtn = section.querySelector('.swiper-button-next');

        if (prevBtn && nextBtn) {
            config.navigation = {
                prevEl: prevBtn,
                nextEl: nextBtn,
            };
        }

        // eslint-disable-next-line no-new
        new Swiper(el, config);
    });
}