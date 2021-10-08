import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Login from './components/Login/Login';

const App = () => {
  return (
    <Router>
    <Route>
  <Login path="/login"/>
  </Route>
  </Router>
    );
}

export default App;
