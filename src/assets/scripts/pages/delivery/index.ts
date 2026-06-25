// =============================================================================
// delivery.ts — Точка входа Vite (страница «Доставка»)
// =============================================================================
import {initAccordion} from '../../shared/ui/accordion';

document.addEventListener('DOMContentLoaded', () => {
    // Аккордеон FAQ — работает на всех разрешениях
    initAccordion({
        selector: '[data-accordion="faq"]',
        oneAtATime: false,
    });
});