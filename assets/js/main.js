const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMore');

const limit = 40;
let offset = 0;

function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
}

const loadPokemonItens = (offset, limit) => {
    pokeAPI.getPokemons(offset, limit).then((pokemons = []) => {
        pokemonList.innerHTML += pokemons.map((pokemon) => 
            `<li class="pokemon ${pokemon.type}">
                <span class="number">#${addLeadingZeros(pokemon.number, 5)}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" 
                        alt="${pokemon.name}">
                </div>
                <div class="detail-btn">
                    <button type='button' 
                        onclick='showDetails("${pokemon.type}", "${pokemon.name}", 
                            ${pokemon.number}, "${pokemon.photo}")'>
                        Details
                    </button>
                </div>
            </li>`
        ).join('');
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    loadPokemonItens(offset, limit);
});

const modalToggle = () => {
    document.getElementById('modal-overlay').classList.toggle('active');
}

const showDetails = (type, name, number, photo) => {
    const modal = document.getElementById('modal');
    
    modal.classList.add(type);

    document.getElementById('modal-overlay').classList.add('active');
    document.querySelector('#modal h2').innerHTML = name;
    document.querySelector('#modal #number').innerHTML = `#${addLeadingZeros(number, 5)}`;

    pokeAPI.getPokemonByName(name)
        .then((details) => {
            document.querySelector('#modal .details #abilities').innerHTML = `
                Abilities: ${details.abilities.map((ability) => `${ability}`).join(', ')}
            `;

            document.querySelector('#modal img').src = photo;
            document.querySelector('#modal .details #species').innerHTML = `Species: ${details.species}`;
            document.querySelector('#modal .details #height').innerHTML = `Height: ${details.height}`;
            document.querySelector('#modal .details #weight').innerHTML = `Weight: ${details.weight}`;
        });
}