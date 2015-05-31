'use strict';

import React from 'react';
import cx from 'react/lib/cx';

const PropTypes = React.PropTypes;

if (process.env.BROWSER) {
  require('styles/icon/material-design-iconic-font.less');
}

export default React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
    rotate: PropTypes.oneOf(['90', '180', '270']),
    flip: PropTypes.oneOf(['horizontal', 'vertical']),
    fixedWidth: PropTypes.bool,
    spin: PropTypes.bool,
    stack: PropTypes.oneOf(['1x', '2x']),
    inverse: PropTypes.bool
  },

  render() {
    let {
      name, size, rotate, flip, spin, fixedWidth, stack, inverse,
      className, ...props
      } = this.props;

    let classNames = cx({
      md: true,
      [`md-${name}`]: true,
      [`md-${size}`]: size
    });

    //if (size) {
    //  classNames += ` md-${size}`;
    //}
    //if (rotate) {
    //  classNames += ` md-rotate-${rotate}`;
    //}
    //if (flip) {
    //  classNames += ` md-flip-${flip}`;
    //}
    //if (fixedWidth) {
    //  classNames += ' md-fw';
    //}
    //if (spin) {
    //  classNames += ' md-spin';
    //}
    //
    //if (stack) {
    //  classNames += ` md-stack-${stack}`;
    //}
    //if (inverse) {
    //  className += ' md-inverse';
    //}

    if (className) {
      classNames += ` ${className}`;
    }
    return <span {...props} className={classNames} />;
  }
});
