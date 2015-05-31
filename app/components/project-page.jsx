'use strict';

import React from 'react';
import UserMenu from './usermenu';
import ProjectsList from './projects-list';
import Project from './project';

if (__BROWSER) {
  require('styles/project-page.less');
}

export default React.createClass({
  render() {
    return (
      <div className='project-page'>
        <div className='project-page__inner'>
          <ProjectsList className='project-page__nav'/>
          <Project className='project-page__project'/>
        <UserMenu className='project-page__user'/>
        </div>
      </div>
    )
  }
});
