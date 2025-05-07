import express from 'express';
import axios from 'axios';
import { Pelicula } from './peliculas.js';
const router = express.Router();

const API_KEY = "7515f8fcb67046367f61c1cf50f6bdc9";

router.get("/", async(req, res) => {
    try {
        const generos = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-ES`);
        res.json(generos.data.genres);
    } catch (error) {
        console.error('Error detallado:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            message: "Error al obtener los géneros",
            error: error.response ? error.response.data : error.message 
        });
    }
});


router.get("/id/:idGenero", async(req, res) => {
    try {
        const idGenero = req.params.idGenero;
        const page = req.query.page || 1;
        const peliculas = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${idGenero}&page=${page}`);
        const peliculasArray = peliculas.data.results.map(pelicula => new Pelicula(
            pelicula.id,
            pelicula.title,
            pelicula.overview,
            pelicula.release_date,
            pelicula.vote_average
        ));
        res.json(peliculasArray);
    } catch (error) {
        console.error('Error detallado:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            message: "Error al obtener las películas por género",
            error: error.response ? error.response.data : error.message 
        });
    }
});

export default router;
