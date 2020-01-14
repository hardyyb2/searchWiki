//constants and variables
const { ipcRenderer } = require(`electron`)
let searchValue = document.querySelector(`.search-text`)
let previousSearch = ''

//Set online offline bar at bottom
const setStatus = status => {
  const offlineHtml = `<div class="net-detection offline">You are Offline. Cannot continue with search. </div>`
  const onlineHtml = `<div class="net-detection online">You are Online. Go for  your search</div>`
  if (status == true) {
    $(`.detection`).html(onlineHtml)
    setTimeout(() => {
      $(`.detection`)
        .slideUp(500)
        .remove()
    }, 3000)
  } else {
    $(`.detection`).html(offlineHtml)
  }
}

//check navigator on app open
navigator.onLine ? true : setStatus(false)

//online check
window.addEventListener(`online`, e => {
  setStatus(true)
})
//offline check
window.addEventListener(`offline`, e => {
  setStatus(false)
})

//add Hover on search results
const addHover = () => {
  $(`.results`).hover(
    function() {
      $(this).addClass(`active`)
    },
    function() {
      $(this).removeClass(`active`)
    }
  )
}

//show search results
const showData = (item, isNew) => {
  localStorage.setItem(`item-data`, JSON.stringify(item))
  if (isNew) {
    item.forEach(elem =>
      $(`.search-results`).append(
        `<a href="http://en.wikipedia.org/?curid=${elem.pageid}" target="_blank" class="results"><h4>${elem.title}</h4><h5>${elem.snippet}</h5></a>`
      )
    )
    addHover()
  } else {
    //retrieve old serach if any
    itemDataArr.forEach(elem =>
      $(`.search-results`).append(
        `<a href="http://en.wikipedia.org/?curid=${elem.pageid}" target="_blank" class="results"><h4>${elem.title}</h4><h5>${elem.snippet}</h5></a>`
      )
    )
    addHover()
    let searchKey = JSON.parse(localStorage.getItem(`search-key`))
    console.log(localStorage.getItem(`search-key`))
    $(`.search-text`).val(searchKey)
  }
}

//retrieve old search data if any
let itemDataArr = JSON.parse(localStorage.getItem(`item-data`)) || []
showData(itemDataArr, false)

//random article search
$(`.random-article`).click(() => {
  window.open(`https://en.wikipedia.org/wiki/Special:Random`)
  console.log(`clicked`)
})

//Enter on search bar
searchValue.addEventListener(`keydown`, e => {
  if (e.key === `Enter`) {
    localStorage.setItem(`search-key`, JSON.stringify($(`.search-text`).val()))
    searchIt()
  }
})

//search function
function searchIt() {
  if (
    $(`.search-text`)
      .val()
      .trim() === ''
  ) {
  } else if (
    previousSearch !==
    $(`.search-text`)
      .val()
      .trim()
  ) {
    //remove old searches
    $(`.results`).remove()
    //fetch data from wiki api
    let url = 'https://en.wikipedia.org/w/api.php'
    let params = {
      action: 'query',
      list: 'search',
      srsearch: `${$(`.search-text`)
        .val()
        .trim()}`,
      format: 'json'
    }

    url = url + '?origin=*'
    Object.keys(params).forEach(function(key) {
      url += '&' + key + '=' + params[key]
    })

    //send data to main process
    ipcRenderer.send(`search-item`, url)

    //receive search data from main process

    ipcRenderer.on(`search-item-success`, async function(e, item) {
      await showData(item, true)
    })

    //set previous search
    previousSearch = $(`.search-text`)
      .val()
      .trim()
  }
}
