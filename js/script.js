/* ==================================================================
   EDIT ME: change this to whatever password you want. Keep it
   something only he would think to try — not an obvious birthday date.
   ================================================================== */
const SECRET_PASSWORD = "duffer";

/* ==================================================================
   PAGES — the whole site's structure lives here. Each page is its
   own file in /pages/, loaded with jQuery AJAX so moving between
   them never reloads the browser.
   ================================================================== */
const pages = [
  { id: "welcome",   file: "pages/01-welcome.html",  label: "Welcome" },
  { id: "special",   file: "pages/02-special.html",  label: "Why You're Special" },
  { id: "memories",  file: "pages/03-memories.html", label: "Our Memories" },
  { id: "story",     file: "pages/04-story.html",    label: "Our Little Story" },
  { id: "surprises", file: "pages/05-surprises.html",label: "Surprise Boxes" },
  { id: "letter",    file: "pages/06-letter.html",   label: "My Letter" },
  { id: "reasons",   file: "pages/07-reasons.html",  label: "Reasons" },
  { id: "anything",  file: "pages/08-anything.html", label: "If I Could Give You Anything" },
  { id: "onelast",   file: "pages/09-onelast.html",  label: "One Last Thing" },
  { id: "finale",    file: "pages/10-finale.html",   label: "Happy Birthday" },
];

let currentPageIndex = 0;

