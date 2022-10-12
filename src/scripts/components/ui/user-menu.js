class UserMenu extends HTMLElement {
    set data(data) {
        this._data = data;
        this.render();
    };

    render() {
        const userBtnLogin = `
        <button type="button" class="btn btn-light" data-toggle="modal" data-target="#loginSignupModal">
            Login
        </button>`;

        const userMenuElement = `
            <div class="section-option">
                <div class="btn-group dropleft">
                    <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        My Card
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#" id="home">Home</a>
                        <a class="dropdown-item" href="#" id="favourites">Favourites</a>
                        <a class="dropdown-item" href="#" id="wishlist">Wishlist</a>
                        <a class="dropdown-item" href="#" id="collection">Collection</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" id="logout">Logout</a>
                    </div>
                </div>
            </div>
        `;

        this.innerHTML = `${ this._data.isLogin ? userMenuElement : userBtnLogin }`;

        if (this._data.isLogin) {
            const titleCard = $(document).find('#title-card h4');

            this.querySelector('#logout').addEventListener('click', () => {
                this._data.logout();
                titleCard.text('All Cards');
            });

            this.querySelector('#home').addEventListener('click', () => {
                this._data.initialPage();
                titleCard.text('All Cards');
            });

            this.querySelector('#collection').addEventListener('click', async () => {
                this._data.getCollection('collection');
                titleCard.text('My Collection');
            });

            this.querySelector('#wishlist').addEventListener('click', async () => {
                this._data.getCollection('wishlist');
                titleCard.text('My Wishlist');
            });

            this.querySelector('#favourites').addEventListener('click', async () => {
                this._data.getCollection('favourites');
                titleCard.text('My Favourites');
            });
        };
    };
};

customElements.define('user-menu', UserMenu);
