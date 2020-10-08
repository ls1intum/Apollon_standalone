import express from 'express';

const app = express();

app.get('/', (req: any, res: any) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3333);
