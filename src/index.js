import express from "express"
import pokemonRoutes from "./routes/pokemon.routes.js";

const app = express()

app.use(express.json())

app.use("/", pokemonRoutes)

app.listen(3000)
console.log("🚀 Server running on port ", 3000)

export default app;