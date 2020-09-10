import React, {Component} from 'react'

export default class Paginador extends Component {

    render(){
        return (
            <div className="form-register__header">
                <ul className="progressbar">
                    <li className="progressbar__option active"><label className="black">General</label></li>
                    <li className="progressbar__option"><label className="black">Academica</label></li>
                    <li className="progressbar__option"><label className="black">Postgrado</label></li>
                    <li className="progressbar__option"><label className="black">Otra Carrera</label></li>
                    <li className="progressbar__option"><label className="black">Opcional</label></li>
                    <li className="progressbar__option"><label className="black">Cuenta</label></li>
                </ul>
                <h1 className="form-register__title">Registro de Docente</h1>
            </div>
        )
    }
}