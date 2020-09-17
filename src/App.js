import React, {Component} from 'react';
import './Assets/CSS/App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import { ProtectedRoute } from "./Protected.route";
import Login from './Pages/Login';
import {Home} from './Pages/Home';
import Registro from './Pages/Registro';
import Buscador from './Pages/Buscador';
import Bandeja from './Pages/Bandeja';
import NewForo from './Pages/NuevoForo';
import Foro from './Pages/Foro';
import ForoComment from './Pages/ForoComment'
import EditForo from './Pages/EditarForo'
import EditDocente from './Pages/EditarDocente'
import RecuperarCuenta from './Pages/RecuperarCuenta'
import forgetPassword from './Pages/forgetPassword'
import Footer from './Components/Footer'

class App extends Component {

  render(){

    return (
      <div className="App">
        <div className="bottom">
          <BrowserRouter>
            <Switch>
              <Route exact path="/Login" component={Login} />
              <ProtectedRoute exact path="/" component={Home} />
              <ProtectedRoute exact path="/Home" component={Home} />
              <ProtectedRoute exact path="/Registro" component={Registro} />
              <ProtectedRoute exact path="/Buscador" component={Buscador} />
              <ProtectedRoute exact path="/Registro/Editar/:id" component={EditDocente}/>
              <ProtectedRoute exact path="/Bandeja" component={Bandeja} />
              <ProtectedRoute exact path="/Foro/Nuevo" component={NewForo} />
              <ProtectedRoute exact path="/Foro/Editar/:id" component={EditForo} />
              <ProtectedRoute exact path="/Foro" component={Foro}/>
              <ProtectedRoute exact path="/Foro/:id" component={ForoComment} />
              <Route exact path="/Recuperar" component={RecuperarCuenta} />
              <Route exact path="/Recuperar/:id/:type" component={forgetPassword} />
              <Route path="*" component={() => "404 NOT FOUND"} />
            </Switch>
          </BrowserRouter>
        </div>
        <Footer></Footer>
      </div>
    );
  }
}

export default App;
