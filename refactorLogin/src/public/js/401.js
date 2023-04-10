document.addEventListener("DOMContentLoaded", () => {
  let tiempo = 5;
  const url = "http://localhost:8080/login";

  const intervalo = setInterval(() => {
    document.getElementById(
      "contador"
    ).innerHTML = `${tiempo}`;
    tiempo--;
  }, 1000);

  setTimeout(() => {
    clearInterval(intervalo);
    window.location.href = url;
  }, 5000);
});
