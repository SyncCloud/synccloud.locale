'use strict';

import React from 'react';
import ListenerMixin from 'alt/mixins/ListenerMixin';
import ProjectStore from 'stores/project';
import ProjectActions from 'actions/project';
import Router from 'react-router';

import cx from 'react/lib/cx';

if (process.env.BROWSER) {
  require('styles/projects-list.less');
}

const getState = () => {
  return {
    activeProject: ProjectStore.getState().activeProject,
    projects: ProjectStore.getProjects(),
    counts: ProjectStore.getProjectsCounts()
  }
};

let NavItem = React.createClass({
  propTypes: {
    eventKey: React.PropTypes.string.isRequired,
    isActive:  React.PropTypes.bool,
    count: React.PropTypes.number,
    onSelect: React.PropTypes.func
  },
  checkActive(key) {
    this.props.isActive = this.props.eventKey === key;
  },
  handleClick(e) {
    if (this.props.onSelect) {
      e.preventDefault();

      this.props.onSelect(this.props.eventKey);
    }
  },
  render() {
    let {
      isActive,
      count,
      children
    } = this.props;

    return (
      <div className={cx({
      'projects-list__nav-item': true,
      'projects-list__nav-item_active_true': isActive,
      'projects-list__nav-item_empty_true': !count
      })} onClick={this.handleClick}>
        <span className="projects-list__nav-item-count">{count}</span>
        <span>{children}</span>
      </div>
    )
  }
});

export default React.createClass({
  mixins: [ListenerMixin, Router.Navigation, Router.State],

  componentDidMount() {
    this.listenTo(ProjectStore, this._onChange);
  },

  getInitialState () {
    return getState();
  },

  _onChange() {
    this.setState(getState());
  },

  _onProjectSelect(selectedProject) {
    this.transitionTo('/project/' + selectedProject);
  },

  render() {
    let projects = [];

    this.state.projects.forEach((pr) => {
      projects.push(
        <NavItem key={pr} eventKey={pr} count={this.state.counts[pr]} isActive={this.state.activeProject==pr} onSelect={this._onProjectSelect}>
          {pr}
        </NavItem>
      )
    });

    return (
      <div className={cx('projects-list', this.props.className)}>
        <h3 className='projects-list__header'>Projects</h3>
        <div className="projects-list__nav">
          {projects}
        </div>
      </div>
    );
  }
});
