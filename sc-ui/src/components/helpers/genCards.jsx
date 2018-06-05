import React from 'react';
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Button from '@material-ui/core/Button';

const cardStyle = {
   display: 'block',
   width: '30vw',
   transitionDuration: '0.3s',
   height: '30vw'
}

const GenerateCards = (props) => {
    console.log("in generate cards")
    console.log(props)
    console.log(props.id)
    console.log(props.balance)
    return (
      <Card style={cardStyle} className="foo">
        <CardContent>
          <Typography className="foo" color="textSecondary">
            Asset
          </Typography>
          <Typography variant="headline" component="h2">
          </Typography>
          <Typography className="foo" color="textSecondary">
            ID: {props.id}
          </Typography>
          <Typography component="p">
            Balance: {props.balance} <br />
            {'InterestRate: 3.0%'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Pool Asset</Button>
          <Button size="small">Process Payment</Button>
          <Button size="small">Set Originator</Button>
        </CardActions>
      </Card>

    );
  }
export default GenerateCards;
