// =============================================================================
// home-v1.js — Точка входа Vite (страница home, Theme V1)
// =============================================================================
import '../../app-v1.js';
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