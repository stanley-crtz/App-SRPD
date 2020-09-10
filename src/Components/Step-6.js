import React, {Component} from 'react'
import SimpleReactValidator from 'simple-react-validator';
import Swal from 'sweetalert2'

export default class Step4 extends Component {

    constructor(props){
        super(props);

        this.validator = new SimpleReactValidator({
            messages: {
                required: "Este campo es requerido",
                alpha_num: "Solo se permiten caracteres alfanumericos",
                min: "Solo se permite un minimo de 3 caracteres",
                max: "Solo s permite un maximo de 8 caracteres"
            }
        });
    }

    User = React.createRef();
    Password = React.createRef();

    state = {
        User: '',
        Password: ''
    }

    noRefresh = (e) => {
        e.preventDefault()

        if (this.validator.allValid()) {
            this.props.recived(this.state, "Cuenta")
        }
        else{
            Swal.fire('Datos incompletos', 'Por favor rellene correctamente cada uno de los campos', 'error')
            this.validator.showMessages()

            this.forceUpdate()
        }
        
    }

    Back = (e) => {
        e.preventDefault()
        this.props.change(e, false, true)
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

    changeStatus = () => {

        const User = this.User.current.value, Password = this.Password.current.value
        this.setState({
            User,
            Password
        })
    }

    generatorData = () => {
        var options = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Z"];
        let passAleatorio, passGenerado = '';
        for (let index = 0; index < 8; index++) {
            
            passAleatorio = parseInt(Math.random()*options.length);
		    passGenerado += options[passAleatorio];
            
        }
        this.Password.current.value = passGenerado

        passAleatorio ='';
        passGenerado ='';
        for (let index = 0; index < 8; index++) {
            
            passAleatorio = parseInt(Math.random()*options.length);
		    passGenerado += options[passAleatorio];
            
        }

        this.User.current.value = passGenerado;

        const User = this.User.current.value, Password = this.Password.current.value

        this.setState({
            User,
            Password
        })
    }

    render(){

        return (

            <div className="step" id="step-6">
                <form onSubmit={this.noRefresh} onReset={this.Back} action="" className="full-form">
                    <div className="step__header">
                        <h2 className="step__title">Cuenta de Usuario<small>(Paso 6)</small></h2>
                    </div>
                    <div className="step__body">

                        <div className="text-left" id="frmUser" method="get">
                            <p>Asigne un usuario y una contraseña al docente.</p> 
                            <div className="row p-2 collapsable">
                                <div className="col-5">
                                    Usuario:
                                </div>
                                <div className="col-7 collapsable">
                                    <input type="text" name="" minLength="3" maxLength="8" placeholder="CodeMaster123" className="form-control" id="User" ref={this.User} onChange={this.changeStatus}/>
                                    {this.validator.message('alpha_num', this.state.User, 'required|alpha_num|min:3|max:8')}
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
                                        <input id="pass" minLength="3" maxLength="8" type="password" className="form-control" placeholder="*****" aria-label="Ingrese su contraseña" onChange={this.changeStatus} aria-describedby="btnGroupAddon" ref={this.Password}/>
                                        {this.validator.message('alpha_num', this.state.Password, 'required|alpha_num|min:3|max:8')}
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="row p-2 collapsable">
                                <div className="col-5"></div>
                                <div className="col-7 collapsable">
                                    <input type="button" className="btn form-control" value="Generar" onClick={this.generatorData}/>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="step__footer">
                        <button type="reset" className="step__button step__button--back" data-to_step="5" data-step="6">Regresar</button>
                        <button type="submit" className="step__button">Guardar</button>
                    </div>

                </form>
            </div>
            
        )
    }
}