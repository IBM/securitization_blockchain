import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import BuySecurityForm from './components/forms/buySecurityForm.jsx'
import FetchObject from './components/forms/fetchObjectForm.jsx'
import InitAssetForm from './components/forms/initAssetForm.jsx'
import InitAssetPoolForm from './components/forms/initAssetPoolForm.jsx'
import InitOriginator from './components/forms/initOriginatorForm.jsx'
import InitSecurity from './components/forms/initOriginatorForm.jsx'


import PoolAsset from './components/forms/poolAssetForm.jsx'


import ProcessPaymentForm from './components/forms/processPaymentForm.jsx'
import SellSecurityForm from './components/forms/sellSecurityForm.jsx'

import SetOriginatorForm from './components/forms/setOriginatorForm.jsx'
import SimpleAssetTable from './components/tables/SimpleAssetTable.js'
import SimplePoolTable from './components/tables/SimplePoolTable.js'
import SimpleInvestorTable from './components/tables/SimpleInvestorTable.js'
import SimpleSecurityTable from './components/tables/SimpleSecurityTable.js'
import SimpleOriginatorTable from './components/tables/SimpleOriginatorTable.js'
import InitHFCForm from './components/forms/initHFClientForm.jsx'
import DeleteObjectForm from './components/forms/deleteObjectForm.jsx'

import FormDialog from './components/forms/FormDialog.js'


// import { Card, ListItem, Button, Icon } from 'react-native-elements'
// import { View, Text, Image } from 'react-native'
import Button from '@material-ui/core/Button';
import Text from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';

// import refreshState from './components/helpers/refreshState.js';


// import { withStyles } from '@material-ui/core/styles';


// const styles = {
//   card: {
//     minWidth: 275,
//   },
//   bullet: {
//     display: 'inline-block',
//     margin: '0 2px',
//     transform: 'scale(0.8)',
//   },
//   title: {
//     marginBottom: 16,
//     fontSize: 14,
//   },
//   pos: {
//     marginBottom: 12,
//   },
// };
var cardStyle = {
   display: 'block',
   width: '30vw',
   transitionDuration: '0.3s',
   height: '30vw'
}


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};



// function getState () {
//   return this.getState()
// }

function refreshState() {
  let config = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      method: "query",
      params: {
        ctorMsg: {
          function: 'read_everything',
          args: []
        }
      }
    })
  }
  // console.log(config.body)

  fetch(window.location.href.replace('30000', '30001') + 'api/chaincode', config)
    .then(response => response.json() )
    .then((json) =>{
      console.log("in refresh state method")
      // const element = GenerateCards(JSON.parse(json))
      // ReactDOM.render(element, document.getElementById('test'));
      // TODO, use react "set state" properly
      // console.log("setting state")
      // console.log({"objects": JSON.parse(json)})
      // this.setState({"objects": JSON.parse(json)})
      console.log("json type: ", typeof(json))
      localStorage.setItem('objects', json)
      // console.log("this.props")
      // console.log(this.props)
      // this.props.objects = json
      return json
  }).catch( (err) => {
      console.log("fetch failed")
      console.log(err)
  });
}

class App extends Component {

  // TODO, super hacky way to rerender every 5 seconds, should rerender on change
  componentDidMount() {
      setInterval(() => {
          console.log("component mounting in interval")
          this.setState({ objects: refreshState() })
          // refreshState()
          // this.setState(() => {
          //     // objects: this.handleRefresh()
          //
          //     // console.log('refreshing state');
          //     // return { unseen: "does not display" }
          // });
      }, 15000);
  }

  handleChange = (event, value) => {
    console.log("updating state")
    console.log(value)
    this.setState({ value });
  };
  handleRefresh = () =>  {
    console.log("handleRefresh")
    // console.log(this.state.objects)
    this.setState({ objects: refreshState() });
  };
  state = {
    value: 0,
    objects: {}
  };
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    // this.setState({quantity: 2})
    var stateObjects

