const generationSelect = document.getElementById('generation-select');
const pokemonList = document.getElementById('pokemon');
const api_url = "https://pokeapi.co/api/v2/pokemon/";
let currentPage = 1;
let pokemonsPerPage = 20;
let allPokemons = [];
let sortOrder = 'name'; // Default sort by name

// Fetch Pokémon species for the selected generation and display each Pokémon
generationSelect.addEventListener('change', async function () {
  const generationName = generationSelect.value;
  const url = `https://pokeapi.co/api/v2/generation/${generationName}/`; 

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for generation: ${generationName}`);
    }
    const data = await response.json();

    // Sort Pokémon species alphabetically
    allPokemons = data.pokemon_species.sort((a, b) => a.name.localeCompare(b.name));

    // Reset to the first page
    currentPage = 1;

    // Display Pokémon for the current page
    displayPokemonList(allPokemons);
    updatePagination();
  } catch (error) {
    console.error('Error fetching generation data:', error.message);
  }
});

// Function to display the sorted and paginated Pokémon list
function displayPokemonList(pokemons) {
  pokemonList.innerHTML = ''; // Clear the container

  // Apply sorting before pagination
  if (sortOrder === 'name') {
    pokemons.sort((a, b) => a.name.localeCompare(b.name)); // A-Z
  } else if (sortOrder === 'id') {
    pokemons.sort((a, b) => extractPokemonId(a.url) - extractPokemonId(b.url)); // Sort by ID
  }

  // Paginate Pokémon list
  const paginatedPokemons = paginatePokemons(pokemons);
  paginatedPokemons.forEach((pokemon) => {
    displaySinglePokemon(pokemon);
  });

  updatePagination();
}

function paginatePokemons(pokemons) {
  const offset = (currentPage - 1) * pokemonsPerPage;
  return pokemons.slice(offset, offset + pokemonsPerPage);
}

// Function to display a single Pokémon's details
async function displaySinglePokemon(pokemon) {
  try {
    const pokemonResponse = await fetch(pokemon.url);
    if (!pokemonResponse.ok) {
      throw new Error(`Failed to fetch details for Pokémon: ${pokemon.name}`);
    }
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
    imageElement.alt = `${name} image`;
    imageElement.onerror = () => (imageElement.src = 'default-image.png'); // Fallback if image doesn't exist

    // Append Pokémon info to the container
    const pokemonElement = document.createElement('div');
    pokeLink.appendChild(imageElement);
    pokemonElement.appendChild(nameElement);
    pokemonElement.appendChild(pokeLink);

    pokemonList.appendChild(pokemonElement);
  } catch (error) {
    console.error(`Error fetching Pokémon details for ${pokemon.name}:`, error.message);
  }
}

function updatePagination() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const pageNumber = document.getElementById('page-number');

    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= Math.ceil(allPokemons.length / pokemonsPerPage);
    const totalPages = Math.ceil(allPokemons.length / pokemonsPerPage);
    pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
}
// Handle page changes
function handlePageChange(direction) {
    if (direction === 'next') {
        currentPage++;
    } else if (direction === 'prev') {
        currentPage--;
    } else if (direction === 'start') {
        currentPage=1;
    } else if (direction === 'end') {
        const totalPages = Math.ceil(allPokemons.length / pokemonsPerPage);
        currentPage=totalPages;
    }
    displayPokemonList(allPokemons); // Re-render the Pokémon list after page change
    updatePagination(); // Update pagination buttons
}
// Sort buttons
document.getElementById('sort-az').addEventListener('click', () => {
  sortOrder = 'name'; // Sort by name
  displayPokemonList(allPokemons);
});

document.getElementById('sort-id').addEventListener('click', () => {
  sortOrder = 'id'; // Sort by ID
  displayPokemonList(allPokemons);
});

// Helper functions
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function extractPokemonId(url) {
  const idMatch = url.match(/\/(\d+)\//);
  return idMatch ? parseInt(idMatch[1], 10) : 0;
}

// Initialize the list with the default selection (Generation I)
generationSelect.dispatchEvent(new Event('change'));
