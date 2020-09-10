import React, {Component, Fragment} from 'react'
import SideBar from '../Components/SideBar'
import HeaderComponent from '../Components/Header'
import Docentes from '../Components/Docentes'
import Axios from 'axios'
import Global from '../Global'
import Moment from 'moment'
import JWT from '../Class/JWT'

export default class Buscador extends Component {

    state = {
        Datos: {
            recopilados: null,
            mostrar: null
        }
    }

    getDocentes = () => {
        
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        } 

        Axios.get(Global.servidor + 'getDocentes', { headers})
            .then((response) => {
                this.setState({
                    Datos: {
                        recopilados: response.data.Docentes,
                        mostrar: response.data.Docentes
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            });

    }

    searchDocentes = (event) => {
        
        const ArrayFilter = this.state.Datos.recopilados.filter((val, i) => {
            
            const Nombre =  val.Nombre.toLowerCase()
            const FechaNac = (Moment().diff(val.FechaNac, 'years')).toString()
            const Carrera = val.Academica.Carrera.toLowerCase()
            const Categoria = val.Academica.CategoriaDocente.toLowerCase()
            const Egreso = (Moment(val.Academica.Egreso).add(1, "days").format('L')).toString()
            const Nivel = val.Academica.NivelDocente.toLowerCase()

            event.Egreso = event.Egreso !== "fecha invalida" ? event.Egreso : ''
            
            if (Nombre.indexOf(event.Nombre) !== -1 && FechaNac.indexOf(event.Edad) !== -1  && Carrera.indexOf(event.Carrera) !== -1 && Categoria.indexOf(event.Categoria) !== -1 && Egreso.indexOf(event.Egreso) !== -1 && Nivel.indexOf(event.Nivel) !== -1) {
                return true;
            }
            else{
                return false;
            }
        });
        
        this.setState({
            Datos: {
                recopilados: this.state.Datos.recopilados,
                mostrar: ArrayFilter
            }
        });

    }

    delete = (e) => {
        this.getDocentes()
    }

    UNSAFE_componentWillMount(){
        this.getDocentes();
    }

    render() {
        return (
            <Fragment>
                <HeaderComponent></HeaderComponent>
                <div className="center">
                    <section id="content">
                        <h2 className="subheader">Resultados de busqueda</h2>
                        <div id="container-busqueda">
                            <SideBar
                                search={this.searchDocentes}
                            ></SideBar>
                            <div className="container-resultados">
                                <Docentes
                                    Data={this.state.Datos.mostrar}
                                    delete={this.delete}
                                ></Docentes>
                            </div>
                            
                        </div>
                        
                    </section>

                    <div className="clearfix"></div>
                </div>
            </Fragment>
            
        )
    }
}