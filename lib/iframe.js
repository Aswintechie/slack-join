import dom from './vd-wrapper.js'
import { readFileSync as read } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const logo = read(join(__dirname, 'assets', 'slack.svg')).toString('base64')
const js = read(join(__dirname, 'assets', 'iframe.js')).toString()
const css = read(join(__dirname, 'assets', 'iframe-button.css')).toString()

export default function iframe ({ path, active, total, large }){
  let str = ''
  if (active) str = `${active}/`
  if (total) str += total
  if (!str.length) str = '–'

  let opts = { 'class': large ? 'slack-btn-large' : '' }
  let div = dom('span.slack-button', opts,
    dom('a.slack-btn href=/ target=_blank',
      dom('span.slack-ico'),
      dom('span.slack-text', 'Slack')
    ),
    dom('a.slack-count href=/ target=_blank', str),
    dom('style', css),
    dom.style().add('.slack-ico', {
      'background-image': `url(data:image/svg+xml;base64,${logo})`
    }),
    dom('script', `
      data = {};
      data.path = ${JSON.stringify(path)};
      data.total = ${total != null ? total : 'null'};
      data.active = ${active != null ? active : 'null'};
    `),
    dom('script', js)
  )

  return div
}

function gradient (css, sel, params){
  ['-webkit-', '-moz-', ''].forEach(p => {
    css.add(sel, {
      'background-image': `${p}linear-gradient(${params})`
    })
  })
}
