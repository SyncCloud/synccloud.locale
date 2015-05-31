'use strict';

import alt from 'utils/alt';

class ProjectActions {
  changeProject(projectName) {
    this.dispatch({projectName});
    //$.get(`/api/items/${projectName}`)
    //  .then((items) => {
    //    this.dispatch({items: items, projectName: project});
    //  })
  }
  search({text}) {
    this.dispatch({text});
  }
}

export default alt.createActions(ProjectActions);
