import React, {Component} from 'react'
import Select from 'react-select';
import Global from '../Global'
import Swal from 'sweetalert2'
// import Moment from 'moment'
import Axios from 'axios'
import Municipios from '../JSON/Municipios.json'
import JWT from '../Class/JWT';
import SimpleReactValidator from 'simple-react-validator-sv-stanley'

export default class Step1 extends Component {

    state = {
        Nombre: '',
        Genero: '',
        Estatus: '',
        FechaNac: '',
        DUI: '',
        Departamento: '',
        Municipio: '',
        Zona: '',
        Celular: '',
        Correo: '',
        PerfilImage: null
    }

    NombreRef = React.createRef();
    GeneroRef = React.createRef();
    EstatusRef = React.createRef();
    FechaNacRef = React.createRef();
    DUIRef = React.createRef();
    DepartamentoRef = React.createRef();
    MunicipioRef = React.createRef();
    ZonaRuralRef = React.createRef();
    ZonaUrbanaRef = React.createRef();
    CelularRef = React.createRef();
    CorreoRef = React.createRef();

    constructor(props){
        super(props);
        this.validator = new SimpleReactValidator({
            element: message => <div className="color-white">{message}</div>,
            messages: {
                alpha_space: "Solo se permiten caracteres alfabeticos",
                required: "Este campo es requerido",
                phone: "Numero de telefono invalido",
                email: "Debe ser una direccion de correo valida"
            }
        });

        this.SelectEstado = Global.EstadoCivil

        this.SelectGenero = Global.Genero

        this.SelectDepartamentos = Municipios

        this.SelectMunicipios = []
        
    }

    calcularEdad = (fecha) => {
        var hoy = new Date();
        var cumpleanos = new Date(fecha);
        var edad = hoy.getFullYear() - cumpleanos.getFullYear();
        var m = hoy.getMonth() - cumpleanos.getMonth();
    
        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
    
        return edad;
    }

