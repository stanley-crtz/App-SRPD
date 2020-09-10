import React, {Component, Fragment} from 'react'
import SideBar from '../Components/SideBar'
import Foros from '../Components/Foros'
import Axios from 'axios'
import Global from '../Global'
import HeaderComponent from '../Components/Header'
import JWT from '../Class/JWT'
import Identificador from '../Class/Identificador'

export default class Foro extends Component {

    state = {
        Datos: {
            recopilados: null,
            mostrar: null
        }
    }

    update = (event) => {
        this.getForo()
    }

    getForo = () => {
        
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        } 

        Axios.get(Global.servidor + 'getForos', { headers})
            .then((response) => {
                this.setState({
                    Datos: {
                        recopilados: response.data.Foros ,
                        mostrar: response.data.Foros
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            });

    }

    UNSAFE_componentWillMount(){
        this.getForo();
    }

    render(){
        return (
            <Fragment>
                <HeaderComponent></HeaderComponent>
                <div className="center">
                    <section id="content">

                        <div id="container-busqueda">
                            
                            {
                                Identificador.validatorIdentificador() && 
                                <SideBar></SideBar>
                            }
                            
                            <div className="container-resultados">
                                <Foros
                                    Data={this.state.Datos.mostrar}
                                    update={this.update}
                                ></Foros>
                            </div>

                        </div>
                        
                    </section>

                    <div className="clearfix"></div>
                </div>
            </Fragment>
        )
    }
}