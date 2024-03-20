var sirenaAudio = document.getElementById("sirena");
var detenerSirenaBtn = document.getElementById("detenerSirenaBtn");
var cuentaAtras = document.getElementById("cuenta-atras");
var pausarBtn = document.getElementById("pausarCuenta");

var tiempoTotal = 0; // Variable global para almacenar el tiempo total en segundos
var tiempoRestante = 0; // Variable global para almacenar el tiempo restante cuando se pausa la cuenta atrás
var intervalo; // Variable global para almacenar el intervalo

function iniciarCuentaRegresiva() {
  // Si no hay tiempo restante almacenado, obtener los valores de horas, minutos y segundos del formulario
  if (tiempoRestante === 0) {
    var horas = parseInt(document.getElementById("horas").value) || 0;
    var minutos = parseInt(document.getElementById("minutos").value) || 0;
    var segundos = parseInt(document.getElementById("segundos").value) || 0;

    // Calcular el tiempo total en segundos
    tiempoTotal = horas * 3600 + minutos * 60 + segundos;
  }

  // Establecer un intervalo para actualizar la cuenta atrás cada segundo
  intervalo = setInterval(function() {
    // Calcular horas, minutos y segundos restantes
    var horasRestantes = Math.floor(tiempoTotal / 3600);
    var minutosRestantes = Math.floor((tiempoTotal % 3600) / 60);
    var segundosRestantes = tiempoTotal % 60;

    // Ocultar elementos relacionados con el formulario y el inicio de la cuenta regresiva
    document.getElementById("formulario-tiempo").style.display = "none"; // Ocultar el formulario al iniciar la cuenta regresiva
    document.getElementById("inicioCuenta").style.display = "none"; // Ocultar el botón de inicio
    document.getElementById("lineaInf").style.display = "none"; // Ocultar la línea inferior
  

    // Actualizar la cuenta atrás en el formato HH:MM:SS
    cuentaAtras.innerHTML = horasRestantes.toString().padStart(2, '0') + ":" + minutosRestantes.toString().padStart(2, '0') + ":" + segundosRestantes.toString().padStart(2, '0');

    // Si el tiempo restante es igual o menor que cero, detener el intervalo y activar la alarma
    if (tiempoTotal <= 0) {
      clearInterval(intervalo);
      cuentaAtras.innerHTML = "¡Tiempo terminado!";
      sirenaAudio.play();
      document.body.classList.add("fondo-rojo"); // Cambiar el color de fondo del cuerpo a rojo
      sirenaAudio.loop = true; // Establecer el bucle de repetición
      detenerSirenaBtn.style.display = "inline"; // Mostrar el botón de detener sirena
      cuentaAtras.classList.add("mensaje-crecimiento"); // Agregar animación de crecimiento al mensaje
      activarAlerta(); // Activar la alerta de notificación
    } else {
      tiempoTotal--; // Disminuir el tiempo restante en cada iteración del intervalo
    }

    // Cambiar el color de la cuenta atrás si faltan menos de 60 segundos
    if (tiempoTotal < 60) {
      cuentaAtras.style.color = "red"; // Cambiar a color rojo
    } else {
      cuentaAtras.style.color = "black"; // Restaurar a color negro
    }
  }, 1000); // Ejecutar cada segundo

  pausarBtn.style.display = "inline"; // Mostrar el botón de pausa
  pausarBtn.addEventListener("click", pausarCuentaAtras); // Agregar evento clic al botón de pausa
}

function pausarCuentaAtras() {
  clearInterval(intervalo); // Pausar la cuenta atrás
  tiempoRestante = tiempoTotal; // Almacenar el tiempo restante
  pausarBtn.textContent = "Reanudar"; // Cambiar texto del botón a "Reanudar"
  pausarBtn.removeEventListener("click", pausarCuentaAtras); // Eliminar el evento clic actual
  pausarBtn.addEventListener("click", reanudarCuentaAtras); // Agregar evento clic para reanudar
}

function reanudarCuentaAtras() {
  iniciarCuentaRegresiva(); // Reanudar la cuenta atrás
  pausarBtn.textContent = "Pausar"; // Cambiar texto del botón a "Pausar"
  pausarBtn.removeEventListener("click", reanudarCuentaAtras); // Eliminar el evento clic actual
  pausarBtn.addEventListener("click", pausarCuentaAtras); // Agregar evento clic para pausar
}

function activarAlerta() {
    // Ocultar el botón de pausar
    pausarBtn.style.display = "none";
  
    // Mostrar una notificación llamativa
    var notification = new Notification("¡Tiempo terminado!", {
      body: "Haz clic aquí para volver a la pestaña.",
      icon: "icono.png" // Cambia "icono.png" por la ruta de tu propio icono si lo deseas
    });
  
    // Hacer que la pestaña destaque
    var intervaloParpadeo = setInterval(function() {
      document.title = (document.title === "¡Hazme caso!") ? " " : "¡Hazme caso!";
    }, 1000);
  
    // Manejar el clic en la notificación
    notification.onclick = function() {
      clearInterval(intervaloParpadeo); // Detener el parpadeo
      document.title = "Cuenta regresiva"; // Restaurar el título de la página
      window.focus(); // Poner la pestaña en primer plano
      this.close(); // Cerrar la notificación
    };
  }

function detenerSirena() {
    sirenaAudio.pause();
    document.body.classList.remove("fondo-rojo");
    document.getElementById("formulario-tiempo").style.display = "block"; // Mostrar el formulario al detener la alarma
    document.getElementById("inicioCuenta").style.display = "inline"; // Mostrar el formulario al detener la alarma
    document.getElementById("lineaInf").style.display = "block"; // Mostrar la línea inferios
    sirenaAudio.currentTime = 0;
    sirenaAudio.loop = false; // Desactivar el bucle de repetición
    detenerSirenaBtn.style.display = "none"; // Ocultar el botón de detener sirena
    cuentaAtras.classList.remove("mensaje-crecimiento"); // Quitar la animación de crecimiento al mensaje
    cuentaAtras.innerHTML = ""; // Limpiar el mensaje
    
    // Recargar la página después de detener la alarma
    location.reload();
  }