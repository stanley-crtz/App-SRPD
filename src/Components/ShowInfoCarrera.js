import React, {Component} from 'react'
import Creatable from 'react-select/creatable'
import Global from '../Global';
import Axios from 'axios'
import SimpleReactValidator from 'simple-react-validator';
import {Link, Redirect} from 'react-router-dom'
import Swal from 'sweetalert2';
import Validacion from '../Validaciones/Validacion';
import AsyncMethods from '../WebPack/asycn'
import JWT from '../Class/JWT';

export default class ShowInfoCarrera extends Component {

    constructor(props) {
        super(props)

        this.validator = new SimpleReactValidator({
            messages: {
                required: "Este campo es requerido"
            }
        });
    }

    state = {
        idUniversidad: '',
        Universidades: [],
        Carreras: [],
        Informacion: {}
    }

    changeOpciones = (Universidad, data, identificardor) => {
        var {idUniversidad, Universidades, Carreras, Informacion} = this.state
        
        Universidades = Universidad;
        Carreras = data;
        idUniversidad = identificardor;

        this.setState({
            idUniversidad,
            Universidades,
            Carreras,
            Informacion
        })
    }

    changeState = (e, type) => {
        var {idUniversidad, Universidades, Carreras, Informacion} = this.state
        var {OtraCarrera} = Informacion.Academica

        if (!OtraCarrera) {
            OtraCarrera = {
                Universidad: '',
                Carrera: ''
            }
        }

        if (type) {
            
            switch (type.name) {
                case "Universidad":

                    OtraCarrera.Universidad = type.action !== "clear" ? e.value.Universidad ? e.value.Universidad : e.value : ''
                    Carreras = type.action !== "clear" ? e.value.Carreras : []
                    idUniversidad = type.action !== "clear" ? e.value._id : ''

                    break;
                case "Carrera":

                    OtraCarrera.Carrera = type.action !== "clear" ? e.value : ''
                    
                    break;

                case "imagenTitulo":
                    OtraCarrera.TituloImage = e
                    break;
                default:
                    break;
            }

        }

        Informacion.Academica.OtraCarrera = OtraCarrera

        this.setState({
            idUniversidad,
            Universidades,
            Carreras,
            Informacion
        })
    }

    getUniversidad = () => {

        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        // Carreras
        Axios.get(Global.servidor + "getUniversidades", {headers})
            .then((resp) => {

                const Universidades = resp.data.Universidades;
                var listCarreras = [], identificardor = '';

                resp.data.Universidades.map((data, i) => {
                    if (data.label === this.state.Informacion.Academica.Universidad) {
                        
                        listCarreras = data.value.Carreras
                        identificardor = data._id
                    }
                    
                    return data;
                })

                this.changeOpciones(Universidades, listCarreras, identificardor);
            })
            .catch((err)=> {
                console.log(err);
            })
    }

