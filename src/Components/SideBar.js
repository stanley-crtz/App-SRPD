import React, {Component, Fragment} from 'react'
import { Link } from 'react-router-dom';
import Moment from 'moment'
import Select from 'react-select'
import Global from '../Global';

export default class SideBar extends Component {

    constructor(props){
        super(props);

        this.CategoriaDocente = Global.CategoriasDocente;
        this.NivelDocente = Global.NivelesDocencia;
    }

    state = {NivelDocente: '', CategoriaDocente: ''}

    Nombre = React.createRef();
    Carrera = React.createRef();
    Edad = React.createRef();
    Egreso = React.createRef();

    search = (e) => {
        e.preventDefault();

        const {NivelDocente, CategoriaDocente} = this.state
        
        const DataSearch = {
            Nombre: this.Nombre.current.value.toLowerCase(),
            Carrera: this.Carrera.current.value.toLowerCase(),
            Edad: this.Edad.current.value.toLowerCase(),
            Egreso: (Moment(this.Egreso.current.value).format('L')).toLowerCase(),
            Nivel: NivelDocente.toLowerCase(),
            Categoria: CategoriaDocente.toLowerCase()
        }
        
        this.props.search(DataSearch);
    }

    changeState = (e, type) => {

        var {NivelDocente, CategoriaDocente} = this.state

        if (type) {
            
            switch (type.name) {
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
            NivelDocente,
            CategoriaDocente
        })

    }

    render() {

        return (
            <aside id="sidebar">
                <div id="search" className="sidebar-item">

                    {
                        this.props.search ? (
                            <Fragment>
                                <h3>Buscador</h3>
                                <p>Encuentra el docente que buscas</p>
                                <form onSubmit={this.search}>
                                    <div className="input-div">
                                        <div className="div">
                                                <h5>Nombre</h5>
                                                <input type="text" className="input buscador" ref={this.Nombre}/>
                                        </div>
                                    </div>
                                    <div className="input-div">
                                        <div className="div">
                                                <h5>Carrera</h5>
                                                <input type="text" className="input buscador" ref={this.Carrera}/>
                                        </div>
                                    </div>
                                    <div className="input-div">
                                        <div className="div">
                                                <h5>Edad</h5>
                                                <input type="number" className="input buscador" ref={this.Edad}/>
                                        </div>
                                    </div>
                                    <div className="input-div">
                                        <div className="div">
                                                <h5>Fecha de Egreso</h5>
                                                <input type="date" className="input buscador" ref={this.Egreso}/>
                                        </div>
                                    </div>
                                    <div className="input-div">
                                        <div className="div">
                                            <h5>
                                                Nivel
                                            </h5>
                                            <Select
                                                className="basic-single sub-form buscador"
                                                classNamePrefix="Nivel Docencia"
                                                defaultValue=""
                                                placeholder="Nivel Docencia *"
                                                isClearable={true}
                                                isSearchable={true}
                                                name="Nivel Docencia"
                                                options={this.NivelDocente}
                                                onChange={this.changeState}
                                            ></Select>
                                        </div>
                                    </div>
                                    <div className="input-div">
                                        <div className="div">
                                                <h5>Categoría</h5>
                                                <Select
                                                    className="basic-single sub-form buscador"
                                                    classNamePrefix="Categoria Docencia"
                                                    defaultValue=""
                                                    placeholder="Categoria Docencia *"
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    name="Categoria Docencia"
                                                    options={this.CategoriaDocente}
                                                    onChange={this.changeState}
                                                ></Select>
                                        </div>
                                    </div>
                                    <input type="submit" name="submit" value="Buscar" className="btn btn-full" />
                                </form>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <h3>Nueva Publicacion</h3>
                                <p>¿Deseas publicar algo nuevo para debatir?</p>
                                <Link to="/Foro/Nuevo" type="button" className="btn">Crear</Link>
                            </Fragment>
                        )
                    }
                        
                </div>
            </aside>
        )
    }
}