import React, { useState } from 'react';

function SideBarEditar(props) {
  // Declara una nueva variable de estado, que llamaremos "count".
    const [General, setGeneral] = useState(true);
    const [Academica, setAcademica] = useState(false);
    const [Postgrado, setPostgrado] = useState(false);
    const [Carrera, setCarrera] = useState(false);
    const [Opcional, setOpcional] = useState(false);
    const [Seguridad, setSeguridad] = useState(false);

    var changeState = (change) => {
        resetState()
        switch (change) {
            case "General":
                setGeneral(true);
                props.change(change)
                break;
            case "Academica":
                setAcademica(true);
                props.change(change)
                break;
            case "Postgrado":
                setPostgrado(true);
                props.change(change)
                break;
            case "Carrera":
                setCarrera(true);
                props.change(change)
                break;
            case "Opcional":
                setOpcional(true);
                props.change(change)
                break;
            case "Seguridad":
                setSeguridad(true);
                props.change(change)
                break;
            default:
                break;
        }
    }

    var resetState = () => {
        setGeneral(false)
        setAcademica(false)
        setPostgrado(false)
        setCarrera(false)
        setOpcional(false)
        setSeguridad(false)
    }

    return (
        <aside id="sidebar">
            <div id="search" className="sidebar-item">
                <div className="flex-colum">
                    <input type="button" className={"sub-menu" + (General ? " sub-menu-active" : '')} value="General" onClick={(e) => {
                        changeState("General")
                    }}></input>
                    <input type="button" className={"sub-menu" + (Academica ? " sub-menu-active" : '')} value="Academica" onClick={(e) => {
                        changeState("Academica")
                    }}></input>
                    <input type="button" className={"sub-menu" + (Postgrado ? " sub-menu-active" : '')} value="Postgrado" onClick={(e) => {
                        changeState("Postgrado")
                    }}></input>
                    <input type="button" className={"sub-menu" + (Carrera ? " sub-menu-active" : '')} value="Otra Carrera" onClick={(e) => {
                        changeState("Carrera")
                    }}></input>
                    <input type="button" className={"sub-menu" + (Opcional ? " sub-menu-active" : '')} value="Capacitado" onClick={(e) => {
                        changeState("Opcional")
                    }}></input>
                    <input type="button" className={"sub-menu" + (Seguridad ? " sub-menu-active" : '')} value="Seguridad" onClick={(e) => {
                        changeState("Seguridad")
                    }}></input>
                </div>
            </div>
        </aside>
    );
}

export default SideBarEditar