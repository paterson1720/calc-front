import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Records from './components/RecordsTable';
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';
import { UserProvider } from './contexts/user-context';
import Calculator from './components/Calculator';

function App() {
  return (
    <UserProvider>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/calculator">
            <Calculator />
          </Route>
          <Route path="/records">
            <Records />
          </Route>
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;
