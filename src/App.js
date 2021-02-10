
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import NavbarWidget from './widgets/navbar/NavbarWidget';
import HomePage from './pages/HomePage';
import LoginPage from  './pages/LoginPage'
import { useState } from 'react';
import MenuPrincipalPage from './pages/MenuPrincipalPage'
import RoomPage from './pages/RoomPage';
function App() {
  const vistasLocal=localStorage.getItem('vistas');
  const [vistas, setvistas] = useState(vistasLocal==null?
    []:
    JSON.parse(vistasLocal));
  const updateNav = () => 
  setvistas(JSON.parse(localStorage.getItem('vistas')) );
  return (
    <BrowserRouter>
    <NavbarWidget parentStateVistas={vistas} updateNav={updateNav}></NavbarWidget>
    <div className="app">
      <Switch>
        {/* <Route path="/demo1" component={DemoOne} /> */}
        <Route path="/home" component={HomePage} />
        <Route path="/mainMenu" component={MenuPrincipalPage} />
        <Route path="/login" component={() => <LoginPage updateNav={updateNav}></LoginPage>} />
        <Route exact path="/room/:roomId" component={RoomPage} />
        {/* <Route component={Menu} /> */}
      </Switch>
    </div>
  </BrowserRouter>
  );
}

export default App;
