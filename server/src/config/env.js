require("dotenv").config();

const variablePuerto = process.env.PORT;

if (variablePuerto === undefined || variablePuerto === null || String(variablePuerto).trim() === "") {
  throw new Error("Puerto no definido");
}
