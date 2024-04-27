import { Button, TextField, InputAdornment } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu';
import './Notes.css'
import { useRef } from "react";

const Notes = () => {
    /** Declare variables **/
    let notes = [], selectedNote = null, lastId = 0, showSidebar = window.matchMedia("(max-width: 1000px)").matches ? false : true, touchstartX = 0, touchendX = 0

    /** Declare constants **/
    const container = useRef(null), header = useRef(null)
    const toggle = useRef(null)
    const saveBtn = useRef(null), addBtn = useRef(null), deleteBtn = useRef(null)
    const noteList = useRef(null), noteInput = useRef(""), noteName = useRef("")
    const search = useRef(null), seachNoResults = useRef(null)
    const mobileInfoScreen = useRef(null)
    const timestamp = useRef(null)

    /** Mobile only function to close the sidebar on click outside of it **/
    const handleNoteFocus = () => { if (showSidebar && window.matchMedia("(max-width: 1000px)").matches) sidebarHide() }

    /** Swipe events for the sidebar **/
    const checkDirection = () => { touchendX+(screen.width/3) < touchstartX ? sidebarHide() : touchendX > touchstartX+(screen.width/3) ? sidebarShow() : null }
    document.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX })
    document.addEventListener('touchend', e => { touchendX = e.changedTouches[0].screenX, checkDirection() })

    /** Note input events handling - checks if both the title and the textarea have at least one symbol each and controls whether the add and save buttons are disabled **/
    const handleNoteInput = () => {
        noteInput.current.value == "" && noteName.current.value == "" ? disableAddBtn() : enableAddBtn()
        noteInput.current.value == "" || noteName.current.value == "" ? disableSaveBtn() : enableSaveBtn()
    }

    /** Button event handling **/
    const handleSave = () => { save() }
    const handleAdd = () => { reset(), focusOnName() }
    const handleDelete = () => {
        if (selectedNote) {
            notes.splice(notes.indexOf(selectedNote), 1)
            let note = document.getElementsByClassName(`note-${selectedNote.id}`)[0]
            note.remove()
            reset()
        }
    }

    /** Toggle event handling **/
    const handleToggle = () => {
        showSidebar = !showSidebar
        showSidebar ? container.current.classList.add('active') : container.current.classList.remove('active')
        showSidebar ? header.current.classList.remove('sidebar-hidden') : header.current.classList.add("sidebar-hidden")
        showSidebar ? toggle.current.setAttribute("title", "Hide Note List") : toggle.current.setAttribute("title", "Show Note List")
    }

    /** Note selection event handling **/
    const handleSelect = (event) => {
        if (window.matchMedia("(max-width: 1000px)").matches) sidebarHide()

        if (event.target.tagName === 'LI' && !event.target.classList.contains("selected")) {
            let li = event.target
            let index = li.className[li.className.length - 1]
            selectedNote = notes.filter(note => note.id === +index)[0]
            deselectNotes()
            event.target.classList.add('selected')
            noteInput.current.value = selectedNote.text
            noteName.current.value = selectedNote.title
            timestamp.current.innerText = selectedNote.timestamp
            timestamp.current.classList.add("active")
            focusOnName()
            enableSaveBtn()
            enableAddBtn()
            enableDeleteBtn()
        }
    }

    /** Search event handling - the searchbar looks for matches both in the title and the content of the note **/
    const handleSearch = () => {
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
    const save = () => {
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
            focusOnName()
            reset()
        }
    }

    /** Deselects any selected notes from the list **/
    const deselectNotes = () => {
        if (selectedNote) {
            let selectedElem = document.getElementsByClassName('selected')[0]
            if (selectedElem) selectedElem.classList.remove('selected')
        }
    }

    /** Sets the note to default state (Add new note) **/
    const reset = () => {
        deselectNotes()
        selectedNote = null
        noteInput.current.value = ''
        noteName.current.value = ''
        timestamp.current.textContent = ''
        timestamp.current.classList.remove("active")
        disableSaveBtn()
        disableAddBtn()
        disableDeleteBtn()
    }

    /** Functions to contol if the sidebar is shown or not **/
    const sidebarHide = () => { if (container.current != undefined) (container.current.classList.remove("active"), showSidebar = false) }
    const sidebarShow = () => { if (container.current != undefined) (container.current.classList.add("active"), showSidebar = true) }

    /** Desktop only functions to allow the user to save a new note with an enter click (if they have at least one symbol in both title and textarea fields) and enable adding a new row with shift+enter **/
    const handleEnter = () => { if (!window.matchMedia("(max-width: 1000px)").matches) enterEvents(event) }
    const enterEvents = (event) => { if (event.keyCode == 13) event.shiftKey ? pasteIntoInput(this, "\n") : ( save(), event.preventDefault() ) }
    const pasteIntoInput = (el, text) => {
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

    /** Focus on the title of the note on desktop devices **/
    const focusOnName = () => { if (!window.matchMedia("(max-width: 1000px)").matches) noteName.current.focus() }

    /** Functions for enabling and disabling the buttons **/
    const enableSaveBtn = () => { saveBtn.current.disabled = false, saveBtn.current.classList.remove("Mui-disabled") }
    const disableSaveBtn = () => { saveBtn.current.disabled = true, saveBtn.current.classList.add("Mui-disabled") }
    const enableAddBtn = () => { addBtn.current.disabled = false, addBtn.current.classList.remove("Mui-disabled") }
    const disableAddBtn = () => { addBtn.current.disabled = true, addBtn.current.classList.add("Mui-disabled") }
    const enableDeleteBtn = () => { deleteBtn.current.disabled = false, deleteBtn.current.classList.remove("Mui-disabled") }
    const disableDeleteBtn = () => { deleteBtn.current.disabled = true, deleteBtn.current.classList.add("Mui-disabled") }

  return (
    <>
      <div className={"container " + (!window.matchMedia("(max-width: 1000px)").matches ? "active" : "")} ref={container}>
        <header className="header" ref={header}>
            <div>
                <Button 
                    aria-label="Toggle Sidebar"
                    variant="outlined" 
                    id="toggle" 
                    title="Hide Note List" 
                    ref={toggle} 
                    onClick={handleToggle}>
                        <ArrowBackIosIcon fontSize="small" id="arrow-desktop" />
                        <MenuIcon fontSize={(window.matchMedia("(max-width: 700px)").matches && window.matchMedia("(orientation: portrait)").matches ? "large" : "small")} id="menu-mobile" />
                </Button>
                <Button 
                    aria-label="Add New Note"
                    variant="outlined" 
                    id="add" 
                    title="Add new note" 
                    className="Mui-disabled"
                    disabled={noteInput.value == "" && noteName.value == ""} 
                    ref={addBtn} 
                    onClick={handleAdd}>
                        <AddIcon fontSize={(window.matchMedia("(max-width: 700px)").matches && window.matchMedia("(orientation: portrait)").matches ? "large" : "small")}/>
                </Button>
            </div>
            <h3>Notes</h3>
            <div className="buttons">
                <Button 
                    aria-label="Delete Current Note"
                    variant="outlined" 
                    id="delete" 
                    title="Delete note" 
                    className="Mui-disabled"
                    disabled={selectedNote} 
                    ref={deleteBtn} 
                    onClick={handleDelete}>
                        <DeleteIcon fontSize={(window.matchMedia("(max-width: 700px)").matches && window.matchMedia("(orientation: portrait)").matches ? "large" : "small")}/>
                </Button>
                <Button 
                    aria-label="Save Current Note"
                    variant="outlined" 
                    id="save" 
                    title="Save note" 
                    className="Mui-disabled"
                    disabled={noteInput.value == "" || noteName.value == ""} 
                    ref={saveBtn} 
                    onClick={handleSave}>
                        <SaveIcon  fontSize={(window.matchMedia("(max-width: 700px)").matches && window.matchMedia("(orientation: portrait)").matches ? "large" : "small")}/>
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
                onFocus={handleNoteFocus} 
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
                    onFocus={handleNoteFocus} 
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
