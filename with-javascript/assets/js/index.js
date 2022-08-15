const pokemonName = document.querySelector(".pokemon__name");
const pokemonID = document.querySelector(".pokemon__number");
const pokemonImage = document.querySelector(".pokemon__image");

const form = document.getElementById("search_show_PokemonInfo");
const input = document.getElementById("inputPokemonName");

const prevBtn = document.getElementById("leftArrBtn");
const nextBtn = document.getElementById("rightArrBtn");

// pokemon type
const type = document.getElementById("type");

// all stats results
const stats_results = document.querySelectorAll(".stat-result");

let searchPokemon = 1;

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

function hasGIF(sprites) {
  // pega GIF do Pokémon
  const pokemonGIF = sprites["versions"]["generation-v"]["black-white"]["animated"]["front_default"];

  // faz o check: se pokemonGIF for null, retorna png
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
    stats_results[i].innerHTML = data.stats[i]["base_stat"];
  }
}

function resetStats() {
  // os status recebem interrogação caso dê alguma falha na requisição
  stats_results.forEach((stat) => {
    stat.innerHTML = "???";
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

prevBtn.addEventListener("click", () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
  return searchPokemon;
});

nextBtn.addEventListener("click", () => {
  searchPokemon++;
  renderPokemon(searchPokemon);
  return searchPokemon;
});

renderPokemon(searchPokemon);