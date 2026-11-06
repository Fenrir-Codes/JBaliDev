(function(){
  var root = document.documentElement,
      reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Theme váltó kezelése */
  try {
    var t = localStorage.getItem("theme");
    if (t) root.setAttribute("data-theme", t);
  } catch(e) {}

  document.getElementById("theme").addEventListener("click", function(){
    var cur = root.getAttribute("data-theme");
    var dark = cur ? cur === "dark" : !matchMedia("(prefers-color-scheme: light)").matches;
    var next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch(e) {}
  });

  /* Gépelős effektus */
  var name = "Jozsef Bali", el = document.getElementById("typed"), i = 0;
  if (reduce) {
    el.textContent = name;
  } else {
    (function tick(){
      el.textContent = name.slice(0, ++i);
      if (i < name.length) setTimeout(tick, 90);
    })();
  }

  /* Sima gördülés a menüpontokra kattintáskor */
  var links = [].slice.call(document.querySelectorAll(".tree a"));
  var brandLink = document.querySelector(".brand");
  var mainContainer = document.querySelector("main");

  function scrollToSection(targetId) {
    var targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  links.forEach(function(link){
    link.addEventListener("click", function(e){
      e.preventDefault();
      var targetId = link.getAttribute("href").replace("#", "");
      scrollToSection(targetId);
    });
  });

  if (brandLink) {
    brandLink.addEventListener("click", function(e){
      e.preventDefault();
      scrollToSection("hero-section");
    });
  }

  /* IntersectionObserver az aktív menüpont pontos kijelöléséhez */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          links.forEach(function(l){
            l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id);
          });
        }
      });
    }, { 
      root: matchMedia("(max-width: 820px)").matches ? null : mainContainer,
      threshold: 0.5 
    });
    
    document.querySelectorAll("main section[id]").forEach(function(s){ io.observe(s); });
  }

  /* Interaktív terminál szimuláció */
  var out = document.getElementById("out"),
      cmd = document.getElementById("cmd");
      
  var cmds = {
    help: "help · whoami · skills · projects · status · contact · clear",
    whoami: "Jozsef Bali, datatekniker med speciale i programmering. København.",
    skills: "C#, .NET, ASP.NET Core, Blazor, Entity Framework, Angular, TypeScript, MSSQL, REST API, Unity",
    projects: "weather-tracker/\nelevportalen/\nv-logger/\nbinary-clock/",
    status: "Jobsøgende. Åben for løntilskud (4 uger) via A-kasse.",
    contact: "vorago01@gmail.com"
  };

  if(cmd && out){
    cmd.addEventListener("keydown", function(e){
      if (e.key !== "Enter") return;
      var c = cmd.value.trim().toLowerCase();
      cmd.value = "";
      if (!c) return;
      if (c === "clear"){ out.textContent = ""; return; }
      out.textContent += "$ " + c + "\n" + (cmds[c] || ("kommando ikke fundet: " + c + ". Skriv help.")) + "\n";
      out.scrollTop = out.scrollHeight;
    });
  }
})();