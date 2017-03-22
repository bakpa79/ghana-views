// Gmaps kwy - AIzaSyCF16HIf9Nn5KZdd41Uj8cVh7ktx3l3t18
import React, { Component } from 'react'
import {createStore, applyMiddleware} from "redux"
import logger from "redux-logger"

import axios from "axios"
import GoogleMapsLoader from "google-maps"

import './App.css';

const reducer = (state, action)=>{
  switch (action.type) {
    case "SET_LAT_lng":
      state = {...state, lng:action.payload.lng, lat: action.payload.lat}
      break;
    case "SET_ELEMENT_SIZE":
      state = {...state, width: action.payload.width, height:action.payload.height}
      break;
    default:
      break;
  }
  return state;
}
const middleware = applyMiddleware(logger())
const store = createStore(reducer, {
  lng:null,
  lat:null,
  width:null,
  height:null
}, middleware)

function stylesReturn(){
  let stylesState = store.getState();
  return {
    width: stylesState.width.toString() + 'px',
    height: stylesState.height.toString() + 'px'
  }
}
const Location = ({position}) => (
<div>
  <h1>{position.lng}</h1>
  <h1>{position.lat}</h1>
</div>
);

GoogleMapsLoader.KEY = 'AIzaSyCF16HIf9Nn5KZdd41Uj8cVh7ktx3l3t18';

function createMap(elID, lat, lng, zoom) {
  GoogleMapsLoader.load((google)=>{
    new google.maps.Map(document.getElementById(elID), {
      center: {lat:lat,lng:lng},
      zoom: zoom
    });
  })
} 
function init(){
  axios.get('http://localhost:9999/locations/1')
    .then((response)=>{
      store.dispatch({type:"SET_LAT_lng", payload: {lng:+response.data.lng, lat:+response.data.lat}})
    })
}

store.subscribe(()=>{
  let newStore = store.getState();
  createMap("map", +newStore.lat, +newStore.lng, 18);
})

class GhanaMap extends Component {
  componentWillMount() {
    store.dispatch({type:"SET_ELEMENT_SIZE", payload:{width:window.innerWidth, height:window.innerHeight}})
  }
  

  componentDidMount() {
    init();
    setTimeout(function() {
        axios.get('http://localhost:9999/locations/3')
          .then((response)=>{
            store.dispatch({type:"SET_LAT_lng", payload: {lng:+response.data.lng, lat:+response.data.lat}})
          })
    }, 3000);
  }
  render() {
    return (
      <div className="App">
        <Location position={store.getState()}/>
        <section style={stylesReturn()} id="map"></section>
      </div>
    );
  }
}

export default GhanaMap;
