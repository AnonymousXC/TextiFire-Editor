const {ipcRenderer, shell} = require('electron');
const fs = require('fs');


function open_file(path) {
    const data = fs.readFileSync(path, {encoding: 'utf-8' , flag: 'r'});
    editor_1.setValue(data);
}

function save_file(path) {
    try{
    const data = editor_1.getValue();
    fs.writeFileSync(path, data, {encoding: 'utf-8' , flag:'w'});
    }
    catch(error){
        window.alert(error);
    }
}


function search_gog() {
    const txt = window.getSelection().toString();
    if(txt)
        shell.openExternal('https://www.google.com/search?q=' + txt)
}


ipcRenderer.on('new' , (event) => {
    editor_1.setValue('');
});

ipcRenderer.on('open_file' , (event, path) => {
    open_file(path);
});


ipcRenderer.on('save_file' , (event, path) => {
    save_file(path);
});

ipcRenderer.on('search_gog', (event) => {
    search_gog();
});


ipcRenderer.on('find_word', (event, word) => {
    editor_1.findAll(word);
});


ipcRenderer.on('change_settings', (event, settings) => {
    const theme_path = 'ace/theme/' + settings[0].toLowerCase();
    const f_t_p = theme_path.replaceAll(" ", '_');
    editor_1.setTheme(f_t_p);
    editor_1.setOptions({
        fontSize: settings[1],
        showLineNumbers: settings[2],
        fontFamily: settings[3],
    });
});