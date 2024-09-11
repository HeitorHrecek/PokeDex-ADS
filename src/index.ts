import express, { Request, Response } from "express";
import path from "path";

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));

app.get('/', function (request: Request, response: Response) {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1025")
        .then(res => res.json())
        .then(data => {
            response.render("index", { results: data });
        })
        .catch(error => {
            response.status(500).send("Erro ao buscar os dados do Pokemon");
        });
});

app.get('/pokemon/:name', function (request: Request, response: Response) {
    const pokemonName = request.params.name;
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(res => res.json())
        .then(data => {
            const abilitiesPromises = data.abilities.map((ability: any) => 
                fetch(`https://pokeapi.co/api/v2/ability/${ability.ability.name}`).then(res => res.json())
            );

            return Promise.all(abilitiesPromises)
                .then(abilities => {
                    response.render("pokemon", { pokemon: data, abilities });
                });
        })
        .catch(error => {
            console.error("Erro ao buscar os dados do Pokemon:", error);
            response.status(500).send("Erro ao buscar os dados do Pokemon.");
        });
});

app.listen(3000, function () {
    console.log("Servidor está rodando.");
});
