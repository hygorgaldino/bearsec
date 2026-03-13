/* =============================================================
   BearSec — main.js
   Handles: navigation, dropdowns, sidebar (mobile), notifications,
            and the interactive terminal.
============================================================= */

/* ─────────────────────────────────────────
   THEME TOGGLE
───────────────────────────────────────── */

/** Toggle between dark (default) and light theme. Persists via localStorage. */
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('bearsec-theme', isLight ? 'light' : 'dark');
}

/** Apply saved theme on page load. */
(function initTheme() {
  if (localStorage.getItem('bearsec-theme') === 'light') {
    document.body.classList.add('light');
  }
})();

/* ─────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────── */

/** Map of page id → breadcrumb label */
const PAGE_LABELS = {
  home:        'Dashboard',
  writeups:    'Writeups',
  exploitation:'Exploitation',
  labs:        'Labs',
  tshoot:      'Troubleshooting',
  tools:       'Tools',
  about:       'About',
};

/**
 * Switch the visible page section and update nav active state.
 * @param {string} id - page key (e.g. 'home', 'labs')
 */
function navTo(id) {
  // Hide all sections
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  // Deactivate all nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show target section
  document.getElementById('page-' + id)?.classList.add('active');

  // Activate matching nav items (there may be multiple for drop items)
  document.querySelectorAll(`.nav-item[data-page="${id}"]`)
    .forEach(n => n.classList.add('active'));

  // Update breadcrumb
  const bcPage = document.getElementById('bc-page');
  if (bcPage) bcPage.textContent = PAGE_LABELS[id] ?? id;

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 900) closeSidebar();
}

/* ─────────────────────────────────────────
   DROPDOWN MENUS
───────────────────────────────────────── */

/**
 * Toggle a nav item's dropdown open/closed.
 * Also navigates to the item's own page.
 * @param {HTMLElement} el - the .nav-item.has-drop element
 */
function toggleDrop(el) {
  const isOpen = el.classList.contains('open');
  const drop   = el.nextElementSibling;

  el.classList.toggle('open', !isOpen);
  drop.classList.toggle('open', !isOpen);

  navTo(el.dataset.page);
}

/* ─────────────────────────────────────────
   SIDEBAR (mobile)
───────────────────────────────────────── */

/** Open / close the sidebar and its dark overlay. */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

/** Close the sidebar (used by overlay click and navTo). */
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

/* ─────────────────────────────────────────
   NOTIFICATIONS
───────────────────────────────────────── */
let notifOpen = false;

/** Toggle the notification fly-out panel. */
function toggleNotif() {
  notifOpen = !notifOpen;
  document.getElementById('notif-panel').classList.toggle('open', notifOpen);
}

// Close the panel when clicking outside of it
document.addEventListener('click', e => {
  if (
    notifOpen &&
    !e.target.closest('#notif-panel') &&
    !e.target.closest('.topbar-btn')
  ) {
    notifOpen = false;
    document.getElementById('notif-panel').classList.remove('open');
  }
});

/* ─────────────────────────────────────────
   TERMINAL
───────────────────────────────────────── */

const termInput = document.getElementById('term-input');
const termOut   = document.getElementById('term-output');

/**
 * Available terminal commands.
 * Each key maps to a function that returns an array of output lines.
 * Returning an empty array (like 'clear') signals no new lines to append.
 */
const COMMANDS = {
  help: () => [
    'Available commands:',
    '  ls         — list directory',
    '  whoami     — current user',
    '  uname -a   — system info',
    '  ps aux     — process list',
    '  id         — user id',
    '  cat flag   — read the flag',
    '  clear      — clear terminal',
  ],

  ls:     () => ['Documents/  Tools/  flags/  .ssh/  exploit.py'],
  whoami: () => ['root'],
  id:     () => ['uid=0(root) gid=0(root) groups=0(root)'],

  'uname -a': () => [
    'Linux bearsec-box 5.15.0-88-generic #98-Ubuntu SMP x86_64 GNU/Linux',
  ],

  'ps aux': () => [
    'root    1  0.0  nginx',
    'root   42  0.2  python3 app.py',
    'root   99  0.0  sshd',
  ],

  'cat flag': () => ['🚩 HTB{b34r_pwn3d_th3_b0x_4g41n}'],

  clear: () => {
    termOut.innerHTML = '';
    return [];
  },
};

/**
 * Append a line to the terminal output.
 * @param {string}  text
 * @param {string}  [extraClass] - e.g. 'dim', 'err', 'warn'
 */
function termAppendLine(text, extraClass = '') {
  const div = document.createElement('div');
  div.className = 't-line' + (extraClass ? ' ' + extraClass : '');
  div.textContent = text;
  termOut.appendChild(div);
}

/** Handle a submitted terminal command. */
function termHandleCommand(raw) {
  const cmd = raw.trim();
  if (!cmd) return;

  // Echo the command
  termAppendLine('➜ ~ ' + cmd, 'dim');

  // Execute
  const handler = COMMANDS[cmd];
  const lines   = handler
    ? handler()
    : [`bash: ${cmd}: command not found`];

  const isError = !handler;
  lines.forEach(line => termAppendLine(line, isError ? 'err' : ''));

  // Scroll to bottom
  termInput.closest('.terminal-body').scrollTop = 99999;
}

// Listen for Enter key in the terminal input
if (termInput) {
  termInput.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const value = termInput.value;
    termInput.value = '';
    termHandleCommand(value);
  });

  // Click anywhere in terminal body to focus the input
  termInput.closest('.terminal-body')
    ?.addEventListener('click', () => termInput.focus());

  // Auto-focus on page load
  termInput.focus();
}

/* ─────────────────────────────────────────
   INIT — bind static nav clicks
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Home item (no dropdown)
  document.querySelector('.nav-item[data-page="home"]')
    ?.addEventListener('click', () => navTo('home'));
});
