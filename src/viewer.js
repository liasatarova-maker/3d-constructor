window.LuxViewer = (() => {
  let model, viewer, page;
  let rotateX = 4, rotateY = -12, scale = 1, dragging = false, lastX = 0, lastY = 0;

  function renderTransform() {
    model.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  }

  function reset() {
    rotateX = 4; rotateY = -12; scale = 1; renderTransform();
  }

  function zoom(delta) {
    scale = Math.min(1.55, Math.max(.62, scale + delta));
    renderTransform();
  }

  function setMaterial(tone) {
    page.dataset.material = tone || "coated";
  }

  function init() {
    model = document.getElementById("calendarModel");
    viewer = document.getElementById("viewer");
    page = document.getElementById("calendarPage");
    renderTransform();

    viewer.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      viewer.setPointerCapture(e.pointerId);
    });
    viewer.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      rotateY += (e.clientX - lastX) * .3;
      rotateX -= (e.clientY - lastY) * .22;
      rotateX = Math.max(-28, Math.min(28, rotateX));
      lastX = e.clientX; lastY = e.clientY; renderTransform();
    });
    viewer.addEventListener("pointerup", () => dragging = false);
    viewer.addEventListener("pointercancel", () => dragging = false);
    viewer.addEventListener("wheel", (e) => { e.preventDefault(); zoom(e.deltaY < 0 ? .07 : -.07); }, { passive: false });
    document.getElementById("zoomIn").onclick = () => zoom(.1);
    document.getElementById("zoomOut").onclick = () => zoom(-.1);
    document.getElementById("resetView").onclick = reset;
  }

  return { init, reset, setMaterial };
})();