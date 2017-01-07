import createElementClass from 'create-element-class'
import timeago from 'timeago.js'

export default createElementClass({
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.rendered) { this.updateRendering() }
  },

  connectedCallback() {
    this.timeElement = this.querySelector('time')
    if (!this.timeElement) {
      console.warn('<time> element missing in shaf-timeago')
      return
    }
    this.timeElement.style.display = 'none'
    this.timeagoInstance = new timeago()
    this.span = document.createElement('span')
    this.appendChild(this.span)

    if (MutationObserver) {
      this.observer = new MutationObserver((mutations) => {
        this.updateRendering()
      })
      const observerConfig = { attributes: true, childList: true, characterData: true, subtree: true }
      this.observer.observe(this.timeElement, observerConfig)
    }

    this.updateRendering()
  },

  updateRendering() {
    this.timeagoInstance.cancel()
    this.span.setAttribute('datetime', trim(this.timeElement.textContent))
    const language = window.navigator.userLanguage || window.navigator.language
    this.timeagoInstance.render(this.span, language)
  }
})

function trim (string) {
  return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}
