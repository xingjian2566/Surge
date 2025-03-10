!(async () => {
  const { requests = [] } = (await httpAPI('/v1/requests/active', 'GET')) || {}
  console.log(JSON.stringify(requests.map(i => i.rule), null, 2))
})()
  .catch(e => {
    console.log(e)
      })
  .finally(() => $done({}))


function httpAPI(path = '', method = 'POST', body = null) {
  return new Promise(resolve => {
    $httpAPI(method, path, body, result => {
      resolve(result)
    })
  })
}
