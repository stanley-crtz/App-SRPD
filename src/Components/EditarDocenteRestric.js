import React, {Component, Fragment} from 'react'
import SideBarEditar from './SideBarEditar'
import Axios from 'axios'
import Global from '../Global'
import ShowInfoGeneral from './ShowInfoGeneral'
import ShowInfoAcademica from './ShowInfoAcademica'
import ShowInfoPostgrado from './ShowInfoPostgrado'
import ShowInfoCarrera from './ShowInfoCarrera'
import ShowInfoOpcional from './ShowInfoOpcional'
import ShowInfoSeguridad from './ShowInfoSeguridad'
import JWT from '../Class/JWT'
import Identificador from '../Class/Identificador'
import NotAccess from './NotAccess'

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

        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        Axios.get(Global.servidor + "getDocente/" + Identificador.getIdentificador(), {headers})
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
                show = <ShowInfoGeneral data={this.state.data[0]} id={Identificador.getIdentificador()}></ShowInfoGeneral>
                break;
            case "Academica":
                show = <ShowInfoAcademica mod={false} data={this.state.data[0]} id={Identificador.getIdentificador()}></ShowInfoAcademica>
                break;
            case "Postgrado":
                show = <ShowInfoPostgrado mod={false} data={this.state.data[0]} id={Identificador.getIdentificador()}></ShowInfoPostgrado>
                break;
            case "Carrera":
                show = <ShowInfoCarrera mod={false} data={this.state.data[0]} id={Identificador.getIdentificador()}></ShowInfoCarrera>
                break;
            case "Opcional":
                show = <ShowInfoOpcional data={this.state.data[0]} id={Identificador.getIdentificador()}></ShowInfoOpcional>
                break;
            case "Seguridad":
                show = <ShowInfoSeguridad data={this.state.data[0]} id={Identificador.getIdentificador()}></ShowInfoSeguridad>
                break;
            default:
                break;
        }

        return (
            <Fragment>
                {
                    this.state.status === "cargando" ? (
                        <label>cargando...</label>
                    ) : this.state.status === "warning" ? (
                        <label>Esta direccion no existe</label>
                    ) : Identificador.validatorIdentificador() ? (
                        <div className="center">
                            <section id="content">
                                <h2 className="subheader">Configura tu cuenta</h2>
                                <div id="container-busqueda">
                                    <SideBarEditar
                                        change={this.changeShow}
                                        idDocente={Identificador.getIdentificador()}
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
                        <NotAccess></NotAccess>
                    )
                }
                
            </Fragment>
        )
    }
}