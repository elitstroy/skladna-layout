// =============================================================================
// home.js — Точка входа Vite (страница home)
// =============================================================================
import {initBranches} from '../../widgets/branches';
import {initTabs} from '../../shared/ui/tabs';

document.addEventListener('DOMContentLoaded', () => {
    initBranches();
    initTabs();
});