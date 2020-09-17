import React, {Component} from 'react'
import Select from 'react-select'
import Axios from 'axios'
import Global from '../Global'
import Creatable from 'react-select/creatable'
import Validacion from '../Validaciones/Validacion'
import Swal from 'sweetalert2'
import SimpleReactValidator from 'simple-react-validator';
import JWT from '../Class/JWT'

export default class Step2 extends Component {

    
    constructor(props){
        super(props)

        this.validator = new SimpleReactValidator({
            element: message => <div className="color-white">{message}</div>,
            messages: {
                required: "Este campo es requerido",
                numeric: "Solo se permiten valores numericos",
                min: "El valor minimo permitido es 7",
                max: "El valor maximo permitido es 10"
            }
        });
        this.NivelDocente = Global.NivelesDocencia
        this.CategoriaDocente = Global.CategoriasDocente
        this.Estado = Boolean
    }

    state = {
        idUniversidad: '',
        Universidades: [],
        Carreras: [],
        Academica: {
            Egreso: '',
            Universidad: '',
            Carrera: '',
            NivelDocente: '',
            CategoriaDocente: '',
            CUM: '',
            TituloImage: null
        }
    }

    CumRef = React.createRef();
    EgresoRef = React.createRef();

    noRefresh = (e) => {
        e.preventDefault()

        var exist = true,
            message = ""

        if (this.validator.allValid()) {

            if (Validacion.ValidatorSelectCreate(this.state.Academica.Universidad, this.state.Universidades, "Universidad")) {
                if (!Validacion.ValidatorSelectCreate(this.state.Academica.Carrera, this.state.Carreras, "Carreras")) {
                    exist = false;
                    message = "Carrera"
                }
            } else {
                exist = false;
                message = "Universidad"
            }

            if (exist) {
                const imagen = document.getElementById("imagenTitulo").files.length
    
                if (imagen !== 0) {
                    this.props.recived(this.state.Academica, "Academica")
                    this.props.change(e, true, false);
                }
                else{
                    Swal.fire('Advertencia', 'Debe colocar una fotografia de su titulo para su perfil', 'info')
                }
            }
            else{
                Swal.fire({
                    title: "Datos no encontrados",
                    text: message === "Universidad" ? `La universidad ${this.state.Academica.Universidad} y la carrera ${this.state.Academica.Carrera} no existen, ¿desea agregarlas?` : `La carrera ${this.state.Academica.Carrera} no existe, ¿desea agregarla?`,
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
            Swal.fire('Datos incompletos', 'Por favor rellene correctamente cada uno de los campos', 'error')
            this.validator.showMessages();
            this.forceUpdate();
        }

        
    }

    newCarrera = () => {
        const params = {
            UniversidadId: this.state.idUniversidad,
            Carrera: this.state.Academica.Carrera
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
            Universidad: this.state.Academica.Universidad,
            Carrera: this.state.Academica.Carrera
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

    Back = (e) => {
        e.preventDefault()
        this.props.change(e, false, true)
    }

    changeState = (e, type) => {

        var {idUniversidad, Universidades, Carreras} = this.state
        var {Universidad, Carrera, NivelDocente, CategoriaDocente, TituloImage} = this.state.Academica;

        if (type) {
            
            switch (type.name) {
                case "Universidad":

                    Universidad = type.action !== "clear" ? e.value.Universidad ? e.value.Universidad : e.value : ''
                    Carreras = type.action !== "clear" ? e.value.Carreras : []
                    idUniversidad = type.action !== "clear" ? e.value._id : ''
                    break;
                case "Carrera":

                    Carrera = type.action !== "clear" ? e.value : ''
                    
                    break;
                case "Nivel Docencia":

                    NivelDocente = type.action !== "clear" ? e.value : ''

                    break;
                case "Categoria Docencia":

                    CategoriaDocente = type.action !== "clear" ? e.value : ''

                    break;
                default:
                    break;
            }

        }

        this.setState({
            idUniversidad,
            Universidades,
            Carreras,
            Academica: {
                Universidad: Universidad.trim(),
                Carrera: Carrera.trim(),
                Egreso: this.EgresoRef.current.value.trim(),
                NivelDocente: NivelDocente.trim(),
                CategoriaDocente: CategoriaDocente.trim(),
                CUM: this.CumRef.current.value.trim(),
                TituloImage
            }
        })

    }

    getUniversidad = () => {
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }
        Axios.get(Global.servidor + "getUniversidades", {headers})
            .then((resp) => {
                this.setState({
                    idUniversidad: this.state.idUniversidad,
                    Universidades: resp.data.Universidades,
                    Carreras: [],
                    Academica: {
                        Universidad: this.state.Academica.Universidad,
                        Carrera: this.state.Academica.Carrera,
                        Egreso: this.state.Academica.Egreso,
                        NivelDocente: this.state.Academica.NivelDocente,
                        CategoriaDocente: this.state.Academica.CategoriaDocente,
                        CUM: this.state.Academica.CUM,
                        TituloImage: this.state.Academica.TituloImage
                    }
                })

                resp.data.Universidades.map((data, i) => {
                    if (data.label === this.state.Academica.Universidad) {
                        this.setState({
                            idUniversidad: this.state.idUniversidad,
                            Universidades: resp.data.Universidades,
                            Carreras: data.value.Carreras,
                            Academica: {
                                Universidad: this.state.Academica.Universidad,
                                Carrera: this.state.Academica.Carrera,
                                Egreso: this.state.Academica.Egreso,
                                NivelDocente: this.state.Academica.NivelDocente,
                                CategoriaDocente: this.state.Academica.CategoriaDocente,
                                CUM: this.state.Academica.CUM,
                                TituloImage: this.state.Academica.TituloImage
                            }
                        })
                    }
                    return data;
                })

                this.props.clear(false)
                
            })
            .catch((err) => {
                console.log(err);
            })

        
    }

    changeImage = (event) => {

        if (event.target.files[0]) {

            var {idUniversidad, Universidades, Carreras} = this.state
            var {Egreso, Universidad, Carrera, NivelDocente, CategoriaDocente, CUM} = this.state.Academica;

            this.setState({
                idUniversidad,
                Universidades,
                Carreras,
                Academica: {
                    Egreso,
                    Universidad,
                    Carrera,
                    NivelDocente,
                    CategoriaDocente,
                    CUM,
                    TituloImage: event.target.files[0]
                }
            })

            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("imgFotoTitulo").src = e.target.result // Renderizamos la imagen
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        
    }

    UNSAFE_componentWillMount(){
        this.getUniversidad()
    }

    render(){

        this.Estado = this.props.data
        
        if (this.Estado) {
            this.getUniversidad()
        }

        return (

            <div className="step" id="step-2">
                <form onSubmit={this.noRefresh} onReset={this.Back} action="" className="full-form">
                    <div className="step__header">
                        <h2 className="step__title">Información de academica<small>(Paso 2)</small></h2>
                    </div>
                    <div className="step__body">

                        <div className="full-form" action="" method="POST" id="registrar-form" >
                            
                            <div className="form-group width-12">
                                <div className="width-6">
                                    <Creatable
                                        className="basic-single sub-form"
                                        classNamePrefix="Universidad"
                                        defaultValue=""
                                        placeholder="Universidad *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Universidad"
                                        options={this.state.Universidades}
                                        onChange={this.changeState}
                                    ></Creatable>
                                    {this.validator.message('required', this.state.Academica.Universidad, 'required')}
                                </div>  
                                <div className="width-6">
                                    <Creatable
                                        className="basic-single sub-form"
                                        classNamePrefix="Carrera"
                                        defaultValue=""
                                        placeholder="Carrera *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Carrera"
                                        options={this.state.Carreras}
                                        onChange={this.changeState}
                                    ></Creatable>
                                    {this.validator.message('required', this.state.Academica.Carrera, 'required')}
                                </div>  
                            
                            </div>

                            <div className="form-group width-12">
                                <div className="width-6">
                                    <Select
                                        className="basic-single sub-form"
                                        classNamePrefix="Nivel Docencia"
                                        defaultValue=""
                                        placeholder="Nivel Docencia *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Nivel Docencia"
                                        options={this.NivelDocente}
                                        onChange={this.changeState}
                                    ></Select>
                                    {this.validator.message('required', this.state.Academica.NivelDocente, 'required')}
                                </div>  
                                <div className="width-6">
                                    <Select
                                        className="basic-single sub-form"
                                        classNamePrefix="Categoria Docencia"
                                        defaultValue=""
                                        placeholder="Categoria Docencia *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Categoria Docencia"
                                        options={this.CategoriaDocente}
                                        onChange={this.changeState}
                                    ></Select>
                                    {this.validator.message('required', this.state.Academica.CategoriaDocente, 'required')}
                                </div>  
                            
                            </div>

                            <div className="form-group width-12">
                                <h3 className="sub-form">AÑO DE EGRESO</h3>
                                <input type="date" className="form-control" ref={this.EgresoRef} onChange={this.changeState}/>
                                {this.validator.message('required', this.state.Academica.Egreso, 'required')}
                            </div>

                            <div className="form-group width-12">
                                <h3 className="sub-form">CUM</h3>
                                <input type="number" className="form-control" placeholder="CUM*" maxLength="2" onChange={this.changeState} ref={this.CumRef}/> 
                                {this.validator.message('required', this.state.Academica.CUM, 'required|numeric|min:7,num|max:10,num')}
                            </div>
                                      
                            <div className="boton-foto">
                                <img id="imgFotoTitulo" src="https://sisterhoodofstyle.com/wp-content/uploads/2018/02/no-image-1.jpg" alt="perfil" aling="text-left"/>
                                <div className="info-imagen-perfil">
                                    <label>Vista previa del titulo universitario.</label>
                                </div>
                            </div>

                            <div className="btn btn-primary btn-file">
                                subir imagen
                                <input id="imagenTitulo" type="file" onChange={this.changeImage}/>
                            </div>         
                        </div>

                    </div>

                    <div className="step__footer">
                        <button type="reset" className="step__button step__button--back" data-to_step="1" data-step="2">Regresar</button>
                        <button type="submit" className="step__button step__button--next" data-to_step="3" data-step="2">Siguiente</button>
                    </div>

                </form>
            </div>
            
        )
    }
}