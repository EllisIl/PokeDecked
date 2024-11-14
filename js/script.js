const api_url = "https://pokeapi.co/api/v2/pokemon/";

async function fetchAllPokemon() {
    try {
        const response = await fetch(api_url);
        const data = await response.json();
        displayAllPokemon(data.results);
    } catch (err) {
        console.error(err);
    }
}
function displayAllPokemon(pokemons) {
    pokemons.forEach(pokemon => {
        displaySinglePokemon(pokemon);
    });
}

async function fetchSinglePokemon(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data
    } catch (err) {
        console.error(err);
    }
}

async function displaySinglePokemon(pokemon) {
    const singlePokemon = await fetchSinglePokemon(pokemon.url);
    const name = pokemon.name;
    const image = singlePokemon.sprites.other.dream_world.front_default;

    const nameElement = document.createElement('h1');
    nameElement.textContent = name;

    const urlElement = document.createElement('img');
    urlElement.src = image;

    const pokemonElement = document.createElement('div');
    pokemonElement.appendChild(nameElement);
    pokemonElement.appendChild(urlElement);

    document.getElementById("pokemon").appendChild(pokemonElement);
}

fetchAllPokemon();
