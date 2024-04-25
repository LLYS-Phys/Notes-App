let notes = []
let selectedNote = null
let isNewNote = true
let lastId = 0
let showSidebar = true
let touchstartX = 0
let touchendX = 0

window.addEventListener('load', () => {
    const container = document.getElementsByClassName('container')[0]
    const saveBtn = document.getElementById("save")
    const addBtn = document.getElementById("add")
    const deleteBtn = document.getElementById("delete")
    const noteList = document.getElementById("notelist")
    const noteInput = document.getElementById("noteinput")
    const noteName = document.getElementById("notename")
    const toggle = document.getElementById("toggle")
    const header = document.getElementsByClassName('header')[0]
    const search = document.getElementById("search")
    const seachNoResults = document.getElementById("no-results")
    const mobileInfoScreen = document.getElementById("mobile-info")
    const timestamp = document.getElementById("timestamp")

    if (window.matchMedia("(max-width: 1000px)").matches) ( sidebarHide(), noteList.addEventListener("click", sidebarHide) )

    noteInput.addEventListener("click", () => { if (showSidebar && window.matchMedia("(max-width: 1000px)").matches) sidebarHide() })
    noteInput.addEventListener("input", checkInputs)
    noteInput.addEventListener("keydown", (event) => { enterEvents(event) })

    noteName.addEventListener("click", () => { if (showSidebar && window.matchMedia("(max-width: 1000px)").matches) sidebarHide() })
    noteName.addEventListener("input", checkInputs)
    noteName.addEventListener("keydown", (event) => { enterEvents(event) })
        
    function checkDirection() {
        if (touchendX < touchstartX) sidebarHide()
        if (touchendX > touchstartX) sidebarShow()
    }
    document.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX
    })
    document.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX
        checkDirection()
    })

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

    toggle.addEventListener("click", (event) => {
        showSidebar = !showSidebar
        showSidebar ? container.classList.add('active') : container.classList.remove('active')
        showSidebar ? header.classList.remove('sidebar-hidden') : header.classList.add("sidebar-hidden")
        showSidebar ? toggle.setAttribute("title", "Hide Note List") : toggle.setAttribute("title", "Show Note List")
    })

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

    function deselectNotes() {
        if (selectedNote) {
            let selectedElem = document.getElementsByClassName('selected')[0]
            if (selectedElem) selectedElem.classList.remove('selected')
        }
    }

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

    function checkInputs(){
        noteInput.value == "" || noteName.value == "" ? ( disableSaveBtn(), disableAddBtn() ) : ( enableSaveBtn(), enableAddBtn() )
    }

    function sidebarHide(){ container.classList.remove("active"), showSidebar = false }
    function sidebarShow(){ container.classList.add("active"), showSidebar = true }

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

    function enableSaveBtn(){ saveBtn.disabled = false, saveBtn.classList.remove("Mui-disabled") }
    function disableSaveBtn(){ saveBtn.disabled = true, saveBtn.classList.add("Mui-disabled") }

    function enableAddBtn(){ addBtn.disabled = false, addBtn.classList.remove("Mui-disabled") }
    function disableAddBtn(){ addBtn.disabled = true, addBtn.classList.add("Mui-disabled") }

    function enableDeleteBtn(){ deleteBtn.disabled = false, deleteBtn.classList.remove("Mui-disabled") }
    function disableDeleteBtn(){ deleteBtn.disabled = true, deleteBtn.classList.add("Mui-disabled") }
})