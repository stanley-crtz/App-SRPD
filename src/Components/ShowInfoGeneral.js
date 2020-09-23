import React, {Component} from 'react'
import Municipios from '../JSON/Municipios.json'
import Select from 'react-select';
import Global from '../Global';
import Moment from 'moment';
import SimpleReactValidator from 'simple-react-validator-sv-stanley'
import {Link, Redirect} from 'react-router-dom'
import Swal from 'sweetalert2'
import Validacion from '../Validaciones/Validacion';
import AsyncMethods from '../WebPack/asycn'
import Axios from 'axios';
import JWT from '../Class/JWT';

export default class ShowInfoGeneral extends Component {

    constructor(props) {
        super(props)

        this.validator = new SimpleReactValidator({
            messages: {
                alpha_space: "Solo se permiten caracteres alfabeéticos",
                required: "Este campo es requerido",
                phone: "Número de telefonó invalido",
                email: "Debe ser una dirección de correo válida"
            }
        });

        this.SelectGenero = Global.Genero;
        this.SelectEstatus = Global.EstadoCivil;
        this.SelectDepartamento = Municipios;

        const Municipio = this.props.data.Departamento
        
        const depart = Municipios.filter((val) => {
            return val.label !== Municipio
        })
        
        this.SelectMunicipios = depart[0].value.Municipios

        this.SelectZona = [
            {label: 'Rural', value: 'Rural'},
            {label: 'Urbana', value: 'Urbana'}
        ]

        this.save = false;
    }

    NombreRef = React.createRef();
    CelularRef = React.createRef();
    CorreoRef = React.createRef();

    sendUpdate = async (e) => {
        e.persist();
        e.preventDefault();

        var {Informacion} = this.state
        var {Genero, Estatus, Departamento, Municipio, PerfilImage} = this.state.Informacion

        if (this.validator.allValid() && Genero && Estatus && Departamento && Municipio) {
            
            if (Validacion.ValidatorSelectMunicipios(Municipio, this.SelectMunicipios)) {

                
                if (Validacion.isJson(PerfilImage)) {
                    Informacion.PerfilImage = await AsyncMethods.saveImages(PerfilImage, "SavePerfil")
                    
                }
                else if (PerfilImage === "") {
                    Swal.fire('Advertencia', 'Debe colocar una fotografia personal para su perfil', 'info')
                }

                if (PerfilImage !== "") {
                    this.saveUpdate(Informacion)
                }
            }
            else {
                Swal.fire('Error', 'El municipio no coincide con el Departamento', 'info')
            }

        }
        else {
            this.validator.showMessages()
            this.forceUpdate()
            Swal.fire('Datos incompletos', 'Por favor rellene correctamente cada uno de los campos', 'error')
        }
    }

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

