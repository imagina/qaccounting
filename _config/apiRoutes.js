const moduleName = 'iaccounting';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  purchases: `${urlBase}/purchases`,
  origins: `${urlBase}/origins`,
  mappings: `${urlBase}/mappings`,
  providers: `${urlBase}/providers`,
  paymentMethods: `${urlBase}/paymentMethods`,
  documentTypes: `${urlBase}/documentTypes`,
  documentTypePeople: `${urlBase}/documentTypePeople`,
  kindPeople: `${urlBase}/kindPeople`,
  analyzeImg: `${urlBase}/purchases/analyze-img`,
}
