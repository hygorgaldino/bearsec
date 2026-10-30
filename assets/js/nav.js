/* ============================================================
   Navegação centralizada (NAV)
   Para adicionar, renomear ou remover itens do menu,
   basta editar o array NAV abaixo.
   ============================================================ */

window.NAV = [
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
