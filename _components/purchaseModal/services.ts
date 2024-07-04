import baseService from 'src/modules/qcrud/_services/baseService'
import {store} from 'src/plugins/utils'
import appConfig from 'src/setup/app'

export default {
  sendN8NImg(data: any) {
    return new Promise((resolve, reject) => {
      const route = `${store.getSetting('isite::n8nBaseUrl')}/accounting/img`

      const body = {
        ...data,
        attributes: {
          ...data.attributes,
          baseUrl: appConfig.baseUrl
        }
      }
      //Request
      baseService.post(route, body).then(response => {

        console.warn("Response: ",response)
        resolve(response);
      }).catch(error => reject(error));
    })
  },
  createItem(data: any, params = {}) {
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
