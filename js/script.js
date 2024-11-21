const api_url = "https://pokeapi.co/api/v2/pokemon/";
let currentPage = 1;
let pokemonPerPage = 10; // Default number of Pokémon per page
let sortOrder = "name"; // Default sort order: A-Z

// Fetch Pokémon with the selected number of items per page
async function fetchAllPokemon() {
    try {
        const response = await fetch(`${api_url}?limit=${pokemonPerPage}&offset=${(currentPage - 1) * pokemonPerPage}`);
        const data = await response.json();
        let pokemons = data.results;

        // Sort Pokémon based on the selected sort order (A-Z or by ID)
        if (sortOrder === "name") {
            pokemons = pokemons.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === "id") {
            pokemons = pokemons.sort((a, b) => {
                const idA = extractPokemonId(a.url);
                const idB = extractPokemonId(b.url);
                return idA - idB;
            });
        }

        displayAllPokemon(pokemons);
        updatePaginationControls(data.count);
    } catch (err) {
        console.error(err);
    }
}

// Display the list of Pokémon
function displayAllPokemon(pokemons) {
    const pokemonContainer = document.getElementById('pokemon');
    pokemonContainer.innerHTML = ''; // Clear previous Pokémon list

    pokemons.forEach(pokemon => {
        displaySinglePokemon(pokemon);
    });
}

// Display a single Pokémon (small card format)
async function displaySinglePokemon(pokemon) {
    const pokemonContainer = document.getElementById('pokemon');
    
    const name = capitalize(pokemon.name);
    const image = await fetchPokemonImage(pokemon.url);

    const pokemonElement = document.createElement('div');
    pokemonElement.classList.add('pokemon-card');
    
    const nameElement = document.createElement('h1');
    nameElement.textContent = name;
    
    const imageElement = document.createElement('img');
    imageElement.src = image;
    imageElement.alt = name;
    
    pokemonElement.appendChild(nameElement);
    pokemonElement.appendChild(imageElement);
    
    pokemonContainer.appendChild(pokemonElement);
}

// Fetch the image for a specific Pokémon
async function fetchPokemonImage(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.sprites.front_default;
}

// Extract the Pokémon ID from the URL
function extractPokemonId(url) {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]); // The second last part is the ID
}

// Capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Update the pagination controls based on the total number of Pokémon
function updatePaginationControls(totalCount) {
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    
    const totalPages = Math.ceil(totalCount / pokemonPerPage);
    
    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;

    // Event listeners for pagination buttons
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAllPokemon();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchAllPokemon();
        }
    });
}

// Handle the change of Pokémon per page from the dropdown
document.getElementById('pokemon-count').addEventListener('change', (event) => {
    pokemonPerPage = parseInt(event.target.value);
    currentPage = 1; // Reset to the first page when the user changes the count
    fetchAllPokemon();
});

// Handle the change of sort order (A-Z or by ID)
document.getElementById('sort-order').addEventListener('change', (event) => {
    sortOrder = event.target.value;
    currentPage = 1; // Reset to the first page when the user changes the sort order
    fetchAllPokemon();
});

// Initialize the app by fetching the Pokémon data
fetchAllPokemon();
