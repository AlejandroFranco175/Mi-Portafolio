function mostrarSeccion(id) {
  // Mostrar sección
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // Actualizar clase activa en navbar
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.id === id);
  });

  // Cargar contenido dinámico si aplica
  if (id === "about") {
    cargarTecnologias();
  } else if (id === "projects") {
    cargarProyectos();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  mostrarSeccion("about"); // se llama cuando se carga el DOM
});

function cargarTecnologias() {
  fetch('tecnologias.json')
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById("tecnologias");
      contenedor.innerHTML = ""; // limpiar antes del bucle

      data.forEach(tecnologia => {
        const img = document.createElement("img");
        img.src = tecnologia.src;
        img.alt = tecnologia.nombre;
        img.title = tecnologia.nombre;
        img.className = "icon";

        contenedor.appendChild(img);
      });
    });
}

function cargarProyectos() {
  Promise.all([
    fetch("proyectos.json").then(res => res.json()),
    fetch("tecnologias.json").then(res => res.json())
  ])
  .then(([proyectos, tecnologias]) => {
    const contenedor = document.getElementById("contenedor-proyectos");
    contenedor.innerHTML = "";

    proyectos.forEach(proyecto => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-3 d-flex mt-4";

      const tecnologiasHTML = proyecto.tecnologias.map(tec => {
        const tech = tecnologias.find(t => t.nombre.toLowerCase() === tec.toLowerCase());
        if (tech) {
          return `<img src="${tech.src}" alt="${tech.nombre}" class="icon me-1" title="${tech.nombre}">`;
        } else {
          return `<span class="tag">${tec}</span>`;
        }
      }).join(""); //join une todas las img en un solo string

      col.innerHTML = `
        <div class="card mb-4 h-100 d-flex flex-column bg-transparent text-light">
            <img src="${proyecto.imagen}" class="card-img-top" alt="${proyecto.nombre}">
            <div class="card-body flex-grow-1">
                <h5 class="card-title">${proyecto.nombre}</h5>
                <p class="card-text">${proyecto.descripcion}</p>
                <div class="d-flex flex-wrap align-items-center gap-1">
                    ${tecnologiasHTML}
                </div>
                <br>
                <a href="${proyecto.link}" class="btn mt-1" target="_blank">Ver Proyecto</a>
            </div>
        </div>
      `;

      contenedor.appendChild(col);
    });
  })
  .catch(err => {
    console.error("Error al cargar proyectos o tecnologías:", err);
  });
}


// Codigo para enviar el correo desde EmailJS:

emailjs.init("qxaO_J-e3eIWBeJIy");

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const btn = this.querySelector("button[type='submit']");
  btn.disabled = true;
  btn.textContent = "Enviando...";

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const mensaje = document.getElementById("mensaje").value;

  const templateParams1 = {
    name: nombre,
    email: email,
    message: mensaje
  };

  const templateParams2 = {
    name: nombre,
    email: email
  };

  Promise.all([
    emailjs.send("service_y89f4gk", "template_ggy7gip", templateParams1),
    emailjs.send("service_y89f4gk", "template_ug8p703", templateParams2)
  ])
  .then(() => {
    // Limpiar formulario
    this.reset();

    // Mostrar modal de éxito con Bootstrap
    const modal = new bootstrap.Modal(document.getElementById("modalExito"));
    modal.show();
  })
  .catch(err => {
    alert("Ocurrió un error al enviar el mensaje.");
    console.error("EmailJS error:", err);
  })
  .finally(() => {
    btn.disabled = false;
    btn.textContent = "Enviar";
  });
});

