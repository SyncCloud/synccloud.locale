'use strict';

import React from 'react';
import ListenerMixin from 'alt/mixins/ListenerMixin';
import ProjectStore from 'stores/project';
import ProjectActions from 'actions/project';
import Icon from './icon';

import ItemsList from './list';
import cx from 'react/lib/cx';

if (__BROWSER) {
  require('styles/project.less');
}

const getState = () => {
  return _.pick(ProjectStore.getState(), 'items', 'searchString');
};

export default React.createClass({
  mixins: [ListenerMixin],

  componentDidMount() {
    this.listenTo(ProjectStore, this._onChange);
  },

  getInitialState () {
    return getState();
  },

  _onChange() {
    this.setState(getState());
  },

  _handleSearch(e) {
    ProjectActions.search({text: e.target.value});
  },

  handleClearSearch(e) {
    e.preventDefault();
    ProjectActions.search({text: ''});
  },

  render() {
    const {
      items=[],
      searchString
    } = this.state;

    const clearIcon = <Icon className='project__search-clear' name='close' onClick={this.handleClearSearch} />;
    return (
      <div className={cx('project', this.props.className)}>
        <div className='project__top'>
          <div className='project__list-count'>{items.length} {searchString ? 'found' : 'left'}</div>
          <div className="project__search">
            {searchString ? clearIcon : null}
            <input type="text" className="project__search-input" onChange={this._handleSearch} value={searchString} placeholder='Type to search'/>
          </div>
        </div>
        <ItemsList className='project__list' items={items}/>
      </div>
    );
  }
});
