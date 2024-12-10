
let allCards = []; // To store the fetched card data
let isLoading = true; // Track loading state
let currentCardIndex = 0; // Track the index of the current card being displayed
let deck = []; // Store the 5-card deck
let packContainer = document.getElementById('pack-container'); // Container to hold all packs

document.getElementById('new-pack-button').addEventListener('click', generateNewPack);

function fetchPokemonCards() {
    const apiKey = '5fb62cb2-8e67-43e2-9d7f-5ea4ee5d10f7'; // Replace with your actual API key
  const apiUrl = 'https://api.pokemontcg.io/v2/cards'; // Fetch up to 100 cards

  setLoadingMessage(true); // Show loading message

  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      allCards = data.data; // Store the fetched cards
      isLoading = false;
      setLoadingMessage(false); // Remove loading message
      generateNewPack(); // Generate a new pack of 5 random cards
    })
    .catch(error => {
      console.error('Error:', error);
      setLoadingMessage(false);
    });
}

function generateNewPack() {
  if (isLoading) {
    alert('Data is still loading. Please wait.');
    return;
  }

  if (allCards.length === 0) return;

  // Select 5 random cards from the fetched data
  deck = allCards.sort(() => 0.5 - Math.random()).slice(0, 5);
  currentCardIndex = 0; // Reset card index when generating a new pack

  // Create a new section for this pack
  const packDiv = document.createElement('div');
  packDiv.classList.add('card-pack');
  packContainer.appendChild(packDiv);

  // Display the 5 cards next to each other
  for (let i = 0; i < deck.length; i++) {
    displayCard(packDiv, i); // Display each card in the pack
  }
}

function displayCard(packDiv, index) {
  if (isLoading) {
    alert('Data is still loading. Please wait.');
    return;
  }

  if (deck.length === 0) {
    console.error('No card data available.');
    return;
  }

  const card = deck[index];
  const img = document.createElement('img');

  img.src = card.images.small; // Use small image URL
  img.alt = card.name; // Alt text as card name
  img.classList.add('flip-animation');

  // Append the card to the current pack
  packDiv.appendChild(img);
}

function setLoadingMessage(show) {
  const outputDiv = document.getElementById('output');
  if (show) {
    outputDiv.innerHTML = '<p>Loading data, please wait...</p>';
  } else {
    outputDiv.innerHTML = ''; // Clear the loading message
  }
}

// Fetch card data once when the page loads
fetchPokemonCards();
