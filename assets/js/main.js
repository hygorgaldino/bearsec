/* ============================================================
   Navegação centralizada: para adicionar/remover itens do menu,
   basta editar o array NAV abaixo. Todas as páginas são
   montadas automaticamente pelo buildSidebar().
   ============================================================ */

const NAV = [
  {
    titulo: null, itens: [
      { texto: "HOME", href: "index.html", id: "home", icone: "⌂" },
    ]
  },
  {
    titulo: "WRITEUPS", icone: "📄", itens: [
      { texto: "All Writeups", href: "writeups/allwriteups.html", id: "writeups-all" },
      { texto: "HTB", href: "writeups/htb.html", id: "writeups-htb" },
      { texto: "TryHackMe", href: "writeups/tryhackme.html", id: "writeups-thm" },
      { texto: "HC", href: "writeups/hc.html", id: "writeups-hc" },
      { texto: "CTF Archive", href: "writeups/ctf-archive.html", id: "writeups-ctf" },
    ]
  },
  {
    titulo: "EXPLOITATION", icone: "⚡", itens: [
      { texto: "Web Exploits", href: "exploitation/web-exploits.html", id: "exploitation-web" },
      { texto: "Binary Exploitation", href: "exploitation/binary-exploitation.html", id: "exploitation-binary" },
      { texto: "Privilege Escalation", href: "exploitation/privilege-escalation.html", id: "exploitation-privesc" },
      { texto: "Reverse Engineering", href: "exploitation/reverse-engineering.html", id: "exploitation-re" },
    ]
  },
  {
    titulo: null, itens: [
      { texto: "LABS", href: "labs.html", id: "labs", icone: "🧪" },
      { texto: "TSHOOT", href: "tshoot.html", id: "tshoot", icone: "🔧" },
      { texto: "TOOLS", href: "tools.html", id: "tools", icone: "⚙" },
      { texto: "ABOUT", href: "about.html", id: "about", icone: "◎" },
    ]
  },
];

/* ============================================================
   Tema Claro / Escuro (Dark / Light Theme Toggle)
   ============================================================ */
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

// Inicializa o tema imediatamente para evitar flash
initTheme();

/* Injeta header + sidebar + footer em qualquer página que
   tenha as divs #site-header, #site-sidebar e #site-footer. */
function buildLayout() {
  const prefixo = document.body.dataset.prefixo || ""; // "../" para páginas em subpastas

  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <a class="logo" href="${prefixo}index.html">Meu Blog</a>
      <div class="header-actions">
        <button id="theme-toggle" type="button" aria-label="Alternar modo claro e escuro" title="Alternar tema">
          <span class="toggle-track">
            <span class="toggle-icon-moon">🌙</span>
            <span class="toggle-icon-sun">☀️</span>
          </span>
          <span class="toggle-knob"></span>
        </button>
        <button id="menu-toggle" aria-label="Abrir menu">&#9776;</button>
      </div>`;

    header.querySelector("#theme-toggle").addEventListener("click", toggleTheme);

    header.querySelector("#menu-toggle").addEventListener("click", () =>
      document.getElementById("site-sidebar").classList.toggle("aberto"));
  }

  const sidebar = document.getElementById("site-sidebar");
  if (sidebar) {
    let html = `
      <div class="sidebar-logo">
        <div class="logo-ring">
          <span class="logo-icon">🐻</span>
        </div>
        <div class="logo-title">BearSec</div>
        <div class="logo-sub">// CyberSecurity</div>
      </div>
    `;
    html += "<ul>";
    for (const secao of NAV) {
      if (secao.titulo) {
        html += `
          <li class="nav-secao nav-dropdown">
            <button class="nav-titulo-btn" type="button" aria-expanded="false">
              ${secao.icone ? `<span class="nav-icon">${secao.icone}</span>` : ""}
              <span class="nav-titulo-texto">${secao.titulo}</span>
              <span class="submenu-arrow">▶</span>
            </button>
            <ul class="nav-submenu">`;
        for (const item of secao.itens) {
          html += `<li><a class="nav-link" data-id="${item.id}" href="${prefixo}${item.href}">${item.texto}</a></li>`;
        }
        html += `</ul></li>`;
      } else {
        html += `<li class="nav-secao"><ul>`;
        for (const item of secao.itens) {
          html += `<li><a class="nav-link" data-id="${item.id}" href="${prefixo}${item.href}">${item.icone ? `<span class="nav-icon">${item.icone}</span>` : ""}<span class="nav-texto">${item.texto}</span></a></li>`;
        }
        html += `</ul></li>`;
      }
    }
    html += `</ul><div class="nav-info">// Info</div>`;
    sidebar.innerHTML = html;

    // Adiciona evento de clique para expandir/recolher submenus
    sidebar.querySelectorAll(".nav-titulo-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const dropdown = btn.closest(".nav-dropdown");
        const aberto = dropdown.classList.toggle("aberto");
        btn.setAttribute("aria-expanded", aberto ? "true" : "false");
      });
    });

    // destaca o item ativo conforme data-page do <body> e abre o submenu pai se aplicável
    const atual = document.body.dataset.page;
    sidebar.querySelectorAll(".nav-link").forEach(a => {
      const isAtivo = a.dataset.id === atual;
      a.classList.toggle("ativo", isAtivo);
      if (isAtivo) {
        const parentDropdown = a.closest(".nav-dropdown");
        if (parentDropdown) {
          parentDropdown.classList.add("aberto");
          const btn = parentDropdown.querySelector(".nav-titulo-btn");
          if (btn) btn.setAttribute("aria-expanded", "true");
        }
      }
    });
  }

  const footer = document.getElementById("site-footer");
  if (footer) footer.innerHTML = "// Info — blog de segurança";
}

document.addEventListener("DOMContentLoaded", buildLayout);
