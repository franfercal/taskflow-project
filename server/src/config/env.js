require("dotenv").config();

const despliegueVercel =
  process.env.VERCEL === "1" || process.env.VERCEL === "true" || Boolean(process.env.VERCEL_URL);

let variablePuerto = process.env.PORT;

if (despliegueVercel && (variablePuerto === undefined || variablePuerto === null || String(variablePuerto).trim() === "")) {
  process.env.PORT = "3000";
  variablePuerto = "3000";
}

if (!despliegueVercel && (variablePuerto === undefined || variablePuerto === null || String(variablePuerto).trim() === "")) {
  throw new Error("Puerto no definido");
}
