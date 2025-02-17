import baseService from 'src/modules/qcrud/_services/baseService'
import {store} from 'src/plugins/utils'

const notToSnakeCase = ['invoice_items', 'options'];
export default {
  sendN8NImg(data: any) {
    return new Promise((resolve, reject) => {
      const body = {
        ...data,
        attributes: {
          ...data.attributes,
          baseUrl: store.state.qsiteApp.baseUrl
        }
      }
      //Request
      baseService.post('apiRoutes.qaccounting.analyzeImg', body).then(response => {
        resolve(response);
      }).catch(error => reject(error));
    })
  },
  createItem(data: any, params = {}) {
    return new Promise((resolve, reject) => {
      //Params
      let requestParams = {
        notToSnakeCase: notToSnakeCase,
        ...params
      }
      //Request
      baseService.create('apiRoutes.qaccounting.purchases', data, requestParams).then(response => {
        resolve(true);
      }).catch(error => reject(error));
    })
  },
  updateItem(id, data: any, params = {}) {
    return new Promise((resolve, reject) => {
      //Params
      let requestParams = {
        notToSnakeCase: notToSnakeCase,
        ...params
      }
      //Request
      baseService.update('apiRoutes.qaccounting.purchases', id, data, requestParams).then(response => {
        resolve(true);
      }).catch(error => reject(error));
    })
  }
}
