import Axios from 'axios'
import Global from '../Global'
import JWT from '../Class/JWT';
class AsyncMethods {

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
}

export default new AsyncMethods()