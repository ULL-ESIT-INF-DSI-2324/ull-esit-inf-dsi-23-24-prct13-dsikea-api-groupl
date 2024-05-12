import express from 'express';
/**
 * Enrutador predeterminado que maneja todas las solicitudes entrantes.
 */

export const defaultRouter = express.Router();
/**
 * Maneja todas las solicitudes que no coinciden con ninguna otra ruta definida.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 */
defaultRouter.all('*', async (req, res) => {
  res.status(501).send({ message: 'Not Implemented' });
});
