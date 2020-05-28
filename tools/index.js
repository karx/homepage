const fs = require('fs');
const YAML = require('json-to-pretty-yaml');
const pokedex = require('./pokelib.json')
const transformAndWriteToFile = require('json-to-frontmatter-markdown');

function nameOfPokemonFromId(id) {
    return pokedex.en_pokedex[id-1].name.english;
}

function numberOfPokemonFromId(id) {
    return ("00" + id).slice(-3);
}

function pokemonImageSourceFromId(id) {
    var base_str = '00000' + id;
    var imageName = numberOfPokemonFromId(id);
    return `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/thumbnails/${imageName}.png`;
}

function gen_pages() {
    for (let index = 1; index <= 151; index++) {
        const pokemon = pokedex.en_pokedex[index-1];
        console.log(pokemon);
        
        let data = '';
        
        data += `---\n`;
        data += YAML.stringify(pokemon);
        data += YAML.stringify(
            {
            "model" : {
                asset: `/pokemon_models/models/${("00" + index).slice(-3)}/glTF/model.gltf`,
                color: '#FFFFFF'
            }
        });
        data += YAML.stringify(
            {
                "header": {
                    "teaser": pokemonImageSourceFromId(index)
                },
                "status": "Kento",
                
                "sidebar": [
                    {
                        "image": pokemonImageSourceFromId(index)
                    }
                ]
                
            }
            );
        data += `\n---`;

        fs.writeFileSync(`../_pokemons/${("00" + index).slice(-3)}.md`, data);
        console.log(data);
    }
}

gen_pages();