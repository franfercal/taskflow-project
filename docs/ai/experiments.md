## Detector de Palíndromos

Objetivo: Crear una función que determine si una cadena de texto es un palíndromo.

    Requisitos: La función debe ser capaz de ignorar los espacios en blanco, los signos de puntuación y no debe distinguir entre letras mayúsculas y minúsculas.

    Ejemplo: Si la entrada es "Anita lava la tina", la función debe retornar true (verdadero). Si la entrada es "Hola mundo", debe retornar false.

Mi solución:

cconst REGEX_NON_ALPHANUMERIC = /[^a-z0-9]/g;

const normalize = (str) =>
str.toLowerCase().replace(REGEX_NON_ALPHANUMERIC, "");

const reverse = (str) => str.split("").reverse().join("");

const isPalindrome = (input) => {
    const clean = normalize(input);
    return clean === reverse(clean);
};

const formatResult = (input, result) =>
`"${input}" → ${result ? "ES palíndromo" : "NO es palíndromo"}`;

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const prompt = () => {
    rl.question('\nEscribe una frase (o "salir" para terminar): ', (input) => {
        if (input.toLowerCase() === "salir") {
            console.log("\n¡Hasta luego!");
            rl.close();
            return;
        }

        console.log(formatResult(input, isPalindrome(input)));
        prompt();
    });
};
prompt();

La de la IA:

// ============================================================
// DETECTOR DE PALÍNDROMOS
// ============================================================

"use strict";

const readline = require("readline");

// ── Configuración ─────────────────────────────────────────
const CONFIG = {
  exitCommand: "salir",
  prompt: '\nEscribe una frase (o "salir" para terminar): ',
  messages: {
    header: "\n============================================\n       DETECTOR DE PALÍNDROMOS\n============================================",
    goodbye: "\n¡Hasta luego!",
    isPalindrome: "✅ ES palíndromo",
    isNotPalindrome: "❌ NO es palíndromo",
  },
};

// ── Lógica de palíndromos ─────────────────────────────────
const Palindrome = {
  REGEX: /[^a-z0-9]/g,

  normalize(str) {
    return str.toLowerCase().replace(this.REGEX, "");
  },

  reverse(str) {
    return str.split("").reverse().join("");
  },

  check(input) {
    const clean = this.normalize(input);
    return clean === this.reverse(clean);
  },
};

// ── Presentación ──────────────────────────────────────────
const UI = {
  printHeader() {
    console.log(CONFIG.messages.header);
  },

  printResult(input, isPalindrome) {
    const label = isPalindrome
      ? CONFIG.messages.isPalindrome
      : CONFIG.messages.isNotPalindrome;
    console.log(`"${input}" → ${label}`);
  },

  printGoodbye() {
    console.log(CONFIG.messages.goodbye);
  },
};

// ── Consola interactiva ───────────────────────────────────
const CLI = {
  rl: readline.createInterface({ input: process.stdin, output: process.stdout }),

  isExitCommand(input) {
    return input.toLowerCase() === CONFIG.exitCommand;
  },

  prompt() {
    this.rl.question(CONFIG.prompt, (input) => {
      if (this.isExitCommand(input)) {
        UI.printGoodbye();
        this.rl.close();
        return;
      }

      UI.printResult(input, Palindrome.check(input));
      this.prompt();
    });
  },
};

// ── Entry point ───────────────────────────────────────────
const main = () => {
  UI.printHeader();
  CLI.prompt();
};

main();

## Generador de Contraseñas Seguras 

Objetivo: Escribir un programa que genere contraseñas aleatorias.

    Requisitos: La función debe aceptar un parámetro numérico para determinar la longitud de la contraseña (el mínimo debe ser de 8 caracteres). La cadena generada debe contener obligatoriamente y de forma aleatoria, al menos: una letra mayúscula, una letra minúscula, un número y un carácter especial (como !@#$%^&*).

    Ejemplo: Al ejecutar la función solicitando una longitud de 10, el programa podría devolver algo como k9#Pq2m!zL.

Mi solución:

"use strict";

const readline = require("readline");

const CONFIG = {
  minLength: 8,
  charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*",
};

const generatePassword = (length) =>
  Array.from({ length }, () =>
    CONFIG.charset[Math.floor(Math.random() * CONFIG.charset.length)]
  ).join("");

const parseLength = (input) => {
  const n = parseInt(input, 10);
  if (isNaN(n)) return { ok: false, error: " Introduce un número válido." };
  if (n < CONFIG.minLength) return { ok: false, error: `El mínimo es ${CONFIG.minLength} caracteres.` };
  return { ok: true, value: n };
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const prompt = () => {
  rl.question('\nLongitud (o "salir"): ', (input) => {
    if (input.trim().toLowerCase() === "salir") {
      console.log("¡Hasta luego!");
      rl.close();
      return;
    }

    const result = parseLength(input);
    console.log(result.ok ? ` ${generatePassword(result.value)}` : result.error);
    prompt();
  });
};

prompt();

La de la IA:

"use strict";

const readline = require("readline");

class PasswordGenerator {
  static CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  static MIN_LENGTH = 8;

  static generate(length) {
    if (isNaN(length) || length < this.MIN_LENGTH)
      throw new Error(`La longitud mínima es ${this.MIN_LENGTH}.`);
    return Array.from({ length }, () =>
      this.CHARSET[Math.floor(Math.random() * this.CHARSET.length)]
    ).join("");
  }
}

class CLI {
  rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  run() {
    console.log("=== GENERADOR DE CONTRASEÑAS ===");
    this.prompt();
  }

  prompt() {
    this.rl.question('\nLongitud (o "salir"): ', (input) => {
      if (input.trim().toLowerCase() === "salir") return this.rl.close();
      try {
        console.log(`🔑 ${PasswordGenerator.generate(parseInt(input, 10))}`);
      } catch (e) {
        console.log(`⚠️  ${e.message}`);
      }
      this.prompt();
    });
  }
}

new CLI().run();

## El Clásico "FizzBuzz"

Objetivo: Escribir un programa que imprima en pantalla los números del 1 al 100, pero sustituyendo ciertos números por palabras.

    Requisitos: Si el número es múltiplo de 3, debe imprimir "Fizz". Si es múltiplo de 5, debe imprimir "Buzz". Si el número es múltiplo tanto de 3 como de 5 (por ejemplo, el 15), debe imprimir "FizzBuzz". Si no es múltiplo de ninguno, simplemente imprime el número.

    Ejemplo de la secuencia: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz...

Mi código: 

const RULES = [
  { divisor: 3, word: "Fizz" },
  { divisor: 5, word: "Buzz" },
];

const RANGE = { start: 1, end: 100 };

function evaluate(n, rules) {
  const result = rules
    .filter(({ divisor }) => n % divisor === 0)
    .map(({ word }) => word)
    .join("");

  return result || String(n);
}

function fizzBuzz(start, end, rules) {
  for (let i = start; i <= end; i++) {
    console.log(evaluate(i, rules));
  }
}

fizzBuzz(RANGE.start, RANGE.end, RULES);

La IA: 

const rules = [[3, "Fizz"], [5, "Buzz"]];
 
for (let i = 1; i <= 100; i++) {
  console.log(rules.map(([d, w]) => i % d === 0 ? w : "").join("") || i);
}


