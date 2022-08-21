const pokemonName = document.querySelector(".pokemon__name");
const pokemonID = document.querySelector(".pokemon__number");

const form = document.getElementById("search_show_PokemonInfo");
const input = document.getElementById("inputPokemonName");

const powerButton = document.getElementById("powerBtn");
let pokedexIsActive = false;

const prevButton = document.getElementById("leftArrBtn");
const nextButton = document.getElementById("rightArrBtn");

// pega a tag que mostrará o tipo do pokemon
const type = document.getElementById("type");

// todos os status
const stats = ["Type:", "HP:", "Attack:", "Defense:", "Special-Attack:", "Special-Defense:", "Speed:"];
const pokemonStatsName = document.querySelectorAll(".pokeDataName");
const stats_results = document.querySelectorAll(".stat-result");

let pokedexLayer3 = document.querySelector(".layer3");

// pega o container da imagem do pokemon
const pokemonImageContainer = document.querySelector(".pokemon-display");

let searchPokemon = 1;

function checkPokedexState() {
  !pokedexIsActive ? powerOn() : powerOff();
}

function powerOn() {
  addPowerOnAnimation();

  pokedexIsActive = true;
  setTimeout(() => {
    pokedexLayer3.style.pointerEvents = "all";
    renderPokemon(searchPokemon);
  }, 1900);
}

function powerOff() {
  pokedexIsActive = false;
  pokedexLayer3.classList.add("pokedexOff");
  pokedexLayer3.style.pointerEvents = "none";
  emptyPokemonData();
}

function addPowerOnAnimation() {
  pokedexLayer3.classList.add("pokedexOpacityAnimation");
  
  // Botão Ciano
  let cyanButton = document.querySelector(".bondiblue-container");
  cyanButton.classList.add("cyanButtonAnimation");

  // Botão Vermelho
  let redButton = document.querySelector(".darkred-container");
  redButton.classList.add("redButtonAnimation");

  // Botão Amarelo
  let yellowButton = document.querySelector(".darkyellow-container");
  yellowButton.classList.add("yellowButtonAnimation");

  // Botão Verde
  let greenButton = document.querySelector(".darkgreen-container");
  greenButton.classList.add("greenButtonAnimation");

  // Remove as animações
  setTimeout(() => {
    pokedexLayer3.classList.remove("pokedexOff");
    pokedexLayer3.classList.remove("pokedexOpacityAnimation");

    cyanButton.classList.remove("cyanButtonAnimation");
    redButton.classList.remove("redButtonAnimation");
    yellowButton.classList.remove("yellowButtonAnimation");
    greenButton.classList.remove("greenButtonAnimation");
  }, 2000);
}

const fetchPokemon = async (pokemon) => {

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (response.status === 200) {
    const data = await response.json();
    return data;
  }
};

const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = "Loading...";
  pokemonID.innerHTML = "";

  const data = await fetchPokemon(pokemon);
  addPokemonImage();
  const pokemonImage = document.querySelector(".pokemon__image");
  
  if (data) {
    
    getTypes(data);
    getStats(data);

    pokemonName.innerHTML = data.name;
    pokemonID.innerHTML = data.id;
    pokemonImage.src = hasGIF(data.sprites);

    input.value = "";
    searchPokemon = data.id;
  } else {
    resetStats();

    pokemonName.innerHTML = "Not found!";
    pokemonID.innerHTML = "?";
    pokemonImage.src = "assets/icons/question-mark.png";

    input.value = "";
    searchPokemon = 0;
  }
};

function addPokemonImage() {
  // adiciona tag img ao container da imagem
  pokemonImageContainer.innerHTML = `
  <img class="pokemon__image" src="" alt="Pokémon" />
  `;
}

function hasGIF(sprites) {
  // pega GIF do Pokémon
  const pokemonGIF = sprites["versions"]["generation-v"]["black-white"]["animated"]["front_default"];

  // faz o check: se pokemonGIF não existir, retorna png
  return (pokemonGIF === null) ? sprites.front_default : pokemonGIF;
}

function getTypes(data) {
  type.innerHTML = "";

  for (let typeIndex of data.types) {
    type.innerHTML += typeIndex.type.name + " ";
  }
  type.innerHTML = (type.innerHTML).trim();
}

function getStats(data) {
  for (let i = 0; i < data.stats.length; i++) {
    pokemonStatsName[i].innerHTML = stats[i];
    stats_results[i].innerHTML = data.stats[i]["base_stat"];
  }
  // Mostra na tela o "Speed"
  pokemonStatsName[pokemonStatsName.length - 1].innerHTML = stats[6];
}

function resetStats() {
  // os status recebem interrogação caso dê alguma falha na requisição
  type.innerHTML = "???";

  stats_results.forEach((stat) => {
    stat.innerHTML = "???";
  });
}

function emptyPokemonData() {
  pokemonImageContainer.innerHTML = "";
  pokemonName.innerHTML = "";
  pokemonID.innerHTML = "";

  const pokemonDataSpans = document.querySelectorAll(".pokeResults-display > h2 > span");
  pokemonDataSpans.forEach((span) => {
    span.innerHTML = "";
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // se o usuário digitar um número que começa com zero, exemplo: 092
  // o programa vai ler 92
  if (input.value.length > 1 && input.value.charAt(0) == 0) {
    input.value = input.value.replace("0", "");
  }

  // se o usuário mandar o mesmo ID do pokémon atual, o evento de click é cancelado
  if (input.value == searchPokemon) {
    input.value = "";
    return;
  }

  // interrompe o evento caso o usuário faça o submit do input vazio
  if (input.value.length == 0) return;

  renderPokemon(input.value.toLowerCase());
});

prevButton.addEventListener("click", () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
  return searchPokemon;
});

nextButton.addEventListener("click", () => {
  searchPokemon++;
  renderPokemon(searchPokemon);
  return searchPokemon;
});

powerButton.onclick = checkPokedexState;