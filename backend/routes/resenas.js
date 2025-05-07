import express from 'express';
import fs from 'fs';
const router = express.Router();


class Reseña{
    constructor( idPelicula, valoracion, comentario){
        this.idPelicula = idPelicula;
        this.valoracion = valoracion;
        this.comentario = comentario;
    }
}

router.post("/publicar", async(req, res) => {
    try {
        const { idPelicula, valoracion, comentario } = req.body;
        console.log('Datos recibidos:', req.body);

        if (!idPelicula || !valoracion || typeof valoracion !== 'number' || !comentario) {
            return res.status(400).json({
                message: "Todos los campos son requeridos"
            });
        }
        
        const reseña = new Reseña(idPelicula, valoracion, comentario);
        console.log('Reseña creada:', reseña);
        
        const archivo = 'resenas.json';
        let reseñas = [];

        if (fs.existsSync(archivo)) {
            const contenido = fs.readFileSync(archivo, 'utf-8');
            try {
                reseñas = JSON.parse(contenido);
            } catch (err) {
                console.error("JSON inválido:", err);
                reseñas = [];
            }
        }

        reseñas.push(reseña);

        fs.writeFileSync(archivo, JSON.stringify(reseñas, null, 2), 'utf-8');
        
        res.status(201).json({
            message: "Reseña guardada exitosamente",
            reseña: reseña
        });
    } catch (error) {
        console.error('Error al guardar la reseña:', error);
        res.status(500).json({
            message: "Error al guardar la reseña",
            error: error.message
        });
    }
});


router.get("/obtener/:idPelicula", async(req,res) =>{
    const idPelicula = req.params.idPelicula;
    const archivo = 'resenas.json';
    let reseñas = [];

    if (fs.existsSync(archivo)){
        const contenido = fs.readFileSync(archivo, 'utf-8')
        try {
            reseñas = JSON.parse(contenido);
        } catch (err){
            console.error("JSON inválido:", err);
            reseñas = [];
        }

    }

    const reseñas_buscadas = reseñas.filter(reseña => reseña.idPelicula == idPelicula);

    res.json(reseñas_buscadas);
});
    
export default router;