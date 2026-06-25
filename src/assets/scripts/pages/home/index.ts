// =============================================================================
// home.js — Точка входа Vite (страница home)
// =============================================================================
import '../../app.js';
import {initSliders} from '../../shared/ui/slider';
import {initAccordion} from '../../shared/ui/accordion';
import {initBranches} from '../../shared/ui/branches';
import {initTabs} from '../../shared/ui/tabs';
import {initDropdown} from '../../shared/ui/dropdown';
import {initModal} from '../../shared/ui/modal';
import {initHeader} from '../../shared/ui/header';

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initSliders();

    initAccordion({
        selector: '.footer__nav-group',
        breakpoint: '(min-width: 1200px)',
    });

    initBranches();
    initTabs();
    initModal();
    initDropdown();
});
