import './App.css';
import Header from './components/Header';
import About from './components/About';
import Contacts from './components/Contacts'
import Location from './components/Location'
import Recordings from './components/Recordings'
import Settings from './components/Settings'
import Login from './components/Login'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import React from "react"
import Signup from "./components/Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "./contexts/AuthContext"
import Dashboard from "./components/Dashboard"
import PrivateRoute from "./components/PrivateRoute"
import ForgotPassword from "./components/ForgotPassword"
import UpdateProfile from "./components/UpdateProfile"

import firebase from 'firebase/app';
import 'firebase/firestore';


function App() {
  return (
    <Container
    className="d-flex align-items-center justify-content-center"
    style={{ minHeight: "100vh" }}
    >
    <Router>
    <div className="app">
      <Header />
      <AuthProvider>
      <Switch>
      <PrivateRoute exact path="/components/dashboard" component={Dashboard} />
      <PrivateRoute path="/update-profile" component={UpdateProfile} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/components/login"  component={Login}/>
      <Route path="/components/settings"  component={Settings}/>
      <Route path="/components/recordings"  component={Recordings}/>
      <Route path="/components/location"  component={Location}/>
      <Route path="/components/contacts"  component={Contacts}/>
      <Route path="/components/about"  component={About}/>
      <Route path ="/" exact component={Home}/>
      
      </Switch>
      </AuthProvider>
      <footer>Built by HackHers copyright 2021</footer>
    
    </div>
    </Router>
    </Container>
  );
}


function Home() {
  async function textContacts() {
    // get the person's contacts from the Firebase database
    console.log("texting");
    console.log("texting");
    let user = firebase.auth().currentUser;
    console.log(user);
    const db = firebase.firestore();
    // const snapshot = await db.collection('users').get();
    // snapshot.forEach((doc) => {
    //   console.log(doc.emergencyContactName);
    // });

    db.collection('users').get().then((snapshot) => {
      console.log(snapshot.docs)
      snapshot.docs.forEach(doc => {
        if(doc.data().uid === user.uid) 
        {
           console.log(doc.data())
           let allContacts = doc.data().emergencyContactName; // database contacts object
           let name =  doc.data().myName;
           Object.keys(allContacts).forEach((contact) =>
             {
               let sendString = "Hey " + contact + "! " + name + " feels like they are in danger and has auto alerted you of this via our app. Please call them and stay on the line until they are safe."
               console.log(sendString);
               let phoneNum = allContacts[contact];
               console.log(phoneNum);
               fetch('https://textbelt.com/text', {
                 method: 'post',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                   phone: '19195790432',
                   message: sendString,
                   key: 'textbelt',
                 }),
               }).then(response => {
                 return response.json();
               }).then(data => {
                 console.log(data);
               });
              }
           )
            }

        }
      )

})
  }
  return (
    <div>
    <br/><br/>
    <div class="btns">
      <button id="textBtn" onClick={textContacts}>TEXT A FRIEND</button>
    <br/>
      <br/>
      <button id ="fakeCall" onClick="fakeCallToUser()">FAKE CALL</button>
    <br/>
      <br/>
      <button id ="locationTracker" onClick="trackLocation()">HOTLINE</button>
    </div>
  </div>
  );
} 

   
export default App;
