let notes = [];
let selectedNote = null;
let isNewNote = true;
let lastId = 0;
let showSidebar = true;

window.addEventListener('load', () => {
    document.getElementById("add").addEventListener("click", () => {
        reset();
        document.getElementById("noteinput").focus();
    })

    document.getElementById("save").addEventListener("click", (event) => {
        if (document.getElementById("noteinput").value.length > 1) {
            let newNote = { id: lastId, text: document.getElementById("noteinput").value };
            let li = document.createElement('li');
            li.className = `note-${newNote.id}`;
            deselectEls();
            li.classList.add('selected');
            li.innerHTML = newNote.text;
            notelist.appendChild(li);
            notes.push(newNote);
            selectedNote = newNote;
            isNewNote = false;
            lastId++;
            document.getElementById("noteinput").focus();
            reset()
        }
    });

    document.getElementById("removenote").addEventListener("click", (event) => {
        if (selectedNote) {
            // remove note from array
            notes.splice(notes.indexOf(selectedNote), 1);
            // remove el from DOM
            let noteEl = document.getElementsByClassName(`note-${selectedNote.id}`)[0];
            noteEl.remove();
            reset();
        }
    });

    document.getElementById("notelist").addEventListener("click", (event) => {
        if (event.target.tagName === 'LI') {
            let li = event.target;
            let index = li.className[li.className.length - 1];
            selectedNote = notes.filter(note => note.id === +index)[0];
            deselectEls();
            event.target.classList.add('selected');
            document.getElementById("noteinput").value = selectedNote.text;
            document.getElementById("noteinput").focus();
        }
    })

    document.getElementById("toggle").addEventListener("click", (event) => {
        let container = document.getElementsByClassName('container')[0];
        showSidebar = !showSidebar;
        showSidebar ? container.classList.add('active') : container.classList.remove('active');
    });

    document.getElementById("search").addEventListener("input", () => {
        for (let i=0; i<notes.length; i++){
            if (notes[i].text.includes(document.getElementById("search").value) || document.getElementById("search").value == ""){
                document.getElementsByClassName("note-" + notes[i].id)[0].classList.remove("hidden")
            }
            else{
                document.getElementsByClassName("note-" + notes[i].id)[0].classList.add("hidden")
            }
        }
    })

    function reset() {
        deselectEls();
        selectedNote = null;
        isNewNote = true;
        document.getElementById("noteinput").value = '';
    }

    function deselectEls() {
        if (selectedNote) {
            let selectedElem = document.getElementsByClassName('selected')[0];
            if (selectedElem){
                selectedElem.classList.remove('selected');
            }
        }
    }
})