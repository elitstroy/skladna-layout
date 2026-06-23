// =============================================================================
// home.js — Точка входа Vite (страница home)
// =============================================================================
import '../../app.js';
import { initSliders } from '../../shared/ui/slider';
import { initAccordion } from '../../shared/ui/accordion';
import { initBranches } from '../../shared/ui/branches';
import { initTabs } from '../../shared/ui/tabs';
import { initDropdown } from '../../shared/ui/dropdown';

document.addEventListener('DOMContentLoaded', () => {
  initSliders();

  initAccordion({
    selector: '.footer__nav-group',
    breakpoint: '(min-width: 1200px)',
  });

  initBranches();
  initTabs();
  initDropdown();
});