    changeState = (e, type) => {
        var {Genero, Estatus, DUI, FechaNac, Departamento, Municipio, Zona, PerfilImage, Academica, Opcional, User, Password} = this.state.Informacion

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
                case "Zona":
                    Zona = type.action !== "clear" ? e.value : '';
                    break;
                case "imagenPerfil":
                    PerfilImage = e;
                    break;
                default:
                    break;
            }
        }

        const Informacion = {
            Nombre: this.NombreRef.current.value.trim(),
            Genero: Genero.trim(),
            Estatus: Estatus.trim(),
            FechaNac: FechaNac,
            DUI: DUI,
            Departamento: Departamento.trim(),
            Municipio: Municipio.trim(),
            Zona: Zona.trim(),
            Celular: this.CelularRef.current.value.trim(),
            Correo: this.CorreoRef.current.value.trim(),
            PerfilImage: PerfilImage,
            Academica,
            Opcional,
            User,
            Password
        }

        this.setState({
            Informacion
        })

    }
    changeImagePerfil = (event) => {

        if (event.target.files[0]) {
            this.changeState(event.target.files[0], {name: "imagenPerfil"})

            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("imgFotoPerfil").src = e.target.result // Renderizamos la imagen
            }
            reader.readAsDataURL(event.target.files[0]);

        }
    }

    UNSAFE_componentWillMount() {
        this.setState({
            Informacion: this.props.data
        })

        console.log(this.props.data);

    }

    render(){

        if (this.state.save) {
            return (<Redirect to="/Buscador"></Redirect>)
        }
        const {Nombre, Genero, Estatus, FechaNac, DUI, Departamento, Municipio, Zona, Celular, Correo, PerfilImage} = this.state.Informacion
        return (
            <form onSubmit={this.sendUpdate} action="">
                <div className="flex-row">
                    <div className="flex-colum">
                        <img className="img-size width-50" src={PerfilImage} alt={Nombre} id="imgFotoPerfil"/>
                        <div className="btn btn-primary btn-file">
                            Cambiar Imagen
                            <input id="imagenPerfil" type="file" onChange={this.changeImagePerfil}/>
                        </div>
                    </div>
                    
                    <div className="flex-colum">
                        <strong>Nombre: 
                            <input type="text" className="form-control" defaultValue={Nombre}ref={this.NombreRef} onChange={this.changeState}></input>
                            {this.validator.message('alpha_space', this.state.Informacion.Nombre, 'required|alpha_space')}
                        </strong>
                        <strong>Género:
                            <Select
                                className="basic-single sub-form"
                                classNamePrefix="Genero"
                                defaultValue={[{label: Genero, value: Genero}]}
                                placeholder="Género *"
                                isClearable={true}
                                isSearchable={true}
                                name="Genero"
                                options={this.SelectGenero}
                                onChange={this.changeState}
                            ></Select>
                            {this.validator.message('required', Genero, 'required')}
                        </strong>
                        
                        <strong>Estatus: 
                            <Select
                                className="basic-single sub-form"
                                classNamePrefix="Estado"
                                defaultValue={[{label: Estatus, value: Estatus}]}
                                placeholder="Estatus *"
                                isClearable={true}
                                isSearchable={true}
                                name="Estado"
                                options={this.SelectEstatus}
                                onChange={this.changeState}
                            ></Select>
                            {this.validator.message('required', Estatus, 'required')}
                        </strong>
                        
                        <strong>Fecha de Nacimiento: 
                            <input type="text" disabled className="form-control" defaultValue={Moment(FechaNac).format('L')} ref={this.FechaNacRef} onChange={this.changeState}></input>
                        </strong>
                        <strong>DUI: 
                            <input type="text" className="form-control" defaultValue={DUI} disabled></input>
                        </strong>
                        <strong>Departamento: 
                            <Select
                                className="basic-single sub-form"
                                classNamePrefix="Departamento"
                                defaultValue={[{label: Departamento, value: Departamento}]}
                                placeholder="Departamento *"
                                isClearable={true}
                                isSearchable={true}
                                name="Departamento"
                                options={this.SelectDepartamento}
                                onChange={this.changeState}
                            ></Select>
                            {this.validator.message('required', Departamento, 'required')}
                        </strong>
                    </div>
                </div>

                <div className="flex-colum">
                    <div className="flex-row">
                        <strong>Municipio: 
                            <Select
                                className="basic-single sub-form"
                                classNamePrefix="Municipio"
                                defaultValue={[{label: Municipio, value: Municipio}]}
                                placeholder="Municipio *"
                                isClearable={true}
                                isSearchable={true}
                                name="Municipio"
                                options={this.SelectMunicipios}
                                onChange={this.changeState}
                            ></Select>
                            {this.validator.message('required', Municipio, 'required')}
                        </strong> 
                        
                        <strong>Zona: 
                            <Select
                                className="basic-single sub-form"
                                classNamePrefix="Zona"
                                defaultValue={[{label: Zona, value: Zona}]}
                                placeholder="Zona *"
                                isClearable={true}
                                isSearchable={true}
                                name="Zona"
                                options={this.SelectZona}
                                onChange={this.changeState}
                            ></Select>
                            {this.validator.message('required', Zona, 'required')}
                        </strong>
                    </div>
                    <div className="flex-row">
                        <strong>Celular: 
                            <input type="text" className="form-control" defaultValue={Celular} ref={this.CelularRef} onChange={this.changeState}></input>
                            {this.validator.message('phone', this.state.Informacion.Celular, 'required|phone')}
                        </strong>
                        <strong>Correo: 
                            <input type="text" className="form-control" defaultValue={Correo} ref={this.CorreoRef} onChange={this.changeState}></input>
                            {this.validator.message('email', this.state.Informacion.Correo, 'required|email')}
                        </strong>
                    </div>
                    <div className="controls-content">
                        <input type="submit" className="editor-button publish edit-docente-grupo" value="Guardar"></input>
                        <Link to="/Buscador" className="editor-button cancel edit-docente-grupo">Cancelar</Link>
                    </div>
                </div>

            </form>
        )
    }
}