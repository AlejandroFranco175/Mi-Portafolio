const BASE_URL = "https://alefranco.alwaysdata.net/projects/";

function mostrarSeccion(id) {
  // Colapsar navbar
  const navbarCollapse = document.getElementById('navbarNav');
  if (navbarCollapse.classList.contains('show')) {
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
      toggle: false
    });
    bsCollapse.hide();
  }

  // Mostrar sección
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.id === id);
  });

  if (id === "about") {
    cargarTecnologias();
  } else if (id === "projects") {
    cargarProyectos();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarSeccion("about");
});

function cargarTecnologias() {
  fetch(BASE_URL + 'api_tecnologias.php')
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById("tecnologias");
      contenedor.innerHTML = "";
      data.forEach(tecnologia => {
        const img = document.createElement("img");
        img.src = BASE_URL + tecnologia.imagen;
        img.alt = tecnologia.nombre;
        img.title = tecnologia.nombre;
        img.className = "icon";
        contenedor.appendChild(img);
      });
    })
    .catch(err => {
      console.error("Error al cargar tecnologías:", err);
    });
}

function cargarProyectos() {
  fetch(BASE_URL + 'api_proyectos.php')
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById("contenedor-proyectos");
      contenedor.innerHTML = "";
      data.forEach(proyecto => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-3 d-flex mt-4";
        const tecnologiasHTML = proyecto.tecnologias.map(tec => {
          return `<img src="${BASE_URL}${tec.imagen}" alt="${tec.nombre}" class="icon me-1" title="${tec.nombre}">`;
        }).join("");
        col.innerHTML = `
          <div class="card mb-4 h-100 d-flex flex-column bg-transparent text-light">
              <img src="${BASE_URL}${proyecto.imagen}" class="card-img-top" alt="${proyecto.nombre}">
              <div class="card-body flex-grow-1">
                  <h5 class="card-title">${proyecto.nombre}</h5>
                  <p class="card-text">${proyecto.descripcion}</p>
                  <div class="d-flex flex-wrap align-items-center gap-1">
                      ${tecnologiasHTML}
                  </div>
                  <br>
                  <a href="${proyecto.url}" class="btn mt-1" target="_blank">Ver Proyecto</a>
              </div>
          </div>
        `;
        contenedor.appendChild(col);
      });
    })
    .catch(err => {
      console.error("Error al cargar proyectos:", err);
    });
}

// Codigo para enviar el correo
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
    emailjs.send("service_acl51kc", "template_ggy7gip", templateParams1),
    emailjs.send("service_acl51kc", "template_ug8p703", templateParams2)
  ])
  .then(() => {
    this.reset();

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

// Esto pa arreglar la advertencia del modal
document.addEventListener('DOMContentLoaded', function() {
  const modalExito = document.getElementById('modalExito');
  
  if (modalExito) {
    // Cuando el modal se muestra, enfocar el botón OK
    modalExito.addEventListener('shown.bs.modal', function() {
      const okButton = this.querySelector('.btn-success');
      okButton.focus();
    });
    
    // Cuando el modal se oculta, quitar el focus manualmente
    modalExito.addEventListener('hide.bs.modal', function() {
      const okButton = this.querySelector('.btn-success');
      okButton.blur();
    });
    
    // Cuando el modal se ha ocultado completamente, mover el focus
    modalExito.addEventListener('hidden.bs.modal', function() {
      const submitBtn = document.querySelector('form button[type="submit"]');
      if (submitBtn) {
        setTimeout(() => {
          submitBtn.focus();
        }, 50);
      }
    });
  }
});