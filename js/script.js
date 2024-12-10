const api_url = "https://pokeapi.co/api/v2/pokemon/";
let currentPage = 1;
let pokemonsPerPage = 20;
let allPokemons = [];
let sortOrder = 'name'; // Default sort by name

// Capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// Fetch all Pokémon data
async function fetchAllPokemons() {
    try {
        const response = await fetch(`${api_url}?limit=1000`); // Fetch a large enough limit to cover all Pokémon
        const data = await response.json();
        allPokemons = data.results;
        displayPokemonList(allPokemons); // Display the full list of Pokémon
        updatePagination();
    } catch (err) {
        console.error(err);
    }
}
// Display the Pokémon list based on sorting order
function displayPokemonList(pokemons) {
    const pokemonContainer = document.getElementById("pokemon");
    pokemonContainer.innerHTML = ''; // Clear the container
    
    // Sort Pokémon list if sorting by name or ID
    if (sortOrder === 'name') {
        pokemons.sort((a, b) => a.name.localeCompare(b.name)); // A-Z
    } else {
        pokemons.sort((a, b) => {
            const idA = extractPokemonId(a.url);
            const idB = extractPokemonId(b.url);
            return idA - idB; // Sort by ID
        });
    }

    // Paginate and show only the current page's Pokémon
    const paginatedPokemons = paginatePokemons(pokemons);
    paginatedPokemons.forEach(pokemon => {
        displaySinglePokemon(pokemon);
    });
}
// Paginate Pokémon list
function paginatePokemons(pokemons) {
    const offset = (currentPage - 1) * pokemonsPerPage;
    return pokemons.slice(offset, offset + pokemonsPerPage);
}
// Display a single Pokémon card for the list view
function displaySinglePokemon(pokemon) {
    const pokemonContainer = document.getElementById("pokemon");

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

    const pokemonElement = document.createElement('div');
    pokemonElement.appendChild(nameElement);
    pokemonElement.appendChild(pokeLink);
    pokeLink.appendChild(imageElement);

    pokemonContainer.appendChild(pokemonElement);
}
// Extract Pokémon ID from the URL
function extractPokemonId(url) {
    return parseInt(url.split('/')[6]);
}
// Update pagination buttons
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
// Handle sort by A-Z and by ID
function handleSort(option) {
    sortOrder = option;
    displayPokemonList(allPokemons);
}
// Initialize the page
function init() {
    fetchAllPokemons();

    // Pagination buttons
    document.getElementById('prev-button').addEventListener('click', () => handlePageChange('prev'));
    document.getElementById('next-button').addEventListener('click', () => handlePageChange('next'));
    document.getElementById('start-button').addEventListener('click', () => handlePageChange('start'));
    document.getElementById('end-button').addEventListener('click',() => handlePageChange('end'));

    // Sort buttons
    document.getElementById('sort-az').addEventListener('click', () => handleSort('name'));
    document.getElementById('sort-id').addEventListener('click', () => handleSort('id'));
}
init(); // Initialize the page on load

year = document.querySelector("#year").textContent = new Date().getFullYear();