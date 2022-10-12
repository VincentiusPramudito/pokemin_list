class PokemonCard extends HTMLElement {
    set card(card) {
        this._card = card;
        this.render();
    };

    render() {
        const data = this._card.card;

        const btnAddCollection = '<a href="#" class="btn-card btn btn-success mt-2" id="addCollection">Add to my collection</a>';
        const btnAddWishlist = '<a href="#" class="btn-card btn btn-primary mt-2" id="addWishlist">Add to my wishlist</a>';
        const btnAddFavourite = '<a href="#" class="btn-card btn btn-warning mt-2" id="addFavourites">Add to my favourites</a>';

        const btnRemoveCollection = '<a href="#" class="btn-card btn btn-secondary mt-2" id="removeCollection">Remove collection</a>';
        const btnRemoveWishlist = '<a href="#" class="btn-card btn btn-secondary mt-2" id="removeWishlist">Remove wishlist</a>';
        const btnRemoveFavourite = '<a href="#" class="btn-card btn btn-secondary mt-2" id="removeFavourites">Remove favourites</a>';

        let buttons = '';
        if (this._card.isLogin) {
            if (this._card.card.isCollected) {
                buttons += btnRemoveCollection;
            } else if (!this._card.card.isCollected) {
                buttons += btnAddCollection;
            };
    
            if (this._card.card.isWishlist) {
                buttons += btnRemoveWishlist;
            } else if (!this._card.card.isWishlist) {
                buttons += btnAddWishlist;
            };
    
            if (this._card.card.isFavourite) {
                buttons += btnRemoveFavourite;
            } else if (!this._card.card.isFavourite) {
                buttons += btnAddFavourite;
            };
        };

        const content = this._card.card ? `
            <div class="card text-center h-100" id=${data.id}>
                <div class="card-img">
                    <img class="card-img-top front" src="${data.image_front}" alt="Card image cap">
                    <img class="card-img-top back d-none" src="${data.image_back}" alt="Card image cap">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${data.name.toUpperCase()}</h5>
                    <p class="card-text">${data.description}</p>
                    <a href="#" class="btn btn-primary mt-auto" id="flipBack">Flip Back</a>
                    ${buttons}
                </div>
            </div>
        ` :  `<p>Empty</p>`;

        this.innerHTML = content;

        this.querySelector('#flipBack').addEventListener('click', (e) => {
            e.preventDefault();
            
            this.querySelector('.card-img').classList.toggle('is-flipped');
            const imageElement = this.querySelectorAll('.card-img-top');
            imageElement.forEach(img => { img.classList.toggle('d-none') });
        });

        this.querySelectorAll('.btn-card').forEach(btn => {
            const cardID = this.children[0].getAttribute('id');
            if (btn.id == 'addCollection') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._card.update(cardID, 'add-collection');
                    // $(btn).replaceWith(btnRemoveCollection);
                    // this._card.card.isCollected = !this._card.card.isCollected;
                    // this.render();
                });
            } else if (btn.id == 'removeCollection') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._card.update(cardID, 'remove-collection');
                    // $(btn).replaceWith(btnAddCollection);
                    // this._card.card.isCollected = !this._card.card.isCollected;
                    // this.render();
                });
            } else if (btn.id == 'addWishlist') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._card.update(cardID, 'add-wishlist');
                });
            } else if (btn.id == 'removeWishlist') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._card.update(cardID, 'remove-wishlist');
                });
            } else if (btn.id == 'addFavourites') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._card.update(cardID, 'add-favourites');
                });
            } else if (btn.id == 'removeFavourites') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._card.update(cardID, 'remove-favourites');
                });
            }
        })
    };
};

customElements.define('pokemon-card', PokemonCard);
