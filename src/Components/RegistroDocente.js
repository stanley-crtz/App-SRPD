import React, {Component, Fragment} from 'react'
import Step1 from './Step-1'
import Step2 from './Step-2'
import Step3 from './Step-3'
import Step4 from './Step-4'
import Step5 from './Step-5'
import Step6 from './Step-6'
import Validacion from '../Validaciones/Validacion'
import Axios from 'axios'
import Global from '../Global'
import Swal from 'sweetalert2'
import JWT from '../Class/JWT'
import { Redirect } from 'react-router-dom'

export default class RegistroDocente extends Component {

    state = {
        update: false,
        Informacion: {
            Nombre: '',
            Genero: '',
            Estatus: '',
            FechaNac: '',
            DUI: '',
            Departamento: '',
            Municipio: '',
            Zona: '',
            Celular: '',
            Correo: '',
            PerfilImage: null,
            Academica: {
                Egreso: '',
                Universidad: '',
                Carrera: '',
                NivelDocente: '',
                CategoriaDocente: '',
                CUM: '',
                TituloImage: null,
                Postgrado: {
                    Universidad: '',
                    Postgrado: '',
                    TituloImage: null
                },
                OtraCarrera: {
                    Universidad: '',
                    Carrera: '',
                    TituloImage: null
                }
            },
            Opcional: {
                Ciencia: [],
                Lenguaje: [],
                Matematica: [],
                Sociales: [],
                Informatica: [],
                Idiomas: [],
                Reconocimientos: []
            },
            User: '',
            Password: '',
        },
        change : false
    }

    animation = (e, next, back) => {
        const form = e.target;

        const change = {
            step:  next ? form.querySelector('.step__button--next').dataset.step : form.querySelector('.step__button--back').dataset.step,
            to_Step: next ? form.querySelector('.step__button--next').dataset.to_step : form.querySelector('.step__button--back').dataset.to_step,
            next,
            back
        }
        Validacion.ChangeStep(change)
        
    }

    update = (e) => {
        this.setState({
            update: e,
            Informacion: this.state.Informacion,
            change: this.state.change
        })
    }

    saveStep = (e, type) => {
        
        var {Nombre, Genero, Estatus, FechaNac, DUI, Departamento, Municipio, Zona, Celular, PerfilImage, Correo, User, Password} = this.state.Informacion;
        var {Egreso, Universidad, Carrera, NivelDocente, CategoriaDocente, CUM, TituloImage} = this.state.Informacion.Academica;
        var Postgrado = {
            Universidad: this.state.Informacion.Academica.Postgrado.Universidad,
            Postgrado: this.state.Informacion.Academica.Postgrado.Postgrado,
            TituloImage: this.state.Informacion.Academica.Postgrado.TituloImage
        };
        var OtraCarrera = {
            Universidad: this.state.Informacion.Academica.OtraCarrera.Universidad,
            Carrera: this.state.Informacion.Academica.OtraCarrera.Carrera,
            TituloImage: this.state.Informacion.Academica.OtraCarrera.TituloImage
        };
        var {Ciencia, Lenguaje, Matematica, Sociales, Informatica, Idiomas, Reconocimientos} = this.state.Informacion.Opcional;
        
        var save = false;
        
        switch (type) {
            case "Personal":

                Nombre = e.Nombre
                Genero = e.Genero
                Estatus = e.Estatus
                FechaNac = e.FechaNac
                DUI = e.DUI
                Departamento = e.Departamento
                Municipio = e.Municipio
                Zona = e.Zona
                Celular = e.Celular
                Correo = e.Correo
                PerfilImage = e.PerfilImage

                break;
            case "Academica":

                Egreso = e.Egreso
                Universidad = e.Universidad
                Carrera = e.Carrera
                NivelDocente = e.NivelDocente
                CategoriaDocente = e.CategoriaDocente
                CUM = e.CUM
                TituloImage = e.TituloImage

                break;
            case "Postgrado":

                Postgrado = e

                break;
            case "OtraCarrera":

                OtraCarrera = e

                break;
            case "Opcional":

                Ciencia = e.Ciencia
                Lenguaje = e.Lenguaje
                Matematica = e.Matematica
                Sociales = e.Sociales
                Informatica = e.Informatica
                Idiomas = e.Idiomas
                Reconocimientos = e.Reconocimientos

                break;
            case "Cuenta":
                
                User = e.User
                Password = e.Password
                save = true

                break;
            default:
                break;
        }

        const Informacion = {
            Nombre, 
            Genero, 
            Estatus, 
            FechaNac, 
            DUI, 
            Departamento, 
            Municipio, 
            Zona, 
            Celular, 
            Correo,
            PerfilImage,
            Academica: {
                Egreso, 
                Universidad, 
                Carrera, 
                NivelDocente, 
                CategoriaDocente, 
                CUM,
                TituloImage,
                Postgrado,
                OtraCarrera
            },
            Opcional: {
                Ciencia, 
                Lenguaje, 
                Matematica, 
                Sociales, 
                Informatica, 
                Idiomas, 
                Reconocimientos
            },
            User, 
            Password
        }

        this.setState({
            
            update: this.state.update,
            Informacion,
            change: this.state.change

        })

        if (save) {
            this.saveRegister(Informacion)
        }



    }

    async saveRegister(data){

        Swal.fire({
            title: 'Registrando Docente...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        });
        
        data.PerfilImage = await this.saveImages(data.PerfilImage, "SavePerfil")
        data.Academica.TituloImage = await this.saveImages(data.Academica.TituloImage, "SaveTitulo")
        if (data.Academica.Postgrado.TituloImage) {
            data.Academica.Postgrado.TituloImage = await this.saveImages(data.Academica.Postgrado.TituloImage, "SavePosgrado")
        }
        if (data.Academica.OtraCarrera.TituloImage) {
            data.Academica.OtraCarrera.TituloImage = await this.saveImages(data.Academica.OtraCarrera.TituloImage, "SaveOtraCarrera")
        }

        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        Axios.post(Global.servidor + "newDocente", data, {headers})
            .then((resp) => {
                Swal.fire(
                    'Exito',
                    'El docente fue creado satisfactoriamente',
                    'success'
                ).then((resp) => {
                    if(resp.value){
                        this.setState({
                            change: true
                        })
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    async saveImages (file, ruta) {

        const formData = new FormData();

        formData.append(
            'file0',
            file,
            file.name
        )
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        return await Axios.post(Global.servidor + ruta, formData, {headers})
            .then((resp) => {
                return resp.data.image
            })
        

    }

    render() {

        if (this.state.change) {
            return (<Redirect to="/Buscador"></Redirect>)
        }

        return(
            <Fragment>
                <Step1 change={this.animation} recived={this.saveStep}></Step1>
                <Step2 change={this.animation} data={this.state.update} clear={this.update} recived={this.saveStep}></Step2>
                <Step3 change={this.animation} data={this.state.update} clear={this.update} recived={this.saveStep}></Step3>
                <Step4 change={this.animation} data={this.state.update} clear={this.update} recived={this.saveStep}></Step4>
                <Step5 change={this.animation} recived={this.saveStep}></Step5>
                <Step6 change={this.animation} recived={this.saveStep}></Step6>
            </Fragment>
        )
    }
}