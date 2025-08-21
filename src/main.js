window.onload = () => {
  const canvas = document.getElementById("flappyCanvas");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas());
};
