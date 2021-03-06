class JWT {

    constructor(){

        const value_or_null = (document.cookie.match(/^(?:.*;)?\s*JWT\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
        this.JWT = value_or_null !== null ? value_or_null : ''
    }

    setJWT(jwt){
        this.JWT = jwt;

        let date = new Date()
        date.setDate( date.getDate() + 13);
        
        document.cookie = `JWT = ${jwt}; expires = ${date.toUTCString()};`
    }

    clearJWT(){
        this.JWT = '';
        document.cookie = `JWT = ;`
    }

    validatorJWT(){
        if (this.JWT !== '') {
            return true
        } else {
            return false
        }
    }

    getJWT(){
        return this.JWT
    }
}

export default new JWT()