function mostrarSeccion(id) {
    const secciones = document.querySelectorAll('.section');
    secciones.forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    if (id === "projects") {
        cargarProyectos();
    }
}


function cargarProyectos() {
    fetch("proyectos.json")
      .then(response => response.json())
      .then(data => {
        const contenedor = document.getElementById("contenedor-proyectos");
        contenedor.innerHTML = ""; // limpiar por si ya hay algo
  
        data.forEach(proyecto => {
          const col = document.createElement("div");
          col.className = "col-12 col-md-6 col-lg-3 d-flex mt-4";
  
          col.innerHTML = `
            <div class="card mb-4 border-info h-100 d-flex flex-column bg-transparent text-light">
                <img src="${proyecto.imagen}" class="card-img-top" alt="${proyecto.nombre}">
                <div class="card-body flex-grow-1">
                    <h5 class="card-title">${proyecto.nombre}</h5>
                    <p class="card-text">${proyecto.descripcion}</p>
                    <div>
                        ${proyecto.tecnologias.map(tec => `<span class="tag">${tec}</span>`).join("")}
                    </div>
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
  