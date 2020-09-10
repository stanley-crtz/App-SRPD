import React, {Component, Fragment} from 'react'
import Creatable from 'react-select/creatable'
import Axios from 'axios'
import Global from '../Global'
import Swal from 'sweetalert2'
import Validacion from '../Validaciones/Validacion'
import SimpleReactValidator from 'simple-react-validator';
import JWT from '../Class/JWT'

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
        Postgrados: [],
        Postgrado: {
            Universidad: '',
            Postgrado: '',
            TituloImage: null
        }
    }

    noRefresh = (e) => {
        e.preventDefault()
        var exist = true,
            message = ""

        const {Universidad, Postgrado} = this.state.Postgrado

        if (Universidad || Postgrado) {
            if (this.validator.allValid() && Universidad && Postgrado) {

                if (Validacion.ValidatorSelectCreate(this.state.Postgrado.Universidad, this.state.Universidades, "Universidad")) {
                    if (!Validacion.ValidatorSelectCreate(this.state.Postgrado.Postgrado, this.state.Postgrados, "Carreras")) {
                        exist = false;
                        message = "Postgrado"
                    }
                } else {
                    exist = false;
                    message = "Universidad"
                }
    
                if (exist) {
                    const imagen = document.getElementById("imagenPostgrado").files.length
        
                    if (imagen !== 0) {
                        this.props.recived(this.state.Postgrado, "Postgrado")
                        this.props.change(e, true, false);
                    }
                    else{
                        Swal.fire('Advertencia', 'Debe colocar una fotografia de su titulo para su perfil', 'info')
                    }
                }
                else{
                    Swal.fire({
                        title: "Datos no encontrados",
                        text: message === "Universidad" ? `La universidad ${this.state.Postgrado.Universidad} y el Postgrado ${this.state.Postgrado.Postgrado} no existen, ¿desea agregarlas?` : `El postgrado ${this.state.Postgrado.Postgrado} no existe, ¿desea agregarlo?`,
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
        
                            message === "Universidad" ? this.newUniversidad() : this.newPostgrado()
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
            this.props.recived({}, "Postgrado")
            this.props.change(e, true, false);
        }
        
    }

    newPostgrado = () => {
        const params = {
            UniversidadId: this.state.idUniversidad,
            Postgrado: this.state.Postgrado.Postgrado
        }
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }
        Axios.post(Global.servidor + "newPostgrado", params, {headers})
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
            Universidad: this.state.Postgrado.Universidad,
            Postgrado: this.state.Postgrado.Postgrado
        }
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }
        Axios.post(Global.servidor + "newUniversidadPostgrado", params, {headers})
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

    getUniversidad = () => {
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        Axios.get(Global.servidor + "getUniversidadesPostgrados", {headers})
            .then((resp) => {
                this.setState({
                    idUniversidad: this.state.idUniversidad,
                    Universidades: resp.data.Universidades,
                    Postgrados: [],
                    Postgrado: {
                        Universidad: this.state.Postgrado.Universidad,
                        Postgrado: this.state.Postgrado.Postgrado,
                        TituloImage: this.state.Postgrado.TituloImage
                    }
                })

                resp.data.Universidades.map((data, i) => {
                    if (data.label === this.state.Postgrado.Universidad) {
                        this.setState({
                            idUniversidad: this.state.idUniversidad,
                            Universidades: resp.data.Universidades,
                            Postgrados: data.value.Postgrados,
                            Postgrado: {
                                Universidad: this.state.Postgrado.Universidad,
                                Postgrado: this.state.Postgrado.Postgrado,
                                TituloImage: this.state.Postgrado.TituloImage
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

    changeState = (e, type) => {

        var {idUniversidad, Universidades, Postgrados} = this.state
        var {Universidad, Postgrado, TituloImage} = this.state.Postgrado

        if (type) {
            
            switch (type.name) {
                case "Universidad":

                    Universidad = type.action !== "clear" ? e.value.Universidad ? e.value.Universidad : e.value : ''
                    Postgrados = type.action !== "clear" ? e.value.Postgrados : []
                    idUniversidad = type.action !== "clear" ? e.value._id : ''

                    break;
                case "Postgrado":

                    Postgrado = type.action !== "clear" ? e.value : ''
                    
                    break;
                default:
                    break;
            }

        }

        this.setState({
            idUniversidad,
            Universidades,
            Postgrados,
            Postgrado: {
                Universidad: Universidad.trim(),
                Postgrado: Postgrado.trim(),
                TituloImage
            }
        })

    }

    changeImage = (event) => {

        var {idUniversidad, Universidades, Postgrados} = this.state
        var {Universidad, Postgrado} = this.state.Postgrado
        
        if (event.target.files[0]) {

            this.setState({
                idUniversidad,
                Universidades,
                Postgrados,
                Postgrado: {
                    Universidad,
                    Postgrado,
                    TituloImage: event.target.files[0]
                }
            })
            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("imgFotoPostgrado").src = e.target.result // Renderizamos la imagen
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

        return(
            <Fragment>
                <div className="step" id="step-3">
                    <form onSubmit={this.noRefresh} onReset={this.Back} action="" className="full-form">
                        <div className="step__header">
                            <h2 className="step__title">¿Tienes algun Postgrado?<small>(Paso 3)</small></h2>
                        </div>
                        <div className="step__body">

                            <div className="full-form" action="" method="POST" id="registrar-form" >

                                <label>Si posee un postgrado complete los campos, de lo contrario solo avance</label>
                                
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
                                        {this.validator.message('required', this.state.Postgrado.Universidad, 'required')}
                                    </div>  
                                    <div className="width-6">
                                        <Creatable
                                            className="basic-single sub-form"
                                            classNamePrefix="Postgrado"
                                            defaultValue=""
                                            placeholder="Postgrado *"
                                            isClearable={true}
                                            isSearchable={true}
                                            name="Postgrado"
                                            options={this.state.Postgrados}
                                            onChange={this.changeState}
                                        ></Creatable>
                                        {this.validator.message('required', this.state.Postgrado.Postgrado, 'required')}
                                    </div>  
                                
                                </div>

                                <div className="boton-foto">
                                    <img id="imgFotoPostgrado" src="https://sisterhoodofstyle.com/wp-content/uploads/2018/02/no-image-1.jpg" alt="perfil" aling="text-left"/>
                                    <div className="info-imagen-perfil">
                                        <label>Vista previa del titulo del Postgrado.</label>
                                    </div>
                                </div>

                                <div className="btn btn-primary btn-file">
                                    subir imagen
                                    <input id="imagenPostgrado" type="file" onChange={this.changeImage}/>
                                </div> 
                            </div>

                        </div>

                        <div className="step__footer">
                            <button type="reset" className="step__button step__button--back" data-to_step="2" data-step="3">Regresar</button>
                            <button type="submit" className="step__button step__button--next" data-to_step="4" data-step="3">Siguiente</button>
                        </div>

                    </form>
                </div>
                
            </Fragment>
        )
    }
}