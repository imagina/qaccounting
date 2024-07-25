const moduleName = 'iaccounting';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  purchases: `${urlBase}/purchases`,
  apikeys: `${urlBase}/apikeys`,
  mappings: `${urlBase}/mappings`,
  providers: `${urlBase}/providers`
}