    return (
      <div className="App">

        {/*
        <div>
          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Assets" />
              <Tab label="Asset Pools" />
            </Tabs>
          </AppBar>

          {value === 0 && <TabContainer><SimpleAssetTable></SimpleAssetTable></TabContainer>}
          {value === 1 && <TabContainer><SimplePoolTable></SimplePoolTable></TabContainer>}
        </div>
        */}

        <div >
        <InitHFCForm> </InitHFCForm>
        </div>

        <div >
        <DeleteObjectForm> </DeleteObjectForm>
        </div>


        <div>
        <AppBar label="Originators" position="static" style={{position:'static',width:'90%', align: 'middle', margin: 'auto', padding: '10px'}} >
            <Typography variant="title" color="inherit">
              Originators
            </Typography>
          </AppBar>
          <SimpleOriginatorTable></SimpleOriginatorTable>
        </div>

        <div style={{padding: '25px'}}>
        <AppBar label="Assets" position="static" style={{position:'static',width:'90%', align: 'middle', margin: 'auto', padding: '10px'}} >
            <Typography variant="title" color="inherit">
              Assets
            </Typography>
          </AppBar>
          <SimpleAssetTable></SimpleAssetTable>
        </div>

        <div>

        <div style={{padding: '25px', width: '45%', float:'left'}}>
          <AppBar label="Asset Pools" position="static" style={{position:'static',width:'90%', align: 'middle', margin: 'auto', padding: '10px'}} >
            <Typography variant="title" color="inherit">
              Asset Pools
            </Typography>
          </AppBar>
          <SimplePoolTable></SimplePoolTable>
        </div>


        <div style={{padding: '25px', width: '45%', float: 'right'}}>
          <AppBar label="Investors" position="static" style={{position:'static',width:'90%', align: 'middle', margin: 'auto', padding: '10px'}} >
            <Typography variant="title" color="inherit">
              Investors
            </Typography>
          </AppBar>
          <SimpleInvestorTable></SimpleInvestorTable>
        </div>

        </div>
        <div>
        <AppBar label="Securities" position="static" style={{position:'static',width:'90%', align: 'middle', margin: 'auto', padding: '10px'}} >
            <Typography variant="title" color="inherit">
              Securities
            </Typography>
          </AppBar>
          <SimpleSecurityTable></SimpleSecurityTable>
        </div>

        {/*
        <p id="test"> </p>
        <div id="CardContainer">
          <Card style={cardStyle} className="foo">
            <CardContent>
              <Typography className="foo" color="textSecondary">
                Asset
              </Typography>
              <Typography variant="headline" component="h2">
              </Typography>
              <Typography className="foo" color="textSecondary">
                ID: asset1
              </Typography>
              <Typography component="p">
                Balance: 545000<br />
                {'InterestRate: 3.0%'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Pool Asset</Button>
              <Button size="small">Process Payment</Button>
              <Button size="small">Set Originator</Button>
            </CardActions>
          </Card>
        </div>

        <p> Form Dialog</p>
        <FormDialog> </FormDialog>

        <p> Fetch Object</p>
        <FetchObject> </FetchObject>

        <p> Buy Security</p>
        <BuySecurityForm> </BuySecurityForm>

        <p> Create Asset</p>
        <InitAssetForm> </InitAssetForm>

        <p> Create Asset Pool</p>
        <InitOriginator> </InitOriginator>

        <p> Create Asset Originator</p>
        <InitOriginator> </InitOriginator>

        <p> Create Security</p>
        <InitSecurity> </InitSecurity>

        <p> Place Asset Into Pool</p>
        <PoolAsset> </PoolAsset>

        <p> Process Payment</p>
        <ProcessPaymentForm> </ProcessPaymentForm>

        <p> Sell Security</p>
        <SellSecurityForm> </SellSecurityForm>

        <p> Set Originator</p>
        <SetOriginatorForm> </SetOriginatorForm>

        */}
        <Button size="small" onClick={ this.handleRefresh }>Refresh Ledger</Button>
      </div>
    );
  }
}
App.propTypes = {
  objects: PropTypes.object
}

export default App;

// export refreshState
