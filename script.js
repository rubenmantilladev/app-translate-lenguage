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
// variables para lectores de voz
const $readers = document.querySelectorAll(".read");
// variables para los botones de lectura
const $listen = $(".listen");
// variables para los lenguajes por defecto
const languages1 = "es";
const languages2 = "en";

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

// API de TRANSLO
const url = "https://translo.p.rapidapi.com/api/v3/translate";
const OPTIONS = {
  method: "POST",
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    "X-RapidAPI-Key": "9341292fbbmsh632461f34cf4937p10906ajsn4d8342ddc3e6",
    "X-RapidAPI-Host": "translo.p.rapidapi.com",
  },
};

// funcion para traducir
$translate.addEventListener("click", async () => {
  if (!$from.value) return;
  OPTIONS.body = new URLSearchParams({
    from: $selectFirst.value,
    to: $selectSecond.value,
    text: $from.value,
  });
  const res = await fetch(url, OPTIONS);
  const data = await res.json();
  $to.value = data.translated_text;
  console.log(data.translated_text);
});

$readers.forEach((read, index) => {
  read.addEventListener("click", () => {
    const textToRead = index === 0 ? $from.value : $to.value;
    if (!textToRead) return;
    speechSynthesis.speak(new SpeechSynthesisUtterance(textToRead));
  });
});

var SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const res = event.results[0][0].transcript;
  $from.value = res;
  $translate.click();
};

$listen.addEventListener("click", () => {
  recognition.start();
});
