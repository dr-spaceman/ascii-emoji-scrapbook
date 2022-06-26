const OUTPUT = document.getElementById('output')

const STARTER_PACK = ['(˵ •̀ ᴗ - ˵ ) ✧', '¯\\_(ツ)_/¯', 'ᕕ( ᐛ )ᕗ']

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
if (isMac) {
  document.getElementById('kbd__paste').innerHTML = '⌘+V'
}

function htmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getScraps() {
  let str = localStorage.getItem('scraps')
  if (str) {
    let hopefullyArray = JSON.parse(str)
    if (!Array.isArray(hopefullyArray)) {
      throw new Error('Local storage is not an array; Data possibly corrupt')
    }

    return new Set(hopefullyArray)
  }

  return new Set()
}

function setScraps(scraps) {
  localStorage.setItem('scraps', JSON.stringify(Array.from(scraps)))
}

function setOutput(scraps) {
  OUTPUT.innerHTML = ''
  scraps.forEach(scrap => {
    const button = document.createElement('button')
    button.className = 'copyable'
    button.innerHTML = htmlEntities(scrap)
    button.dataset.pure = scrap
    OUTPUT?.append(button)
  })
}

let scraps = getScraps()
if (scraps.size === 0) {
  scraps = new Set(STARTER_PACK)
  setScraps(scraps)
}
setOutput(scraps)

document.addEventListener('paste', event => {
  event.preventDefault()
  const paste = (event.clipboardData || window.clipboardData).getData('text')
  let scraps = getScraps()
  scraps.add(paste)
  setScraps(scraps)
  setOutput(scraps)
})

let shiftPressed = false
document.addEventListener('keydown', event => {
  if (event.key === 'Shift') {
    shiftPressed = true
    OUTPUT.classList.add('delete-warn')
  }
})
document.addEventListener('keyup', event => {
  if (event.key === 'Shift') {
    shiftPressed = false
    OUTPUT.classList.remove('delete-warn')
  }
})

OUTPUT.addEventListener('click', event => {
  if (event.target.classList.contains('copyable')) {
    if (shiftPressed) {
      let remove = event.target.dataset.pure
      console.log(`removing ${remove}`)
      let scraps = getScraps()
      scraps.delete(remove)
      setScraps(scraps)
      setOutput(scraps)
    } else {
      let copy = event.target.innerHTML
      navigator.clipboard.writeText(copy)
    }
  }
})
