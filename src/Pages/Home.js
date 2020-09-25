import React, { Fragment } from 'react'
// import Tarjeta from '../Components/Tarjeta'
import HeaderComponent from '../Components/Header'
import Identificador from '../Class/Identificador';
import CharLine from '../Components/ChartLine';
import EditarDocenteRestric from '../Components/EditarDocenteRestric'

export const Home = (props) => {
    
    return (
        <Fragment>
            <HeaderComponent></HeaderComponent>
            
            {
                Identificador.validatorIdentificador() ? (
                    <EditarDocenteRestric></EditarDocenteRestric>
                ) : (
                    <CharLine/>
                )
            }
        </Fragment>
    );
}