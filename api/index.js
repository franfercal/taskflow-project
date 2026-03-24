/**
 * Punto de entrada serverless de Vercel para la app Express del proyecto.
 * `vercel.json` reenvía todas las rutas aquí; Express sirve estáticos y la API como en local.
 *
 * @see https://vercel.com/kb/guide/using-express-with-vercel
 */

module.exports = require("../server/src/index.js");
