import React, {Component, Fragment} from 'react'
import HeaderComponent from '../Components/Header'
import SideBarEditar from '../Components/SideBarEditar'
import Axios from 'axios'
import Global from '../Global'
import ShowInfoGeneral from '../Components/ShowInfoGeneral'
import ShowInfoAcademica from '../Components/ShowInfoAcademica'
import ShowInfoPostgrado from '../Components/ShowInfoPostgrado'
import ShowInfoCarrera from '../Components/ShowInfoCarrera'
import ShowInfoOpcional from '../Components/ShowInfoOpcional'
import ShowInfoSeguridad from '../Components/ShowInfoSeguridad'
import JWT from '../Class/JWT'
import Identificador from '../Class/Identificador'

export default class EditarDocente extends Component {

    state = {
        status: 'cargando',
        data: [],
        show: "General"
    }

    changeShow = (e) => {
        const {status, data} = this.state;

        this.setState({
            status,
            data,
            show: e
        })
    }
    
    UNSAFE_componentWillMount(){
        const id = this.props.match.params.id;

        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        Axios.get(Global.servidor + "getDocente/" + id, {headers})
            .then((resp) => {
                this.setState({
                    status: resp.data.status,
                    data: resp.data.result ? resp.data.result : [],
                    show: this.state.show
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render(){

        var show = <label></label>

        switch (this.state.show) {
            case "General":
                show = <ShowInfoGeneral data={this.state.data[0]} id={this.props.match.params.id}></ShowInfoGeneral>
                break;
            case "Academica":
                show = <ShowInfoAcademica data={this.state.data[0]} id={this.props.match.params.id}></ShowInfoAcademica>
                break;
            case "Postgrado":
                show = <ShowInfoPostgrado data={this.state.data[0]} id={this.props.match.params.id}></ShowInfoPostgrado>
                break;
            case "Carrera":
                show = <ShowInfoCarrera data={this.state.data[0]} id={this.props.match.params.id}></ShowInfoCarrera>
                break;
            case "Opcional":
                show = <ShowInfoOpcional data={this.state.data[0]} id={this.props.match.params.id}></ShowInfoOpcional>
                break;
            case "Seguridad":
                show = <ShowInfoSeguridad data={this.state.data[0]} id={this.props.match.params.id}></ShowInfoSeguridad>
                break;
            default:
                break;
        }

        return (
            <Fragment>
                <HeaderComponent></HeaderComponent>
                
                {
                    this.state.status === "cargando" ? (
                        <label>cargando...</label>
                    ) : this.state.status === "warning" ? (
                        <label>Esta direccion no existe</label>
                    ) : !Identificador.validatorIdentificador() ?(
                        <div className="center">
                            <section id="content">
                                <h2 className="subheader">Editar Docente</h2>
                                <div id="container-busqueda">
                                    <SideBarEditar
                                        change={this.changeShow}
                                    ></SideBarEditar>
                                    <div className="container-resultados max-content">
                                        {
                                            this.state.data.length > 0 &&
                                            show
                                        }
                                    </div>
                                    
                                </div>
                                
                            </section>

                            <div className="clearfix"></div>
                        </div>
                    ) : (
                        <label>No tienes autorizacion</label>
                    )
                }
                
            </Fragment>
        )
    }
}