const botonReportar = document.getElementById("botonReportar");
const modalFondo = document.getElementById("modalFondo");
const modalCerrar = document.getElementById("modalCerrar");
const formularioReporte = document.getElementById("formularioReporte");

botonReportar.addEventListener("click", function () {
  modalFondo.classList.add("activo");
});

modalCerrar.addEventListener("click", function () {
  modalFondo.classList.remove("activo");
});

modalFondo.addEventListener("click", function (evento) {
  if (evento.target === modalFondo) {
    modalFondo.classList.remove("activo");
  }
});

formularioReporte.addEventListener("submit", function (evento) {
  evento.preventDefault();
  alert("Reporte guardado con éxito");
  formularioReporte.reset();
  modalFondo.classList.remove("activo");
});

document.querySelectorAll(".navegacion a").forEach(function (enlace) {
  enlace.addEventListener("click", function (evento) {
    const destino = document.querySelector(enlace.getAttribute("href"));
    if (destino) {
      evento.preventDefault();
      destino.scrollIntoView({ behavior: "smooth" });
    }
  });
});
