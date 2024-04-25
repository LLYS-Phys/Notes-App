/** Declare variables **/
let notes = [], selectedNote = null, isNewNote = true, lastId = 0, showSidebar = true, touchstartX = 0, touchendX = 0

window.addEventListener('load', () => {
    /** Declare constants **/
    const container = document.getElementsByClassName('container')[0], header = document.getElementsByClassName('header')[0]
    const saveBtn = document.getElementById("save"), addBtn = document.getElementById("add"), deleteBtn = document.getElementById("delete")
    const noteList = document.getElementById("notelist"), noteInput = document.getElementById("noteinput"), noteName = document.getElementById("notename")
    const toggle = document.getElementById("toggle")
    const search = document.getElementById("search"), seachNoResults = document.getElementById("no-results")
    const mobileInfoScreen = document.getElementById("mobile-info")
    const timestamp = document.getElementById("timestamp")

    /** Hide the sidebar by default on non-desktop devices **/
    if (window.matchMedia("(max-width: 1000px)").matches) ( sidebarHide(), noteList.addEventListener("click", sidebarHide) )

    /** Event listeners for the textarea of the note **/
    noteInput.addEventListener("click", () => { if (showSidebar && window.matchMedia("(max-width: 1000px)").matches) sidebarHide() })
    noteInput.addEventListener("input", checkInputs)
    noteInput.addEventListener("keydown", (event) => { if (!window.matchMedia("(max-width: 1000px)").matches) enterEvents(event) })

    /** Event listeners for the title of the note **/
    noteName.addEventListener("click", () => { if (showSidebar && window.matchMedia("(max-width: 1000px)").matches) sidebarHide() })
    noteName.addEventListener("input", checkInputs)
    noteName.addEventListener("keydown", (event) => { if (!window.matchMedia("(max-width: 1000px)").matches) enterEvents(event) })
        
    /** Swipe events for the sidebar **/
    function checkDirection() { 
        touchendX+25 < touchstartX ? sidebarHide() : touchendX > touchstartX+(screen.width/3) ? sidebarShow() : null 
    }
    document.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX })
    document.addEventListener('touchend', e => { touchendX = e.changedTouches[0].screenX, checkDirection() })

    /** Event listeners for the buttons **/
    addBtn.addEventListener("click", () => { ( reset(), noteName.focus() )})
    saveBtn.addEventListener("click", save)
    deleteBtn.addEventListener("click", (event) => {
        if (selectedNote) {
            notes.splice(notes.indexOf(selectedNote), 1)
            let note = document.getElementsByClassName(`note-${selectedNote.id}`)[0]
            note.remove()
            reset()
        }
    })
    toggle.addEventListener("click", (event) => {
        showSidebar = !showSidebar
        showSidebar ? container.classList.add('active') : container.classList.remove('active')
        showSidebar ? header.classList.remove('sidebar-hidden') : header.classList.add("sidebar-hidden")
        showSidebar ? toggle.setAttribute("title", "Hide Note List") : toggle.setAttribute("title", "Show Note List")
    })

    /** Event listeners for note selection **/
    noteList.addEventListener("click", (event) => {
        if (event.target.tagName === 'LI') {
            let li = event.target
            let index = li.className[li.className.length - 1]
            selectedNote = notes.filter(note => note.id === +index)[0]
            deselectNotes()
            event.target.classList.add('selected')
            noteInput.value = selectedNote.text
            noteName.value = selectedNote.title
            timestamp.innerText = selectedNote.timestamp
            noteName.focus()
            enableSaveBtn()
            enableAddBtn()
            enableDeleteBtn()
            timestamp.classList.add("active")
        }
    })

    /** Event listeners for the search bar **/
    search.addEventListener("input", () => {
        let countHidden = 0
        for (let i=0; i<notes.length; i++){
            if (notes[i].text.includes(search.value) || notes[i].title.includes(search.value) || search.value == ""){
                document.getElementsByClassName("note-" + notes[i].id)[0].classList.remove("hidden")
            }
            else{
                document.getElementsByClassName("note-" + notes[i].id)[0].classList.add("hidden")
                countHidden += 1
            }
        }
        search.value != "" && countHidden == document.getElementsByTagName("li").length ? seachNoResults.style.display = "block" : seachNoResults.style.display = "none"
    })

    /** Sets the note to default state (Add new note) **/
    function reset() {
        deselectNotes()
        selectedNote = null
        isNewNote = true
        noteInput.value = ''
        noteName.value = ''
        timestamp.textContent = ''
        disableSaveBtn()
        disableAddBtn()
        disableDeleteBtn()
        timestamp.classList.remove("active")
    }

    /** Deselects any selected notes from the list **/
    function deselectNotes() {
        if (selectedNote) {
            let selectedElem = document.getElementsByClassName('selected')[0]
            if (selectedElem) selectedElem.classList.remove('selected')
        }
    }

    /** Saves the new note when both the title and the textarea have at least one symbol and return to default state (Add new note) **/
    function save() {
        if (noteInput.value.length > 0 && noteName.value.length > 0) {
            mobileInfoScreen.classList.add("active")
            setTimeout(() => { mobileInfoScreen.classList.remove("active") }, 1000)
            let now = new Date()
            let date = now.getDate().toString() + "/" + now.getMonth().toString() + "/" + now.getFullYear().toString() + " " + now.getHours().toString() + ":" + now.getMinutes().toString() 
            let newNote = { id: lastId, text: noteInput.value, title: noteName.value, timestamp: date }
            let li
            if (selectedNote == null){
                li = document.createElement('li')
                li.className = `note-${newNote.id}`
                li.setAttribute("uniqueId", lastId)
                lastId++
                noteList.prepend(li)
                notes.push(newNote)
            }
            else{
                li = document.getElementsByClassName('selected')[0]
                let liIndex = notes.findIndex(note => note.id == li.attributes.uniqueId.value)
                notes[liIndex].title = newNote.title
                notes[liIndex].text = newNote.text
            }
            deselectNotes()
            li.classList.add('selected')
            li.innerHTML = newNote.title
            selectedNote = newNote
            isNewNote = false
            noteName.focus()
            reset()
        }
    }

    /** Checks if both the title and the textarea have at least one symbol each and controls whether the add and save buttons are disabled **/
    function checkInputs(){
        noteInput.value == "" && noteName.value == "" ? ( disableAddBtn() ) : ( enableAddBtn() )
        noteInput.value == "" || noteName.value == "" ? ( disableSaveBtn() ) : ( enableSaveBtn() )
    }

    /** Functions to contol if the sidebar is shown or not **/
    function sidebarHide(){ container.classList.remove("active"), showSidebar = false }
    function sidebarShow(){ container.classList.add("active"), showSidebar = true }

    /** Desktop only functions to allow the user to save a new note with an enter click (if they have at least one symbol in both title and textarea fields) and enable adding a new row with shift+enter **/
    function enterEvents(event){ if (event.keyCode == 13) event.shiftKey ? pasteIntoInput(this, "\n") : ( save(), event.preventDefault() ) }
    function pasteIntoInput(el, text) {
        if (el != undefined){
            el.focus()
            if (typeof el.selectionStart == "number"
                    && typeof el.selectionEnd == "number") {
                let val = el.value
                let selStart = el.selectionStart
                el.value = val.slice(0, selStart) + text + val.slice(el.selectionEnd)
                el.selectionEnd = el.selectionStart = selStart + text.length
            } else if (typeof document.selection != "undefined") {
                let textRange = document.selection.createRange()
                textRange.text = text
                textRange.collapse(false)
                textRange.select()
            }
        }
    }

    /** Functions for enabling and disabling the buttons **/
    function enableSaveBtn(){ saveBtn.disabled = false, saveBtn.classList.remove("Mui-disabled") }
    function disableSaveBtn(){ saveBtn.disabled = true, saveBtn.classList.add("Mui-disabled") }
    function enableAddBtn(){ addBtn.disabled = false, addBtn.classList.remove("Mui-disabled") }
    function disableAddBtn(){ addBtn.disabled = true, addBtn.classList.add("Mui-disabled") }
    function enableDeleteBtn(){ deleteBtn.disabled = false, deleteBtn.classList.remove("Mui-disabled") }
    function disableDeleteBtn(){ deleteBtn.disabled = true, deleteBtn.classList.add("Mui-disabled") }
})