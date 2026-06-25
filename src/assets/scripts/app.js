// =============================================================================
// app.js — Глобальная точка входа (подключается на всех страницах)
// =============================================================================
import '../styles/main.scss';
import {initHeader} from './shared/ui/header';
import {initSliders} from './shared/ui/slider';
import {initAccordion} from './shared/ui/accordion';
import {initDropdown} from './shared/ui/dropdown';
import {initModal} from './shared/ui/modal';

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initSliders();

    initAccordion({
        selector: '.footer__nav-group',
        breakpoint: '(min-width: 1200px)',
    });

    initModal();
    initDropdown();
});