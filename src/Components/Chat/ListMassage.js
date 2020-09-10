import React, {Component, Fragment} from 'react'
import Logo from '../../Assets/Images/jpeg/Logo.jpeg'
import Moment from 'moment'
import 'moment/locale/es'
import Global from '../../Global'
import Identificador from '../../Class/Identificador'

export default class ListMassage extends Component {
    state = {
        mensaje: {}
    }
    UNSAFE_componentWillMount(){
        this.setState({
            mensaje: this.props.mensaje
        })
    }

    render(){
        return(
            <Fragment>
                {
                    this.state.mensaje.Nombre === "Bot" ? (
                        <div className="container-chat-others">
                            <div className="others">
                                <img className="circle-img" src={Logo} alt=""/>
                                <div className="chat-bubble chat-others">
                                        {this.state.mensaje.mensaje}
                                </div>
                                
                            </div>
                            
                        </div>
                    ): (

                        !Identificador.validatorIdentificador() ? (
                            this.state.mensaje.Nombre === "SRP" ? (
                                <div className="my">
                                    <div className="chat-bubble chat-my">
                                        {
                                            this.state.mensaje.foto !== null ? (
                                                <img className="image-chat" src={Global.servidor + "getImageChat/" + this.state.mensaje.foto} alt="fotoChat" />
                                            ) : (
                                                this.state.mensaje.mensaje
                                            )
                                        }
                                    </div>
                                </div>
                            ): (
                                <div className="container-chat-others">
                                    <div className="others">
                                        <img className="circle-img" src={Global.servidor + "getImagePerfil/" + this.props.image} alt=""/>
                                        <div className="chat-bubble chat-others">
                                            {
                                                this.state.mensaje.foto !== null ? (
                                                    <img className="image-chat" src={Global.servidor + "getImageChat/" + this.state.mensaje.foto} alt="fotoChat" />
                                                ) : (
                                                    this.state.mensaje.mensaje
                                                )
                                            }
                                        </div>
                                        
                                        
                                    </div>
                                    <div className="fecha">
                                        <label >{Moment(this.state.mensaje.fecha).fromNow(Date.now)}</label>
                                    </div>
                                </div>
                            )
                        ) : (
                            this.state.mensaje.Nombre !== "SRP" ? (
                                <div className="my">
                                    <div className="chat-bubble chat-my">
                                            {
                                                this.state.mensaje.foto !== null ? (
                                                    <img className="image-chat" src={Global.servidor + "getImageChat/" + this.state.mensaje.foto} alt="fotoChat" />
                                                ) : (
                                                    this.state.mensaje.mensaje
                                                )
                                            }
                                    </div>
                                </div>
                            ): (
                                <div className="container-chat-others">
                                    <div className="others">
                                        <img className="circle-img" src={Logo} alt=""/>
                                        <div className="chat-bubble chat-others">
                                            {
                                                this.state.mensaje.foto !== null ? (
                                                    <img className="image-chat" src={Global.servidor + "getImageChat/" + this.state.mensaje.foto} alt="fotoChat" />
                                                ) : (
                                                    this.state.mensaje.mensaje
                                                )
                                            }
                                        </div>
                                        
                                        
                                    </div>
                                    <div className="fecha">
                                        <label >{Moment(this.state.mensaje.fecha).fromNow(Date.now)}</label>
                                    </div>
                                </div>
                            )
                        )
                        
                    )
                    
                }
                
                
            </Fragment>
        )
    }
}