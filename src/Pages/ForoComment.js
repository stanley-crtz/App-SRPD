import React, {Component, Fragment} from 'react'
import HeaderComponent from '../Components/Header'
import Axios from 'axios'
import Global from '../Global'
import Moment from 'moment'
import ForoChatComment from '../Components/ForoChatComment'
import Image from '../Assets/Images/svg/iconImage.svg'
import JWT from '../Class/JWT'
import Identificador from '../Class/Identificador'

export default class ForoComment extends Component {

    constructor(props){
        super(props)
        this.connectSocket = Global.ConnectChat
    }

    dataMensaje = React.createRef();

    state = {
        informacion: null,
        comentarios: null
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

        Axios.post(Global.servidor + "saveImageForoComment", formData, { headers})
            .then((resp) => {
                var id = this.props.match.params.id;
                const data = {
                    info: {
                        message: '',
                        foto: resp.data.image,
                        idDocente: Identificador.getIdentificador()
                    },
                    id
                };

                this.connectSocket.emit("sendComment", data);
            })
            .catch((err) => {
                console.log(err);
            })

        
    }

    sendMessage = (e) => {
        

        if (e.key === "Enter" && this.dataMensaje.current.value.trim() !== '') {
            var id = this.props.match.params.id;
            const data = {
                info: {
                    message: this.dataMensaje.current.value,
                    foto: null,
                    idDocente: Identificador.getIdentificador()
                },
                id
            };

            this.connectSocket.emit("sendComment", data);

            this.dataMensaje.current.value = ""

        }
    }

    getForo = () => {
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }
        Axios.get(Global.servidor + "getForo/" + this.props.match.params.id, {headers})
            .then((resp) => {
                this.setState({
                    informacion: resp.data.Foros,
                    comentarios: this.state.comentarios
                })

            })
            .catch((err) => {
                console.log(err);
            })
    }

    searchComment = () => {
        this.connectSocket.emit("requestComment", this.props.match.params.id)
    }

    UNSAFE_componentWillMount() {
        this.getForo()
        this.searchComment()
        this.connectSocket.on("recivedComment", (data) => {
            console.log(data);
            this.setState({
                informacion: this.state.informacion,
                comentarios: data
            })

        })

        this.connectSocket.on("searchCMT", (data) => {
            this.searchComment()
        })
        
    }

    render() {
        var data;
        this.state.informacion != null ? data = this.state.informacion[0] : data = null;

        var Comentarios = null;
        if (this.state.comentarios !== null) {
            Comentarios = this.state.comentarios.map((value, i) => {
                return <ForoChatComment data={value} key={i}></ForoChatComment>
            })
        }
        else{
            Comentarios = <label></label>
        }
        
        return(
            <Fragment>
                <HeaderComponent></HeaderComponent>

                {
                    data !== null ? (
                        <div className="main-container-Foro">
                            <div className="Publish-Foro">
                                <div className="title">
                                    <div className="Tarjeta-Usuario">
                                        
                                        <img className="circle-img Tarjeta-circle-image" src={Global.servidor + "getImagePerfil/" + data.PerfilImage[0]} alt={data.Nombre[0]}/>
                                        <div className="Tarjeta-Publish">
                                            <h2>{data.Nombre[0]}</h2>
                                            <label>{Moment(data.datePublish).fromNow(Date.now)}</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="Foro-Data">
                                    <div className="Tarjeta-Info">
                                        <div className="Tarjeta-Name">
                                            <h2><u>{data.titulo}</u></h2>
                                        </div>
                                        <div className="Tarjeta-Description" dangerouslySetInnerHTML={{__html: data.descripcion}}>
                                            
                                        </div>
                                        {
                                            data.imagen !== null &&
                                            <div className="Tarjeta-Image-Foro">
                                                <img src={Global.servidor + "getImageForo/" + data.imagen} alt={data.titulo}></img>
                                            </div>
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="chat-Foro">
                                <div className="title">
                                    <label>Comentarios</label>
                                </div>
                                <div className="messages-list">
                                    {Comentarios}
                                </div>

                                {
                                    Identificador.validatorIdentificador() &&
                                    <div className="input-container">
                                        <div id="div_file">
                                            <img id="texto" src={Image} alt="icono"/>
                                            <input type="file" id="btn_enviar" accept="image/*" onChange={this.fileChange}/>
                                        </div>
                                        <input className="msg-input" type="text" placeholder="Escribe un mensaje" ref={this.dataMensaje} onKeyPress={this.sendMessage}/>
                                    </div>
                                }
                                
                            </div>
                        </div>
                    ) : (
                        <label>Cargando...</label>
                    )
                }
            </Fragment>
        )
    }
}