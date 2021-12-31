const {ipcRenderer} = require('electron');


function send_settings() {
    const font_size = document.getElementById('font-size').value + 'px';
    const theme = document.getElementById('theme').value;
    const line_num = document.getElementById('line-num').checked;
    const font = document.getElementById('font').value;
    const data = [];
    data.push(theme);
    data.push(font_size);
    data.push(line_num);
    data.push(font);
    ipcRenderer.send("settings" , data);
}