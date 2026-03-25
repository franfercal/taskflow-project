require("dotenv").config();

// Vercel no usa puerto como en local no se puedeponer obligatorio PORT en .env
const despliegueVercel =
  process.env.VERCEL === "1" || process.env.VERCEL === "true" || Boolean(process.env.VERCEL_URL);

let variablePuerto = process.env.PORT;

// En serverless tenemos que poner un PORT ficticio
if (despliegueVercel && (variablePuerto === undefined || variablePuerto === null || String(variablePuerto).trim() === "")) {
  process.env.PORT = "3000";
  variablePuerto = "3000";
}

// En necesitamos tener .env bien puesto
if (!despliegueVercel && (variablePuerto === undefined || variablePuerto === null || String(variablePuerto).trim() === "")) {
  throw new Error("Puerto no definido");
}
