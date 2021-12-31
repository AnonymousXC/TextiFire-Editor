const {ipcRenderer} = require('electron');


function find_exp() {
    const txt = document.getElementById('find-in').value;
    ipcRenderer.send('find' , txt);
}