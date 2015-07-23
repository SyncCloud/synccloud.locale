'use strict';

import ProjectActions from 'actions/project';
import ItemActions from 'actions/item';
import alt from 'utils/alt';

class ProjectStore {
  constructor() {
    this.bindActions(ProjectActions);
    this.bindActions(ItemActions)
  }

  _byId(id) {
    return _.find(this.items, ((i) => {
      return i.id === id;
    }));
  }

  static getProjects() {
    return _.keys(this.getState().itemsByProject);
  }

  static getProjectsCounts() {
    let counts = {};
    const {itemsByProject, localesByProject} = this.getState();

    for (let [pr, items] of Object.entries(itemsByProject)) {
      counts[pr] = ProjectStore._getUntranslated(items, localesByProject[pr]).length;
    }

    return counts;
  }

  static _getUntranslated(items, locales=[]) {
    return items.filter((i) => {
      return _.any(locales, (l)=>{return !i.translations[l] || !i.translations[l].value});
    });
  }

  onUpdateItem(data) {
    if (_.all(_.values(data.translations))) {
      this.setState({
        items: this.items.filter((i) => {return i.id !== data.id})
      });
    } else if (!this._byId(data.id)) {
      this.setState({
        items: this.items.concat(data)
      });
    }
    _.assign(this._byId(data.id), data);
  }

  onDeleteItem({id}) {
    this.itemsByProject[this.activeProject] = this.itemsByProject[this.activeProject].filter((i) => {return i.id !== id});
    this.setState({
      items: this.items.filter((i) => {return i.id !== id})
    });
  }

  onChangeProject({projectName}) {
    this.setState({
      activeProject: projectName,
      searchString: '',
      items: ProjectStore._getUntranslated(this.itemsByProject[projectName], this.localesByProject[projectName])
    });
  }

  onSearch({text}) {
    const re = new RegExp(text, 'i');
    let items = this.itemsByProject[this.activeProject];
    if (!text) {
      items = ProjectStore._getUntranslated(items, this.localesByProject[this.activeProject]);
    }
    this.setState({
      searchString: text,
      items: items.filter((item)=>{
        return _.values(_.pluck(item.translations, 'value')).join(' ').match(re);
      })
    });
  }
}

export default alt.createStore(ProjectStore, 'ProjectStore');
