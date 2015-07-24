'use strict';

import React from 'react';

export default React.createClass({
  render() {
    const {
      html,
      readOnly,
      preventEnter,
      ...other
    } = this.props;
    const fontSize = this._calcFontSize(html.length);
    const lineHeight = this._calcLineHeight(fontSize) + 'px';

    return <div
      {...other}
      style={{fontSize, lineHeight}}
      onInput={this.emitChange}
      onBlur={this._onBlur}
      onFocus={this._onFocus}
      onKeyPress={this._onKeyPress}
      contentEditable={!readOnly}
      dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
  },
  _calcFontSize(length) {
    if (length < 20) {
      return 48;
    } else {
      return Math.round(48/(1 + (length-20)/100))
    }
  },
  _calcLineHeight(fontSize) {
    if (fontSize > 36) {
      return 48;
    } else {
      return fontSize*1.5;
    }
  },
  _onKeyPress(e) {
    if (e.key == 'Enter' && this.props.preventEnter) {
      e.preventDefault()
    }
  },
  _updateFontSize(length) {
    const fontSize = this._calcFontSize(length);
    const root = this.getDOMNode();
    root.style.fontSize = fontSize + 'px';
    root.style.lineHeight = this._calcLineHeight(fontSize) + 'px';
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== React.findDOMNode(this).innerHTML;
  },

  componentDidUpdate() {
    if ( this.props.html !== React.findDOMNode(this).innerHTML ) {
      React.findDOMNode(this).innerHTML = this.props.html;
    }
  },

  _onBlur() {
    this.emitChange();
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  },

  _onFocus() {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  },

  emitChange() {
    var html = React.findDOMNode(this).innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      const root = React.findDOMNode(this);
      const text = (root.innerText || root.textContent).trim();
      this._updateFontSize(text.length);
      this.props.onChange(html, text);
    }
    this.lastHtml = html;
  }
});
