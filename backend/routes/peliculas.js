import express from 'express';
import axios from 'axios';
const router = express.Router();

const API_KEY = "7515f8fcb67046367f61c1cf50f6bdc9";

export class Pelicula{
    constructor(id, nombre, descripcion, fechaSalida, puntuacion, id_generos){
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaSalida = fechaSalida;
        this.puntuacion = puntuacion;
        this.id_generos = id_generos;
    }
}

router.get("/populares", async(req, res) => {
    try{
        const page = req.query.page || 1; 
        const peliculas = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`);
        const peliculasArray = peliculas.data.results.map(pelicula => new Pelicula(pelicula.id, pelicula.title, pelicula.overview, pelicula.release_date, pelicula.vote_average, pelicula.genre_ids));
        res.json(peliculasArray);
    } catch (error) {
        console.error('Error detallado:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            message: "Error al obtener las peliculas",
            error: error.response ? error.response.data : error.message 
        });
    }
});

router.get("/nombre/:nombre", async(req, res) => {
    try{
        const nombre = req.params.nombre;
        const peliculas = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${nombre}`);
        const peliculasArray = peliculas.data.results.map(pelicula => new Pelicula(pelicula.id, pelicula.title, pelicula.overview, pelicula.release_date, pelicula.vote_average, pelicula.genre_ids));
        res.json(peliculasArray);
    } catch (error) {
        console.error('Error detallado:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            message: "Error al obtener las peliculas",
            error: error.response ? error.response.data : error.message 
        });
    }
})

router.get("/id/:id", async(req, res) => {
    try{
        const id = req.params.id;
        const pelicula = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es-ES`);
        
        res.json(new Pelicula(pelicula.data.id, pelicula.data.title, pelicula.data.overview, pelicula.data.release_date, pelicula.data.vote_average, pelicula.data.genre_ids));
    } catch (error) {
        console.error('Error detallado:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            message: "Error al obtener la pelicula",
            error: error.response ? error.response.data : error.message 
        });
    }
})

export default router;