$(function () {
  /* ================================================================
     TOAST HELPER
     ================================================================ */
  const $toastEl = $("#mainToast");
  const toast = new bootstrap.Toast($toastEl[0], { delay: 2600 });

  function showToast(message) {
    $("#mainToastBody").text(message);
    toast.show();
  }

  /* ================================================================
     UNLOCK FLOW — handled with jQuery, no page reload at any point
     ================================================================ */
  $("#unlockForm").on("submit", function (e) {
    e.preventDefault();
    const entered = $("#secretInput").val().trim().toLowerCase();

    if (entered === SECRET_PASSWORD.toLowerCase()) {
      showToast("I knew you'd remember.");
      $("#secretInput").prop("disabled", true);

      setTimeout(function () {
        $("#unlock-screen").addClass("is-hidden");
        $("#main-site").removeClass("d-none");
        buildNav();
        loadPage(0);
      }, 900);
    } else {
      showToast("Hmm... that's not what I was looking for.");
      $("#secretInput").addClass("shake");
      setTimeout(() => $("#secretInput").removeClass("shake"), 450);
    }
  });

  /* ================================================================
     AJAX PAGE LOADING
     ================================================================ */
  function loadPage(index) {
    if (index < 0 || index >= pages.length) return;
    const page = pages[index];

    $("#pageLoader").removeClass("d-none");
    $("#ajaxErrorNotice").addClass("d-none");

    $("#pageContent").stop(true).fadeTo(200, 0, function () {
      $.get(page.file)
        .done(function (html) {
          $("#pageContent")
            .attr("class", "page-content page-content--" + page.id)
            .html(html)
            .css("opacity", 0);

          currentPageIndex = index;
          window.scrollTo({ top: 0, behavior: "auto" });
          $("#pageContent").animate({ opacity: 1 }, 400);
          updateNav();
        })
        .fail(function () {
          $("#ajaxErrorNotice").removeClass("d-none");
        })
        .always(function () {
          $("#pageLoader").addClass("d-none");
        });
    });
  }

  function nextPage() { loadPage(currentPageIndex + 1); }
  function prevPage() { loadPage(currentPageIndex - 1); }

  $("#nextPageBtn").on("click", nextPage);
  $("#prevPageBtn").on("click", prevPage);

  // "Begin" button on the welcome page (delegated — page content is re-injected)
  $(document).on("click", ".js-next-page", nextPage);

  /* ================================================================
     NAVIGATION — dots + slide-out menu, built once after unlock
     ================================================================ */
  function buildNav() {
    const $dots = $("#navDots");
    const $menuList = $("#navMenuList");

    pages.forEach(function (page) {
      $dots.append($("<li>").attr("data-index", pages.indexOf(page)).attr("title", page.label));
      $menuList.append($("<li>").append($("<button>").attr("data-index", pages.indexOf(page)).text(page.label)));
    });

    $("#navDots, #navMenuList").on("click", "[data-index]", function () {
      loadPage(parseInt($(this).data("index"), 10));
      closeMenu();
    });
  }

  function updateNav() {
    $("#navDots li").removeClass("is-active").eq(currentPageIndex).addClass("is-active");
    $("#navMenuList button").removeClass("is-active").eq(currentPageIndex).addClass("is-active");
    $("#pagerLabel").text(pages[currentPageIndex].label);
    $("#prevPageBtn").prop("disabled", currentPageIndex === 0);
    $("#nextPageBtn").prop("disabled", currentPageIndex === pages.length - 1);
  }

  function closeMenu() {
    $("#navMenu").removeClass("is-open");
    $("#navToggle").attr("aria-expanded", "false");
  }

  $("#navToggle").on("click", function () {
    const isOpen = $("#navMenu").hasClass("is-open");
    $("#navMenu").toggleClass("is-open");
    $(this).attr("aria-expanded", !isOpen);
  });

  /* ================================================================
     SURPRISE BOXES — populate the shared modal on open
     (the modal lives in index.html, outside the AJAX content, so it
     never needs to be re-bound)
     ================================================================ */
  $("#surpriseModal").on("show.bs.modal", function (event) {
    const $trigger = $(event.relatedTarget);
    const title = $trigger.data("title");
    const body = $trigger.data("body");
    const photo = $trigger.data("photo");

    $("#surpriseModalTitle").text(title);
    $("#surpriseModalBody").text(body);

    if (photo) {
      $("#surpriseModalPhoto img").attr("src", photo);
      $("#surpriseModalPhoto").removeClass("d-none");
    } else {
      $("#surpriseModalPhoto").addClass("d-none");
    }
  });

  /* ================================================================
     LETTER — reveal on click (delegated, page content is dynamic)
     ================================================================ */
  $(document).on("click", "#openLetterBtn", function () {
    $("#letterIntro").fadeOut(250, function () {
      $("#letterContent").removeClass("d-none").hide().fadeIn(500);
    });
  });

  /* ================================================================
     REASONS — cycle through a list on every click
     EDIT: add, remove, or rewrite any of these reasons freely.
     ================================================================ */
  const reasons = [
    "Because you make ordinary days feel special.",
    "Because I can be myself around you.",
    "Because somehow, you became one of my favourite parts of life.",
    "Because you listen, even when it's not important.",
    "Because your laugh is genuinely one of my favourite sounds.",
    "Because I don't just love talking to you, I love the feeling I have after talking to you.",
    "Because talking to you never feels like effort.",
    "Because you make me want to be a better version of myself.",
    "Because you're patient with me on my worst days.",
    "Because you make me feel like I can be honest about anything.",
    "Because even your texts make my day better.",
    "Because you have this way of explaining things to me until i stop worrying.",
    "Because being around you feels easy.",
    "Because you're kind in ways you probably don't even notice.",
    "Because you make time for me, even when you're busy.",
    "Because you're the first person I want to tell things to.",
    "Because you make me smile at my phone like an idiot.",
    "Because you are my best friend in the world and I love you for that .",
    "Because you make me feel safe, in a way that's hard to explain.",
    "Because — simply — you.",
  ];
  let lastReasonIndex = -1;

  $(document).on("click", "#reasonBtn", function () {
    let index;
    do {
      index = Math.floor(Math.random() * reasons.length);
    } while (index === lastReasonIndex && reasons.length > 1);
    lastReasonIndex = index;

    const $display = $("#reasonDisplay");
    $display.addClass("is-fading");
    setTimeout(function () {
      $display.text(reasons[index]).removeClass("is-fading");
    }, 300);
  });

  /* ================================================================
     ANYTHING — gradual reveal
     ================================================================ */
  $(document).on("click", "#findOutBtn", function () {
    $("#anythingIntro").fadeOut(300, function () {
      $("#anythingReveal").removeClass("d-none").hide().fadeIn(600);
    });
  });

  /* ================================================================
     ONE LAST THING — reveal
     ================================================================ */
  $(document).on("click", "#notQuiteBtn", function () {
    $("#oneLastReveal").removeClass("d-none");
    $(this).fadeOut(200);
  });

  /* ================================================================
     FINALE — blow the candle to trigger the celebration:
     confetti/crackers + balloons rising + the final message.
     ================================================================ */
  $(document).on("click", "#blowCandleBtn", function () {
    const $flame = $("#flame");
    if ($flame.hasClass("is-blown")) return; // avoid double-trigger
    $flame.addClass("is-blown");
    $(this).prop("disabled", true).fadeTo(300, 0);

    setTimeout(function () {
      $("#finaleCakeStage").fadeOut(400, function () {
        $("#finaleReveal").removeClass("d-none").hide().fadeIn(700);
        launchConfetti();
        launchBalloons();
      });
    }, 700);
  });

  /* ================================================================
     Minimal confetti / crackers — a handful of soft pastel pieces,
     not a screen-filling effect.
     ================================================================ */
  function launchConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#c9a15a", "#e6bcc4", "#fff8f5", "#c97a8a"];
    const pieces = Array.from({ length: 40 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 120,
      y: canvas.height * 0.35,
      size: 4 + Math.random() * 5,
      speedX: (Math.random() - 0.5) * 6,
      speedY: -Math.random() * 7 - 2,
      gravity: 0.18,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.2,
    }));

    let frame = 0;
    const maxFrames = 220;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.speedY += p.gravity;
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.spin;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
        ctx.restore();
      });

      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    draw();
  }

  /* ================================================================
     Balloons rising gently from the bottom of the screen — SVG
     elements animated with CSS, cleaned up after they finish.
     ================================================================ */
  function launchBalloons() {
    const $container = $("#balloonRise");
    if (!$container.length) return;
    $container.empty();

    const colors = ["#c97a8a", "#c9a15a", "#e6bcc4", "#7a4a5e"];
    const count = 7;

    for (let i = 0; i < count; i++) {
      const left = 8 + Math.random() * 84;
      const delay = Math.random() * 1.2;
      const drift = (Math.random() - 0.5) * 120;
      const color = colors[i % colors.length];

      const $balloon = $(
        `<svg class="rising-balloon" viewBox="0 0 60 90" style="left:${left}%; color:${color}; --delay:${delay}s; --drift:${drift}px;">
           <use href="#svg-balloon"></use>
         </svg>`
      );
      $container.append($balloon);
    }

    setTimeout(function () {
      $container.empty();
    }, 8000);
  }
});
