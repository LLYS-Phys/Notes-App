import { Button, TextField, Typography, InputAdornment } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './notes.css'
import './notes_logic.js'

function Notes() {
  return (
    <>
      <div className="container active">
        <header>
            <Button variant="outlined" id="add" title="Add new note">
                <AddIcon fontSize="small"/>
            </Button>
            <h3>Notes</h3>
            <div className="buttons">
                <Button variant="outlined" id="removenote" title="Delete note">
                    <DeleteIcon  fontSize="small"/>
                </Button>
                <Button variant="outlined" id="save" title="Save note">
                    <SaveIcon  fontSize="small"/>
                </Button>
            </div>
        </header>
        <aside>
            <Button variant="contained" id="toggle">
                <ArrowBackIosIcon fontSize="small" />
            </Button>
            <div className="search-box">
                <TextField variant="standard" id="search" placeholder="Search" InputProps={{startAdornment: <InputAdornment position="start"><i className="fa fa-search"></i></InputAdornment>,}}></TextField>
            </div>
            <ul id="notelist">
            
            </ul>
        </aside>
        <main>
            <textarea name="noteinput" id="noteinput" cols="50" rows="50" placeholder="Create new note"></textarea>
        </main>
      </div>
      <script src="./notes_logic.js"></script>
    </>
  )
}

export default Notes
