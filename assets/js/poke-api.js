const pokeAPI = {}

class Pokemon {
    number;
    name;
    type;
    types = [];
    photo;
    species;
    height;
    weight;
    abilities;
}

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

    pokemon.species = pokeDetail.species.name;
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;
    
    pokemon.abilities = pokeDetail.abilities
        .map((abilities => abilities.ability.name));

    return pokemon;
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
        .then(convertPokeAPIDetailToPokemon)
        .catch((e) => alert('Pokemon Not Found!'));
}