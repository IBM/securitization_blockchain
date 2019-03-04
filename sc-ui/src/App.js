import React, { Component } from 'react';
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

  fetch(window.location.href.replace('30000', '30001') + 'api/chaincode', config)
    .then(response => response.json() )
    .then((json) =>{
      console.log("in refresh state method")
      console.log("json type: ", typeof(json))
      localStorage.setItem('objects', json)
      return json
  }).catch( (err) => {
      console.log("fetch failed")
      console.log(err)
  });
}

class App extends Component {

  // TODO, rerenders at 5 second interval, should be event driven to rerender on change
  componentDidMount() {
      setInterval(() => {
          console.log("component mounting in interval")
          this.setState({ objects: refreshState() })
      }, 15000);
  }

  handleChange = (event, value) => {
    console.log("updating state")
    console.log(value)
    this.setState({ value });
  };
  handleRefresh = () =>  {
    console.log("handleRefresh")
    this.setState({ objects: refreshState() });
  };
  state = {
    value: 0,
    objects: {}
  };
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    var stateObjects

    return (
      <div className="App">
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
        <Button size="small" onClick={ this.handleRefresh }>Refresh Ledger</Button>
      </div>
    );
  }
}
App.propTypes = {
  objects: PropTypes.object
}

export default App;
