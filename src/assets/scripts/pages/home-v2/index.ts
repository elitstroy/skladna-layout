// =============================================================================
// home-v2.js — Точка входа Vite (страница home, Theme V2)
// =============================================================================
import '../../app-v2.js';
import { initSliders } from '../../shared/ui/slider';
import { initAccordion } from '../../shared/ui/accordion';
import { initBranches } from '../../shared/ui/branches';
import { initTabs } from '../../shared/ui/tabs';

document.addEventListener('DOMContentLoaded', () => {
  initSliders();

  initAccordion({
    selector: '.footer__nav-group',
    breakpoint: '(min-width: 1200px)',
  });

  initBranches();
  initTabs();
});