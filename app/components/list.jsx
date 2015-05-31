'use strict';

import React from 'react/addons';
import cx from 'react/lib/cx';
import Item from './item';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

if (process.env.BROWSER) {
  require('styles/list.less');
}

export default React.createClass({
  propTypes: {
    items: React.PropTypes.array.isRequired
  },
  _handleItemFinish(id) {
  },
  render() {

    let items = this.props.items.map((item) => {
      return (
        <Item key={item.id} className='list__item' item={item} onFinish={this._handleItemFinish}/>
      )
    });

    return (
      <div className={cx('list', this.props.className)}>
        <ReactCSSTransitionGroup transitionName='fade'>
          {items}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
});
