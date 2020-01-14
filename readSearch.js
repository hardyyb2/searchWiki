const fetch = require(`node-fetch`)
module.exports = (url, callback) => {
  let arr = []
  fetch(url)
    .then(response => response.json())
    .then(response => {
      let arr2 = response.query.search
      arr2.forEach(search => {
        arr.push({
          title: search.title,
          pageid: search.pageid,
          snippet: search.snippet
        })
      })
      callback(arr)
    })
    .catch(error => console.log(error))
}
