let API_URL = "";
let API_TECH_URL = "";

function getEnv(key) {
  return window.env && window.env[key] ? window.env[key] : null;
}

// Cargar variables del .env
fetch('../.env')
  .then(res => res.text())
  .then(text => {
    window.env = {};
    text.split('\n').forEach(line => {
      const [k, v] = line.split('=');
      if (k && v) window.env[k.trim()] = v.trim();
    });
    API_URL = getEnv('API_URL');
    API_TECH_URL = getEnv('API_TECH_URL');
  });

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
  if (!API_TECH_URL) {
    setTimeout(cargarTecnologias, 100);
    return;
  }
  fetch(API_TECH_URL)
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById("tecnologias");
      contenedor.innerHTML = "";
      data.forEach(tecnologia => {
        const img = document.createElement("img");
        img.src = '../' + tecnologia.imagen;
        img.alt = tecnologia.nombre;
        img.title = tecnologia.nombre;
        img.className = "icon";
        contenedor.appendChild(img);
      });
    });
}

function cargarProyectos() {
  if (!API_URL) {
    setTimeout(cargarProyectos, 100);
    return;
  }
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById("contenedor-proyectos");
      contenedor.innerHTML = "";
      data.forEach(proyecto => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-3 d-flex mt-4";
        const tecnologiasHTML = proyecto.tecnologias.map(tec => {
          return `<img src="../${tec.imagen}" alt="${tec.nombre}" class="icon me-1" title="${tec.nombre}">`;
        }).join("");
        col.innerHTML = `
          <div class="card mb-4 h-100 d-flex flex-column bg-transparent text-light">
              <img src="../${proyecto.imagen}" class="card-img-top" alt="${proyecto.nombre}">
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
      console.error("Error al cargar proyectos:", err);
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

