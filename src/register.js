import React, { Component } from 'react'
import addons from '@kadira/storybook-addons'
import Prism from 'prismjs'
import styled from 'styled-components'
import CopyToClipboard from 'react-copy-to-clipboard'

const css = `/**
 * prism.js default theme for JavaScript, CSS and HTML
 * Based on dabblet (http://dabblet.com)
 * @author Lea Verou
 */

code[class*="language-"],
pre[class*="language-"] {
	color: black;
	background: none;
	text-shadow: 0 1px white;
	font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
	text-align: left;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
	line-height: 1.5;

	-moz-tab-size: 4;
	-o-tab-size: 4;
	tab-size: 4;

	-webkit-hyphens: none;
	-moz-hyphens: none;
	-ms-hyphens: none;
	hyphens: none;
}

pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
	text-shadow: none;
	background: #b3d4fc;
}

pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
code[class*="language-"]::selection, code[class*="language-"] ::selection {
	text-shadow: none;
	background: #b3d4fc;
}

@media print {
	code[class*="language-"],
	pre[class*="language-"] {
		text-shadow: none;
	}
}

/* Code blocks */
pre[class*="language-"] {
	padding: 1em;
	margin: .5em 0;
	overflow: auto;
}

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
	background: #f5f2f0;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
	padding: .1em;
	border-radius: .3em;
	white-space: normal;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
	color: slategray;
}

.token.punctuation {
	color: #999;
}

.namespace {
	opacity: .7;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
	color: #905;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
	color: #690;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
	color: #a67f59;
	background: hsla(0, 0%, 100%, .5);
}

.token.atrule,
.token.attr-value,
.token.keyword {
	color: #07a;
}

.token.function {
	color: #DD4A68;
}

.token.regex,
.token.important,
.token.variable {
	color: #e90;
}

.token.important,
.token.bold {
	font-weight: bold;
}
.token.italic {
	font-style: italic;
}

.token.entity {
	cursor: help;
}
`
const prismStyle = document.createElement('style')
prismStyle.innerHTML = css
document.body.appendChild(prismStyle)

export class JSX extends Component {
  constructor(...args) {
    super(...args)

    this.state = {}
    this.onAddJSX = this.onAddJSX.bind(this)
    this.stopListeningOnStory = () => this.setState({})
  }

  componentDidMount() {
    const { channel, api } = this.props

    channel.on('kadira/jsx/add_jsx', this.onAddJSX)
    api.onStory(this.setCurrent.bind(this))
  }

  componentWillUnmount() {
    const { channel } = this.props

    if (this.stopListeningOnStory) {
      this.stopListeningOnStory()
    }
    channel.removeListener('kadira/jsx/add_jsx', this.onAddJSX)
  }

  setCurrent(kind, story) {
    this.setState({ current: { kind, story } })
  }

  onAddJSX(kind, story, jsx) {
    const state = this.state

    if (typeof state[kind] === 'undefined') {
      state[kind] = {}
    }
    state[kind][story] = jsx
    this.setState(state)
  }
  _copy() {
    if (
      typeof this.state.current !== 'undefined' &&
      typeof this.state[this.state.current.kind] !== 'undefined'
    ) {
      Copy.copy(this.state[current.kind][current.story])
    }
  }
  render() {
    if (
      typeof this.state.current !== 'undefined' &&
      typeof this.state[this.state.current.kind] !== 'undefined'
    ) {
      const current = this.state.current
      const code = this.state[current.kind][current.story]
      const jsx = Prism.highlight(code, Prism.languages.html)

      return (
        <div>
          <Copied text={code}>
            <button>Copy</button>
          </Copied>
          <Code dangerouslySetInnerHTML={{ __html: jsx }} />
        </div>
      )
    } else {
      return <Code />
    }
  }
}
addons.register('kadira/jsx', api => {
  addons.addPanel('kadira/jsx/panel', {
    title: 'JSX',
    render: () => <JSX channel={addons.getChannel()} api={api} />,
  })
})

const Copied = styled(CopyToClipboard)`
  position: absolute;
  top: 17px;
  left: 54px;
  outline: none;
  border: 1px solid #A7A7A7;
  border-radius: 2px;
  color: #A7A7A7;
  background-color: transparent;
  cursor: pointer;
  transition: all .3s ease;
  &:hover {
    color: #777777;
    border: 1px solid #777777;
  }
  &:active {
    color: #111;
    border: 1px solid #111;
  }
`

const Code = styled.pre`
  padding: 5px 15px;
`