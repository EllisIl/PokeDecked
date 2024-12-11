const getRandomPokemon = async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1281"); // Fetch the full list of Pokémon.
    const data = await response.json();

    // Generate three random indices from the total count of Pokémon.
    const randomIndices = Array.from({ length: 3 }, () => Math.floor(Math.random() * data.count));

    // Fetch details for the three random Pokémon.
    const promises = randomIndices.map(index => fetch(data.results[index].url).then(res => res.json()));
    return Promise.all(promises);
};

const createCard = (pokemon) => {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-image" />
        <h3 class="pokemon-name">${capitalize(pokemon.name)}</h3>
        <p class="pokemon-type">Type: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(", ")}</p>
    `;

    return card;
};

const populateCards = async () => {
    const container = document.getElementById("pokemon-cards");
    container.innerHTML = ""; 

    const pokemons = await getRandomPokemon();

    pokemons.forEach(pokemon => {
        const card = createCard(pokemon);
        container.appendChild(card);
    });
};

window.onload = populateCards;