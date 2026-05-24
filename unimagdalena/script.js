const CORREO_DESTINO = "jrcervantesp@unimagdalena.edu.co";

const objetosBase = [
  { nombre: "Termo azul", lugar: "Biblioteca Germán Bula", fecha: "20 de mayo", color: "#cce0ff", inicial: "Termo" },
  { nombre: "Cuaderno argollado", lugar: "Bloque 8, salón 203", fecha: "19 de mayo", color: "#fff0b3", inicial: "Cuaderno" },
  { nombre: "Carnet estudiantil", lugar: "Cafetería central", fecha: "21 de mayo", color: "#d9f2d9", inicial: "Carnet" },
  { nombre: "Audífonos negros", lugar: "Polideportivo", fecha: "22 de mayo", color: "#f5d6d6", inicial: "Audífonos" }
];

const coloresPaleta = ["#cce0ff", "#fff0b3", "#d9f2d9", "#f5d6d6", "#e0d4f7", "#ffe0cc"];

function obtenerObjetosGuardados() {
  const datos = localStorage.getItem("objetosEncontrados");
  return datos ? JSON.parse(datos) : [];
}

function guardarObjeto(objeto) {
  const lista = obtenerObjetosGuardados();
  lista.push(objeto);
  localStorage.setItem("objetosEncontrados", JSON.stringify(lista));
}

function fechaHoy() {
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const f = new Date();
  return f.getDate() + " de " + meses[f.getMonth()];
}

function crearTarjeta(objeto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta-objeto";
  tarjeta.innerHTML =
    '<div class="tarjeta-imagen" style="background-color:' + objeto.color + ';">' + objeto.inicial + '</div>' +
    '<div class="tarjeta-contenido">' +
      '<span class="etiqueta">Encontrado</span>' +
      '<h4>' + objeto.nombre + '</h4>' +
      '<p><strong>Lugar:</strong> ' + objeto.lugar + '</p>' +
      '<p><strong>Fecha:</strong> ' + objeto.fecha + '</p>' +
      '<button class="boton-secundario" data-reclamar="' + objeto.nombre + '">Reclamar</button>' +
    '</div>';
  return tarjeta;
}

const pista = document.getElementById("carruselPista");

function renderizarMuro() {
  pista.innerHTML = "";
  const guardados = obtenerObjetosGuardados();
  const todos = guardados.concat(objetosBase);
  todos.forEach(function (obj) {
    pista.appendChild(crearTarjeta(obj));
  });
  posicionCarrusel = 0;
  aplicarDesplazamiento();
}

let posicionCarrusel = 0;

function tarjetasVisibles() {
  const ancho = window.innerWidth;
  if (ancho < 600) return 1;
  if (ancho < 900) return 2;
  return 3;
}

function aplicarDesplazamiento() {
  const tarjeta = pista.querySelector(".tarjeta-objeto");
  if (!tarjeta) return;
  const estilo = window.getComputedStyle(pista);
  const gap = parseInt(estilo.gap) || 20;
  const anchoTarjeta = tarjeta.getBoundingClientRect().width + gap;
  pista.style.transform = "translateX(" + (-posicionCarrusel * anchoTarjeta) + "px)";
}

document.getElementById("carruselAnterior").addEventListener("click", function () {
  if (posicionCarrusel > 0) {
    posicionCarrusel--;
    aplicarDesplazamiento();
  }
});

document.getElementById("carruselSiguiente").addEventListener("click", function () {
  const total = pista.querySelectorAll(".tarjeta-objeto").length;
  const max = Math.max(0, total - tarjetasVisibles());
  if (posicionCarrusel < max) {
    posicionCarrusel++;
    aplicarDesplazamiento();
  }
});

window.addEventListener("resize", aplicarDesplazamiento);

function abrirModal(id) {
  document.getElementById(id).classList.add("activo");
}

function cerrarModal(id) {
  document.getElementById(id).classList.remove("activo");
}

document.getElementById("botonReportar").addEventListener("click", function () {
  abrirModal("modalReportar");
});

document.getElementById("botonEncontre").addEventListener("click", function () {
  abrirModal("modalEncontre");
});

document.querySelectorAll(".modal-cerrar").forEach(function (boton) {
  boton.addEventListener("click", function () {
    cerrarModal(boton.getAttribute("data-cerrar"));
  });
});

document.querySelectorAll(".modal-fondo").forEach(function (fondo) {
  fondo.addEventListener("click", function (evento) {
    if (evento.target === fondo) {
      cerrarModal(fondo.id);
    }
  });
});

pista.addEventListener("click", function (evento) {
  const boton = evento.target.closest("[data-reclamar]");
  if (!boton) return;
  const nombre = boton.getAttribute("data-reclamar");
  document.getElementById("reclamarObjetoNombre").textContent = nombre;
  document.querySelector('#modalReclamar input[name="objeto"]').value = nombre;
  abrirModal("modalReclamar");
});

function enviarPorCorreo(asunto, cuerpo) {
  const url = "mailto:" + CORREO_DESTINO +
    "?subject=" + encodeURIComponent(asunto) +
    "&body=" + encodeURIComponent(cuerpo);
  window.location.href = url;
}

document.querySelectorAll(".modal-formulario").forEach(function (formulario) {
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const tipo = formulario.getAttribute("data-tipo");
    const datos = new FormData(formulario);
    let asunto = "";
    let cuerpo = "";

    if (tipo === "perdido") {
      asunto = "Nuevo objeto perdido reportado";
      cuerpo =
        "Categoría: " + datos.get("categoria") + "\n" +
        "Lugar: " + datos.get("lugar") + "\n" +
        "Descripción: " + datos.get("descripcion") + "\n" +
        "Contacto: " + datos.get("contacto");
      enviarPorCorreo(asunto, cuerpo);
      alert("Reporte enviado con éxito. Se abrirá tu correo para confirmar el envío.");
    }

    if (tipo === "encontrado") {
      const nuevoObjeto = {
        nombre: datos.get("nombre"),
        lugar: datos.get("lugar"),
        fecha: fechaHoy(),
        color: coloresPaleta[Math.floor(Math.random() * coloresPaleta.length)],
        inicial: datos.get("categoria")
      };
      guardarObjeto(nuevoObjeto);
      renderizarMuro();
      asunto = "Nuevo objeto encontrado publicado";
      cuerpo =
        "Categoría: " + datos.get("categoria") + "\n" +
        "Nombre: " + datos.get("nombre") + "\n" +
        "Lugar: " + datos.get("lugar") + "\n" +
        "Descripción: " + datos.get("descripcion") + "\n" +
        "Contacto: " + datos.get("contacto");
      enviarPorCorreo(asunto, cuerpo);
      alert("Objeto publicado en el muro. Se abrirá tu correo para notificar al administrador.");
    }

    if (tipo === "reclamo") {
      asunto = "Reclamo de objeto: " + datos.get("objeto");
      cuerpo =
        "Objeto reclamado: " + datos.get("objeto") + "\n" +
        "Nombre: " + datos.get("nombre") + "\n" +
        "Código estudiantil: " + datos.get("codigo") + "\n" +
        "Contacto: " + datos.get("contacto") + "\n" +
        "Prueba de propiedad: " + datos.get("prueba");
      enviarPorCorreo(asunto, cuerpo);
      alert("Reclamo enviado. Se abrirá tu correo para confirmar el envío al administrador.");
    }

    formulario.reset();
    const modal = formulario.closest(".modal-fondo");
    if (modal) cerrarModal(modal.id);
  });
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

renderizarMuro();
