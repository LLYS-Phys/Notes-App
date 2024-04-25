import { Button, TextField, Typography, InputAdornment } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu';
import './notes.css'
import './notes_logic.js'

function Notes() {
  return (
    <>
      <div className="container active">
        <header className="header">
            <div>
                <Button variant="outlined" id="toggle" title="Hide Note List">
                    <ArrowBackIosIcon fontSize="small" id="arrow-desktop" />
                    <MenuIcon fontSize="small" id="menu-mobile" />
                </Button>
                <Button variant="outlined" id="add" title="Add new note" disabled>
                    <AddIcon fontSize="small"/>
                </Button>
            </div>
            <h3>Notes</h3>
            <div className="buttons">
                <Button variant="outlined" id="delete" title="Delete note" disabled>
                    <DeleteIcon  fontSize="small"/>
                </Button>
                <Button variant="outlined" id="save" title="Save note" disabled>
                    <SaveIcon  fontSize="small"/>
                </Button>
            </div>
        </header>
        <aside className="sidebar">
            <div className="search-box">
                <TextField variant="standard" id="search" placeholder="Search" InputProps={{startAdornment: <InputAdornment position="start"><i className="fa fa-search"></i></InputAdornment>,}}></TextField>
            </div>
            <ul id="notelist">
                <p id="no-results">No results found</p>
            </ul>
        </aside>
        <main className="main">
            <TextField variant="standard" id="notename" fullWidth placeholder="Note Name"></TextField>
            <textarea name="noteinput" id="noteinput" cols="50" rows="50" placeholder="Create new note"></textarea>
            <div id="mobile-info">
                <p>Note saved successfully!</p>
            </div>
            <div id="timestamp"></div>
        </main>
      </div>
      <script src="./notes_logic.js"></script>
    </>
  )
}

export default Notes
