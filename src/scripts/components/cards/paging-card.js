class PagingCard extends HTMLElement {
    set data(data) {
        this._data = data;
        this.render();
    };

    render() {
        const setCard = async (data) => {
            this._data.loadPage(data);
        };

        this.innerHTML = '';

        if (this._data.data) {
            this.innerHTML = `
                <nav aria-label="navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item prev ${ (this._data.data.prev != null) ? '' : 'disabled' }"><a class="page-link" href="#">Previous</a></li>
                        <li class="page-item next ${ (this._data.data.next != null) ? '' : 'disabled' }"><a class="page-link" href="#">Next</a></li>
                    </ul>
                </nav>
            `;
        };

        if (this._data.data && this._data.data.prev) {
            this.querySelector('.prev').addEventListener('click', async (e) => {
                e.preventDefault();
                setCard(this._data.data.prev);
            });
        };

        if (this._data.data && this._data.data.next) {
            this.querySelector('.next').addEventListener('click', async (e) => {
                e.preventDefault();
                setCard(this._data.data.next);
            });
        };
    };
};

customElements.define('paging-card', PagingCard);
