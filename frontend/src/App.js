import './App.css';
import './styles.css';
import {BrowserRouter as Router, Routes, Route, Redirect  } from "react-router-dom"
import Login from './login/login';
import Registration from './login/registration';
import Dashboard from './panel/dashboard';
import Menu from "./panel/menu"
import Settings from "./panel/settings"

function App() {
  // const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  //   <Route {...rest} render={(props) => (
  //     isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />
  //   )} />
  // );

  return (
    <Router>
      <Routes>
        <Route exact path='/login' element={<Login />}></Route>
        <Route exact path='/registration' element={<Registration />}></Route>
        <Route exact path='/' element={<Dashboard />} />
        <Route exact path='/menu' element={<Menu />} />
        <Route exact path='/settings' element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
