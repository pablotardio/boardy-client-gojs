
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import NavbarWidget from './widgets/navbar/NavbarWidget';
import HomePage from './pages/HomePage';
import { useState } from 'react';

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
        {/* <Route component={Menu} /> */}
      </Switch>
    </div>
  </BrowserRouter>
  );
}

export default App;
