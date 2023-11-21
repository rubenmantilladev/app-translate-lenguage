import languages from "./languages.js";

// funcion para seleccionar elementos
const $ = (selector) => document.querySelector(selector);

// variables para los selectores
const $selectFirst = $(".first");
const $selectSecond = $(".second");
const $translate = $(".translate");
// variables para los botones de cambio
const $change = $("#change");
const $from = $(".fromText");
const $to = $(".toText");
const $trash = $(".trash");
// variables para lectores de voz
const $readers = document.querySelectorAll(".read");
// variables para los botones de lectura
const $listen = $(".listen");
// variables para los lenguajes por defecto
const languages1 = "es";
const languages2 = "en";
// btn para copiar texto
const $copy = $("#btn-copy");

// Loading
const $loading = $("#btn-loading");

for (const i in languages) {
  // obteniendo el key y value de cada objeto
  const value = Object.keys(languages[i]).toString();
  const key = Object.values(languages[i]).toString();

  // introduciendo el value y key en los options
  $selectFirst.innerHTML += `<option value="${key}">${value}</option>`;
  $selectSecond.innerHTML += `<option value="${key}">${value}</option>`;
}

// Añadiendo lenguajes por defecto
$selectFirst.value = languages1;
$selectSecond.value = languages2;

// funcion para intercambiar los lenguajes
$change.addEventListener("click", () => {
  [$selectFirst.value, $selectSecond.value] = [
    $selectSecond.value,
    $selectFirst.value,
  ];

  if (!$to.value) return;
  [$from.value, $to.value] = [$to.value, $from.value];
});

// funcion para traducir
async function translate() {
  try {
    $loading.style.visibility = "visible";
    const url = "https://text-translator2.p.rapidapi.com/translate";
    const OPTIONS = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "65b7ceac59mshab258e964e0b131p171c50jsn97f6dfdb82ac",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      body: new URLSearchParams({
        source_language: $selectFirst.value,
        target_language: $selectSecond.value,
        text: $from.value,
      }),
    };
    const res = await fetch(url, OPTIONS).finally(() => {
      $loading.style.visibility = "hidden";
    });
    const data = await res.json();
    $to.value = data.data.translatedText;
  } catch (error) {
    console.log(error);
    return;
  }
}

// funcion para traducir al dar click
$translate.addEventListener("click", () => {
  if (!$from.value) return;
  translate();
});

$from.addEventListener("keydown", (e) => {
  if (!$from.value) return;
  // Si se presiona Ctrl + Enter
  if (e.ctrlKey && e.keyCode === 13) {
    translate();
  }
});

$readers.forEach((read, index) => {
  read.addEventListener("click", () => {
    const textToRead = index === 0 ? $from.value : $to.value;
    if (!textToRead) return;
    speechSynthesis.speak(new SpeechSynthesisUtterance(textToRead));
  });
});

// API de SpeechRecognition para la funcion de microfono
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  var SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}

recognition.onresult = (event) => {
  const res = event.results[0][0].transcript;
  $from.value = res;
  $translate.click();
};

$listen.addEventListener("click", () => {
  // Iniciando el microfono
  recognition.start();
  // Capturando el evento de inicio
  recognition.onstart = () => {
    console.log("Se inicio el microfono");
  };
  // Capturando el evento de finalizacion
  recognition.onend = () => {
    console.log("Se detuvo el microfono");
  };
});

$copy.addEventListener("click", copyText);
function copyText() {
  if (!$to.value) return;
  navigator.clipboard.writeText($to.value);
}

// Contador de caracteres
const $contador1 = document.getElementById("contador1");
$from.addEventListener("input", function (e) {
  const target = e.target;
  const longMax = target.getAttribute("maxlength");
  const longActual = target.value.length;
  $contador1.innerHTML = `${longActual}/${longMax}`;
});
const $contador2 = document.getElementById("contador2");
$to.addEventListener("input", function (e) {
  const target = e.target;
  const longMax = target.getAttribute("maxlength");
  const longActual = target.value.length;
  $contador2.innerHTML = `${longActual}/${longMax}`;
});

$trash.addEventListener("click", () => {
  $from.value = "";
  $to.value = "";
  $contador1.innerHTML = `0/500`;
  $contador2.innerHTML = `0/500`;
});

// Cambiar el contenido del boton de copiar al dar click
$copy.addEventListener("click", () => {
  $copy.innerHTML = `<i class="bx bx-check"></i>`;
  setTimeout(() => {
    $copy.innerHTML = `<i class="bx bx-copy-alt"></i>`;
  }, 800);
});

// Focus en el textarea
$from.focus();
