'use strict';

import React from 'react';
import cx from 'react/lib/cx';
import ListenerMixin from 'alt/mixins/ListenerMixin';
import ItemActions from 'actions/item';
import ProjectStore from 'stores/project';
import Editable from './editable';
import Icon from './icon';

if (__BROWSER) {
  require('styles/item.less');
}

let TranslateField = React.createClass({
  mixins: [ListenerMixin],

  propTypes: {
    translation: React.PropTypes.object.isRequired,
    locale: React.PropTypes.string.isRequired,
    isKey: React.PropTypes.bool,
    onChange: React.PropTypes.func
  },
  componentDidMount(){
    this.listenTo(ProjectStore, () => {
      this.setState({searchBy: ProjectStore.getState().searchString});
    })
  },
  getInitialState() {
    return {
      value: this.props.translation.value,
      searchBy: ''
    }
  },
  _onChange(html, text) {
    this.setState({value: html});
    if (this.props.onChange) {
      this.props.onChange(this.props.locale, text);
    }
  },
  render() {
    let {
      translation,
      locale,
      isKey} = this.props;
    let {value} = this.state;
    let date = translation.modifiedAt;
    if (date) {
      date = <div className="item__tr-date">{isKey? 'Added' : 'Modified'} {moment(date).calendar()} by {translation.modifiedBy.name}</div>
    }
    return (
      <div className={cx({item__tr: true, item__tr_key_true: isKey})}>
        <div className='item__tr-locale'>{locale}</div>
        <div className="item__tr-field">
              <Editable className="item__tr-input" readOnly={isKey} html={value} preventEnter={true} onChange={this._onChange}
                        placeholder='Abracadabra!'/>
          {date}
        </div>
      </div>
    )
  }
});

export default React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired,
    onFinish: React.PropTypes.func
  },
  getInitialState() {
    return {
      isEditing: false
    };
  },
  _isTranslated() {
    return _.all(_.values(this.props.item.translations));
  },
  _onKeyDown(e) {
    if (e.key == 'Enter') {
      ItemActions.updateItem(this.props.item);
      if (this._isTranslated() && this.props.onFinish) {
        this.props.onFinish(this.props.item.id);
      }
    }
  },
  _onTranslate(locale, value) {
    const translations = this.props.item.translations;
    translations[locale]= {value, modifiedAt: new Date(), modifiedBy: {}}
  },
  _onDeleteClick() {
    ItemActions.deleteItem({id: this.props.item.id});
  },
  render() {
    const item = this.props.item;
    const locales = ['en', 'ru'];
    let entries = locales.map((locale) => {
      const translation = item.translations[locale] ? item.translations[locale] : {value: ''};

      return (
          <TranslateField locale={locale} isKey={locale === item.keyLocale} translation={translation} onChange={this._onTranslate} />
      )
    });

    return (
      <div className={cx('item', this.props.className)} onKeyDown={this._onKeyDown}>
        {entries}
        <Icon className='md-delete item__delete md-2x' onClick={this._onDeleteClick}/>
      </div>
    )
  }
});
