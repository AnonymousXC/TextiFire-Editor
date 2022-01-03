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

function close_search() {
    editor_1.focus();
    document.getElementById('editor-1').focus();
    document.getElementById('find').style.visibility = 'hidden';
}

function close_goto() {
    editor_1.focus();
    document.getElementById('goto').style.visibility = 'hidden';
}

function close_replace() {
    editor_1.focus();
    document.getElementById('find').style.visibility = 'hidden'
    document.getElementById('replace').style.visibility = 'hidden';
}

function find() {
    const txt = document.getElementById('find-txt').value;
    console.log('running');
    editor_1.findAll(txt);
}

function find_next() {
    editor_1.findNext();
}

function find_pre() {
    editor_1.findPrevious();
}


function goto_line() {
    const line = document.getElementById('line-num').value;
    console.log(line);
    editor_1.gotoLine(line, 0, false);
    editor_1.scrollToLine(line, true, true);
}

function replace_txt() {
    console.log('changes');
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


// ipcRenderer.on('find_word', (event, word) => {
//     document.getElementById('find').style.visibility = 'visible';
//     editor_1.findAll(word);
// });


ipcRenderer.on('find', (event) => {
    document.getElementById('find').style.visibility = 'visible';
});

ipcRenderer.on('goto', (event) => {
    document.getElementById('goto').style.visibility = 'visible';
});

ipcRenderer.on('replace', (event) => {
    document.getElementById('find').style.visibility = 'visible';
    document.getElementById('replace').style.visibility = 'visible';
})


ipcRenderer.on('change_settings', (event, settings) => {
    const theme_path = 'ace/theme/' + settings[0].toLowerCase();
    const f_t_p = theme_path.replaceAll(" ", '_');
    editor_1.setTheme(f_t_p);
    editor_1.setOptions({
        fontSize: settings[1],
        showLineNumbers: settings[2],
        //fontFamily: //settings[3],
        cursorStyle: settings[4],
        highlightActiveLine: settings[5],
        animatedScroll: settings[6],
        fadeFoldWidgets: settings[7],
        scrollSpeed: settings[8],
        tabSize: settings[9],
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
        document.getElementById('editor-1').style.position = 'fixed';
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


ipcRenderer.on('wrap_word', (event) => {
    editor_1.setOptions({
        wrap: true,
    });
});

ipcRenderer.on('unwrap_word', (event) => {
    editor_1.setOptions({
        wrap: false,
    });
});

ipcRenderer.on('sel-all', (event) => {
    editor_1.selectAll();
});


ipcRenderer.on('dd_tt', (event) => {
    const date = new Date
    const tt_yy = date.getHours() + ':' + date.getMinutes() + ' Hours ' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ';
    editor_1.insert(tt_yy);
});
