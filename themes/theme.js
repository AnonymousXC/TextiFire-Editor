const {ipcRenderer} = require('electron');


function send_theme() {
    const theme = document.getElementById('theme').value;
    ipcRenderer.send("theme" , theme);
}