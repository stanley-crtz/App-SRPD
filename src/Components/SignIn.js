import React, { Component } from 'react'
import Icon from '../Assets/Images/svg/avatar.svg'
import Select from 'react-select'
import Validacion from '../Validaciones/Validacion'
import Swal from 'sweetalert2'
import Axios from 'axios'
import Global from '../Global'
import JWT from '../Class/JWT'

export default class Register extends Component {

    Nombre = React.createRef();
    Apellido = React.createRef();
    FechaNac = React.createRef();
    DUI = React.createRef();
    NIT = React.createRef();
    Correo = React.createRef();
    User = React.createRef();
    Password = React.createRef();

    state = {

        Select: {
            Genero: [
                {value: 'Masculino', label: 'Masculino'},
                {value: 'Femenino', label: 'Femenino'},
                {value: 'Otro/a', label: 'Otro/a'}
            ],

            Status: [
                {value: 'Soltero/a', label: 'Soltero/a'},
                {value: 'Comprometido/a', label: 'Comprometido/a'},
                {value: 'Casado/a', label: 'Casado/a'},
                {value: 'Unión de hecho', label: 'Unión de hecho'},
                {value: 'Divorciado/a', label: 'Divorciado/a'},
                {value: 'Viudo/a', label: 'Viudo/a'},
            ],
            GeneroInput: '',
            EstatusInput: ''
        }

    }

    ChangeGenero =(event) => {
        var GeneroEvent;
        event !== null ? GeneroEvent = event.value : GeneroEvent = '' ; 
        
        this.setState({
            Select: {
                Genero: this.state.Select.Genero,
                Status: this.state.Select.Status,
                GeneroInput: GeneroEvent,
                EstatusInput: this.state.Select.EstatusInput
            }
        })

    }

    ChangeStatus =(event) => {
        var StatusEvent;
        event !== null ? StatusEvent = event.value : StatusEvent = '' ; 
        this.setState({
            Select: {
                Genero: this.state.Select.Genero,
                Status: this.state.Select.Status,
                GeneroInput: this.state.Select.GeneroInput,
                EstatusInput: StatusEvent
            }
        })
    }

    SignIn = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Registrando Usuario...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        });

        if (Validacion.ValidatorSelect(this.state.Select.GeneroInput, this.state.Select.Genero) && Validacion.ValidatorSelect(this.state.Select.EstatusInput, this.state.Select.Status)) {
            var params = {
                Nombre: this.Nombre.current.value,
                Apellido: this.Apellido.current.value,
                Genero: this.state.Select.GeneroInput,
                Estatus: this.state.Select.EstatusInput,
                FechaNac: this.FechaNac.current.value,
                DUI: this.DUI.current.value,
                NIT: this.NIT.current.value,
                Correo: this.Correo.current.value,
                User: this.User.current.value,
                Password: this.Password.current.value
            }

            const headers = {
                authorization: `Bearer ${JWT.getJWT()}`
            }

            Axios.post(Global.servidor + 'Registro', params, {headers})
                .then(resp => {
                    return resp.data.token;
                })
                .then(resp => {
                    Swal.close();
                    this.props.History(resp);
                })
                .catch(err => {
                    Swal.fire('Error al registrar usuario', '', 'info');
                })

        } else {
            Swal.fire('Faltan datos por ingresar', '', 'error');
        }
        

    }

    Login = () => {
        this.props.SignIn('Login')
    }

    render() {
        return (
            <form method="GET" onSubmit={this.SignIn} id="frmLogin">

                <img src={Icon} alt="Icono" />

                <h2 className="title-login">Cuenta Nueva</h2>

                <div className="input-div">
                    <div className="i">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="div">
                        <h5>Nombre</h5>
                        <input type="text" required className="input" ref={this.Nombre}/>
                    </div>
                </div>

                <div className="input-div">
                    <div className="i">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="div">
                        <h5>Apellido</h5>
                        <input type="text" required className="input" ref={this.Apellido}/>
                    </div>
                </div>

                <div className="input-div">
                    <div className="i">
                        <i className="fas fa-venus-mars"></i>
                    </div>
                    <div className="div">
                        <Select
                            className="basic-single"
                            classNamePrefix="Genero"
                            defaultValue=""
                            placeholder="Género..."
                            isClearable={true}
                            isSearchable={true}
                            name="Genero"
                            options={this.state.Select.Genero}
                            onChange={this.ChangeGenero}
                        ></Select>
                        {/* React Select Genero */}
                    </div>
                </div>

                <div className="input-div">
                    <div className="i">
                        <i className="fas fa-venus-mars"></i>
                    </div>
                    <div className="div">
                        <Select
                            className="basic-single"
                            classNamePrefix="Status"
                            defaultValue=""
                            placeholder="Estatus..."
                            isClearable={true}
                            isSearchable={true}
                            name="Status"
                            options={this.state.Select.Status}
                            isOptionSelected={this.Estatus}
                            onChange={this.ChangeStatus}
                        ></Select>
                        {/* React Select Estatus */}
                    </div>
                </div>

                <div className="input-div one">
                    <div className="i">
                        <i className="far fa-calendar-alt"></i>
                    </div>
                    <div className="div">
                        <input type="date" required className="input" ref={this.FechaNac} />
                    </div>
                </div>

                <div className="input-div">
                    <div className="i">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="div">
                        <h5>DUI</h5>
                        <input type="text" required pattern="\d{8}-\d{1}" label="00000000-1" className="input"ref={this.DUI}/>
                    </div>
                </div>

                <div className="input-div" >
                    <div className="i">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="div">
                        <h5>NIT</h5>
                        <input type="text" required pattern="[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1}" className="input" ref={this.NIT} />
                    </div>
                </div>

                <div className="input-div" >
                    <div className="i">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="div">
                        <h5>Correo</h5>
                        <input type="text" required className="input" ref={this.Correo} />
                    </div>
                </div>

                <div className="input-div">
                    <div className="i">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="div">
                        <h5>Usuario</h5>
                        <input type="text" v-model="RegistrarUsuario.Usuario" className="input" ref={this.User} />
                    </div>
                </div>

                <div className="input-div" >
                    <div className="i">
                        <i id="password" data-accion="hide" className="fas fa-lock"></i>
                    </div>
                    <div className="div">
                        <h5>Contraseña</h5>
                        <input required minLength="3" maxLength="8" type="password" v-model="RegistrarUsuario.Password" className="input" ref={this.Password}/>
					</div>
                </div>
                <input type="submit" className="btn" value="Crear" />
                <input type="button" value="Iniciar Sesion" className="btn" onClick={this.Login} />

            </form>
        )
    }

}