// =============================================================================
// delivery.ts — Точка входа Vite (страница «Доставка»)
// =============================================================================
import '../../app.js';
import {initHeader} from '../../shared/ui/header';
import {initSliders} from '../../shared/ui/slider';
import {initAccordion} from '../../shared/ui/accordion';
import {initDropdown} from '../../shared/ui/dropdown';
import {initModal} from '../../shared/ui/modal';

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initSliders();

    // Аккордеон навигации в подвале (как на главной)
    initAccordion({
        selector: '.footer__nav-group',
        breakpoint: '(min-width: 1200px)',
    });

    // Аккордеон FAQ — работает на всех разрешениях
    initAccordion({
        selector: '.faq-item',
        oneAtATime: false,
    });

    initModal();
    initDropdown();
});
