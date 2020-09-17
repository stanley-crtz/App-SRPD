import React, {Component} from 'react'
import Creatable from 'react-select/creatable'
import Global from '../Global';
import Axios from 'axios'
import SimpleReactValidator from 'simple-react-validator';
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2';
import Validacion from '../Validaciones/Validacion';
import AsyncMethods from '../WebPack/asycn'
import {Redirect} from 'react-router-dom'
import JWT from '../Class/JWT';

export default class ShowInfoPostgrado extends Component {

    constructor(props){
        super(props);

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
        Informacion: {}
    }

    changeOpciones = (Universidad, data, id) => {
        var {idUniversidad, Universidades, Postgrados, Informacion} = this.state
        
        Universidades = Universidad;
        Postgrados = data;
        idUniversidad = id

        this.setState({
            idUniversidad,
            Universidades,
            Postgrados,
            Informacion
        })
    }

    getUniversidad = () => {

        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        Axios.get(Global.servidor + "getUniversidadesPostgrados", {headers})
            .then( (resp) => {

                const Universidades = resp.data.Universidades;

                var listPostgrados = [], idUniversidad = ''

                resp.data.Universidades.map((data, i) => {
                    if (this.state.Informacion.Academica.Postgrado) {
                        if (data.label === this.state.Informacion.Academica.Postgrado.Universidad) {
                        
                            listPostgrados = data.value.Postgrados
                            idUniversidad = data._id
                        }
                    }
                    return data;
                })

                this.changeOpciones(Universidades, listPostgrados, idUniversidad);

            })
            .catch( (err) => {
                console.log(err);
            })
    }

    changeState = (e, type) => {

        var {idUniversidad, Universidades, Postgrados, Informacion} = this.state
        var {Postgrado} = Informacion.Academica

        if (!Postgrado) {
            Postgrado = {
                Universidad: '',
                Postgrado: ''
            }
        }

        if (type) {
            
            switch (type.name) {
                case "Universidad":

                    Postgrado.Universidad = type.action !== "clear" ? e.value.Universidad ? e.value.Universidad : e.value : ''
                    Postgrados = type.action !== "clear" ? e.value.Postgrados : []
                    idUniversidad = type.action !== "clear" ? e.value._id : ''

                    break;
                case "Postgrado":

                    Postgrado.Postgrado = type.action !== "clear" ? e.value : ''
                    
                    break;

                case "imagenTituloPostgrado":
                    Postgrado.TituloImage = e;
                    break;
                default:
                    break;
            }

        }

        Informacion.Academica.Postgrado = Postgrado

        this.setState({
            idUniversidad,
            Universidades,
            Postgrados,
            Informacion
        })

    }

