const {ipcRenderer, shell} = require('electron');
const fs = require('fs');

var editor_2;

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
    if(editor_2 != null){
        editor_2.setTheme(f_t_p);
        editor_2.setOptions({
            fontSize: settings[1],
            showLineNumbers: settings[2],
            fontFamily: settings[3],
        });
    }
});


ipcRenderer.on('double_editor', () =>{
    if(document.getElementById('editor-2') == null){
        const editor_22 = document.createElement('div');
        editor_22.id = 'editor-2';
        editor_22.style.position = 'absolute';
        document.getElementById('editor-1').style.right = '50%';
        document.getElementById('editor-1').style.left = 0;
        editor_22.style.top = 0;
        editor_22.style.bottom = 0;
        editor_22.style.left = '50%';
        editor_22.style.right = 0;
        document.body.appendChild(editor_22);
        editor_2 = ace.edit('editor-2');
    }
});


ipcRenderer.on('single_editor', (event) => {
    if(document.getElementById('editor-2') != null){
        document.getElementById('editor-1').style.right = 0;
        document.getElementById('editor-2').remove();
    }
});