import React, {Component} from 'react'
import Creatable from 'react-select/creatable'
import Select from 'react-select';
import Global from '../Global';
import Axios from 'axios'
import Moment from 'moment';
import SimpleReactValidator from 'simple-react-validator';
import {Link, Redirect} from 'react-router-dom'
import AsyncMethods from '../WebPack/asycn'
import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es';
import Swal from 'sweetalert2';
import Validacion from '../Validaciones/Validacion';
import JWT from '../Class/JWT';
registerLocale('es', es)

export default class ShowInfoAcademica extends Component {

    constructor(props){
        super(props)

        this.validator = new SimpleReactValidator({
            messages: {
                required: "Este campo es requerido",
                numeric: "Solo se permiten valores numericos",
                min: "El valor mínimo permitido es 7",
                max: "El valor máximo permitido es 10"
            }
        });
        this.NivelDocente = Global.NivelesDocencia
        this.CategoriaDocente = Global.CategoriasDocente
        this.Estado = Boolean
    }

    CUMRef = React.createRef()

    state = {
        idUniversidad: '',
        Universidades: [],
        Carreras: [],
        Informacion: {}
    }

    changeOpciones = (Universidad, data, id) => {
        var {idUniversidad, Universidades, Carreras, Informacion} = this.state
        
        Universidades = Universidad;
        Carreras = data;
        idUniversidad = id;

        this.setState({
            idUniversidad,
            Universidades,
            Carreras,
            Informacion
        })
    }

    changeStateDate = (event, type) => {

        this.changeState(Moment((event)).format("YYYY-MM-DD"), {name: "Egreso"})
    }

    changeState = (e, type) => {
        var {idUniversidad, Universidades, Carreras} = this.state
        var Informacion = this.state.Informacion ,{Academica} = this.state.Informacion;

        if (type) {
            
            switch (type.name) {
                case "Universidad":

                    Academica.Universidad = type.action !== "clear" ? e.value.Universidad ? e.value.Universidad : e.value : ''
                    Carreras = type.action !== "clear" ? e.value.Carreras : []
                    idUniversidad = type.action !== "clear" ? e.value._id : ''
                    break;
                case "Carrera":

                    Academica.Carrera = type.action !== "clear" ? e.value : ''
                    
                    break;
                case "Nivel Docencia":

                    Academica.NivelDocente = type.action !== "clear" ? e.value : ''

                    break;
                case "Categoria Docencia":

                    Academica.CategoriaDocente = type.action !== "clear" ? e.value : ''

                    break;
                case "Egreso":
                    Academica.Egreso = e
                    break;
                case "imagenTitulo":
                    Academica.TituloImage = e
                    break;
                default:
                    break;
            }

        }

        Informacion.Academica = Academica
        Informacion.Academica.CUM = this.CUMRef.current.value.trim()

        
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

    noRefresh = (e) => {
        e.preventDefault()
    }

    changeImageTitulo = (event) => {

        if (event.target.files[0]) {
            this.changeState(event.target.files[0], {name: "imagenTitulo"})

            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("imgFotoTitulo").src = e.target.result // Renderizamos la imagen
            }
            reader.readAsDataURL(event.target.files[0]);

        }
    }

