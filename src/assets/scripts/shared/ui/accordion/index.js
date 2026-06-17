// =============================================================================
// initAccordion — Универсальный JS-аккордеон (БЭМ, data-атрибуты)
// =============================================================================

/**
 * Инициализирует аккордеон на элементах с data-атрибутами.
 *
 * Разметка группы:
 *   <div data-accordion>
 *     <button data-accordion-trigger type="button" aria-expanded="false">Заголовок</button>
 *     <div data-accordion-panel hidden>Контент</div>
 *   </div>
 *
 * @param {Object} options
 * @param {string} [options.selector='[data-accordion]'] — селектор групп
 * @param {string} [options.breakpoint=null] — MediaQuery-строка, на которой аккордеон отключается (все панели открыты)
 * @param {boolean} [options.oneAtATime=false] — закрывать остальные группы при открытии одной
 * @param {Function} [options.onToggle=null] — колбэк (group, isOpen) после переключения
 * @returns {Function} destroy — удаляет все слушатели и возвращает панели в исходное состояние
 */
export function initAccordion(options = {}) {
  const {
    selector = '[data-accordion]',
    breakpoint = null,
    oneAtATime = false,
    onToggle = null,
  } = options;

  const groups = Array.from(document.querySelectorAll(selector));

  if (!groups.length) {
    return () => {};
  }

  // --------------- Внутренние утилиты ---------------

  /** Найти trigger внутри группы */
  const getTrigger = (group) => group.querySelector('[data-accordion-trigger]');

  /** Найти panel внутри группы */
  const getPanel = (group) => group.querySelector('[data-accordion-panel]');

  /** Открыта ли группа (панель видна) */
  const isOpen = (group) => {
    const panel = getPanel(group);
    return panel && !panel.hidden;
  };

  /** Открыть группу */
  const open = (group) => {
    const trigger = getTrigger(group);
    const panel = getPanel(group);

    if (panel) panel.hidden = false;
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    group.classList.add(`${group.classList[0]}--open`);

    if (onToggle) onToggle(group, true);
  };

  /** Закрыть группу */
  const close = (group) => {
    const trigger = getTrigger(group);
    const panel = getPanel(group);

    if (panel) panel.hidden = true;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    group.classList.remove(`${group.classList[0]}--open`);

    if (onToggle) onToggle(group, false);
  };

  /** Переключить группу */
  const toggle = (group) => {
    if (isOpen(group)) {
      close(group);
    } else {
      if (oneAtATime) {
        groups.forEach((g) => {
          if (g !== group) close(g);
        });
      }
      open(group);
    }
  };

  /** Принудительно открыть все группы (десктоп) */
  const openAll = () => {
    groups.forEach((g) => open(g));
  };

  /** Восстановить исходное состояние (закрыть все) */
  const closeAll = () => {
    groups.forEach((g) => close(g));
  };

  /** Обработчик клика по trigger */
  const handleClick = (event) => {
    const trigger = event.target.closest('[data-accordion-trigger]');
    if (!trigger) return;

    const group = trigger.closest(selector);
    if (!group) return;

    // На десктопе клики игнорируются
    if (breakpoint && window.matchMedia(breakpoint).matches) return;

    event.preventDefault();
    toggle(group);
  };

  /** Обработчик изменения matchMedia */
  let mql = null;
  const handleBreakpointChange = (e) => {
    if (e.matches) {
      // Перешли в десктоп — открываем все
      openAll();
    } else {
      // Перешли в мобилку — закрываем все
      closeAll();
    }
  };

  // --------------- Инициализация ---------------

  // Навешиваем делегированный обработчик на document
  document.addEventListener('click', handleClick, true);

  // Если задан breakpoint — слушаем изменения
  if (breakpoint) {
    mql = window.matchMedia(breakpoint);
    mql.addEventListener('change', handleBreakpointChange);

    // Начальное состояние
    if (mql.matches) {
      openAll();
    }
  }

  // --------------- Destroy ---------------

  const destroy = () => {
    document.removeEventListener('click', handleClick, true);

    if (mql) {
      mql.removeEventListener('change', handleBreakpointChange);
      mql = null;
    }

    // Сбрасываем состояние (закрываем все)
    closeAll();
  };

  return destroy;
}