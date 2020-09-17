import React, {Component, Fragment} from 'react'
import User from '../Components/Chat/User'
import ChatColumn from '../Components/Chat/ChatColumn'
import Axios from 'axios'
import Global from '../Global'
import HeaderComponent from '../Components/Header'
import JWT from '../Class/JWT'
import Identificador from '../Class/Identificador'

export default class Bandeja extends Component {

    constructor(props){
        super(props)
        this.connectSocket = Global.ConnectChat
    }

    state = {
        Docentes: {
            recopilados: null,
            mostrar: null
        },
        Docente: null
    }

    search = React.createRef();

    getDocentes = () => {
        
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        } 

        Axios.get(Global.servidor + 'getDocentes', { headers})
            .then((response) => {
                this.setState({
                    Docentes: {
                        recopilados: response.data.Docentes,
                        mostrar: response.data.Docentes
                    },
                    Docente: this.state.Docente
                })
            })
            .catch((err) => {
                console.log(err);
            });

    }

    docenteSelection = (event) => {
        this.setState({
            Docentes: this.state.Docentes,
            Docente: event
        })
    }

    searchDocentes = (event) => {
        if (event.key === "Enter") {

            const NombreSearch = this.search.current.value.toLowerCase();

            const ArrayFilter = this.state.Docentes.recopilados.filter((val, i) => {

                const Nombre =  val.Nombre.toLowerCase()
                
                if (Nombre.indexOf(NombreSearch) !== -1 ) {
                    return true;
                }
                else{
                    return false;
                }
            });
            
            this.setState({
                Docentes: {
                    recopilados: this.state.Docentes.recopilados,
                    mostrar: ArrayFilter
                },
                Docente: this.state.Docente
            });
        }
        
    }

    UNSAFE_componentWillMount(){
        this.getDocentes()


    }

    componentDidMount(){
        this.connectSocket.on("searchMSG", (data) => {
            console.log("Cambio");
            this.getDocentes();
        })
    }

    render(){
        var docentes = null;
        if (this.state.Docentes.mostrar !== null && !this.state.Docentes.mostrar) {
            docentes = this.state.Docentes.mostrar.map((value, i) => {
                return <User docente={value} docenteSelection={this.docenteSelection} key={i}></User>
            })
        }
        else{
            docentes = <label></label>
        }
        return (
            <Fragment>
                <HeaderComponent></HeaderComponent>
                <div className="main-container">

                    {
                        !Identificador.validatorIdentificador() &&
                        <div className="users-column">
                            <div className="title">
                                <div className="search-container">
                                    <i className="fas fa-search"></i>
                                    <input type="text" className="input-search" placeholder="Buscar...." ref={this.search} onKeyPress={this.searchDocentes}/>
                                </div>
                            </div>
                            <div className="users">
                                {docentes}
                                
                            </div>
                        </div>
                    }
                    
                    <div className="chat-column">
                        <ChatColumn salaChat={this.state.Docente}></ChatColumn>
                    </div>
                </div>
            </Fragment>
        )
    }
}