    sendUpdate = async (e) => {
        e.persist()
        e.preventDefault()

        var {Informacion} = this.state
        const {Universidad, Carrera, NivelDocente, CategoriaDocente, TituloImage} = this.state.Informacion.Academica

        var exist = true,
            message = ""

        if (this.validator.allValid() && Universidad && Carrera && NivelDocente && CategoriaDocente) {
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
                if (Validacion.isJson(TituloImage)) {
                    Informacion.Academica.TituloImage = await AsyncMethods.saveImages(TituloImage, "SaveTitulo")
                }
                else if (TituloImage === "") {
                    Swal.fire('Advertencia', 'Debe colocar una fotografia del titulo para su perfil', 'info')
                }
                
                if (TituloImage !== "") {
                    this.saveUpdate(Informacion)
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
        }
        else{
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

    newCarrera = () => {
        const params = {
            UniversidadId: this.state.idUniversidad,
            Carrera: this.state.Informacion.Academica.Carrera
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
            Universidad: this.state.Informacion.Academica.Universidad,
            Carrera: this.state.Informacion.Academica.Carrera
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

    UNSAFE_componentWillMount() {
        this.setState({
            Informacion: this.props.data
        })

        this.getUniversidad();

    }

    render() {

        if (this.state.save) {
            return (<Redirect to="/Buscador"></Redirect>)
        }

        const {Academica} = this.props.data
        const {Universidad, Carrera, NivelDocente, CategoriaDocente, CUM, TituloImage} = Academica

        var fecha = new Date(this.state.Informacion.Academica.Egreso)
        fecha.setDate(fecha.getDate() + 1)

        const CustomButtonDate = ({ value, onClick })=> (
            <input type="button" className="custom-input" onClick={onClick} value={value}/>
        );

        const mod = this.props.mod

        return(
            <form onSubmit={this.sendUpdate}>
                <div className="flex-row">
                    <div className="flex-colum">
                        <strong>Egreso: <br/>
                                <DatePicker
                                    locale="es"
                                    selected={fecha}
                                    onChange={this.changeStateDate}
                                    maxDate={new Date()}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    todayButton="Fecha Actual"
                                    name="Egreso"
                                    disabled={!mod}
                                    customInput={<CustomButtonDate></CustomButtonDate>}
                                ></DatePicker>
                        </strong>
                        <strong>Universidad: 
                            <Creatable
                                className="basic-single sub-form"
                                classNamePrefix="Universidad"
                                defaultValue={[{label: Universidad, value: Universidad}]}
                                placeholder="Universidad *"
                                isClearable={true}
                                isSearchable={true}
                                name="Universidad"
                                options={this.state.Universidades}
                                onChange={this.changeState}
                                isDisabled={!mod}
                            ></Creatable>
                            {this.validator.message('required', this.state.Informacion.Academica.Universidad, 'required')}
                        </strong>
                        <strong>Carrera: 
                            <Creatable
                                className="basic-single sub-form"
                                classNamePrefix="Carrera"
                                defaultValue={[{label:Carrera, value:Carrera}]}
                                placeholder="Carrera *"
                                isClearable={true}
                                isSearchable={true}
                                name="Carrera"
                                options={this.state.Carreras}
                                onChange={this.changeState}
                                isDisabled={!mod}
                            ></Creatable>
                            {this.validator.message('required', this.state.Informacion.Academica.Carrera, 'required')}
                        </strong>
                        <strong>Nivel Docente: 
                            <Select
                                className="basic-single sub-form"
                                classNamePrefix="Nivel Docencia"
                                defaultValue={[{label: NivelDocente, value: NivelDocente}]}
                                placeholder="Nivel Docencia *"
                                isClearable={true}
                                isSearchable={true}
                                name="Nivel Docencia"
                                options={this.NivelDocente}
                                onChange={this.changeState}
                                isDisabled={!mod}
                            ></Select>
                            {this.validator.message('required', this.state.Informacion.Academica.NivelDocente, 'required')}
                        </strong>
                        <strong>Categoria Docente: 
                            <Select
                                className="basic-single sub-form"
                                classNamePrefix="Categoria Docencia"
                                defaultValue={[{label: CategoriaDocente, value: CategoriaDocente}]}
                                placeholder="Categoria Docencia *"
                                isClearable={true}
                                isSearchable={true}
                                name="Categoria Docencia"
                                options={this.CategoriaDocente}
                                onChange={this.changeState}
                                isDisabled={!mod}
                            ></Select>
                            {this.validator.message('required', this.state.Informacion.Academica.CategoriaDocente, 'required')}
                        </strong>
                        <strong>CUM: 
                            <input type="text" className="form-control" defaultValue={CUM} onChange={this.changeState} ref={this.CUMRef} disabled={!mod}></input>
                            {this.validator.message('required', this.state.Informacion.Academica.CUM, 'required|numeric|min:7,num|max:10,num')}
                        </strong>
                    </div>
                    <div className="flex-colum">
                        <img className="img-size width-50" src={Global.servidor + "getImageTitulo/" + TituloImage} alt={Universidad} id="imgFotoTitulo"/>
                        <div className="btn btn-primary btn-file">
                            Cambiar Titulo
                            <input id="imagenPerfil" type="file" onChange={this.changeImageTitulo} disabled={!mod}/>
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