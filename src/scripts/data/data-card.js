class GetDataPokemonCard {
    static async getInitialData(curr, limit) {
        try {
            const result = await GetDataPokemonCard.getFetchJSON(`https://pokeapi.co/api/v2/pokemon?limit=${ limit }&offset=${ (limit*curr) }`);
            return GetDataPokemonCard.createDataCard(result);
        } catch (error) {
            throw error;
        }
    };

    static async getData(url) {
        try {
            const resultJSON = await GetDataPokemonCard.getFetchJSON(url);
            return GetDataPokemonCard.createDataCard(resultJSON);
        } catch (error) {
            throw error;
        }
    };

    static async createDataCard(resultJSON) {
        try {
            const cards = resultJSON.results.map(async card => {
                const data = await GetDataPokemonCard.getFetchJSON(card.url);
                if (data.species) {
                    const description = await GetDataPokemonCard.getFetchJSON(data.species.url);
    
                    return {
                        id: data.id,
                        name: data.name,
                        image_front: data.sprites.front_shiny,
                        image_back: data.sprites.back_shiny,
                        description: description.flavor_text_entries[0].flavor_text.replace(/(\r\n|\n|\r)/g,"")
                    };
                };
            });
    
            cards.push({
                count: resultJSON.count,
                next: resultJSON.next,
                prev: resultJSON.previous
            })
    
            return await Promise.all(cards)
        } catch (error) {
            throw error;
        }
    };

    static async getFetchJSON(url) {
        try {
            const result = await fetch(url);
            if (!result.ok) {
                throw new Error(result.statusText.length? result.statusText : "Request failed!");
            }
            return await result.json();
            
        } catch (error) {
            throw error;
        };
    };

    static async getSingleData(id) {
        try {
            const result = await GetDataPokemonCard.getFetchJSON(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (result.species) {
                const description = await GetDataPokemonCard.getFetchJSON(result.species.url);
    
                return {
                    id: result.id,
                    name: result.name,
                    image_front: result.sprites.front_shiny,
                    image_back: result.sprites.back_shiny,
                    description: description.flavor_text_entries[0].flavor_text.replace(/(\r\n|\n|\r)/g,"")
                };
            };

        } catch (error) {
            throw error;
        }
    };

    static async getCharByName(name) {
        try {
            const data = await GetDataPokemonCard.getFetchJSON(`https://pokeapi.co/api/v2/pokemon/${ name }`);
            if (data.species) {
                const description = await GetDataPokemonCard.getFetchJSON(data.species.url);
                return {
                    id: data.id,
                    name: data.name,
                    image_front: data.sprites.front_shiny,
                    image_back: data.sprites.back_shiny,
                    description: description.flavor_text_entries[0].flavor_text.replace(/(\r\n|\n|\r)/g,"")
                };
            };

        } catch (error) {
            throw error;
        }
    };
};

export default GetDataPokemonCard;
