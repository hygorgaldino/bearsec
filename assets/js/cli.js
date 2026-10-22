function initTerminal() {
    const termInput = document.getElementById('term-input');
    const termOut = document.getElementById('term-output');

    // Se não existirem os elementos, aborta
    if (!termInput || !termOut) return;

    // Define os comandos suportados
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
        ls: () => ['Documents/  Tools/  flags/  .ssh/  exploit.py'],
        whoami: () => ['root'],
        id: () => ['uid=0(root) gid=0(root) groups=0(root)'],
        'uname -a': () => ['Linux bearsec-box 5.15.0-88-generic #98-Ubuntu SMP x86_64 GNU/Linux'],
        'ps aux': () => ['root    1  0.0  nginx', 'root   42  0.2  python3 app.py', 'root   99  0.0  sshd'],
        'cat flag': () => ['🚩 CTF{b34r_pwn3d_4g41n}'],
        clear: () => { termOut.innerHTML = ''; return []; },
    };

    // Adiciona uma linha ao output
    function appendLine(text, cls = '') {
        const d = document.createElement('div');
        d.className = 't-line' + (cls ? ' ' + cls : '');
        d.textContent = text;
        termOut.appendChild(d);
    }

    // Manuseador de teclas no input
    termInput.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;

        const cmd = termInput.value.trim();
        termInput.value = '';
        if (!cmd) return;

        // Exibe o comando digitado
        appendLine('➜ ~ ' + cmd, 'dim');

        // Busca o handler correspondente
        const handler = COMMANDS[cmd];
        const lines = handler ? handler() : [`bash: ${cmd}: command not found`];

        // Adiciona linhas de saída
        lines.forEach(l => appendLine(l, handler ? '' : 'err'));

        // Faz scroll automático
        termInput.closest('.terminal-body').scrollTop = 99999;
    });

    // Foca no input ao clicar no corpo do terminal
    termInput.closest('.terminal-body')
        ?.addEventListener('click', () => termInput.focus());

    // Foca automaticamente ao iniciar
    termInput.focus();
}

// Chame esta função após o DOM estar pronto ou quando o conteúdo for carregado dinamicamente
document.addEventListener('DOMContentLoaded', initTerminal);