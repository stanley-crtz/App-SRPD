import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import SimpleReactValidator from 'simple-react-validator';
import Swal from 'sweetalert2';
import Axios from 'axios'
import Global from '../Global';

export default class forgetPassword extends Component {

    constructor(props){
        super(props);
        this.validator = new SimpleReactValidator({
            element: message => <div className="color-white">{message}</div>,
            messages: {
                required: "Este campo es requerido",
                alpha_num: "Solo se permiten caracteres alfanumericos",
                min: "Solo se permite un minimo de 3 caracteres",
                max: "Solo se permite un maximo de 8 caracteres"
            }
        });
    }

    state = {
        pass: '',
        confirmPass: '',
        redirect: false
    }

    changePassword = (e) => {
        e.preventDefault()

        const {id, type} = this.props.match.params
        const {pass} = this.state

        Swal.fire({
            title: 'Cambiando Contraseña...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        });

        if (this.confirmPassword() && this.validator.allValid()) {
            Axios.put(Global.servidor + 'changePassword/' + type, {id, password: pass})
                .then((resp) => {
                    const {title, body, icon} = resp.data
                    Swal.fire(title, body, icon).then((resp)=>{
                        if (resp.value) {
                            this.setState({
                                redirect: true
                            })
                        }
                    })
                })
        } else {
            Swal.fire('Advertencia', 'Los datos proporcionados no coinciden', 'warning')
            this.validator.showMessages()
            this.forceUpdate()
        }
    }

    confirmPassword = () => {

        const {pass, confirmPass} = this.state;

        return pass === confirmPass ? true : false
    }

    setPass = (e) => {
        const {confirmPass} = this.state;

        this.setState({
            pass: e,
            confirmPass
        })
    }

    setConfirmPass = (e) => {
        const {pass} = this.state;

        this.setState({
            pass,
            confirmPass: e
        })
    }

    render(){

        if (this.state.redirect) {
            return <Redirect to="/"></Redirect>
        }
        return(
            <main className="main margin-50">
    
                <section className="content-form-denegado">
                    <h2 className="sub-title line-bottom">RECUPERA TU CUENTA</h2>
                    
                    <form className="text-left full-form" id="frmUser" method="get" onSubmit={this.changePassword}>
                        
                        <p>Cambia a tu Nueva contraseña</p> 
    
                        <div className="from-control">
                            <input type="text" className="form-control" placeholder="Nueva contraseña" onChange={(e) => this.setPass(e.target.value)}/>
                            {this.validator.message('alpha_num', this.state.pass, 'required|alpha_num|min:3|max:8')}
                            <input type="text" className="form-control" placeholder="Confirma contraseña" onChange={(e) => this.setConfirmPass(e.target.value)}/>
                            
                            <div className="loginButton">
                                <input type="submit" className="form-control btn-success" value="Cambiar"/>
                            </div>
                        </div>
                    </form>
            
                </section>
            </main>
        )
    }
}