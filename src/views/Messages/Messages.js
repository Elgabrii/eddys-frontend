import React, { useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Flex } from '@rebass/grid';
import {
  api,
} from '../../api/api';
import Pagination from '@material-ui/lab/Pagination';
// import name from 'module';
const useStyles = makeStyles({
  root: {
    minWidth: 275,
    padding: '10px',
    marginBottom: '7px'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function Messages() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const [skip, setSkip] = useState(0);
  const [limit, useLimit] = useState(600);
  const [messages, setMessages] = useState([])


  useEffect(()=> {
    getMessages()
  },[])
  // const fetchMessages = 
  const getMessages = async() => {
    let res = await api.get(`/messages?skip=${skip}&limit=${limit}`)
    // debugger
    setMessages(res.data)
    

  }

  return (
    <Flex flexDirection="column" width={1}>
      {
        messages.map(message => (
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Sender: {message.senderName}
              </Typography>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Phone Number: {message.phoneNumber}
              </Typography>
              <Typography variant="h6" component="h2">
                {message.body}
              </Typography>
            </CardContent>
          </Card>      
        ))
      }
      {/* <Pagination count={pages} page={page} onChange={''} color="primary" /> */}
    </Flex>
  );
}
