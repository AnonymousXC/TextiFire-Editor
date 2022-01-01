const {ipcRenderer} = require('electron');


function send_settings() {
    const font_size = document.getElementById('font-size').value + 'px';
    const theme = document.getElementById('theme').value;
    const line_num = document.getElementById('line-num').checked;
    const font = document.getElementById('font').value;
    const cursor_style = document.getElementById('cursor').value;
    const highlight = document.getElementById('highlight').checked;
    const anime_scroll = true//document.getElementById('scroll-anime').checked;
    const fade_fold = document.getElementById('fadefold').checked;
    const scroll_speed = document.getElementById('scrollSpeed').value;
    const tab_size = document.getElementById('tab-size').value;
    const data = [];
    data.push(theme);
    data.push(font_size);
    data.push(line_num);
    data.push(font);
    data.push(cursor_style);
    data.push(highlight);
    data.push(anime_scroll);
    data.push(fade_fold);
    data.push(scroll_speed);
    data.push(tab_size);
    ipcRenderer.send("settings" , data);
}