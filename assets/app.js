/* global $,dateFns */
function fallbackCopyTextToClipboard (text) {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
    console.log('Fallback: Copying text command was ' + msg)
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}
function copyTextToClipboard (text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Async: Copying to clipboard was successful!')
    },
    function (err) {
      console.error('Async: Could not copy text: ', err)
    }
  )
}
function generateStub (ev) {
  ev.preventDefault()
  const tags = $('input[name=tags]')[0].value.split(/,\s*/)
  const today = Date.now()
  const date =
    dateFns.format(today, 'yyyyMMdd') + 'T' + dateFns.format(today, 'HHmmss')
  const stubTitle = $('input[name=title]')[0]
    .value.toLowerCase()
    .replace(/[^A-Za-z0-9]/g, '-')
  const tagString = tags.length === 0 ? '' : '__' + tags.join('_')
  const fileName = `${date}--${stubTitle}${tagString}.org`

  $('input[name=filename]')[0].disabled = false
  $('input[name=filename]')[0].value = fileName

  const fileStub = `#+title:      ${$('input[name=title]')[0].value}
#+date:       [${dateFns.format(today, 'yyyy-MM-dd E HH:mm')}]
#+filetags:   :${tags.join(':')}:
#+identifier: ${date}

`
  $('textarea[name=stub]')[0].disabled = false
  $('textarea[name=stub]')[0].value = fileStub
  return false
}

$(document).ready(function () {
  $('form').on('submit', generateStub)
  $('#cpy-fn').on('click', function () {
    copyTextToClipboard($('input[name=filename]')[0].value)
  })
  $('#cpy-cn').on('click', function () {
    copyTextToClipboard($('textarea[name=stub]')[0].value)
  })
})
