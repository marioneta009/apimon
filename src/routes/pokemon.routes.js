import { Router } from "express"
import axios from "axios"
import { PrismaClient} from '@prisma/client';
import NodeCache from 'node-cache';
import authenticateToken from '../midlewareAuth.js';


const prisma = new PrismaClient()
const router = Router()
const myCache = new NodeCache({ stdTTL: 10, checkperiod: 120 });

router.get("/", async (req, res) => {
    const key = 'pokemonList';
    const value = myCache.get(key);
    if (value != undefined) {
        res.json(value);
    } else {
        try {
            const list = await prisma.pokemon.findMany();
            myCache.set(key, list);
            res.json(list);
        } catch (error) {
            console.error('Prisma error:', error);
            res.status(500).json({ error: 'Error retrieving the pokemons from the database' });
        }
    }
})

router.get("/:name", async (req, res) => {
    const name = (req.params.name).toLowerCase();

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        
            const data = response.data;
            const result = {
                name: data.name,
                moves: data.moves.slice(0, 4).map(move => move.move.name).join(', '),
                types: data.types.map(type => type.type.name).join(', '),
            };
            try {
                const newPokemon = await prisma.pokemon.create({
                    data: result,
                });
                    res.json(newPokemon);
            } catch (error) {
                if (error.code === 'P2002') {
                    res.status(409).json({error: 'This pokemon already exists in the database'});
                } else {
                    console.error('Prisma error:', error);
                    res.status(500).json({error: 'Error saving the pokemon in the database'});

                }
            }
        
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({error: 'Pokemon not found in PokeAPI'});
        } else {
            res.status(500).json({error: 'Error retrieving data from PokeAPI'});
        }
    }
})

router.delete("/:id", authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const pokemon = await prisma.pokemon.delete({
            where: { id: id },
        });
        res.json({ message: 'Pokemon deleted successfully', pokemon });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Pokemon not found in the database' });
        } else {
            res.status(500).json({ error: 'Error deleting the pokemon from the database' });
        }
    }
});

router.delete("/free/:name", authenticateToken, async (req, res) => {
    const name = (req.params.name).toLowerCase();
    try {
        const pokemon = await prisma.pokemon.delete({
            where: { name: name },
        });
        res.json({ message: 'Pokemon deleted successfully', pokemon });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Pokemon not found in the database' });
        } else {
            res.status(500).json({ error: 'Error deleting the pokemon from the database' });
        }
    }
});

router.delete("/type/:type", authenticateToken, async (req, res) => {
    const type = (req.params.type).toLowerCase();
    try {
        const result = await prisma.pokemon.deleteMany({
            where: {
                types: {
                    contains: type,
                },
            },
        });
        if (result.count > 0) {
            res.json({ message: `Pokemons of type ${type} deleted successfully` });
        } else {
            res.status(404).json({ error: `No Pokemons of type ${type} found in the database` });
        }
    } catch (error) {
        console.error('Prisma error:', error);
        res.status(500).json({ error: 'Error deleting the pokemons from the database' });
    }
});

export default router