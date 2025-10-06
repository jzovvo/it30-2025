import {Util} from 'css-gum'

;(() => {
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('div').style.fontSize = Util.cssPxToVw(1000)(100)
  })
})()
