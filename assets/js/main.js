/* ============================================================
   main.js - Lógica e Orquestração do Layout
   O menu de navegação reside separadamente em: assets/js/nav.js
   ============================================================ */

(function () {
  "use strict";

  /* ------------------------------------------------------------
     1. Gerenciador de Tema (Dark / Light)
     ------------------------------------------------------------ */
  function initTheme() {
    const saved = localStorage.getItem("blog-theme");
    if (saved === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }

  function toggleTheme() {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("blog-theme", isLight ? "light" : "dark");
  }

  // Inicializa o tema imediatamente para evitar flash de tela (FOUC)
  initTheme();

  /* ------------------------------------------------------------
     2. Componentes de Interface
     ------------------------------------------------------------ */
  function buildHeader(prefixo) {
    const header = document.getElementById("site-header");
    if (!header) return;

    header.innerHTML = `
      <a class="logo" href="${prefixo}index.html">BearSec</a>
      <div class="header-actions">
        <button id="theme-toggle" type="button" aria-label="Alternar modo claro e escuro" title="Alternar tema">
          <span class="toggle-track">
            <span class="toggle-icon-moon">🌙</span>
            <span class="toggle-icon-sun">☀️</span>
          </span>
          <span class="toggle-knob"></span>
        </button>
        <button id="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false">&#9776;</button>
      </div>`;

    const themeBtn = header.querySelector("#theme-toggle");
    const menuBtn = header.querySelector("#menu-toggle");

    themeBtn?.addEventListener("click", toggleTheme);

    menuBtn?.addEventListener("click", () => {
      const sidebar = document.getElementById("site-sidebar");
      const aberto = sidebar?.classList.toggle("aberto");
      menuBtn.setAttribute("aria-expanded", String(Boolean(aberto)));
    });
  }

  // Renderiza um link de navegação de forma padronizada e unificada (DRY)
  function renderNavLink(item, prefixo, paginaAtual) {
    const isAtivo = item.id === paginaAtual;
    const iconHtml = item.icone ? `<span class="nav-icon">${item.icone}</span>` : "";
    return `<li><a class="nav-link${isAtivo ? " ativo" : ""}" data-id="${item.id}" href="${prefixo}${item.href}">${iconHtml}<span class="nav-texto">${item.texto}</span></a></li>`;
  }

  function buildSidebar(prefixo, navItems) {
    const sidebar = document.getElementById("site-sidebar");
    if (!sidebar || !Array.isArray(navItems)) return;

    const paginaAtual = document.body.dataset.page || "";

    let html = `
      <div class="sidebar-logo">
      <a href="${prefixo}index.html" class="logo-ring" title="BearSec Home">
          <img src="${prefixo}assets/img/bearsec-logo.jpg" alt="BearSec Logo" class="logo-img">
        </a>
        <div class="logo-title">BearSec</div>
        <div class="logo-sub">// CyberSecurity</div>
      </div>
      <ul>`;

    for (const secao of navItems) {
      if (secao.titulo) {
        // Verifica se algum item filho corresponde à página atual para já renderizar aberto
        const hasItemAtivo = secao.itens.some(item => item.id === paginaAtual);
        const iconHtml = secao.icone ? `<span class="nav-icon">${secao.icone}</span>` : "";

        html += `
          <li class="nav-secao nav-dropdown${hasItemAtivo ? " aberto" : ""}">
            <button class="nav-titulo-btn" type="button" aria-expanded="${hasItemAtivo ? "true" : "false"}">
              ${iconHtml}
              <span class="nav-titulo-texto">${secao.titulo}</span>
              <span class="submenu-arrow">▶</span>
            </button>
            <ul class="nav-submenu">
              ${secao.itens.map(item => renderNavLink(item, prefixo, paginaAtual)).join("")}
            </ul>
          </li>`;
      } else {
        html += `
          <li class="nav-secao">
            <ul>
              ${secao.itens.map(item => renderNavLink(item, prefixo, paginaAtual)).join("")}
            </ul>
          </li>`;
      }
    }

    html += `</ul><div class="nav-info">// System Online - v1.0.0</div>`;
    sidebar.innerHTML = html;

    // Delegação centralizada de eventos na barra lateral (melhor performance e sem múltiplos loops)
    sidebar.addEventListener("click", (e) => {
      // Toggle de dropdown retrátil
      const btn = e.target.closest(".nav-titulo-btn");
      if (btn) {
        const dropdown = btn.closest(".nav-dropdown");
        if (dropdown) {
          const aberto = dropdown.classList.toggle("aberto");
          btn.setAttribute("aria-expanded", String(aberto));
        }
        return;
      }

      // Ao clicar em um link no mobile, fecha a sidebar automaticamente
      const link = e.target.closest(".nav-link");
      if (link && window.innerWidth <= 768) {
        sidebar.classList.remove("aberto");
        const menuBtn = document.getElementById("menu-toggle");
        menuBtn?.setAttribute("aria-expanded", "false");
      }
    });
  }

  function buildFooter() {
    const footer = document.getElementById("site-footer");
    if (footer) footer.innerHTML = "// EOF";
  }

  /* ------------------------------------------------------------
     3. Orquestrador e Inicialização
     ------------------------------------------------------------ */
  function buildLayout() {
    const prefixo = document.body.dataset.prefixo || "";

    buildHeader(prefixo);
    buildFooter();

    if (window.NAV) {
      buildSidebar(prefixo, window.NAV);
    } else {
      // Carrega nav.js dinamicamente caso não tenha sido importado via HTML
      const script = document.createElement("script");
      script.src = `${prefixo}assets/js/nav.js`;
      script.onload = () => buildSidebar(prefixo, window.NAV);
      script.onerror = () => console.error("Não foi possível carregar: " + script.src);
      document.head.appendChild(script);
    }

    // Fecha a sidebar ao clicar fora (backdrop no mobile)
    document.addEventListener("click", (e) => {
      const sidebar = document.getElementById("site-sidebar");
      const menuBtn = document.getElementById("menu-toggle");
      if (
        sidebar?.classList.contains("aberto") &&
        !sidebar.contains(e.target) &&
        !menuBtn?.contains(e.target)
      ) {
        sidebar.classList.remove("aberto");
        menuBtn?.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", buildLayout);

  // Expõe no escopo global para compatibilidade com testes e diretrizes do AGENTS.md
  window.buildLayout = buildLayout;
  window.initTheme = initTheme;
  window.toggleTheme = toggleTheme;
})();
