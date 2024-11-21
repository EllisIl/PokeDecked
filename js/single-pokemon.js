const api_url = "https://pokeapi.co/api/v2/pokemon/";
const pokemonName = new URLSearchParams(window.location.search).get('pokemon');

// Function to fetch and display the detailed information of a single Pokémon
async function fetchSinglePokemon(name) {
    try {
        const response = await fetch(`${api_url}${name}`);
        const data = await response.json();
        displaySinglePokemon(data);
    } catch (err) {
        console.error(err);
    }
}

// Function to display a single Pokémon's data
function displaySinglePokemon(pokemon) {
    const pokemonContainer = document.querySelector('.single-pokemon-view');
    pokemonContainer.innerHTML = ''; // Clear the container before injecting new content

    const name = capitalize(pokemon.name);
    const image = pokemon.sprites.other.dream_world.front_default || pokemon.sprites.front_default;
    const id = pokemon.id;
    const types = pokemon.types.map(type => capitalize(type.type.name)).join(', ');
    const abilities = pokemon.abilities.map(ability => capitalize(ability.ability.name)).join(', ');

    // Create HTML content for the Pokémon view
    const nameElement = document.createElement('h1');
    nameElement.textContent = `${name} (ID: ${id})`;

    const imageElement = document.createElement('img');
    imageElement.src = image;
    imageElement.alt = `${name} image`;

    const typesElement = document.createElement('p');
    typesElement.textContent = `Types: ${types}`;

    const abilitiesElement = document.createElement('p');
    abilitiesElement.textContent = `Abilities: ${abilities}`;

    const statsElement = document.createElement('div');
    statsElement.classList.add('stats');
    pokemon.stats.forEach(stat => {
        const statElement = document.createElement('p');
        statElement.textContent = `${capitalize(stat.stat.name)}: ${stat.base_stat}`;
        statsElement.appendChild(statElement);
    });

    // Assemble everything into the container
    pokemonContainer.appendChild(nameElement);
    pokemonContainer.appendChild(imageElement);
    pokemonContainer.appendChild(typesElement);
    pokemonContainer.appendChild(abilitiesElement);
    pokemonContainer.appendChild(statsElement);
}

// Capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Handle back to home button
document.getElementById('home-button').addEventListener('click', () => {
    window.location.href = '/'; // Go back to the home page
});

// Fetch the Pokémon details
fetchSinglePokemon(pokemonName);
