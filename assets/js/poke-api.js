const pokeAPI = {}

const convertPokeAPIDetailToPokemon = (pokeDetail) => {
    const pokemon = new Pokemon();
    
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types
        .map((typeSlot => typeSlot.type.name));
    
    const [ type ] = types;

    pokemon.type = type;
    pokemon.types = types;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    return pokemon;
}

const convertResult = (details) => {
    const pokemonDetails = new PokemonDetails();

    pokemonDetails.species = details.species.name;
    pokemonDetails.height = details.height;
    pokemonDetails.weight = details.weight;
    
    pokemonDetails.abilities = details.abilities
        .map((abilities => abilities.ability.name));

    return pokemonDetails;
}


pokeAPI.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeAPIDetailToPokemon);
}

pokeAPI.getPokemons = (offset = 0, limit = 20) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeAPI.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonDetails) => pokemonDetails);
}

pokeAPI.getPokemonByName = (name) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    return fetch(url)
        .then((response) => response.json())
        .then(convertResult);
}