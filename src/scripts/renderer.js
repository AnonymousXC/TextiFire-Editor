const {ipcRenderer, shell} = require('electron');
const fs = require('fs');
const path = require('path');

var editor_2, files = [], file_data = [], subfolders = [], current_dir = "", folder_save = "";
const file_extension_open = [".png", ".jpg", ".jpeg", ".svg", ".Ink", ".exe", ".pdf", ".docx"]
var folder_path_create = "C:/Users/CV/Desktop/Projects/Electron Project/Noter Rewritten 2";


function open_file(path) {
    const data = fs.readFileSync(path, {encoding: 'utf-8' , flag: 'r'});
    editor_1.setValue(data);
    editor_1.clearSelection();
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

function open_stackover() {
    shell.openExternal("https://stackoverflow.com/");
}

function open_github() {
    shell.openExternal("https://github.com");
}

function open_itch() {
    shell.openExternal('https://itch.io');
}


function create_file() {
    const file_exe = document.getElementById('file-exe');
    const no_of_input = file_exe.getElementsByTagName('input').length;
    if(current_dir && no_of_input == 0){
        const name_inp = document.createElement('input');
        name_inp.className = "name-inp";
        name_inp.id = "input-0";
        name_inp.onkeydown = file_created;
        name_inp.onblur = remove_box;
        file_exe.appendChild(name_inp);
        name_inp.focus();
    }
}

function file_created() {
    if(event.keyCode == 13 && current_dir){
        const file_name = this.value;
        const path = current_dir + "/" + file_name;
        fs.writeFileSync(path, "", {encoding:'utf-8'});
        readDirFiles(current_dir);
        const inp = document.getElementById('input-0');
        try{
            inp.remove();
        }
        catch(err){
            
        };
    }
}


function remove_box() {
    this.remove();
}

function creater_folder() {
    const file_exe = document.getElementById('file-exe');
    const no_of_child = file_exe.getElementsByTagName('input').length;
    if(no_of_child == 0 && current_dir){
        const box = document.createElement('input');
        box.className = "name-inp";
        box.id = "input-0";
        file_exe.appendChild(box);
        box.onkeydown = folder_created;
        box.focus();
        box.onblur = remove_box;
    }
}

function folder_created() {
    if (event.keyCode == 13 && current_dir) {
        const folder_name = this.value;
        const folder_path = path.join(current_dir, folder_name);
        fs.mkdirSync(folder_path);
        readDirFiles(current_dir);
        const inp = document.getElementById('input-0');
        try{
            inp.remove();
        }
        catch(err){

        };
    }
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


function toggle_file_exe() {
    const file_exe = document.getElementById('file-exe');
    const style = window.getComputedStyle(file_exe);
    const visibility = style.getPropertyValue("visibility");
    if(visibility == "visible"){
        file_exe.style.visibility = 'hidden'
        document.getElementById("editor-1").style.left = "50px";
    }
    else if(visibility == "hidden"){
        file_exe.style.visibility = "visible";
        document.getElementById("editor-1").style.left = "250px";
    }
}


ipcRenderer.on("open_folder", (event, folder_path) => {
    readDirFiles(folder_path[0]);
    folder_path_create = folder_path[0];
});


function readDirFiles(dir) {
    current_dir = dir;
    const files = [];
    const file_exe = document.getElementById("file-exe");
    file_exe.textContent = "";
    file_data = [];
    subfolders = [];
    
    fs.readdirSync(dir).forEach(filename => {
        const name = path.parse(filename).name;
        const ext = path.parse(filename).ext;
        const filepath = path.resolve(dir, filename);
        const stat = fs.statSync(filepath);
        const isFile = stat.isFile();
        const isDir = stat.isDirectory();

        if (isFile) files.push({ filepath, name, ext, stat });
        if (isDir) subfolders.push({filepath, name});
    });
    
    files.sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });
    
    for(var i = 0; i < files.length; i++){
        const btn = document.createElement('button');
        const br = document.createElement("br");
        btn.textContent = files[i].name + files[i].ext;
        btn.onclick = readFileDir;
        btn.id = files[i].name;
        btn.className = "file-btn";
        file_exe.appendChild(btn);
        file_exe.appendChild(br);
    }
    
    for(var j = 0; j < files.length; j++){
        const file_path = files[j].filepath;
        var data = "";
        try {
            data = fs.readFileSync(file_path, {encoding:'utf-8', flag:'r'})
        }
        catch(err){
            console.log(err)
        };
        const file = files[j].name + files[j].ext;
        const extension = files[j].ext;
        const path = files[j].filepath;
        file_data.push({data , file, extension, path});
    }

    for(var j = 0; j < subfolders.length; j++){
        const folder_path = subfolders[j].filepath;
        const name = subfolders[j].name;
        const br = document.createElement('br');
        const btn = document.createElement('button');
        btn.className = "folder-btn";
        btn.textContent = name;
        btn.id = subfolders[j].filepath;
        btn.onclick = open_subfolder;
        file_exe.appendChild(br);
        file_exe.appendChild(btn);
    }
}


function readFileDir() {
    const file_name = this.textContent;
    for(var i = 0; i < file_data.length; i++){
        if(file_data[i].file == file_name){
            if(file_extension_open.includes(file_data[i].extension) != true){
            editor_1.setValue(file_data[i].data);
            editor_1.clearSelection();
            folder_save = file_data[i].path;
            }
            if(file_extension_open.includes(file_data[i].extension) == true){
                shell.openPath(file_data[i].path);
                console.log("Opening");
            }
            break;
        }
    }
}


function open_subfolder() {
    const folder_path = this.id;
    readDirFiles(folder_path)
}

function one_level_up() {
    const up_path = path.join(current_dir, "../");
    readDirFiles(up_path);
}
