'use strict';

import alt from 'utils/alt';

class ItemActions {
  updateItem(data) {
    const request = {};
    for (let [locale, {value}] of Object.entries(data.translations)) {
      request[locale] = value;
    }
    $.ajax({
      method: 'POST',
      url: `/translate/${data.id}`,
      contentType: 'application/json',
      data: JSON.stringify(request)
    }).done((resp) => {
      this.dispatch(resp);
    });
  }
}

export default alt.createActions(ItemActions);
