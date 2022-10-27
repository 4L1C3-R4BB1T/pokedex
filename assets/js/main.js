const loader = document.querySelector("#loading");
const searchField = document.getElementById('idSearch');
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMore');
const optTypes = document.querySelectorAll('.type-filter .types .type');

let offset = 0;
const limit = 100;

let count = 1;
let selectedType = '';

let aux = 0;

function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
}

const loadPokemonItens = (offset, limit, type = '') => {
    pokemonList.style.display = 'none';
    loader.style.display = 'flex';

    type = (type === 'all') ? '' : type;

    pokeAPI.getPokemons(offset, limit).then((allPokemons = []) => {
        
        if (type) return allPokemons.map((p) => { if (p.type === type) return p });
        return allPokemons;

    }).then((pokemons) => { 
        
        pokemons = pokemons.filter(p => { return p !== undefined });
        
        // gambiarra suprema
        if (pokemons.length === 0) {
            aux += 500;
            loadPokemonItens(offset, aux, type);
            return;
        }

        loader.style.display = 'none';
        pokemonList.style.display = '';

        const items = pokemons.map((pokemon) => 
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
                        onclick='showDetails("${pokemon.name}")'>
                        Details
                    </button>
                </div>
            </li>`
        ).join('');

        if (count > 0) pokemonList.innerHTML += items;
        else pokemonList.innerHTML = items;
    });
}

loadMoreButton.addEventListener('click', () => {
    count++;
    offset += limit;
    loadPokemonItens(offset, limit, selectedType);
});

const modalToggle = () => {
    document.getElementById('modal-overlay').classList.toggle('active');
}

// show details of a specific pokemon
const showDetails = (name) => {
    pokeAPI.getPokemonByName(name)
        .then((details) => {
            const modal = document.getElementById('modal');
    
            modal.removeAttribute('class');
            modal.classList.add(details.type);

            document.getElementById('modal-overlay').classList.add('active');
            document.querySelector('#modal h2').innerHTML = details.name;
            document.querySelector('#modal #number').innerHTML = `#${addLeadingZeros(details.number, 5)}`;

            document.querySelector('#modal .details #abilities').innerHTML = `
                Abilities: ${details.abilities.map((ability) => `${ability}`).join(', ')}
            `;

            document.querySelector('#modal img').src = details.photo;
            document.querySelector('#modal .details #species').innerHTML = `Species: ${details.species}`;
            document.querySelector('#modal .details #height').innerHTML = `Height: ${details.height}`;
            document.querySelector('#modal .details #weight').innerHTML = `Weight: ${details.weight}`;
        });
}

// filter by type event
optTypes.forEach((e) => {
    e.addEventListener('click', () => {
        count = 0;
        offset = 0;
        selectedType = e.textContent;
        loadPokemonItens(offset, limit, selectedType);
    });
});

// search input event
searchField.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    showDetails(searchField.value.trim().toLowerCase()); 
  }
});

loadPokemonItens(offset, limit);
