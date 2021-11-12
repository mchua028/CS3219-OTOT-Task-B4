import React from "react";
import './App.css';

import axios from "axios";
import { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {Button} from '@material-ui/core';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField"
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from '@material-ui/icons/Edit';

import Dialog from '@material-ui/core/Dialog';
import { DialogTitle } from "@material-ui/core";
import { DialogContent } from "@material-ui/core";
import { DialogContentText } from "@material-ui/core";
import { DialogActions } from "@material-ui/core";
import Box from '@material-ui/core/Box';

import { createTheme } from '@material-ui/core/styles';

const customtheme = createTheme({
  palette: {
    secondary: {
      light: '#efefef',
      main: '#d32f2f',
      dark: '#d3d3d3',
      contrastText: '#000',
    },
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
	fontSize:16
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: customtheme.palette.secondary.light,
    },
  },
}))(TableRow);

const App = () => {
  const [trainingData, setTrainingData] = useState([]);

  useEffect(() => {
	axios.get("http://localhost:8080/restapi/trainings")
		.then((response) => {
			setTrainingData(response.data.data);
		})
	}, [])

	const getData = () => {
		axios.get("http://localhost:8080/restapi/trainings")
			.then((getData) => {
				setTrainingData(getData.data.data);
			})
	}


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  	const [id, setID] = useState(null);
  	const [name, setName] = useState('');
	const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);

  const postData = () => {
	  if(name=="" || distance<=0 || duration<=0){
		  alert("All fields must be filled and distance/duration must be positive");
	  }
	  else{
		axios.post("http://localhost:8080/restapi/trainings", {
			name,
			distance,
			duration
		})
		.then(() => {
			getData();
		})
		alert("New training successfully added");
	}
}

const setData = (data) => {
	let id = data._id;
	let name = data.name;
	let distance = parseInt(data.distance);
	let duration = parseInt(data.duration);
	
	setID(id);
	setName(name);
	setDistance(distance);
	setDuration(duration);
}

const updateData = () => {
	console.log(`http://localhost:8080/restapi/trainings/${id}`);
	console.log(`id: ${id}`);
	if(name=="" || distance<=0 || duration<=0){
		alert("All fields must be filled and distance/duration must be positive");
	}
	else{
		axios.put(`http://localhost:8080/restapi/trainings/${id}`, {
			name,
			distance,
			duration
		})
		.then(() => {
			getData();
		})
		alert("Training successfully updated");
	}
}

const onDelete = (id) => {
	axios.delete(`http://localhost:8080/restapi/trainings/${id}`)
	.then(() => {
        getData();
    })
	alert("Training successfully deleted");
  }

  return (
    <div className="App">
		<div className="App-header">
      <h1>Welcome to training hub</h1>
	  <img src="https://www.freeiconspng.com/thumbs/exercise-icon/exercise-icon-1.png"className="App-logo" alt="logo" />
	  </div>
	  <br></br>
	
	<br></br>
	<TextField required id="name" label="Name" variant="outlined" onChange={(e) => setName(e.target.value)}/>
	<TextField required id="distance" label="Distance(km)" variant="outlined" type="number" onChange={(e) => setDistance(e.target.value)}/>
	<TextField required id="duration" label="Duration(min)" variant="outlined" type="number" onChange={(e) => setDuration(e.target.value)}/>
	<Button color="primary" variant="contained" onClick={postData}> Submit </Button>
	<br></br>
	<br></br>
	<Dialog open={open} onClose={handleClose}>
		<DialogTitle>Fill in </DialogTitle>
		<DialogContent>
		<DialogContentText>
			Enter details of training:
		</DialogContentText>
		<Box
			component="form"
			sx={{
				'& .MuiTextField-root': { m: 2, width: '15ch' },
			}}
			noValidate
			autoComplete="off"
			>
			<div>
				<TextField 
				id="name" label="Name" variant="outlined" 
				value={name} onChange={(e) => setName(e.target.value)}
				/>
				<TextField 
				id="distance" label="Distance(km)" variant="outlined" 
				value={distance} type="number" onChange={(e) => setDistance(e.target.value)}/>
				<TextField 
				id="duration" label="Duration(min)" variant="outlined" 
				value={duration} type="number" onChange={(e) => setDuration(e.target.value)}/>
			</div>
			</Box>
		</DialogContent>
		<DialogActions>
		<Button onClick={handleClose}>Cancel</Button>
		<Button onClick={()=>{handleSave();updateData()}}>Save</Button>
		</DialogActions>
	</Dialog>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell >Distance(km)</StyledTableCell>
			  <StyledTableCell >Duration(min)</StyledTableCell>
			  <StyledTableCell ></StyledTableCell>
			  <StyledTableCell ></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {trainingData.map((item) => {
                return (
                  <StyledTableRow>
                    <StyledTableCell>
                      {item.name}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item.distance}
                    </StyledTableCell>
					<StyledTableCell>
                      {item.duration}
                    </StyledTableCell>
					<StyledTableCell align='right' width='10'>
						<Button color="primary" variant="contained" onClick={() => {handleClickOpen();setData(item)}}>Edit</Button>
					</StyledTableCell>
					<StyledTableCell align='right' width='10'>
						<Button color="secondary" variant="contained" onClick={() => onDelete(item._id)}>Delete</Button>
					</StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
	  <br></br>
	  <Button color="primary" variant="contained" onClick={getData}>Reload</Button>
	  <br></br>
	  <br></br>
    </div>
  );
};

export default App;
