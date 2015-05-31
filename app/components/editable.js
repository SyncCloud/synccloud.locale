'use strict';

import React from 'react';

export default React.createClass({
  render() {
    const {
      html,
      readonly
    } = this.props;
    const fontSize = this._calcFontSize(html.length);
    const lineHeight = this._calcLineHeight(fontSize) + 'px';
    return <div
      {...this.props}
      style={{fontSize, lineHeight}}
      onInput={this.emitChange}
      onBlur={this.emitChange}
      contentEditable={!this.props.readonly}
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
  _updateFontSize(length) {
    const fontSize = this._calcFontSize(length);
    const dom =this.getDOMNode();
    const $dom = $(dom);
    $dom.css({fontSize, lineHeight: this._calcLineHeight(fontSize)+'px'});
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== React.findDOMNode(this).innerHTML;
  },

  componentDidUpdate() {
    if ( this.props.html !== React.findDOMNode(this).innerHTML ) {
      React.findDOMNode(this).innerHTML = this.props.html;
    }
  },

  emitChange() {
    var html = React.findDOMNode(this).innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      const text = $.trim($(React.findDOMNode(this)).text());
      this._updateFontSize(text.length);
      this.props.onChange(html, text);
    }
    this.lastHtml = html;
  }
});
