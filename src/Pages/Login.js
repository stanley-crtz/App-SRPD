import React, {Component} from 'react'
import auth from '../auth'
import Wave from '../Assets/Images/png/wave.png'
import Avatar from '../Assets/Images/svg/bg.svg'
import LoginComponent from '../Components/Login'
import Register from '../Components/SignIn'
import Swal from 'sweetalert2'


export default class Login extends Component {
    state = {
        login: 'Login'
    }

    CambiarState = (event) => {
        if (event === 'Register') {
            Swal.fire({
                title: 'Ingresa la contraseña de administrador',
                input: 'password',
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Ingresar',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
                
            }).then((result) => {
                if (result.value === '123456') {
                    this.setState({
                        login: event
                    })
                }
                else {
                    Swal.fire('Contraseña Incorrecta', '', 'error')
                }
            })
        } else{
            this.setState({
                login: event
            })
        }
        
    }

    Login =(event) => {
        auth.login(() => {
            this.props.history.push("/");
        });
    }

    render() {
        return (
            <div>

                <div className="Login">

                    <img className="wave" src={Wave} alt="Wave"/>

                    <div className="container-login">
                        
                        <div className="img">
                            <img src={Avatar} alt="Avatar"/>
                        </div>

                        <div className="login-content" >

                            {
                                this.state.login === "Login" ? (
                                    <LoginComponent Registrar={this.CambiarState} History={this.Login}></LoginComponent>
                                ) : (
                                    <Register SignIn={this.CambiarState} History={this.Login}></Register>
                                )
                            }

                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}