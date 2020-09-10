import React, {Component, Fragment} from 'react'
import Creatable from 'react-select/creatable'
import Swal from 'sweetalert2'
import Validacion from '../Validaciones/Validacion'
import SimpleReactValidator from 'simple-react-validator';
import Axios from 'axios'
import Global from '../Global'
import JWT from '../Class/JWT';

export default class Step3 extends Component {

    constructor(props){
        super(props);

        this.Estado = Boolean
        this.validator = new SimpleReactValidator({
            messages: {
                required: "Este campo es requerido"
            }
        });
    }

    state = {
        idUniversidad: '',
        Universidades: [],
        OtrasCarreras: [],
        OtraCarrera: {
            Universidad: '',
            Carrera: '',
            TituloImage: null
        }
    }

    noRefresh = (e) => {
        e.preventDefault()
        var exist = true,
            message = ""

        const {Universidad, Carrera} = this.state.OtraCarrera

        if (Universidad || Carrera) {
            if (this.validator.allValid() && Universidad && Carrera) {

                if (Validacion.ValidatorSelectCreate(this.state.OtraCarrera.Universidad, this.state.Universidades, "Universidad")) {
                    if (!Validacion.ValidatorSelectCreate(this.state.OtraCarrera.Carrera, this.state.OtrasCarreras, "Carreras")) {
                        exist = false;
                        message = "Postgrado"
                    }
                } else {
                    exist = false;
                    message = "Universidad"
                }
    
                if (exist) {
                    const imagen = document.getElementById("imagenOtraCarrera").files.length
        
                    if (imagen !== 0) {
                        this.props.recived(this.state.OtraCarrera, "OtraCarrera")
                        this.props.change(e, true, false);
                    }
                    else{
                        Swal.fire('Advertencia', 'Debe colocar una fotografia de su titulo para su perfil', 'info')
                    }
                }
                else{
                    Swal.fire({
                        title: "Datos no encontrados",
                        text: message === "Universidad" ? `La universidad ${this.state.OtraCarrera.Universidad} y la carrera ${this.state.OtraCarrera.Carrera} no existen, ¿desea agregarlas?` : `La Carrera ${this.state.OtraCarrera.Carrera} no existe, ¿desea agregarlo?`,
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
        else{
            this.props.recived({}, "OtraCarrera")
            this.props.change(e, true, false);
        }
    }

    newCarrera = () => {
        const params = {
            UniversidadId: this.state.idUniversidad,
            Carrera: this.state.OtraCarrera.Carrera
        }
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }
        Axios.post(Global.servidor + "newCarrera", params, {headers})
            .then((resp) => {
                this.getCarrera()
                
                Swal.close()
                this.props.clear(true)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    newUniversidad = () => {
        const params = {
            Universidad: this.state.OtraCarrera.Universidad,
            Carrera: this.state.OtraCarrera.Carrera
        }
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }
        Axios.post(Global.servidor + "newUniversidad", params, {headers})
            .then((resp) => {
                this.getCarrera()
                
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

        var {idUniversidad, Universidades, OtrasCarreras} = this.state
        var {Universidad, Carrera, TituloImage} = this.state.OtraCarrera

        if (type) {
            
            switch (type.name) {
                case "Universidad":
                    Universidad = type.action !== "clear" ? e.value.Universidad ? e.value.Universidad : e.value : ''
                    OtrasCarreras = type.action !== "clear" ? e.value.Carreras : []
                    idUniversidad = type.action !== "clear" ? e.value._id : ''
                    break;
                case "Carrera":

                    Carrera = type.action !== "clear" ? e.value : ''
                    
                    break;
                default:
                    break;
            }

        }

        this.setState({
            idUniversidad,
            Universidades,
            OtrasCarreras,
            OtraCarrera: {
                Universidad: Universidad.trim(),
                Carrera: Carrera.trim(),
                TituloImage
            }
        })

    }

    changeImage = (event) => {

        var {idUniversidad, Universidades, OtrasCarreras} = this.state
        var {Universidad, Carrera} = this.state.OtraCarrera

        if (event.target.files[0]) {

            this.setState({
                idUniversidad,
                Universidades,
                OtrasCarreras,
                OtraCarrera: {
                    Universidad,
                    Carrera,
                    TituloImage: event.target.files[0]
                }
            })

            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("imgFotoOtraCarrera").src = e.target.result // Renderizamos la imagen
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        
    }

    getCarrera = () => {
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }
        Axios.get(Global.servidor + "getUniversidades", {headers})
            .then((resp) => {
                this.setState({
                    Universidades: resp.data.Universidades,
                    OtrasCarreras: [],
                    OtraCarrera: {
                        Universidad: this.state.OtraCarrera.Universidad,
                        Carrera: this.state.OtraCarrera.Carrera
                    }
                })
        
                resp.data.Universidades.map((data, i) => {
                    if (data.label === this.state.OtraCarrera.Universidad) {
                        this.setState({
                            idUniversidad: this.state.idUniversidad,
                            Universidades: resp.data.Universidades,
                            OtrasCarreras: data.value.Carreras,
                            OtraCarrera: {
                                Universidad: this.state.OtraCarrera.Universidad,
                                Carrera: this.state.OtraCarrera.Carrera
                            }
                        })
                    }
                    return data;
                })


                this.props.clear(false)
            })
            .catch((err) => {
                console.log(err);
            });
        

    }

    UNSAFE_componentWillMount() {
        this.getCarrera()
    }
    render(){
        this.Estado = this.props.data
        
        if (this.Estado) {
            this.getCarrera()
        }
        return(
            <Fragment>
                <div className="step" id="step-4">
                    <form onSubmit={this.noRefresh} onReset={this.Back} action="" className="full-form">
                        <div className="step__header">
                            <h2 className="step__title">¿Tienes alguna otra carrera?<small>(Paso 4)</small></h2>
                        </div>
                        <div className="step__body">

                            <div className="full-form" action="" method="POST" id="registrar-form" >

                                <label>Si posee otra carrera complete los campos, de lo contrario solo avance</label>

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
                                        {this.validator.message('required', this.state.OtraCarrera.Universidad, 'required')}
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
                                            options={this.state.OtrasCarreras}
                                            onChange={this.changeState}
                                        ></Creatable>
                                        {this.validator.message('required', this.state.OtraCarrera.Carrera, 'required')}
                                    </div>  

                                </div>

                                <div className="boton-foto">
                                    <img id="imgFotoOtraCarrera" src="https://sisterhoodofstyle.com/wp-content/uploads/2018/02/no-image-1.jpg" alt="perfil" aling="text-left"/>
                                    <div className="info-imagen-perfil">
                                        <label>Vista previa del titulo del Postgrado.</label>
                                    </div>
                                </div>

                                <div className="btn btn-primary btn-file">
                                    subir imagen
                                    <input id="imagenOtraCarrera" type="file" onChange={this.changeImage}/>
                                </div>

                            </div>

                        </div>

                        <div className="step__footer">
                            <button type="reset" className="step__button step__button--back" data-to_step="3" data-step="4">Regresar</button>
                            <button type="submit" className="step__button step__button--next" data-to_step="5" data-step="4">Siguiente</button>
                        </div>


                    </form>
                </div>
                
            </Fragment>
        )
    }
}