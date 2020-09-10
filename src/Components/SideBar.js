import React, {Component, Fragment} from 'react'
import { Link } from 'react-router-dom';
import Moment from 'moment'

export default class SideBar extends Component {

    Nombre = React.createRef();
    Carrera = React.createRef();
    Edad = React.createRef();
    Egreso = React.createRef();
    Nivel = React.createRef();
    Categoria = React.createRef();

    search = (e) => {
        e.preventDefault();
        
        const DataSearch = {
            Nombre: this.Nombre.current.value.toLowerCase(),
            Carrera: this.Carrera.current.value.toLowerCase(),
            Edad: this.Edad.current.value.toLowerCase(),
            Egreso: (Moment(this.Egreso.current.value).format('L')).toLowerCase(),
            Nivel: this.Nivel.current.value.toLowerCase(),
            Categoria: this.Categoria.current.value.toLowerCase()
        }
        
        this.props.search(DataSearch);
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
                                                <h5>Nivel</h5>
                                                <input type="text" className="input buscador" ref={this.Nivel}/>
                                        </div>
                                    </div>
                                    <div className="input-div">
                                        <div className="div">
                                                <h5>Categoría</h5>
                                                <input type="text" className="input buscador" ref={this.Categoria}/>
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