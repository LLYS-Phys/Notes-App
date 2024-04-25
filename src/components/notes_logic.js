let notes = [];
let selectedNote = null;
let isNewNote = true;
let lastId = 0;
let showSidebar = true;
let touchstartX = 0
let touchendX = 0

window.addEventListener('load', () => {
    const container = document.getElementsByClassName('container')[0]
    const saveBtn = document.getElementById("save")
    const addBtn = document.getElementById("add")
    const deleteBtn = document.getElementById("delete")
    const noteList = document.getElementById("notelist")
    const noteInput = document.getElementById("noteinput")
    const toggle = document.getElementById("toggle")
    const header = document.getElementsByClassName('header')[0]
    const search = document.getElementById("search")
    const seachNoResults = document.getElementById("no-results")
    const mobileInfoScreen = document.getElementById("mobile-info")

    if (window.matchMedia("(max-width: 1000px)").matches){
        container.classList.remove("active")
        showSidebar = false
        noteList.addEventListener("click", () => {
            container.classList.remove("active")
            showSidebar = false
        })
    }
    noteInput.addEventListener("click", () => {
        if (showSidebar && window.matchMedia("(max-width: 1000px)").matches){  
            container.classList.remove("active")
            showSidebar = false
        }
    })
        
    function checkDirection() {
        if (touchendX < touchstartX){
            container.classList.remove("active")
            showSidebar = false
        } 
        if (touchendX > touchstartX) {
            container.classList.add("active")
            showSidebar = true
        }
    }

    document.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX
    })

    document.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX
        checkDirection()
    })

    noteInput.addEventListener("input", () => {
        if (noteInput.value == ""){
            saveBtn.disabled = true
            saveBtn.classList.add("Mui-disabled")
            addBtn.disabled = true
            addBtn.classList.add("Mui-disabled")
        }
        else{
            saveBtn.disabled = false
            saveBtn.classList.remove("Mui-disabled")
            addBtn.disabled = false
            addBtn.classList.remove("Mui-disabled")
        }
    })

    addBtn.addEventListener("click", () => {
        reset();
        noteInput.focus();
    })

    saveBtn.addEventListener("click", () => {
        save()
    });

    noteInput.addEventListener("keydown", (event) => {
        if (event.keyCode == 13) {
            if (event.shiftKey){
                pasteIntoInput(this, "\n");
            }
            else{
                save()
                event.preventDefault()
            }
        }
    })

    function pasteIntoInput(el, text) {
        if (el != undefined){
            el.focus()
            if (typeof el.selectionStart == "number"
                    && typeof el.selectionEnd == "number") {
                var val = el.value;
                var selStart = el.selectionStart;
                el.value = val.slice(0, selStart) + text + val.slice(el.selectionEnd);
                el.selectionEnd = el.selectionStart = selStart + text.length;
            } else if (typeof document.selection != "undefined") {
                var textRange = document.selection.createRange();
                textRange.text = text;
                textRange.collapse(false);
                textRange.select();
            }
        }
    }

    deleteBtn.addEventListener("click", (event) => {
        if (selectedNote) {
            notes.splice(notes.indexOf(selectedNote), 1);
            let noteEl = document.getElementsByClassName(`note-${selectedNote.id}`)[0];
            noteEl.remove();
            reset();
        }
    });

    noteList.addEventListener("click", (event) => {
        if (event.target.tagName === 'LI') {
            let li = event.target;
            let index = li.className[li.className.length - 1];
            selectedNote = notes.filter(note => note.id === +index)[0];
            deselectEls();
            event.target.classList.add('selected');
            noteInput.value = selectedNote.text;
            noteInput.focus();
            saveBtn.disabled = false
            saveBtn.classList.remove("Mui-disabled")
            addBtn.disabled = false
            addBtn.classList.remove("Mui-disabled")
            deleteBtn.disabled = false
            deleteBtn.classList.remove("Mui-disabled")
        }
    })

    toggle.addEventListener("click", (event) => {
        showSidebar = !showSidebar;
        showSidebar ? container.classList.add('active') : container.classList.remove('active');
        showSidebar ? header.classList.remove('sidebar-hidden') : header.classList.add("sidebar-hidden");
        showSidebar ? toggle.setAttribute("title", "Hide Note List") : toggle.setAttribute("title", "Show Note List")
    });

    search.addEventListener("input", () => {
        let countHidden = 0
        for (let i=0; i<notes.length; i++){
            if (notes[i].text.includes(search.value) || search.value == ""){
                document.getElementsByClassName("note-" + notes[i].id)[0].classList.remove("hidden")
            }
            else{
                document.getElementsByClassName("note-" + notes[i].id)[0].classList.add("hidden")
                countHidden += 1
            }
        }
        if (search.value != "" && countHidden == document.getElementsByTagName("li").length){
            seachNoResults.style.display = "block"
        }
        else{
            seachNoResults.style.display = "none"
        }
    })

    function reset() {
        deselectEls();
        selectedNote = null;
        isNewNote = true;
        noteInput.value = '';
        saveBtn.disabled = true
        saveBtn.classList.add("Mui-disabled")
        addBtn.disabled = true
        addBtn.classList.add("Mui-disabled")
        deleteBtn.disabled = true
        deleteBtn.classList.add("Mui-disabled")
    }

    function deselectEls() {
        if (selectedNote) {
            let selectedElem = document.getElementsByClassName('selected')[0];
            if (selectedElem){
                selectedElem.classList.remove('selected');
            }
        }
    }

    function save() {
        if (noteInput.value.length > 1) {
            mobileInfoScreen.classList.add("active")
            setTimeout(() => {
                mobileInfoScreen.classList.remove("active")
            }, 1000);
            let newNote = { id: lastId, text: noteInput.value };
            let li
            if (selectedNote == null){
                li = document.createElement('li');
                li.className = `note-${newNote.id}`;
                lastId++;
                noteList.appendChild(li);
                notes.push(newNote);
            }
            else{
                li = document.getElementsByClassName('selected')[0]
                let liIndex = notes.findIndex(note => note.text == li.textContent)
                notes[liIndex].text = newNote.text
            }
            deselectEls();
            li.classList.add('selected');
            li.innerHTML = newNote.text;
            selectedNote = newNote;
            isNewNote = false;
            noteInput.focus();
            reset()
        }
    }
})