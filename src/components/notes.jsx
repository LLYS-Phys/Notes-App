import { Button, TextField, Typography, InputAdornment } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu';
import './notes.css'
import { useRef } from "react";

function Notes() {
    /** Declare variables **/
    let notes = [], selectedNote = null, isNewNote = true, lastId = 0, showSidebar = true, touchstartX = 0, touchendX = 0

    /** Declare constants **/
    const container = useRef(null), header = useRef(null)
    const toggle = useRef(null)
    const saveBtn = useRef(null), addBtn = useRef(null), deleteBtn = useRef(null)
    const noteList = useRef(null), noteInput = useRef(""), noteName = useRef("")
    const search = useRef(null), seachNoResults = useRef(null)
    const mobileInfoScreen = useRef(null)
    const timestamp = useRef(null)

    /** Hide the sidebar by default on non-desktop devices **/
    window.addEventListener('load', () => { if (window.matchMedia("(max-width: 1000px)").matches && noteList.current != null) ( sidebarHide(), noteList.current.addEventListener("click", sidebarHide) ) })

    /** Mobile only function to close the sidebar on click outside of it **/
    function handleNoteClick(){ if (showSidebar && window.matchMedia("(max-width: 1000px)").matches) sidebarHide() }

    /** Swipe events for the sidebar **/
    function checkDirection() { 
        touchendX+25 < touchstartX ? sidebarHide() : touchendX > touchstartX+(screen.width/3) ? sidebarShow() : null 
    }
    document.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX })
    document.addEventListener('touchend', e => { touchendX = e.changedTouches[0].screenX, checkDirection() })

    /** Note input events - checks if both the title and the textarea have at least one symbol each and controls whether the add and save buttons are disabled **/
    function handleNoteInput(){
        noteInput.current.value == "" && noteName.current.value == "" ? disableAddBtn() : enableAddBtn()
        noteInput.current.value == "" || noteName.current.value == "" ? disableSaveBtn() : enableSaveBtn()
    }

    /** Button event handling **/
    function handleSave(){ save() }
    function handleAdd(){ reset(), noteName.current.focus() }
    function handleDelete(){
        if (selectedNote) {
            notes.splice(notes.indexOf(selectedNote), 1)
            let note = document.getElementsByClassName(`note-${selectedNote.id}`)[0]
            note.remove()
            reset()
        }
    }
    function handleToggle(){
        showSidebar = !showSidebar
        showSidebar ? container.current.classList.add('active') : container.current.classList.remove('active')
        showSidebar ? header.current.classList.remove('sidebar-hidden') : header.current.classList.add("sidebar-hidden")
        showSidebar ? toggle.current.setAttribute("title", "Hide Note List") : toggle.current.setAttribute("title", "Show Note List")
    }

    /** Handles note selection **/
    function handleSelect(event){
        if (window.matchMedia("(max-width: 1000px)").matches) sidebarHide()
        if (event.target.tagName === 'LI') {
            let li = event.target
            let index = li.className[li.className.length - 1]
            selectedNote = notes.filter(note => note.id === +index)[0]
            deselectNotes()
            event.target.classList.add('selected')
            noteInput.current.value = selectedNote.text
            noteName.current.value = selectedNote.title
            timestamp.current.innerText = selectedNote.timestamp
            noteName.current.focus()
            enableSaveBtn()
            enableAddBtn()
            enableDeleteBtn()
            timestamp.current.classList.add("active")
        }
    }

    /** Handles search - the searchbar looks for matches both in the title and the content of the note **/
    function handleSearch(){
        let countHidden = 0
        for (let i=0; i<notes.length; i++){
            if (notes[i].text.includes(search.current.value) || notes[i].title.includes(search.current.value) || search.current.value == ""){
                document.getElementsByClassName("note-" + notes[i].id)[0].classList.remove("hidden")
            }
            else{
                document.getElementsByClassName("note-" + notes[i].id)[0].classList.add("hidden")
                countHidden += 1
            }
        }
        search.current.value != "" && countHidden == document.getElementsByTagName("li").length ? seachNoResults.current.style.display = "block" : seachNoResults.current.style.display = "none"
    }

    /** Saves the new note when both the title and the textarea have at least one symbol and return to default state (Add new note) **/
    function save() {
        if (noteInput.current.value.length > 0 && noteName.current.value.length > 0) {
            mobileInfoScreen.current.classList.add("active")
            setTimeout(() => { mobileInfoScreen.current.classList.remove("active") }, 1000)
            let now = new Date()
            let date = now.getDate().toString() + "/" + now.getMonth().toString() + "/" + now.getFullYear().toString() + " " + now.getHours().toString() + ":" + now.getMinutes().toString() 
            let newNote = { id: lastId, text: noteInput.current.value, title: noteName.current.value, timestamp: date }
            let li
            if (selectedNote == null){
                li = document.createElement('li')
                li.className = `note-${newNote.id}`
                li.setAttribute("uniqueId", lastId)
                lastId++
                noteList.current.prepend(li)
                notes.push(newNote)
            }
            else{
                li = document.getElementsByClassName('selected')[0]
                let liIndex = notes.findIndex(note => note.id == li.attributes.uniqueId.value)
                notes[liIndex].title = newNote.title
                notes[liIndex].text = newNote.text
            }
            deselectNotes()
            li.innerHTML = newNote.title
            noteName.current.focus()
            reset()
        }
    }

    /** Deselects any selected notes from the list **/
    function deselectNotes() {
        if (selectedNote) {
            let selectedElem = document.getElementsByClassName('selected')[0]
            if (selectedElem) selectedElem.classList.remove('selected')
        }
    }

    /** Sets the note to default state (Add new note) **/
    function reset() {
        deselectNotes()
        selectedNote = null
        isNewNote = true
        noteInput.current.value = ''
        noteName.current.value = ''
        timestamp.current.textContent = ''
        disableSaveBtn()
        disableAddBtn()
        disableDeleteBtn()
        timestamp.current.classList.remove("active")
    }

    /** Functions to contol if the sidebar is shown or not **/
    function sidebarHide(){ if (container.current != undefined) (container.current.classList.remove("active"), showSidebar = false) }
    function sidebarShow(){ if (container.current != undefined) (container.current.classList.add("active"), showSidebar = true) }

    /** Desktop only functions to allow the user to save a new note with an enter click (if they have at least one symbol in both title and textarea fields) and enable adding a new row with shift+enter **/
    function handleEnter(){ if (!window.matchMedia("(max-width: 1000px)").matches) enterEvents(event) }
    function enterEvents(event){ if (event.keyCode == 13) event.shiftKey ? pasteIntoInput(this, "\n") : ( save(), event.preventDefault() ) }
    function pasteIntoInput(el, text) {
        if (el != undefined){
            el.focus()
            if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
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
    function enableSaveBtn(){ saveBtn.current.disabled = false, saveBtn.current.classList.remove("Mui-disabled") }
    function disableSaveBtn(){ saveBtn.current.disabled = true, saveBtn.current.classList.add("Mui-disabled") }
    function enableAddBtn(){ addBtn.current.disabled = false, addBtn.current.classList.remove("Mui-disabled") }
    function disableAddBtn(){ addBtn.current.disabled = true, addBtn.current.classList.add("Mui-disabled") }
    function enableDeleteBtn(){ deleteBtn.current.disabled = false, deleteBtn.current.classList.remove("Mui-disabled") }
    function disableDeleteBtn(){ deleteBtn.current.disabled = true, deleteBtn.current.classList.add("Mui-disabled") }

  return (
    <>
      <div className="container active" ref={container}>
        <header className="header" ref={header}>
            <div>
                <Button 
                    variant="outlined" 
                    id="toggle" 
                    title="Hide Note List" 
                    ref={toggle} 
                    onClick={handleToggle}>
                        <ArrowBackIosIcon fontSize="small" id="arrow-desktop" />
                        <MenuIcon fontSize="small" id="menu-mobile" />
                </Button>
                <Button 
                    variant="outlined" 
                    id="add" 
                    title="Add new note" 
                    disabled={noteInput.value == "" && noteName.value == ""} 
                    ref={addBtn} 
                    onClick={handleAdd}>
                        <AddIcon fontSize="small"/>
                </Button>
            </div>
            <h3>Notes</h3>
            <div className="buttons">
                <Button 
                    variant="outlined" 
                    id="delete" 
                    title="Delete note" 
                    disabled={selectedNote} 
                    ref={deleteBtn} 
                    onClick={handleDelete}>
                        <DeleteIcon fontSize="small"/>
                </Button>
                <Button 
                    variant="outlined" 
                    id="save" 
                    title="Save note" 
                    disabled={noteInput.value == "" || noteName.value == ""} 
                    ref={saveBtn} 
                    onClick={handleSave}>
                        <SaveIcon  fontSize="small"/>
                </Button>
            </div>
        </header>
        <aside className="sidebar">
            <div className="search-box">
                <TextField 
                    variant="standard" 
                    id="search" 
                    placeholder="Search" 
                    inputRef={search} 
                    onInput={handleSearch} 
                    InputProps={{startAdornment: <InputAdornment position="start">
                                                    <i className="fa fa-search"></i>
                                                 </InputAdornment>,}}>
                </TextField>
            </div>
            <ul id="notelist" ref={noteList} onClick={(event)=>handleSelect(event)}>
                <p id="no-results" ref={seachNoResults}>No results found</p>
            </ul>
        </aside>
        <main className="main">
            <TextField 
                variant="standard" 
                id="notename" 
                fullWidth 
                placeholder="Note Name" 
                inputRef={noteName} 
                onInput={handleNoteInput} 
                onClick={handleNoteClick} 
                onKeyDown={(event)=>handleEnter(event)}>
            </TextField>
            <div id="noteinput-wrapper">
                <textarea 
                    name="noteinput" 
                    id="noteinput" 
                    cols="50" 
                    rows="50" 
                    placeholder="Create new note" 
                    ref={noteInput} 
                    onInput={handleNoteInput} 
                    onClick={handleNoteClick} 
                    onKeyDown={(event)=>handleEnter(event)}>
                </textarea>
            </div>
            <div id="mobile-info" ref={mobileInfoScreen}>
                <p>Note saved successfully!</p>
            </div>
            <div id="timestamp" ref={timestamp}></div>
        </main>
      </div>
      
    </>
  )
}

export default Notes
