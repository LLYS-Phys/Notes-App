import { Button, TextField, Typography } from "@mui/material"

function Test() {
  return (
    <>
      <div>
        <Typography variant="h1">Wecome</Typography>
        <TextField label="Name"/>
        <Button variant="contained" color="primary">Submit</Button>
      </div>
    </>
  )
}

export default Test
