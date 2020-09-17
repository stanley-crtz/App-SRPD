import React, {Component} from 'react'
import SimpleReactValidator from 'simple-react-validator';
import { Link, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2'
import Axios from 'axios';
import Global from '../Global';
import JWT from '../Class/JWT';

export default class ShowInfoSeguridad extends Component {

    constructor(props){
        super(props);

        this.validator = new SimpleReactValidator({
            messages: {
                required: "Este campo es requerido",
                alpha_num: "Solo se permiten caracteres alfanumericos",
                min: "Solo se permite un minimo de 3 caracteres",
                max: "Solo se permite un maximo de 8 caracteres"
            }
        });
    }

    UserRef = React.createRef();
    PasswordRef = React.createRef();

    state = {
        Informacion: {}
    }

    showPassword = () => {
        
        const accion = document.getElementById("password");
        const txtPass = document.getElementById("pass")
        
		if (accion.dataset.accion === 'hide') {
            
            txtPass.type = "text"
            accion.dataset.accion = 'show';
            accion.className = 'fas fa-lock-open';

        }
        else {
            txtPass.type = "password"
            accion.dataset.accion = 'hide';
            accion.className = 'fas fa-lock';
        }
    }

    changeState = () => {

        var {Informacion} = this.state
        
        Informacion.User = this.UserRef.current.value;
        Informacion.Password = this.PasswordRef.current.value;

        this.setState({
            Informacion
        })
    }

    // generatorData = () => {
    //     var {Informacion} = this.state

    //     var options = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Z"];
    //     let passAleatorio, passGenerado = '';
    //     for (let index = 0; index < 8; index++) {
            
    //         passAleatorio = parseInt(Math.random()*options.length);
	// 	    passGenerado += options[passAleatorio];
            
    //     }
    //     this.PasswordRef.current.value = passGenerado

    //     passAleatorio ='';
    //     passGenerado ='';
    //     for (let index = 0; index < 8; index++) {
            
    //         passAleatorio = parseInt(Math.random()*options.length);
	// 	    passGenerado += options[passAleatorio];
            
    //     }

    //     this.UserRef.current.value = passGenerado;

    //     Informacion.User = this.UserRef.current.value;
    //     Informacion.Password = this.PasswordRef.current.value;

    //     this.setState({
    //         Informacion
    //     })
    // }

    saveUpdate = (data) => {

        const _id = this.props.id
        
        Swal.fire({
            title: 'Aplicando Cambios...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        });

        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        const params = {
            _id,
            data
        }


        Axios.put(Global.servidor + "UpdateDocente", params, {headers})
            .then((resp) => {

                Swal.fire(
                    'Exito',
                    'El docente fue actualizado satisfactoriamente',
                    'success'
                ).then((resp) => {
                    if(resp.value){
                        this.setState({
                            save: true
                        })
                    }
                })
                
            })
            .catch((err) => {
                console.log(err);
            })
        
    }

    sendUpdate = (e) => {
        e.preventDefault()

        const {Informacion} = this.state
        const {User, Password} = this.state.Informacion

        if (this.validator.allValid() && User  && Password) {
            this.saveUpdate(Informacion)
        }
        else{
            Swal.fire('Datos incompletos', 'Por favor rellene correctamente cada uno de los campos', 'error')
            this.validator.showMessages()

            this.forceUpdate()
        }
    }

    UNSAFE_componentWillMount(){
        this.setState({
            Informacion: this.props.data
        })
    }

    render(){

        if (this.state.save) {
            return (<Redirect to="/Buscador"></Redirect>)
        }

        const {User, Password} = this.props.data

        return (
            <form onSubmit={this.sendUpdate}>
                <div className="row p-2 collapsable">
                    <div className="col-5">
                        Usuario:
                    </div>
                    <div className="col-7 collapsable">
                        <input type="text" name="" minLength="3" maxLength="8" placeholder="CodeMaster123" className="form-control" id="User" onChange={this.changeState} defaultValue={User} ref={this.UserRef}/>
                        {this.validator.message('alpha_num', this.state.Informacion.User, 'required|alpha_num|min:3|max:8')}
                    </div>
                </div>
                <div className="row p-2 collapsable">
                    <div className="col-5">
                        Contraseña:
                    </div>
                    <div className="col-7 collapsable">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <div className="input-group-text" id="btnGroupAddon" onClick={this.showPassword}>
                                    <i id="password" data-accion="hide" className="fas fa-lock"></i>
                                </div>
                            </div>
                            <input id="pass" minLength="3" maxLength="8" type="password" className="form-control" placeholder="*****" aria-label="Ingrese su contraseña" onChange={this.changeState} aria-describedby="btnGroupAddon" defaultValue={Password} ref={this.PasswordRef}/>
                            
                        </div>
                        {this.validator.message('alpha_num', this.state.Informacion.Password, 'required|alpha_num|min:3|max:8')}
                        
                    </div>
                </div>
                <div className="controls-content">
                    <input type="submit" className="editor-button publish edit-docente-grupo" value="Guardar"></input>
                    <Link to="/Buscador" className="editor-button cancel edit-docente-grupo">Cancelar</Link>
                </div>
            </form>
        )
    }
}