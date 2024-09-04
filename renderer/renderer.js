const estado = document.querySelector(".estado");
const minutosText = document.querySelector(".minutos");
const segundosText = document.querySelector(".segundos");
const inicio = document.querySelector(".inicio");
const pausa = document.querySelector(".pausa");
const reiniciar = document.querySelector(".reiniciar");
const minTrabajo = document.querySelector(".minTrabajo");
const minDescanso = document.querySelector(".minDescanso");
const minDescansoLargo = document.querySelector(".minDescansoLargo");
const main = document.querySelector(".main");
const periodo = document.querySelector(".periodo");
let minutosDescanso = minDescanso.value;
let estadoActual = "Trabajando";
let intervalo;
let minutos = minTrabajo.value;
let minutosDescansoLargo = minDescansoLargo.value;
let segundos = 60;
estado.innerHTML = estadoActual;
pausa.disabled = true;
periodo.innerHTML = 1;

minTrabajo.addEventListener("change", () => {
  if (minTrabajo.value > 0) {
    minutos = minTrabajo.value;
    establecerMinutos();
  }
});

minDescanso.addEventListener("change", () => {
  if (minDescanso.value > 0) {
    minutosDescanso = minDescanso.value;
  }
});

minDescansoLargo.addEventListener("change", () => {
  if (minDescansoLargo.value > 0) {
    minutosDescansoLargo = minDescansoLargo.value;
  }
});

establecerMinutos();

inicio.addEventListener("click", pomodoroCompleto);

pausa.addEventListener("click", pararManual);

reiniciar.addEventListener("click", reiniciarContador);

function cambiarColor() {
  main.classList.toggle("bg-green-100");
  inicio.classList.toggle("bg-green-500");
  inicio.classList.toggle("enabled:hover:bg-green-600");
  inicio.classList.toggle("enabled:active:bg-green-700");
  pausa.classList.toggle("bg-green-500");
  pausa.classList.toggle("enabled:hover:bg-green-600");
  pausa.classList.toggle("enabled:active:bg-green-700");
  reiniciar.classList.toggle("bg-green-500");
  reiniciar.classList.toggle("enabled:hover:bg-green-600");
  reiniciar.classList.toggle("enabled:active:bg-green-700");
}

function establecerMinutos() {
  minutosText.innerText = minutos;
  if (minutos < 10) {
    minutosText.innerText = `0${minutos}`;
  } else {
    minutosText.innerText = minutos;
  }
}

function cambiarSegundos() {
  segundos--;
  if (segundos < 10) {
    segundosText.innerText = `0${segundos}`;
  } else {
    segundosText.innerText = segundos;
  }
}

function cambiarMinutos() {
  if (segundos === 0 || segundosText.innerHTML === "00") {
    segundos = 60;
    minutos--;
    minutosText.innerText = minutos;
    if (minutos < 10) {
      minutosText.innerText = `0${minutos}`;
    } else {
      minutosText.innerText = minutos;
    }
  }
}

function cambiarBotones() {
  inicio.disabled = !inicio.disabled;
  pausa.disabled = !pausa.disabled;
}
function pararManual() {
  clearInterval(intervalo);
  cambiarBotones();
}

function reiniciarContador() {
  clearInterval(intervalo);
  if (estadoActual === "Trabajando") {
    minutos = minTrabajo.value;
  } else if (estadoActual === "Descanso" && periodo.innerHTML % 4 == 0) {
    minutos = minDescansoLargo.value;
  } else {
    minutos = minDescanso.value;
  }
  segundos = 60;
  segundosText.innerHTML = "00";
  establecerMinutos();
  cambiarBotones();
}

function comprobarReloj() {
  if (minutosText.innerHTML === "00" && segundosText.innerHTML === "00") {
    segundos = 60;
    cambiarEstado();
  }
}

function cambiarEstado() {
  if (estadoActual === "Trabajando") {
    window.tomarDescanso.descanso();
    estadoActual = "Descanso";
    if (periodo.innerHTML % 4 == 0) {
      minutos = minutosDescansoLargo;
    } else {
      minutos = minutosDescanso;
    }

    cambiarColor();
  } else {
    window.volverTrabajo.trabajo();
    minutos = minTrabajo.value;
    estadoActual = "Trabajando";
    periodo.innerHTML++;
    cambiarColor();
  }
  estado.innerHTML = estadoActual;
}

function pomodoroCompleto() {
  establecerMinutos();
  intervalo = setInterval(() => {
    comprobarReloj();
    cambiarMinutos();
    cambiarSegundos();
  }, 1000);

  cambiarBotones();
}

const inputTarea = document.querySelector(".inputTarea");
const agregarTarea = document.querySelector(".agregarTarea");
const tareas = document.querySelector(".tareas");

agregarTarea.addEventListener("click", nuevaTarea);

function nuevaTarea() {
  const tarea = crearTarea();
  tareas.innerHTML += tarea;
}

function obtenerDatos() {
  return inputTarea.value;
}

function idRandom() {
  const letras = "abcdefghijklmnopqrstuvwxyz";
  let id = "";

  for (let i = 0; i < 5; i++) {
    id += letras[Math.floor(Math.random() * (27 - 1) + 1)];
  }
  return id;
}

function crearTarea() {
  id = idRandom();
  datos = obtenerDatos();
  inputTarea.value = null;
  guardarTareaLocal(id, datos);
  return `
  <div class="flex bg-white rounded-md h-12 text-sm items-center p-2 m-2" id="${id}">
    <p class="flex-1">${datos}</p>
    <button value="${id}" onclick="eliminarTarea(this.value)" class="font-bold text-black hover:text-black/50 active:text-black/25">Terminar</button>
  </div>
  `;
}

function eliminarTarea(id) {
  const tareaBorrar = document.querySelector(`#${id}`);
  localStorage.removeItem(id);
  tareas.removeChild(tareaBorrar);
}

function guardarTareaLocal(id, datos) {
  localStorage.setItem(id, datos);
}

const nTareas = localStorage.length;

if (nTareas > 0) {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    let value = localStorage.getItem(key);
    tareas.innerHTML += `
  <div class="flex bg-white rounded-md h-12 text-sm items-center p-2 m-2" id="${key}">
    <p class="flex-1">${value}</p>
    <button value="${key}" onclick="eliminarTarea(this.value)" class="font-bold text-black hover:text-black/50 active:text-black/25">Terminar</button>
  </div>
  `;
  });
}
