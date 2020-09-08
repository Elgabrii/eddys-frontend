import React, {useEffect, useState} from 'react';
// import name from '../';
import { api } from '../../api/api';
import Button from '@material-ui/core/Button';
import {
  Base,
  Zone,
  Zones
} from './Zones.style';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import {Flex} from '@rebass/grid';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import green from '@material-ui/core/colors/green';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


export default () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [zone, setZone] = useState('');
  const classes = useStyles();
  const [deleteId, setDeleteId] = useState('')

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDeleteModal = (id) => {
    setOpenDeleteModal(true)
    setDeleteId(id)
  }

  const closeDeleteModal = () => {
    setOpenDeleteModal(false)
  }

  useEffect(() => {
    fetchZones()
  }, []);

  const fetchZones = async() => {
    setLoading(true);
    let response = await api.get('/zone');
    setZones(response.data)
    setLoading(false)
  }
  const addZone = async() => {
    setLoading(true);
    try {
      await api.post('/zone', {
        name: zone
      });
      await fetchZones()
    }
    catch(err) {
      console.log(err)
    }
    setLoading(false)
    setOpen(false)
  }

  const deleteZone = async() => {
    try {
      await api.delete('/zone/'+deleteId)
      await fetchZones()
      closeDeleteModal()
    }
    catch(err) {
      console.log(err)
    }
  }
  return (
    <Base>
      <div>
      <Button variant="contained" color="primary" type="button" onClick={handleOpen}>
        <AddBoxIcon /> 
        <Box component="span" ml={1}>
          Add Zone
        </Box>
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Flex justifyContent="space-between" width={'300px'}>
            <TextField id="outlined-basic" onChange={(e) => setZone(e.target.value)} label="Zone" variant="outlined" /> 
              <Button variant="contained" color="primary" type="button" onClick={addZone}>
                <AddBoxIcon /> 
              </Button>
            </Flex>
          </div>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openDeleteModal}
        onClose={closeDeleteModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDeleteModal}>
          <div className={classes.paper}>
            <Flex flexDirection="column" alignItems="center" justifyContent="space-between" width={'400px'}>
              Are you sure you want to delete this zone?
              <Flex width={0.4} pt={3} justifyContent="space-between">
                <Button variant="contained" onClick={deleteZone} color="primary">
                  Yes
                </Button>
                <Button variant="contained" onClick={closeDeleteModal} color="secondary">
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </div>
        </Fade>
      </Modal>
    </div>
      <Zones>
        {
          zones.map(zone => <Zone onClick={()=>handleOpenDeleteModal(zone.id)}>{zone.name} <DeleteForeverIcon/></Zone>)
        }
      </Zones>
    </Base>
    // <h1>hello from zones</h1>
  )
}
// export default Zones