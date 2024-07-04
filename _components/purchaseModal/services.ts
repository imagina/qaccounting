import baseService from 'src/modules/qcrud/_services/baseService'

export default {
   createItem(data: any, params = {}){
     return new Promise((resolve, reject) => {
       //Params
       let requestParams = {
         notToSnakeCase: [],
         ...params
       }
       //Request
       baseService.create('apiRoutes.q.blocks', data, requestParams).then(response => {
         resolve(true);
       }).catch(error => reject(error));
     })
   }
}
