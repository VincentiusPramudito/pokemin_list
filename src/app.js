import 'regenerator-runtime';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Swal from 'sweetalert2';
window.Swal = Swal;

import './styles/style.css';
import main from './scripts/view/main.js';

document.addEventListener('DOMContentLoaded', main);
