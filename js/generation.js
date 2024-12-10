const generationSelect = document.getElementById('generation-select');
const pokemonList = document.getElementById('pokemon');  // Corrected the reference
const api_url = "https://pokeapi.co/api/v2/pokemon/";

// Fetch Pokémon species for the selected generation and display each Pokémon
generationSelect.addEventListener('change', async function() {
  const generationName = generationSelect.value;
  const url = `https://pokeapi.co/api/v2/generation/${generationName}/`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Clear the current list
    pokemonList.innerHTML = '';

    // Loop through the pokemon_species array and display only for the selected generation
    const sortedPokemonSpecies = data.pokemon_species.sort((a, b) => a.name.localeCompare(b.name)); // Sorting alphabetically

    sortedPokemonSpecies.forEach(async (pokemon) => {
      await displaySinglePokemon(pokemon);  // Call displaySinglePokemon for each Pokémon in the selected generation
    });
  } catch (error) {
    console.error('Error fetching generation data:', error);
  }
});

// Function to display a single Pokémon's details
async function displaySinglePokemon(pokemon) {
  try {
    // Fetch the Pokémon details
    const pokemonResponse = await fetch(pokemon.url);
    const pokemonData = await pokemonResponse.json();

    // Capitalize name and fetch the Pokémon image
    const name = capitalize(pokemon.name);
    const pokeLink = document.createElement('a');
    pokeLink.href = `pokemon.html?pokemon=${pokemon.name}`; // Navigate to the single Pokémon page

    const nameElement = document.createElement('h1');
    nameElement.textContent = name;

    // Fetch Pokémon image (handling broken images)
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${extractPokemonId(pokemon.url)}.png`;
    const imageElement = document.createElement('img');
    imageElement.src = image;
    imageElement.onerror = () => imageElement.src = 'default-image.png'; // Fallback if image doesn't exist

    // Append Pokémon info to the container
    const pokemonElement = document.createElement('div');
    pokemonElement.appendChild(nameElement);
    pokemonElement.appendChild(pokeLink);
    pokeLink.appendChild(imageElement);

    pokemonList.appendChild(pokemonElement);
  } catch (error) {
    console.error('Error fetching Pokémon details:', error);
  }
}

// Helper function to capitalize the first letter of the Pokémon name
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Helper function to extract Pokémon ID from the URL
function extractPokemonId(url) {
  const idMatch = url.match(/\/(\d+)\//);
  return idMatch ? idMatch[1] : ''; // Return empty string if ID is not found
}

// Initialize the list with the default selection (Generation I)
generationSelect.dispatchEvent(new Event('change'));
