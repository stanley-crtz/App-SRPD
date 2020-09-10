import React, {Component, Fragment} from 'react'
import ListMassage from './ListMassage'
import Mensajes from './Mensajes'
import Image from '../../Assets/Images/svg/iconImage.svg'
import Axios from 'axios'
import Global from '../../Global'
import JWT from '../../Class/JWT'
import Identificador from '../../Class/Identificador'

export default class ChatColumn extends Component {
    state = {
        message: [
            {
                Nombre: 'Bot',
                mensaje: 'Bienvenido al sistema de chat del SRP',
                img: null,
                fecha: '2020/01/01'
            },
            {
                Nombre: 'Bot',
                mensaje: 'Dar click a algún docente del lado izquierdo para empezar el chat',
                img: null,
                fecha: '2020/01/01'
            }
        ],
        sendMessage: {}
    }

    dataMensaje = React.createRef();

    constructor(props){
        super(props);
        this.connectSocket = null
    }

    sendMessage = (e) => {
        

        if (e.key === "Enter" && this.dataMensaje.current.value.trim() !== '') {
            var id = "";
            Identificador.validatorIdentificador() ? id= Identificador.getIdentificador(): id = this.props.salaChat._id;
            
            const data = {
                info: {
                    message: this.dataMensaje.current.value,
                    foto: null,
                    nombre: Identificador.validatorIdentificador() ? "Docente" : "SRP"
                },
                id
            };

            this.setState({
                message: this.state.message,
                sendMessage: data
            })
        }
    }

    clearMessage = (e) => {
        this.dataMensaje.current.value = '';

        this.setState({
            message: this.state.message,
            sendMessage: {},
            fileUpload: null
        })
    }

    fileChange = (event) => {

        const file = event.target.files[0];

        const formData = new FormData();

        formData.append(
            'file0',
            file,
            file.name
        )
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        Axios.post(Global.servidor + "saveImageChat", formData, {headers})
            .then((resp) => {
                var id = "";
                Identificador.validatorIdentificador() ? id= Identificador.getIdentificador(): id = this.props.salaChat._id;
                
                const data = {
                    info: {
                        message: '',
                        foto: resp.data.image,
                        nombre: Identificador.validatorIdentificador() ? "Docente" : "SRP"
                    },
                    id
                };

                this.setState({
                    message: this.state.message,
                    sendMessage: data
                })
            })
            .catch((err) => {
                console.log(err);
            })

        
    }

    render() {
        const message = this.state.message
        const MensajesList = message.map((data, i) => {
            return <ListMassage mensaje={data} key={i}></ListMassage>
        })

        return(
            <Fragment>
                <div className="title">
                    {
                        this.props.salaChat ? (
                            <label>{this.props.salaChat.Nombre}</label>
                        ) : (
                            <label>SRP</label>
                        )
                        
                    }
                    
                </div>
                <div className="messages-list">
                    {
                        this.props.salaChat ? (
                            <Mensajes id={this.props.salaChat._id} image={this.props.salaChat.PerfilImage} data={this.state.sendMessage} clear={this.clearMessage}></Mensajes>
                        ) : (
                            !Identificador.validatorIdentificador() ? (
                                MensajesList
                            ) : (
                                <Mensajes id={Identificador.getIdentificador()} data={this.state.sendMessage} clear={this.clearMessage}></Mensajes>
                            )
                            
                        )
                        
                    }
                </div>
                <div className="input-container">
                    <div id="div_file">
                        <img id="texto" src={Image} alt="icono"/>
                        <input type="file" id="btn_enviar" accept="image/*" onChange={this.fileChange}/>
                    </div>
                    <input className="msg-input" type="text" placeholder="Escribe un mensaje" ref={this.dataMensaje} onKeyPress={this.sendMessage}/>
                </div>
            </Fragment>
        )
    }
}