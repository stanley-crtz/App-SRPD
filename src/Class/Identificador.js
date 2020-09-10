class Identificador {

    constructor(){

        const value_or_null = (document.cookie.match(/^(?:.*;)?\s*Docente\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
        this.Identificador = value_or_null !== null ? value_or_null : ''

    }

    setIdentificador(id){
        this.Identificador = id
        document.cookie = `Docente = ${id};`
    }

    clearIdentificador(){
        this.Identificador = ''
        document.cookie = `Docente = ;`
    }

    validatorIdentificador(){
        if (this.Identificador !== '') {
            return true
        } else {
            return false
        }
    }

    getIdentificador(){
        return this.Identificador
    }
}

export default new Identificador()