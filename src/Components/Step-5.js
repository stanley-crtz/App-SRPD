import React, {Component, Fragment} from 'react'
import Capacitado from '../JSON/Capacitado.json'
import Creatable from 'react-select/creatable'

export default class Step3 extends Component {

    constructor(props) {
        super(props)
        this.Ciencia = Capacitado.Ciencia;
        this.Lenguaje = Capacitado.Lenguaje;
        this.Matematica = Capacitado.Matematica;
        this.Sociales = Capacitado.Sociales;
        this.Informatica = Capacitado.Informatica;
        this.Idiomas = Capacitado.Idiomas;
    }

    state = {
        Ciencia: [],
        Lenguaje: [],
        Matematica: [],
        Sociales: [],
        Informatica: [],
        Idiomas: [],
        Reconocimientos: []
    }

    noRefresh = (e) => {
        e.preventDefault()
        this.props.recived(this.state, "Opcional")
        this.props.change(e, true, false);
    }

    Back = (e) => {
        e.preventDefault()
        this.props.change(e, false, true)
    }

    changeState = (e, type) => {

        var {Ciencia, Lenguaje, Matematica, Sociales, Informatica, Idiomas, Reconocimientos} = this.state;

        if (type) {
            
            switch (type.name) {
                case "Ciencia":

                    Ciencia = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                case "Lenguaje":

                    Lenguaje = type.action !== "clear" ? e !== null ? e : [] : []
                    
                    break;
                case "Matematica":

                    Matematica = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                case "Estudios Sociales":

                    Sociales = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                case "Informatica":

                    Informatica = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                case "Idiomas":

                    Idiomas = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                case "Reconocimientos":

                    Reconocimientos = type.action !== "clear" ? e !== null ? e : [] : []

                    break;
                default:
                    break;
            }

        }

        this.setState({
            Ciencia,
            Lenguaje,
            Matematica,
            Sociales,
            Informatica,
            Idiomas,
            Reconocimientos
        })
    }

    render(){

        const customStyles = {
            
            menuList: (provided, state)=> ({
                ...provided,
                maxHeight: 150

            })
          }

        return(
            <Fragment>
                <div className="step" id="step-5">
                    <form onSubmit={this.noRefresh} onReset={this.Back} action="" className="full-form">
                        <div className="step__header">
                            <h2 className="step__title">Información de opcional<small>(Paso 5)</small></h2>
                        </div>
                        <div className="step__body">

                            <p>Seleccione las materias en las que esta capacitado para impartir</p>
                            
                            <div className="form-group width-12">
                                <div className="sub-form">
                                    Ciencia
                                    <Creatable
                                        styles={customStyles}
                                        className="basic-single sub-form"
                                        classNamePrefix="Ciencia"
                                        isMulti={true}
                                        placeholder="Ciencia *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Ciencia"
                                        options={this.Ciencia}
                                        onChange={this.changeState}
                                    ></Creatable>
                                    
                                </div>
                            </div>

                            <div className="form-group width-12">
                                <div className="sub-form">
                                    Lenguaje
                                    <Creatable
                                        styles={customStyles}
                                        className="basic-single sub-form"
                                        classNamePrefix="Lenguaje"
                                        isMulti={true}
                                        placeholder="Lenguaje *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Lenguaje"
                                        options={this.Lenguaje}
                                        onChange={this.changeState}
                                    ></Creatable>
                                    
                                </div>
                            </div>

                            <div className="form-group width-12">
                                <div className="sub-form">
                                    Matematica
                                    <Creatable
                                        styles={customStyles}
                                        className="basic-single sub-form"
                                        classNamePrefix="Matematica"
                                        isMulti={true}
                                        placeholder="Matematica *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Matematica"
                                        options={this.Matematica}
                                        onChange={this.changeState}
                                    ></Creatable>
                                    
                                </div>
                            </div>

                            <div className="form-group width-12">
                                <div className="sub-form">
                                    Estudios Sociales
                                    <Creatable
                                        styles={customStyles}
                                        className="basic-single sub-form"
                                        classNamePrefix="Estudios Sociales"
                                        isMulti={true}
                                        placeholder="Estudios Sociales *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Estudios Sociales"
                                        options={this.Sociales}
                                        onChange={this.changeState}
                                    ></Creatable>
                                    
                                </div>
                            </div>

                            <div className="form-group width-12">
                                <div className="sub-form">
                                    Informatica
                                    <Creatable
                                        styles={customStyles}
                                        className="basic-single sub-form"
                                        classNamePrefix="Informatica"
                                        isMulti={true}
                                        placeholder="Informatica *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Informatica"
                                        options={this.Informatica}
                                        onChange={this.changeState}
                                    ></Creatable>
                                    
                                </div>
                            </div>

                            <div className="form-group width-12">
                                <div className="sub-form">
                                    Idiomas
                                    <Creatable
                                        styles={customStyles}
                                        className="basic-single sub-form"
                                        classNamePrefix="Idiomas"
                                        isMulti={true}
                                        placeholder="Idiomas *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Idiomas"
                                        options={this.Idiomas}
                                        onChange={this.changeState}
                                    ></Creatable>
                                    
                                </div>
                            </div>

                            <p>Añada los reconocimientos que considere</p>

                            <div className="form-group width-12">
                                <div className="sub-form">
                                    Reconocimientos obtenidos:
                                    <Creatable
                                        styles={customStyles}
                                        className="basic-single sub-form"
                                        classNamePrefix="Reconocimientos"
                                        isMulti={true}
                                        placeholder="Reconocimientos *"
                                        isClearable={true}
                                        isSearchable={true}
                                        name="Reconocimientos"
                                        onChange={this.changeState}
                                    ></Creatable>
                                    
                                </div>
                            </div>

                        </div>

                        <div className="step__footer">
                            <button type="reset" className="step__button step__button--back" data-to_step="4" data-step="5">Regresar</button>
                            <button type="submit" className="step__button step__button--next" data-to_step="6" data-step="5">Siguiente</button>
                        </div>

                    </form>
                </div>
                
            </Fragment>
        )
    }
}