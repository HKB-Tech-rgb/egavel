import Api from '@/services/Api.js'

export default{
    register(creds){
        return Api.post('arbitregister', creds);
    },
    login(creds){
        return Api.post('arbitLogin', creds);
    }
}