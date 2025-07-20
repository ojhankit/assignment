const panels = document.querySelectorAll(".panel");

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

  const currentLayer = current.querySelector(".zoom-layer");
  const nextLayer = next.querySelector(".zoom-layer");

  // Show next panel underneath
  gsap.set(next, { autoAlpha: 1, zIndex: 0 });
  gsap.set(nextLayer, { scale: 1, rotateX: 0, rotateY: 0 });

  // Bring current panel to top
  gsap.set(current, { autoAlpha: 1, zIndex: 10 });

  const tl = gsap.timeline();

  tl.to(currentLayer, {
        scale: 20,
        rotateX: 5,
        rotateY: -5,
        duration: 10,
        ease: "sine.inOut"
    });
  tl.fromTo(next.querySelector(".text-content"), 
    { autoAlpha: 0, y: 50 }, 
    { autoAlpha: 1, y: 0, duration: 4, ease: "power2.out" }, 
    5 // Start fading in next text midway (adjust timing as needed)
  );
  tl.to(current, {
        autoAlpha: 0,
        duration: 0.2,
        ease: "sine.inOut"
    }, "-=1");

    await new Promise(resolve => tl.eventCallback("onComplete", resolve));
    await showPanel((i + 1) % panels.length);
}

async function startZoomExperience() {
  await runLoader();
  await showPanel(index);
}

window.addEventListener("load", startZoomExperience);