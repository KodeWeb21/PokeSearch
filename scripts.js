const URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";
const $template = document.getElementById("templatePokemon");
const $containerPokemons = document.querySelector(".container__pokemons");
const $inputForm = document.querySelector(".form__input");
const $formSearch = document.querySelector(".form");
let searching = false;
const loading = document.querySelector('.loading');

const removeLoading = () =>{
    loading.remove();
}

const addLoading = () =>{
    $containerPokemons.appendChild(loading);
}

const getNamePokemons = (url) =>{
    return fetch(url)
    .then(response=>response.json())
    .then(data=>data.results)
}

const getImagePokemon = (url) =>{
    return fetch(url)
    .then(response=>response.json())
    .then(data=>data.sprites.front_default)
}

const paintPokemons = async (pokemons) =>{
    const fragment = document.createDocumentFragment();
    for(const pokemon of pokemons){
        const {name, url} = pokemon;
        const clon = $template.content.cloneNode(true);
        const imgSrcPokemon = await getImagePokemon(url);
        const $imgPokemon = clon.querySelector(".img");
        const $namePokemon = clon.querySelector(".pokemon__name");

        $imgPokemon.setAttribute("alt",name)
        $imgPokemon.setAttribute("src",imgSrcPokemon);
        $namePokemon.textContent = name;
        fragment.appendChild(clon);
    }
    removeLoading();
    $containerPokemons.appendChild(fragment);
}

const getDataPokemon = (url) =>{
    return fetch(url)
    .then(response=>response.json())
    .then(pokemon=>{
        return{
            "name": pokemon.name, 
            "img": pokemon.sprites.front_default
        };
    })
}

const paintOnePokemo = ({name, img}) =>{
    const clon = $template.content.cloneNode(true);
    const $img = clon.querySelector(".img");
    const $name = clon.querySelector(".pokemon__name");

    $img.setAttribute("src",img);
    $name.textContent = name;
    removeLoading();
    $containerPokemons.appendChild(clon);
}

const getAllPokemons = async () =>{
    const pokemons = await getNamePokemons(URL);
    paintPokemons(pokemons);
}


const removeAllPokemons = () =>{
    while($containerPokemons.firstChild){
        $containerPokemons.removeChild($containerPokemons.firstChild);
    }
}

$formSearch.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const pokemonToSearch = $formSearch.pokemonInput.value.toLowerCase();
    if(pokemonToSearch.trim() === ""){
        return;
    };
    searching = true;
    removeAllPokemons();

    const URLPOKEMON = `https://pokeapi.co/api/v2/pokemon/${pokemonToSearch}`;
    addLoading();
    const wantedPokemon =  await getDataPokemon(URLPOKEMON);
    paintOnePokemo(wantedPokemon);
})

getAllPokemons();

$inputForm.addEventListener("input",()=>{
    const inputValue = $formSearch.pokemonInput.value;
    if(inputValue === "" && searching){
        removeAllPokemons();
        addLoading();
        getAllPokemons()
        searching = false;
    }
})
