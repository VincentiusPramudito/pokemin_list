import logo from '../../../assets/logo.png';
import './user-menu';

class HeaderSection extends HTMLElement {
    set data(data) {
        this._data = data;
        this.render();
    };

    render() {
        this.innerHTML = `
            <style>
                img:hover {
                    cursor: pointer
                }
            </style>
            
            <div class="section-logo"><img src=${logo}></div>
            <user-menu></user-menu>
        `;
        
        const userMenuElement = this.querySelector('user-menu');
        userMenuElement.data = this._data;

        this.querySelector('img').addEventListener('click', () => {
            this._data.initialPage();
        });
    };
};

customElements.define('header-section', HeaderSection);
