const panels = document.querySelectorAll(".panel");
const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");

  let stars = [];
  let w, h;

  function initStars(count = 200) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * w
      });
    }
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initStars();
  }

  function animateStars() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#fff";
    for (let i = 0; i < stars.length; i++) {
      let star = stars[i];
      star.z -= 2;
      if (star.z <= 0) {
        star.z = w;
        star.x = Math.random() * w;
        star.y = Math.random() * h;
      }

      const k = 128.0 / star.z;
      const x = (star.x - w / 2) * k + w / 2;
      const y = (star.y - h / 2) * k + h / 2;

      if (x >= 0 && x < w && y >= 0 && y < h) {
        const size = (1 - star.z / w) * 3;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    requestAnimationFrame(animateStars);
  }

  window.addEventListener("resize", resize);
  resize();
  animateStars();

panels.forEach((panel, i) => {
  if (i !== 0) gsap.set(panel, { autoAlpha: 0 });
});

let index = 0;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runLoader() {
  const loader = document.getElementById("loader");
  await sleep(2000); 
  await gsap.to(loader, {
    autoAlpha: 0,
    duration: 1,
    onComplete: () => loader.style.display = "none"
  });
}

async function showPanel(i) {
  const current = panels[i];
  const next = panels[(i + 1) % panels.length];

  const currentCard = current.querySelector(".zoom-card");
  const nextCard = next.querySelector(".zoom-card");

  currentCard.style.willChange = "transform, opacity";
  nextCard.style.willChange = "transform, opacity";

  // Prepare next panel
  gsap.set(next, { autoAlpha: 1, zIndex: 0 });
  gsap.set(nextCard, { scale: 0.4, opacity: 0.6, y: -20 });

  // Bring current panel to front
  gsap.set(current, { autoAlpha: 1, zIndex: 10 });

  const tl = gsap.timeline();

  // Animate current card out
  tl.to(currentCard, {
    scale: 12,
    opacity: 0,
    duration: 8,
    ease: "sine.inOut",
    force3D: true
  });

  // Animate next card in early begin while current is still animating
  tl.to(nextCard, {
    scale: 1,
    opacity: 1,
    y: 0,
    duration: 6,
    ease: "sine.inOut"
  }, "-=6");

  // Fade out current panel earlier overlaps more with next card
  tl.to(current, {
    autoAlpha: 0,
    duration: 0.2,
    ease: "sine.inOut"
  }, "-=4");

  setTimeout(() => showPanel((i + 1) % panels.length), 6000); // trigger next before full finish
}


async function startZoomExperience() {
  await runLoader();
  await showPanel(index);
}

window.addEventListener("load", startZoomExperience);
