class PokemonDeck extends HTMLElement {
    set cards(cards) {
        this._cards = cards;
        this.render();
    };

    render() {
        this.innerHTML = `
            <style>
                .card-deck {
                    margin-top: 3%;
                }

                .row {
                    width: 100%;
                }

                @media screen and (max-width: 1140px) {
                    .card-deck {
                        margin-top: 5%;
                    }
                }
                
                @media screen and (max-width: 710px) {
                    .card-deck {
                        margin-top: 10%;
                    }
                }
            </style>
            <div class="card-deck">
                <div class="row ml-0"></div>
            </div>
        `;

        if (!this._cards.cards.length) {
            const card = document.createElement('div');
            card.classList = 'card';

            const bodycard = document.createElement('div');
            bodycard.classList = 'card-body';
            bodycard.innerText = 'No Cards';
            card.appendChild(bodycard);

            this.querySelector('.card-deck .row').replaceWith(card);
        } 
        else if (this._cards && this._cards.cards) {
            this._cards.cards.forEach(card => {
                const col = document.createElement('div');
                col.classList = 'col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 pb-3';

                const cardElement = document.createElement('pokemon-card');
                cardElement.card = { card, isLogin: this._cards.isLogin, update: this._cards.update };

                col.appendChild(cardElement);
                this.querySelector('.card-deck .row').appendChild(col);
            });
        };
    };
};

customElements.define('pokemon-deck', PokemonDeck);
