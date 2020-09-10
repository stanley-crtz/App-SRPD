import React, {Component} from 'react'
import Capacitado from '../JSON/Capacitado.json'
import Creatable from 'react-select/creatable'
import { Link, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from 'axios';
import Global from '../Global';
import JWT from '../Class/JWT';

export default class ShowInfoOpcional extends Component {

    constructor(props) {
        super(props)
        this.Ciencia = Capacitado.Ciencia;
        this.Lenguaje = Capacitado.Lenguaje;
        this.Matematica = Capacitado.Matematica;
        this.Sociales = Capacitado.Sociales;
        this.Informatica = Capacitado.Informatica;
        this.Idiomas = Capacitado.Idiomas;
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

    state = {
        Informacion: {}
    }

    changeState = (e, type) => {
        var {Informacion} = this.state
        var {Opcional} = this.state.Informacion;

        if (type) {
            
            switch (type.name) {
                case "Ciencia":

                    Opcional.Ciencia = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                case "Lenguaje":

                    Opcional.Lenguaje = type.action !== "clear" ? e !== null ? e : [] : []
                    
                    break;
                case "Matematica":

                    Opcional.Matematica = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                case "Estudios Sociales":

                    Opcional.Sociales = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                case "Informatica":

                    Opcional.Informatica = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                case "Idiomas":

                    Opcional.Idiomas = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                case "Reconocimientos":

                    Opcional.Reconocimientos = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                default:
                    break;
            }
        }

        Informacion.Opcional = Opcional

        console.log(Informacion.Opcional);

        this.setState({
            Informacion
        })
    }

    sendUpdate = (e) => {
        e.preventDefault()

        const {Informacion} = this.state

        this.saveUpdate(Informacion)
    }

    UNSAFE_componentWillMount() {
        this.setState({
            Informacion: this.props.data
        })
    }

    render(){

        if (this.state.save) {
            return (<Redirect to="/Buscador"></Redirect>)
        }

        const {Ciencia, Lenguaje, Matematica, Sociales, Informatica, Idiomas, Reconocimientos} = this.props.data.Opcional
        
        return(
            <form onSubmit={this.sendUpdate}>
                <div className="form-group width-12">
                    <div className="sub-form">
                        Ciencia
                        <Creatable
                            className="basic-single sub-form"
                            classNamePrefix="Ciencia"
                            isMulti={true}
                            defaultValue={Ciencia}
                            placeholder="Ciencia *"
                            isClearable={true}
                            isSearchable={true}
                            name="Ciencia"
                            options={this.Ciencia}
                            onChange={this.changeState}
                        ></Creatable>
                        
                    </div>
                </div>
                <div className="form-group width-12">
                    <div className="sub-form">
                        Lenguaje
                        <Creatable
                            className="basic-single sub-form"
                            classNamePrefix="Lenguaje"
                            isMulti={true}
                            defaultValue={Lenguaje}
                            placeholder="Lenguaje *"
                            isClearable={true}
                            isSearchable={true}
                            name="Lenguaje"
                            options={this.Lenguaje}
                            onChange={this.changeState}
                        ></Creatable>
                        
                    </div>
                </div>
                <div className="form-group width-12">
                    <div className="sub-form">
                        Matemática
                        <Creatable
                            className="basic-single sub-form"
                            classNamePrefix="Matematica"
                            isMulti={true}
                            defaultValue={Matematica}
                            placeholder="Matemática *"
                            isClearable={true}
                            isSearchable={true}
                            name="Matematica"
                            options={this.Matematica}
                            onChange={this.changeState}
                        ></Creatable>
                        
                    </div>
                </div>
                <div className="form-group width-12">
                    <div className="sub-form">
                        Estudios Sociales
                        <Creatable
                            className="basic-single sub-form"
                            classNamePrefix="Estudios Sociales"
                            isMulti={true}
                            defaultValue={Sociales}
                            placeholder="Estudios Sociales *"
                            isClearable={true}
                            isSearchable={true}
                            name="Estudios Sociales"
                            options={this.Sociales}
                            onChange={this.changeState}
                        ></Creatable>
                        
                    </div>
                </div>
                <div className="form-group width-12">
                    <div className="sub-form">
                        Informática
                        <Creatable
                            className="basic-single sub-form"
                            classNamePrefix="Informatica"
                            isMulti={true}
                            defaultValue={Informatica}
                            placeholder="Informática *"
                            isClearable={true}
                            isSearchable={true}
                            name="Informatica"
                            options={this.Informatica}
                            onChange={this.changeState}
                        ></Creatable>
                        
                    </div>
                </div>
                <div className="form-group width-12">
                    <div className="sub-form">
                        Idiomas
                        <Creatable
                            className="basic-single sub-form"
                            classNamePrefix="Idiomas"
                            isMulti={true}
                            defaultValue={Idiomas}
                            placeholder="Idiomas *"
                            isClearable={true}
                            isSearchable={true}
                            name="Idiomas"
                            options={this.Idiomas}
                            onChange={this.changeState}
                        ></Creatable>
                        
                    </div>
                </div>
                <div className="cuadro width-full">
                    <div className="form-group width-12">
                        <div className="sub-form">
                            Reconocimientos obtenidos:
                            <Creatable
                                className="basic-single sub-form"
                                classNamePrefix="Reconocimientos"
                                isMulti={true}
                                defaultValue={Reconocimientos}
                                placeholder="Reconocimientos *"
                                isClearable={true}
                                isSearchable={true}
                                name="Reconocimientos"
                                onChange={this.changeState}
                            ></Creatable>
                            
                        </div>
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