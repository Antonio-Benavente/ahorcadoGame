// Obtiene el lienzo y su contexto para dibujar el ahorcado
const canvas = document.getElementById("ahorcado");
const ctx = canvas.getContext("2d");

// Obtiene los elementos del DOM necesarios para la interfaz del juego
const btnIniciar = document.getElementById("iniciar");
const modal = document.getElementById("modal");
const modalReinicio = document.getElementById("modal-reinicio");
const contenedor = document.getElementById("container");
const palabraElemento = document.getElementById("word");
const intentosElemento = document.getElementById("attempts");
const mensajeResultado = document.getElementById("resultado-mensaje");
const palabraCorrectaElemento = document.getElementById("palabra-correcta");
const btnReiniciar = document.getElementById("reiniciar");

// Obtiene los botones de dificultad
const btnFacil = document.getElementById("facil");
const btnIntermedio = document.getElementById("intermedio");
const btnDificil = document.getElementById("dificil");

// Variables del juego
let palabraElegida = "";
let palabraEscondida = [];
let intentos = 5;
let dificultad = "";

// Manejo de selección de dificultad
const botonesDificultad = document.querySelectorAll(".dificultad button");
let botonSeleccionado = null;

botonesDificultad.forEach(boton => {
    boton.addEventListener("click", function () {
        if (botonSeleccionado) {
            botonSeleccionado.style.backgroundColor = "";
            botonSeleccionado.style.color = "";
        }

        this.style.backgroundColor = "#3D3D3D";
        this.style.color = "white";
        botonSeleccionado = this;

        dificultad = this.id;
    });
});

// Función para dibujar el ahorcado dependiendo del número de intentos restantes
function dibujarAhorcado(intentos) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";

    if (intentos <= 4) {
        ctx.beginPath();
        ctx.moveTo(10, 240);
        ctx.lineTo(190, 240);
        ctx.moveTo(50, 240);
        ctx.lineTo(50, 20);
        ctx.lineTo(130, 20);
        ctx.lineTo(130, 50);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(130, 70, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (intentos <= 3) {
        ctx.beginPath();
        ctx.moveTo(130, 90);
        ctx.lineTo(130, 150);
        ctx.stroke();
    }
    if (intentos <= 2) {
        ctx.beginPath();
        ctx.moveTo(130, 100);
        ctx.lineTo(100, 130);
        ctx.stroke();
    }
    if (intentos <= 1) {
        ctx.beginPath();
        ctx.moveTo(130, 100);
        ctx.lineTo(160, 130);
        ctx.stroke();
    }
    if (intentos <= 0) {
        ctx.beginPath();
        ctx.moveTo(130, 150);
        ctx.lineTo(100, 190);
        ctx.moveTo(130, 150);
        ctx.lineTo(160, 190);
        ctx.stroke();
    }
}

// Selecciona una palabra aleatoria según la dificultad elegida
function seleccionarPalabra() {
    if (!window[dificultad] || window[dificultad].length === 0) return "";
    return window[dificultad][Math.floor(Math.random() * window[dificultad].length)];
}

// Muestra la palabra oculta como espacios vacíos
function mostrarPalabraEscondida() {
    palabraEscondida = palabraElegida.split("").map(() => `<span class="caja-letras"></span>`);
    palabraElemento.innerHTML = palabraEscondida.join(" ");
}

// Inicia el juego, elige una palabra y reinicia los intentos
function iniciarJuego() {
    if (!dificultad) {
        alert("Selecciona una dificultad antes de empezar.");
        return;
    }

    palabraElegida = seleccionarPalabra();
    if (!palabraElegida) {
        alert("No hay palabras disponibles para la dificultad seleccionada");
        return;
    }

    mostrarPalabraEscondida();
    intentos = 5;
    intentosElemento.textContent = intentos;
    dibujarAhorcado(intentos);

    // Oculta el modal de inicio y muestra el juego
    modal.style.visibility = "hidden";
    contenedor.style.visibility = "visible";
    modalReinicio.style.display = "none";

    // Habilita el teclado virtual
    document.querySelectorAll(".key").forEach(button => {
        button.disabled = false;
    });
}

// Verifica si la letra ingresada está en la palabra
function verificarLetra(letra) {
    letra = letra.toLowerCase();
    if (!letra.match(/[a-záéíóú]/) || letra.length !== 1) {
        alert("Introduce una letra válida");
        return;
    }
    if (intentos <= 0) return;

    let encontrada = false;
    const cuadrosLetras = document.querySelectorAll(".caja-letras");
    palabraElegida.split("").forEach((caracter, i) => {
        if (caracter === letra) {
            cuadrosLetras[i].textContent = letra;
            encontrada = true;
        }
    });

    // Si no se encuentra la letra, se reduce el número de intentos
    if (!encontrada) {
        intentos--;
        intentosElemento.textContent = intentos;
        dibujarAhorcado(intentos);
    }

    // Verifica si el jugador ha ganado o perdido
    if ([...cuadrosLetras].every(span => span.textContent !== "")) {
        mostrarModalReinicio("¡Ganaste!");
    } else if (intentos === 0) {
        mostrarModalReinicio("Perdiste");
    }
}

// Maneja la entrada de una letra desde el teclado virtual
function checkLetter(letter, button) {
    button.disabled = true;
    verificarLetra(letter);
}

// Muestra el modal de reinicio con el resultado del juego
function mostrarModalReinicio(mensaje) {
    document.querySelectorAll(".key").forEach(boton => {
        boton.disabled = true;
    });
    mensajeResultado.textContent = mensaje;
    palabraCorrectaElemento.textContent = `La palabra era: "${palabraElegida}"`;
    modalReinicio.style.display = "flex";
}

// Reinicia el juego cuando se presiona el botón de reinicio
btnReiniciar.addEventListener("click", () => {
    modalReinicio.style.display = "none";
    modal.style.visibility = "visible";
});

// Crea el teclado virtual al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    const keyboardContainer = document.getElementById("keyboard");
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    letters.forEach(letter => {
        const button = document.createElement("button");
        button.textContent = letter;
        button.classList.add("key");
        button.addEventListener("click", () => checkLetter(letter, button));
        keyboardContainer.appendChild(button);
    });
});

// Agrega el evento para iniciar el juego cuando se presiona el botón "Iniciar"
btnIniciar.addEventListener("click", iniciarJuego);
