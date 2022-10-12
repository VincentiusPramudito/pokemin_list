import $ from 'jquery';
window.$ = $;

import GetDataPokemonCard from "../data/data-card";

import '../components/ui/header-section.js';
import '../components/cards/pokemon-deck';
import '../components/cards/pokemon-card.js';
import '../components/cards/paging-card.js';

const main = async () => {
    const cardHeaderElement = document.querySelector('header-section');
    const cardListElement = document.querySelector('pokemon-deck');
    const cardPagingElement = document.querySelector('paging-card');
    const currentPage = 0;
    const limit = 18;

    let pageActive = null;

    const userCards = () => {
        return JSON.parse(localStorage.getItem('userlogin')).cards;
    };

    /* ============================== GET COLLECTION CARD ============================== */
    const clasificationCards = (cards, userCards) => {
        cards.map(card => {
            if (userCards) {
                if (userCards.collection.includes(card.id)) {
                    card.isCollected = true;
                };
    
                if (userCards.favourites.includes(card.id)) {
                    card.isFavourite = true;
                };
    
                if (userCards.wishlist.includes(card.id)) {
                    card.isWishlist = true;
                };
            };
        });

        return cards;
    };

    const getCollection = async (param) => {
        Swal.fire({
            title: 'Please wait...',
            html: '<div class="spinner-grow text-primary"></div>',
            allowOutsideClick: false,
            showConfirmButton: false
        });

        const collectionCards = userCards()[param];

        if (collectionCards) {
            const cards = collectionCards.map(async card => await GetDataPokemonCard.getSingleData(card));
            const results = await Promise.all(cards);
    
            const isUserAlreadyLogin = localStorage.getItem('userlogin') ? JSON.parse(localStorage.getItem('userlogin')).isLogin : null;
            const dataUserCards = isUserAlreadyLogin ? userCards() : null;
            
            const renderResult = (res, userCards, isLogin) => {
                const cards = res;
                const resultCard = clasificationCards(cards, userCards);
    
                cardListElement.cards = { cards: resultCard, isLogin: isLogin, update };
                cardPagingElement.data = { data: null };
                pageActive = param;
                Swal.close();
            };
            renderResult(results, dataUserCards, isUserAlreadyLogin);
        }
        else loadPage(param);
    };

    /* ============================== UPDATE DATA CARD ============================== */
    const update = (id, type) => {
        const getUsersData = JSON.parse(localStorage.getItem('userdata'));
        let userLogin = JSON.parse(localStorage.getItem('userlogin'));

        const splitType = type.split('-');
        const order = splitType[0];
        let typeCard = splitType[1];

        if (order == 'add') {
            userLogin.cards[typeCard].push(Number(id));
        } else if (order == 'remove') {
            userLogin.cards[typeCard] = userLogin.cards[typeCard].filter(idCard => idCard != id);
        };

        const userIdx = getUsersData.findIndex(user => user.email == userLogin.email);
        getUsersData[userIdx] = userLogin;

        localStorage.setItem('userlogin', JSON.stringify(userLogin));
        localStorage.setItem('userdata', JSON.stringify(getUsersData));

        if (pageActive) getCollection(pageActive)
        else initialPage();
    };

    /* ============================== (RE)LOAD PAGE ============================== */
    const loadPage = async (page) => {
        Swal.fire({
            title: 'Please wait...',
            html: '<div class="spinner-grow text-primary"></div>',
            allowOutsideClick: false,
            showConfirmButton: false
        });

        pageActive = page;

        try {
            const results = await GetDataPokemonCard.getData(page);
            const isUserAlreadyLogin = localStorage.getItem('userlogin') ? JSON.parse(localStorage.getItem('userlogin')).isLogin : null;
            const dataUserCards = isUserAlreadyLogin ? userCards() : null;

            renderResult(results, dataUserCards, isUserAlreadyLogin);
        } catch (error) {
            console.log(error);
            Swal.close();
        };
    };

    /* ============================== INITIAL ============================== */
    const initialPage = async() => {
        pageActive = null;

        Swal.fire({
            title: 'Please wait...',
            html: '<div class="spinner-grow text-primary"></div>',
            allowOutsideClick: false,
            showConfirmButton: false
        });

        try {
            const results = await GetDataPokemonCard.getInitialData(currentPage, limit);
            const isUserAlreadyLogin = localStorage.getItem('userlogin') ? JSON.parse(localStorage.getItem('userlogin')).isLogin : null;
            const dataUserCards = isUserAlreadyLogin ? userCards() : null;
            renderResult(results, dataUserCards, isUserAlreadyLogin);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error
            });
            Swal.close();
        };
    };

    const renderResult = (res, userCards, isLogin) => {
        const dataResult = res[res.length-1];
        const cards = res.slice(0, res.length-1);

        const resultCard = clasificationCards(cards, userCards);

        cardListElement.cards = { cards: resultCard, isLogin, update };
        cardPagingElement.data = { data: dataResult, clasificationCards, userCards, isLogin, update, loadPage };

        Swal.close();
    };

    initialPage();

    /* ============================== LOGOUT ============================== */
    const logout = () => {
        const getUsersData = JSON.parse(localStorage.getItem('userdata'));
        const userLogin = JSON.parse(localStorage.getItem('userlogin'));
        const userIdx = getUsersData.findIndex(userdata => userdata.email == userLogin.email);

        userLogin.isLogin = false;
        getUsersData[userIdx] = userLogin;
        localStorage.setItem('userdata', JSON.stringify(getUsersData));
        localStorage.removeItem('userlogin');

        Swal.fire({
            icon: 'success',
            title: 'See you soon!',
            text: `Thank you, ${userLogin.name}!`
        }).then( _ => {
            cardHeaderElement.data = { isLogin: false };
            initialPage();
        });
    };

    /* ============================== LOGIN ============================== */
    const login = (param) => {
        const getUsersData = JSON.parse(localStorage.getItem('userdata'));
        if (!getUsersData) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'User does not exist!'
            });

            return false;
        };

        const isUserExist = getUsersData.find(user => user.email == param.email);
        if (!isUserExist) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'User does not exist!'
            });

            return false;
        };

        const isPasswordValid = isUserExist.password == param.password ? true : false;
        if (!isPasswordValid) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password does not match!'
            });

            return false;
        };
        isUserExist.isLogin = true;

        // update obj datauser
        const userIdx = getUsersData.findIndex(user => user.email == param.email);
        getUsersData[userIdx] = isUserExist;

        // update 'database' & status isLogin
        localStorage.setItem('userdata', JSON.stringify(getUsersData));
        cardHeaderElement.data = {
            logout,
            userCards,
            update,
            getCollection,
            initialPage,
            isLogin: true
        };

        // create cookies userlogin on localstorage
        localStorage.setItem('userlogin', JSON.stringify(isUserExist));

        Swal.fire({
            icon: 'success',
            title: 'Welcome back!',
            text: `Hello, ${isUserExist.name}!`
        }).then( _ => {
            $('#loginSignupModal').modal('hide');
            initialPage();
        });
    };

    const loginForm = $('#login-form');
    loginForm.on('submit', (e) => {
        e.preventDefault();
        loginForm.addClass('was-validated');

        if (!loginForm[0].checkValidity()) {
            return false;
        };

        const email = $('#email-login').val();
        const password = $('#password-login').val();
        const param = { email, password };

        login(param);
    });

    const isUserAlreadyLogin = localStorage.getItem('userlogin');
    if (isUserAlreadyLogin) {
        const isLogin = JSON.parse(isUserAlreadyLogin).isLogin;
        if (isLogin == true) {
            cardHeaderElement.data = {
                logout,
                userCards,
                update,
                getCollection,
                initialPage,
                isLogin: true
            };
        } else {
            cardHeaderElement.data = {
                isLogin: false
            };
        };
    } else {
        cardHeaderElement.data = {
            isLogin: false
        };
    };

    /* ============================== SIGNUP ============================== */
    const signup = (param) => {
        const getUsersData = JSON.parse(localStorage.getItem('userdata'));
        const payload = {
            email: param.email,
            password: param.password,
            name: param.name,
            cards: {
                favourites: [],
                wishlist: [],
                collection: []
            },
            isLogin: false
        };

        if (!getUsersData) {
            localStorage.setItem('userdata', JSON.stringify([ payload ]));
            Swal.fire({
                icon: 'success',
                title: 'Congrats!',
                text: 'You already signup successfully! Please login with your account..'
            }).then( _ => $('#loginSignupModal').modal('hide'));
        } else {
            const isUserExist = getUsersData.find(user => user.email == param.email);
            if (isUserExist) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'User already exist!'
                });
    
                return false;
            } else {
                getUsersData.push(payload);
                localStorage.setItem('userdata', JSON.stringify(getUsersData));
                Swal.fire({
                    icon: 'success',
                    title: 'Congrats!',
                    text: 'You already signup successfully! Please login with your account..'
                }).then( _ => $('#loginSignupModal').modal('hide'));
            };
        };
    };

    const signupForm = $('#signup-form');
    signupForm.on('submit', (e) => {
        e.preventDefault();
        signupForm.addClass('was-validated');

        if (!signupForm[0].checkValidity()) {
            return false;
        };

        const email = $('#email-signup').val();
        const password = $('#password-signup').val();
        const name = $('#name-signup').val();

        const param = { email, password, name };
        signup(param);
    });

    /* ============================== SEARCH ============================== */
    const search = $('#btn-search');
    search.on('click', async () => {
        const input = $('#search-input').val().trim();

        Swal.fire({
            title: 'Please wait...',
            html: '<div class="spinner-grow text-primary"></div>',
            allowOutsideClick: false,
            showConfirmButton: false
        });
        
        try {
            const results = await GetDataPokemonCard.getCharByName(input);
            const isUserAlreadyLogin = localStorage.getItem('userlogin') ? JSON.parse(localStorage.getItem('userlogin')).isLogin : null;
            const dataUserCards = isUserAlreadyLogin ? userCards() : null;

            if (input.length) {
                const renderResult = (res, userCards, isLogin) => {
                    const cards = [res];
                    const resultCard = clasificationCards(cards, userCards);
        
                    cardListElement.cards = { cards: resultCard, isLogin: isLogin, update };
                    cardPagingElement.data = { data: null };
                    
                    Swal.close();
                };
                renderResult(results, dataUserCards, isUserAlreadyLogin);
            } else {
                if (pageActive) getCollection(pageActive)
                else initialPage();
            };
            Swal.close();
        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error
            });
        }
    });

    $(document).on('keydown', '#login-form, #signup-form', (e) => {
        let idTrigger = e.key || e.which || e.keyCode;
        if (idTrigger && (idTrigger == 13 || idTrigger.toLowerCase() == "enter")) {
            if (e.target.id === 'search-input') {
                search.trigger('click');
            }
            else {
                if ($(e.target).parents('form').attr('id') == 'login-form')
                    $('#login-form').trigger('submit');
                else if ($(e.target).parents('form').attr('id') == 'signup-form')
                    $('#signup-form').trigger('submit');
            }
        }
    });

    /* ============================== COMPLEMENTARY FUNCTION ============================== */
    const btnSwitchForm = $('#switchingForm');
    btnSwitchForm.on('click', (e) => {
        $('.collapse').toggle();
        let text = e.target.previousSibling.textContent;
        if (text.includes('Already')) {
            e.target.previousSibling.textContent = "Don't have an account ? ";
        } else {
            e.target.previousSibling.textContent = "Already have an account? ";
        };
    });

    $('#loginSignupModal').on('hidden.bs.modal', () => {
        loginForm[0].reset();
        signupForm[0].reset();
        loginForm.removeClass('was-validated');
        signupForm.removeClass('was-validated');
    });
};

export default main;
