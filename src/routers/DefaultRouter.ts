import express from 'express';

export const defaultRouter = express.Router();

defaultRouter.all('*', async (req, res) => {
  res.status(501).send({ message: 'Not Implemented' });
});