    changeImage = (event) => {
        if (event.target.files[0]) {
            this.changeState(event.target.files[0], {name: "imagenTituloPostgrado"})

            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("imgFotoPostgrado").src = e.target.result // Renderizamos la imagen
            }
            reader.readAsDataURL(event.target.files[0]);

        }
    }

    sendUpdate = async (e) => {
        e.persist()
        e.preventDefault()

        var {Informacion} = this.state
        const {Universidad, Postgrado, TituloImage} = this.state.Informacion.Academica.Postgrado

        if (Universidad || Postgrado) {
            if (this.validator.allValid() && Universidad && Postgrado) {

                var exist = true,
                    message = ""
    
                if (Validacion.ValidatorSelectCreate(Universidad, this.state.Universidades, "Universidad")) {
                    if (!Validacion.ValidatorSelectCreate(Postgrado, this.state.Postgrados, "Postgrados")) {
                        exist = false;
                        message = "Postgrado"
                    }
                } else {
                    exist = false;
                    message = "Universidad"
                }
    
                if (exist) {
                    if (TituloImage) {
                        if (Validacion.isJson(TituloImage)) {
                            Informacion.Academica.Postgrado.TituloImage = await AsyncMethods.saveImages(TituloImage, "SavePosgrado")
                            
                        }
                        else if (TituloImage === "") {
                            Swal.fire('Advertencia', 'Debe colocar una fotografia del titulo para su perfil', 'info')
                        }
        
                        if (TituloImage !== "") {
                            this.saveUpdate(Informacion)
                        }
                    }
                    else {
                        Swal.fire('Advertencia', 'Debe colocar una fotografia del titulo para su perfil', 'info')
                    }
                }
                else{
                    Swal.fire({
                        title: "Datos no encontrados",
                        text: message === "Universidad" ? `La universidad ${Universidad} y el Postgrado ${Postgrado} no existen, ¿desea agregarlas?` : `El postgrado ${Postgrado} no existe, ¿desea agregarlo?`,
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
            }
            else {
                this.validator.showMessages()
                this.forceUpdate()
                Swal.fire('Datos incompletos', 'Por favor rellene correctamente cada uno de los campos', 'error')
            }
        } else {
            Informacion.Academica.Postgrado = {}
            this.saveUpdate(Informacion)
        }
    }

    newPostgrado = () => {
        
        const params = {
            UniversidadId: this.state.idUniversidad,
            Postgrado: this.state.Informacion.Academica.Postgrado.Postgrado
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
            Universidad: this.state.Informacion.Academica.Postgrado.Universidad,
            Postgrado: this.state.Informacion.Academica.Postgrado.Postgrado
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

    UNSAFE_componentWillMount(){
        this.setState({
            Informacion: this.props.data
        })
        this.getUniversidad()
    }

    render(){

        if (this.state.save) {
            return (<Redirect to="/Buscador"></Redirect>)
        }

        const {Postgrado} = this.props.data.Academica

        const mod = this.props.mod

        return(
            <form onSubmit={this.sendUpdate}>
                <div className="flex-row">
                    <div className="flex-colum">
                        <img id="imgFotoPostgrado" className="img-size width-50" src={Postgrado && Postgrado.TituloImage ? Global.servidor + "getImagePostrado/" + Postgrado.TituloImage : "https://sisterhoodofstyle.com/wp-content/uploads/2018/02/no-image-1.jpg"} alt={Postgrado ? Postgrado.Universidad : 'Vista Previa'}/>
                        <div className="btn btn-primary btn-file">
                            Cambiar Titulo
                            <input id="imagenPerfil" type="file" onChange={this.changeImage} disabled={!mod}/>
                        </div>
                    </div>
                    <div className="flex-colum center-colum width-combo">
                        <strong className="flex-0">Universidad: 
                            <Creatable
                                className="basic-single sub-form"
                                classNamePrefix="Universidad"
                                defaultValue={Postgrado ? [{label: Postgrado.Universidad, value: Postgrado.Universidad}] : ''}
                                placeholder="Universidad *"
                                isClearable={true}
                                isSearchable={true}
                                name="Universidad"
                                options={this.state.Universidades}
                                onChange={this.changeState}
                                isDisabled={!mod}
                            ></Creatable>
                            {this.validator.message('required', this.state.Informacion.Academica.Postgrado ? this.state.Informacion.Academica.Postgrado.Universidad : 'f', 'required')}
                        </strong>
                        <strong className="flex-0">Postgrado:
                            <Creatable
                                className="basic-single sub-form"
                                classNamePrefix="Postgrado"
                                defaultValue={Postgrado ? [{label: Postgrado.Postgrado, value: Postgrado.Postgrado}] : ''}
                                placeholder="Postgrado *"
                                isClearable={true}
                                isSearchable={true}
                                name="Postgrado"
                                options={this.state.Postgrados}
                                onChange={this.changeState}
                                isDisabled={!mod}
                            ></Creatable>
                            {this.validator.message('required', this.state.Informacion.Academica.Postgrado ? this.state.Informacion.Academica.Postgrado.Postgrado : 'f', 'required')}
                        </strong>
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