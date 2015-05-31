'use strict';

import ProjectActions from 'actions/project';
import ItemActions from 'actions/item';
import alt from 'utils/alt';

class ItemStore {
  constructor() {
    this.bindActions(ItemActions)
  }
}

export default alt.createStore(ItemStore, 'ItemStore');
