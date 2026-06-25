// =============================================================================
// delivery.ts — Точка входа Vite (страница «Доставка»)
// =============================================================================
import {initAccordion} from '../../shared/ui/accordion';

document.addEventListener('DOMContentLoaded', () => {
    // Аккордеон FAQ — работает на всех разрешениях
    initAccordion({
        selector: '.faq-item',
        oneAtATime: false,
    });
});