    noRefresh = async (e) => {
        e.persist()
        e.preventDefault()

        if (this.validator.allValid()) {

            if (this.calcularEdad(this.state.FechaNac) >= 21) {

                const imagen = document.getElementById("imagenPerfil").files.length

                if (imagen !== 0) {
                    this.trimRef();

                    const dui = await this.confirmDUI()

                    if (!dui) {

                        this.props.recived(this.state, "Personal")
                        this.props.change(e, true, false);
                    } else {
                        Swal.fire('DUI', 'El dui ingresado ya se encuentra ingresado en la base de datos', 'error')
                    }
                    
                }
                else{
                    Swal.fire('Advertencia', 'Debe colocar una fotografia personal para su perfil', 'info')
                }
                
            }
            else{
                Swal.fire('Advertencia', 'Debe ser mayor o igual a 21 años', 'info')
            }
            
        } else {
            Swal.fire('Datos incompletos', 'Por favor rellene correctamente cada uno de los campos', 'error')
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    trimRef = () => {
        this.NombreRef.current.value = this.NombreRef.current.value.trim();
        this.FechaNacRef.current.value = this.FechaNacRef.current.value.trim();
        this.DUIRef.current.value = this.DUIRef.current.value.trim();
        this.CelularRef.current.value = this.CelularRef.current.value.trim();
        this.CorreoRef.current.value = this.CorreoRef.current.value.trim();
    }

    changeState = (e, type) => {

        var {Genero, Estatus, Departamento, Municipio} = this.state
        var Zona

        if (type) {
            switch (type.name) {
                case "Estado":
                    Estatus = type.action !== "clear" ? e.value : '';
                    break;
                case "Genero":
                    Genero = type.action !== "clear" ? e.value : '';
                    break;
                case "Departamento":
                    Departamento = type.action !== "clear" ? e.value.Departamento ? e.value.Departamento : e.value : ''
                    this.SelectMunicipios = type.action !== "clear" ? e.value.Municipios : []
                    break;
                case "Municipio":
                    Municipio = type.action !== "clear" ? e.value : '';
                    break;
                default:
                    break;
            }
        }

        if (this.ZonaRuralRef.current.checked) {
            Zona = this.ZonaRuralRef.current.value
        } else {
            Zona = this.ZonaUrbanaRef.current.value
        }

        // const prueba = {
        //     Nombre: this.NombreRef.current.value.trim(),
        //     Genero: Genero.trim(),
        //     Estatus: Estatus.trim(),
        //     FechaNac: this.FechaNacRef.current.value.trim(),
        //     DUI: this.DUIRef.current.value.trim(),
        //     Departamento: Departamento,
        //     Municipio: Municipio,
        //     Zona: Zona,
        //     Celular: this.CelularRef.current.value.trim(),
        //     Correo: this.CorreoRef.current.value.trim(),
        //     PerfilImage: this.state.PerfilImage
        // }
        
        this.setState({
            Nombre: this.NombreRef.current.value.trim(),
            Genero: Genero.trim(),
            Estatus: Estatus.trim(),
            FechaNac: this.FechaNacRef.current.value.trim(),
            DUI: this.DUIRef.current.value.trim(),
            Departamento: Departamento,
            Municipio: Municipio,
            Zona: Zona,
            Celular: this.CelularRef.current.value.trim(),
            Correo: this.CorreoRef.current.value.trim(),
            PerfilImage: this.state.PerfilImage
        })

        
    }

    changeImage = (event) => {

        var {Genero, Estatus, Departamento, Municipio, Zona} = this.state

        if (event.target.files[0]) {

            this.setState({
                Nombre: this.NombreRef.current.value.trim(),
                Genero: Genero.trim(),
                Estatus: Estatus.trim(),
                FechaNac: this.FechaNacRef.current.value.trim(),
                DUI: this.DUIRef.current.value.trim(),
                Departamento: Departamento,
                Municipio: Municipio,
                Zona: Zona,
                Celular: this.CelularRef.current.value.trim(),
                Correo: this.CorreoRef.current.value.trim(),
                PerfilImage: event.target.files[0]
            })

            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("imgFotoPerfil").src = e.target.result // Renderizamos la imagen
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        
    }

    async confirmDUI() {
        var confirmDUI
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }
        await Axios.get(Global.servidor + "confirmDUI/" + this.DUIRef.current.value, {headers})
            .then((resp) => {

                confirmDUI = resp.data.DUI
                
            })
            .catch((err) => console.log(err));
        return confirmDUI
    }


    render(){

        return(

            <div className="step active visible" id="step-1">
                <form onSubmit={this.noRefresh} action="" className="full-form">
                    <div className="step__header">
                        <h2 className="step__title">Información de personal<small>(Paso 1)</small></h2>
                    </div>
                    <div className="step__body">

                        <div className="full-form" action="" method="POST" id="registrar-form" >
                                      
                            <div className="form-group width-12">
                                <div className="width-12">
                                    <input type="text" placeholder="Nombre *" className="form-control" onChange={this.changeState} ref={this.NombreRef}/> 
                                    {this.validator.message('alpha_space', this.state.Nombre, 'required|alpha_space')}
                                </div>
                            </div>
                                  
                            <div className="form-group width-12">
                                <div className="width-6">
                                    <input type="text" placeholder="Teléfono *" className="form-control" onChange={this.changeState} ref={this.CelularRef}/> 
                                    {this.validator.message('phone', this.state.Celular, 'required|phone')}
                                </div> 
                                <div className="width-6">
                                    <input type="text" placeholder="Dui *" className="form-control" name="Dui" id="Dui" onChange={this.changeState} ref={this.DUIRef}/>
                                    {this.validator.message('dui', this.state.DUI, 'required|dui')}
                                </div>  
                            </div>
                            
                            <div className="form-group">
                                <div className="width-12">
                                    <input type="text" placeholder="Correo Electronico *" className="form-control" onChange={this.changeState} ref={this.CorreoRef}/>
                                    {this.validator.message('email', this.state.Correo, 'required|email')}
                                </div>
                            </div>
                                    
                            <div className="form-group width-12">
                                <div className="width-6">
                                    <Select
                                        ref={this.GeneroRef}
                                        className="basic-single sub-form"
                                        classNamePrefix="Genero"
                                        defaultValue=""
                                        placeholder="Genero *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Genero"
                                        options={this.SelectGenero}
                                        onChange={this.changeState}
                                    ></Select>
                                    {this.validator.message('required', this.state.Genero, 'required')}
                                </div>  
                                <div className="width-6">
                                    <Select
                                        ref={this.EstatusRef}
                                        className="basic-single sub-form"
                                        classNamePrefix="Estado"
                                        defaultValue=""
                                        placeholder="Estado Civil *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Estado"
                                        options={this.SelectEstado}
                                        onChange={this.changeState}
                                    ></Select>
                                    {this.validator.message('required', this.state.Estatus, 'required')}
                                </div>  
                            
                            </div>

                            <div className="form-group width-12">
                                <div className="width-6">
                                    <Select
                                        ref={this.DepartamentoRef}
                                        className="basic-single sub-form"
                                        classNamePrefix="Departamento"
                                        defaultValue=""
                                        placeholder="Departamento *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Departamento"
                                        options={this.SelectDepartamentos}
                                        onChange={this.changeState}
                                    ></Select>
                                    {this.validator.message('required', this.state.Departamento, 'required')}
                                </div>  
                                <div className="width-6">
                                    <Select
                                        ref={this.EstatusRef}
                                        className="basic-single sub-form"
                                        classNamePrefix="Municipio"
                                        defaultValue=""
                                        placeholder="Municipio *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Municipio"
                                        options={this.SelectMunicipios}
                                        onChange={this.changeState}
                                    ></Select>
                                    {this.validator.message('required', this.state.Municipio, 'required')}
                                </div>  
                            
                            </div>
                                 
                            <div className="form-group width-12">
                                <h3 className="sub-form">Fecha de nacimiento</h3>
                                <input type="date" placeholder="00/00/0000" nombre="fecha" step="1" className="form-control" onChange={this.changeState} ref={this.FechaNacRef} required/>
                            </div>
                            
                            <div className="form-group width-12">
                                <h3 className="sub-form">Tipo de zona</h3>
                                <div className="width-4">
                                  <label htmlFor="Rural"><input type="radio" id="Rural" name="zona" value="Rural" ref={this.ZonaRuralRef} onChange={this.changeState}/>Rural</label>
                                </div>
                                <div className="width-4">
                                  <label htmlFor="Urbana"><input type="radio" id="Urbana" name="zona" defaultChecked value="Urbana" ref={this.ZonaUrbanaRef} onChange={this.changeState}/>Urbana</label>
                                </div>
                            </div>
                            
                            <div className="boton-foto">
                                <img id="imgFotoPerfil" src="https://sisterhoodofstyle.com/wp-content/uploads/2018/02/no-image-1.jpg" alt="perfil" aling="text-left"/>
                                <div className="info-imagen-perfil">
                                    <label>Esta foto será mostrada en su perfil se le recomienda que sea formal.</label>
                                </div>
                            </div>
                                        
                                        
                                        
                            <div className="btn btn-primary btn-file">
                                subir imagen
                                <input id="imagenPerfil" type="file" onChange={this.changeImage}/>
                            </div>
                            <br/>
                            
                        </div>

                    </div>

                    <div className="step__footer">
                        <button type="submit" className="step__button step__button--next" data-to_step="2" data-step="1">Siguiente</button>
                    </div>

                </form>
            </div>
            
        )
    }
}