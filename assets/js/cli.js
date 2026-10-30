/* ============================================================
   cli.js - Interface e Comandos do Terminal Interativo
   Carregado exclusivamente em: index.html
   ============================================================ */

(function () {
  "use strict";

  function initTerminal() {
    const termInput = document.getElementById("term-input");
    const termOut = document.getElementById("term-output");
    const termBody = termInput?.closest(".terminal-body");
    const termCard = termInput?.closest(".terminal-card");

    // Se não existirem os elementos necessários, aborta
    if (!termInput || !termOut || !termBody || !termCard) return;

    // Histórico de comandos (navegação com setas para cima/baixo)
    const history = [];
    let historyIdx = -1;

    // Define os comandos suportados
    const COMMANDS = {
      help: () => [
        "Available commands:",
        "  ls         — list directory",
        "  whoami     — current user",
        "  uname -a   — system info",
        "  ps aux     — process list",
        "  id         — user id",
        "  cat flag   — read the flag",
        "  clear      — clear terminal",
      ],
      ls: () => ["Documents/  Tools/  flags/  .ssh/  exploit.py"],
      whoami: () => ["root"],
      id: () => ["uid=0(root) gid=0(root) groups=0(root)"],
      "uname -a": () => [
        "Linux bearsec-box 5.15.0-88-generic #98-Ubuntu SMP x86_64 GNU/Linux",
      ],
      "ps aux": () => [
        "root    1  0.0  nginx",
        "root   42  0.2  python3 app.py",
        "root   99  0.0  sshd",
      ],
      "cat flag": () => ["🚩 CTF{b34r_pwn3d_4g41n}"],
      clear: () => {
        termOut.innerHTML = "";
        return [];
      },
    };

    // Adiciona uma linha ao output
    function appendLine(text, cls = "") {
      const d = document.createElement("div");
      d.className = "t-line" + (cls ? " " + cls : "");
      d.textContent = text;
      termOut.appendChild(d);
    }

    // Scroll suave e preciso para o final
    function scrollToBottom() {
      termBody.scrollTop = termBody.scrollHeight;
    }

    // Processamento do comando
    function executeCommand(rawCmd) {
      const cmd = rawCmd.trim();
      termInput.value = "";
      if (!cmd) return;

      // Armazena no histórico
      history.push(cmd);
      historyIdx = history.length;

      // Exibe o comando digitado
      appendLine("➜ ~ " + cmd, "dim");

      // Executa o handler ou exibe mensagem de erro
      const handler = COMMANDS[cmd];
      const lines = handler ? handler() : [`bash: ${cmd}: command not found`];

      // Adiciona linhas de saída se não for o comando clear
      if (cmd !== "clear") {
        lines.forEach((l) => appendLine(l, handler ? "" : "err"));
      }

      scrollToBottom();
    }

    // Manipulador de teclas no input
    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        executeCommand(termInput.value);
        return;
      }

      // Navegação no histórico com Up / Down
      if (e.key === "ArrowUp") {
        if (history.length > 0 && historyIdx > 0) {
          historyIdx--;
          termInput.value = history[historyIdx];
        }
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (historyIdx < history.length - 1) {
          historyIdx++;
          termInput.value = history[historyIdx];
        } else {
          historyIdx = history.length;
          termInput.value = "";
        }
        e.preventDefault();
      }
    });

    // Foca no input ao clicar no corpo do terminal
    termBody.addEventListener("click", () => termInput.focus());

    // Botões de controle da barra superior (.t-controls)
    const minimizeBtn = termCard.querySelector('.t-btn[title="Minimize"]');
    const maximizeBtn = termCard.querySelector('.t-btn[title="Maximize"]');
    const closeBtn = termCard.querySelector('.t-btn[title="Close"]');

    // Minimizar / Restaurar corpo
    minimizeBtn?.addEventListener("click", () => {
      const isHidden = termBody.style.display === "none";
      termBody.style.display = isHidden ? "" : "none";
      termCard.style.height = isHidden ? "" : "auto";
    });

    // Maximizar / Restaurar altura
    maximizeBtn?.addEventListener("click", () => {
      if (termCard.style.height === "450px") {
        termCard.style.height = "";
      } else {
        termBody.style.display = "";
        termCard.style.height = "450px";
      }
      scrollToBottom();
    });

    // Fechar terminal
    closeBtn?.addEventListener("click", () => {
      termCard.style.display = "none";
    });

    // Foca automaticamente ao carregar
    termInput.focus();
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTerminal);
  } else {
    initTerminal();
  }
})();
