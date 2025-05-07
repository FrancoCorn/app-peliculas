import express from 'express';
import peliculasRouter from './routes/peliculas.js';
import generosRouter from './routes/generos.js';
import resenasRouter from './routes/resenas.js';

const app = express();


app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/peliculas', peliculasRouter);
app.use('/generos', generosRouter);
app.use('/resenas', resenasRouter);
    

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});