    changeImage = (event) => {
        if (event.target.files[0]) {
            this.changeState(event.target.files[0], {name: "imagenTitulo"})

            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("imgFotoOtraCarrera").src = e.target.result // Renderizamos la imagen
            }
            reader.readAsDataURL(event.target.files[0]);

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

    newCarrera = () => {
        const params = {
            UniversidadId: this.state.idUniversidad,
            Carrera: this.state.Informacion.Academica.OtraCarrera.Carrera
        }
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }
        Axios.post(Global.servidor + "newCarrera", params, {headers})
            .then((resp) => {
                this.getUniversidad()
                
                Swal.close()
                this.props.clear(true)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    newUniversidad = () => {
        const params = {
            Universidad: this.state.Informacion.Academica.OtraCarrera.Universidad,
            Carrera: this.state.Informacion.Academica.OtraCarrera.Carrera
        }

        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        Axios.post(Global.servidor + "newUniversidad", params, {headers})
            .then((resp) => {
                this.getUniversidad()
                
                Swal.close()
                this.props.clear(true)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    sendUpdate = async (e) => {
        e.persist()
        e.preventDefault()

        var {Informacion} = this.state
        const {Universidad, Carrera, TituloImage} = this.state.Informacion.Academica.OtraCarrera

        if (Universidad || Carrera) {
            
            if (this.validator.allValid() && Universidad && Carrera) {
                
                var exist = true,
                    message = ""

                    if (Validacion.ValidatorSelectCreate(Universidad, this.state.Universidades, "Universidad")) {
                        if (!Validacion.ValidatorSelectCreate(Carrera, this.state.Carreras, "Carreras")) {
                            exist = false;
                            message = "Carrera"
                        }
                    } else {
                        exist = false;
                        message = "Universidad"
                    }
        
                    if (exist) {
                        
                        if (TituloImage) {
                            if (Validacion.isJson(TituloImage)) {
                                Informacion.Academica.OtraCarrera.TituloImage = await AsyncMethods.saveImages(TituloImage, "SaveOtraCarrera")
                            }
                            else if (TituloImage === "") {
                                Swal.fire('Advertencia', 'Debe colocar una fotografia del titulo para su perfil', 'info')
                            }
                            
                            if (TituloImage !== "") {
                                this.saveUpdate(Informacion)
                            }
                        } else {
                            Swal.fire('Advertencia', 'Debe colocar una fotografia del titulo para su perfil', 'info')
                        }
                    }
                    else {
                        Swal.fire({
                            title: "Datos no encontrados",
                            text: message === "Universidad" ? `La universidad ${Universidad} y la carrera ${Carrera} no existen, ¿desea agregarlas?` : `La carrera ${Carrera} no existe, ¿desea agregarla?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Si',
                            cancelButtonText: 'No'
                        })
                        .then((result) => {
                            if (result.value) {
                                Swal.fire({
                                    title: 'Creando registro...',
                                    allowOutsideClick: false,
                                    onBeforeOpen: () => {
                                        Swal.showLoading()
                                    },
                                });
            
                                message === "Universidad" ? this.newUniversidad() : this.newCarrera()
                            }
        
                        })
                    }

            } else {
                this.validator.showMessages()
                this.forceUpdate()
                Swal.fire('Datos incompletos', 'Por favor rellene correctamente cada uno de los campos', 'error')
            }
        }
        else {
            Informacion.Academica.OtraCarrera = {}
            this.saveUpdate(Informacion)
        }
    }

    UNSAFE_componentWillMount() {
        this.setState({
            Informacion: this.props.data
        })

        this.getUniversidad();

    }

    render(){

        if (this.state.save) {
            return (<Redirect to="/Buscador"></Redirect>)
        }

        const {OtraCarrera} = this.props.data.Academica

        const mod = this.props.mod

        return(
            <form onSubmit={this.sendUpdate}>
                <div className="flex-row">
                            
                    <div className="flex-colum center-colum width-combo">
                        <strong className="flex-0">Universidad: 
                            <Creatable
                                className="basic-single sub-form"
                                classNamePrefix="Universidad"
                                defaultValue={OtraCarrera ? [{label: OtraCarrera.Universidad, value: OtraCarrera.Universidad}]: ''}
                                placeholder="Universidad *"
                                isClearable={true}
                                isSearchable={true}
                                name="Universidad"
                                options={this.state.Universidades}
                                onChange={this.changeState}
                                isDisabled={!mod}
                            ></Creatable>
                            {this.validator.message('required', this.state.Informacion.Academica.OtraCarrera ? this.state.Informacion.Academica.OtraCarrera.Universidad : "f", 'required')}
                        </strong>
                        <strong className="flex-0">Carrera:
                            <Creatable
                                className="basic-single sub-form"
                                classNamePrefix="Carrera"
                                defaultValue={OtraCarrera ? [{label: OtraCarrera.Carrera, value: OtraCarrera.Carrera}]: ''}
                                placeholder="Otra Carrera *"
                                isClearable={true}
                                isSearchable={true}
                                name="Carrera"
                                options={this.state.Carreras}
                                onChange={this.changeState}
                                isDisabled={!mod}
                            ></Creatable>
                            {this.validator.message('required', this.state.Informacion.Academica.OtraCarrera ? this.state.Informacion.Academica.OtraCarrera.Carrera : "f", 'required')}
                        </strong>
                    </div>
                    <div className="flex-colum">
                        <img id="imgFotoOtraCarrera" className="img-size width-50" src={OtraCarrera && OtraCarrera.TituloImage ? Global.servidor + "getImageOtraCarrera/" + OtraCarrera.TituloImage : "https://sisterhoodofstyle.com/wp-content/uploads/2018/02/no-image-1.jpg"} alt={OtraCarrera ? OtraCarrera.Universidad : "Vista Previa"}/>
                        <div className="btn btn-primary btn-file">
                            Cambiar Titulo
                            <input id="imagenPerfil" type="file" onChange={this.changeImage} disabled={!mod}/>
                        </div>
                    </div>
                    
                </div>
                {
                    mod &&
                    <div className="controls-content">
                        <input type="submit" className="editor-button publish edit-docente-grupo" value="Guardar"></input>
                        <Link to="/Buscador" className="editor-button cancel edit-docente-grupo">Cancelar</Link>
                    </div>
                }
            </form>
        )
    }
}