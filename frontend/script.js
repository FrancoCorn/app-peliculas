function mostrarPeliculas(peliculas) {
  const lista = document.getElementById('lista-peliculas');
  lista.innerHTML = '';
  if (peliculas.length === 0) {
    lista.innerHTML = '<li>No se encontraron películas.</li>';
    return;
  }
  peliculas.forEach(p => {
    const li = document.createElement('li');
    li.className = 'pelicula';
    li.innerHTML = `
      <strong>${p.nombre}</strong> (${p.fechaSalida})<br>
      <em>Puntuación:</em> ${p.puntuacion}<br>
      <em>Descripción:</em> ${p.descripcion}
    `;
    li.onclick = () => abrirModalResena(p);
    lista.appendChild(li);
  });
}

function mostrarResenas(resenas){
  const lista = document.getElementById('lista-resenas');
  lista.innerHTML = '';

  if (resenas.length == 0){
    lista.innerHTML = '<li>No se encontraron resenas.</li>'
    return;
  }

  resenas.forEach(r => {
    const li = document.createElement('li');
    li.className = 'reseña';

    li.innerHTML = `
      <strong>Puntuación: </strong> ${r.valoracion}<br>
      <em>Comentario: </em> ${r.comentario}
    `;

    lista.appendChild(li);
  })
}

function abrirModalResena(pelicula) {
  const modal = document.getElementById('modal-resena');
  const titulo = document.getElementById('modal-titulo');
  const idPelicula = document.getElementById('modal-id-pelicula');
  
  titulo.textContent = pelicula.nombre;
  idPelicula.value = pelicula.id;
  modal.classList.add('show');

  cargarResenas(pelicula.id);
}

function cerrarModal() {
  const modal = document.getElementById('modal-resena');
  modal.classList.remove('show');
  document.getElementById('form-resena').reset();
}

window.onclick = function(event) {
  const modal = document.getElementById('modal-resena');
  if (event.target == modal) {
    cerrarModal();
  }
}

async function enviarResena(event) {
  event.preventDefault();
  const form = event.target;
  const idPelicula = form.idPelicula.value;
  const valoracion = Number(form.valoracion.value);
  const comentario = form.comentario.value;

  try {
    const response = await fetch('http://localhost:3000/resenas/publicar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        idPelicula: parseInt(idPelicula),
        valoracion: parseInt(valoracion),
        comentario
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al publicar la reseña');
    }
    alert('¡Reseña publicada con éxito!');
    cargarResenas(idPelicula);
  } catch (error) {
    alert('Error al publicar la reseña: ' + error.message);
  }
}

function cargarPopulares() {

  document.getElementById('busqueda').value = '';
  document.getElementById('selector-generos').value = '';
  document.getElementById('puntuacion').value = '';
  
  fetch('http://localhost:3000/peliculas/populares')
    .then(res => res.json())
    .then(mostrarPeliculas)
    .catch(() => alert('Error al cargar las películas populares'));
}

function buscarPelicula() {
  const nombre = document.getElementById('busqueda').value.trim();
  if (!nombre) {
    alert('Ingresa un nombre para buscar');
    return;
  }

  document.getElementById('selector-generos').value = '';
  document.getElementById('puntuacion').value = '';
  
  fetch(`http://localhost:3000/peliculas/nombre/${encodeURIComponent(nombre)}`)
    .then(res => res.json())
    .then(mostrarPeliculas)
    .catch(() => alert('Error al buscar la película'));
}

function cargarResenas(idPelicula){
  fetch(`http://localhost:3000/resenas/obtener/${idPelicula}`)
    .then(res=> res.json())
    .then(mostrarResenas)
    .catch(() => alert('Error al cargar las reseñas'))
}

function cargarPorGenero() {
  const idGenero = document.getElementById('selector-generos').value;
  if (!idGenero) return;
  
  document.getElementById('busqueda').value = '';
  document.getElementById('puntuacion').value = '';
  
  fetch(`http://localhost:3000/generos/id/${idGenero}`)
    .then(res => res.json())
    .then(mostrarPeliculas)
    .catch(() => alert('Error al cargar las películas por género'));
}

function cargarGeneros() {
  fetch('http://localhost:3000/generos')
    .then(res => res.json())
    .then(generos => {
      const selector = document.getElementById('selector-generos');
      generos.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero.id;
        option.textContent = genero.name;
        selector.appendChild(option);
      });
    })
    .catch(() => alert('Error al cargar los géneros'));
}

function buscarPorPuntuacion(){
  const comparador = document.getElementById('comparador').value;
  const puntuacion = document.getElementById('puntuacion').value;
  
  if (!puntuacion || puntuacion < 0 || puntuacion > 10) {
    alert('Ingresa una puntuación válida entre 0 y 10');
    return;
  }

  document.getElementById('busqueda').value = '';
  document.getElementById('selector-generos').value = '';
  
  // Mostrar indicador de carga
  const lista = document.getElementById('lista-peliculas');
  lista.innerHTML = '<li class="loading">Cargando películas... ⌛</li>';
  
  if (comparador === "mayor"){
    fetch(`http://localhost:3000/peliculas/puntuacionMayor/${puntuacion}`)
      .then(res => res.json())
      .then(mostrarPeliculas)
      .catch(() => {
        alert('Error al cargar las películas por puntuación');
        lista.innerHTML = '<li>Error al cargar las películas.</li>';
      });
  } else {
    fetch(`http://localhost:3000/peliculas/puntuacionMenor/${puntuacion}`)
      .then(res => res.json())
      .then(mostrarPeliculas)
      .catch(() => {
        alert('Error al cargar las películas por puntuación');
        lista.innerHTML = '<li>Error al cargar las películas.</li>';
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarPopulares();
  cargarGeneros();
});