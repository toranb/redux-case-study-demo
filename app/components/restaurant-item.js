import Ember from 'ember';
import fetch from 'fetch';
import { connect } from 'ember-redux';
import { getReviews, getSelectedId } from '../reducers/restaurants';

const { get } = Ember;

var stateToComputed = (state) => {
  return {
    reviews: getReviews(state),
    selectedId: getSelectedId(state)
  };
};

var dispatchToActions = function(dispatch) {
  return {
    rate: rating => {
      let selectedId = get(this, 'selectedId');
      let params = {
        method: 'POST',
        body: JSON.stringify({rating: rating})
      };
      return fetch(`/api/restaurants/${selectedId}`, params)
        .then(fetched => fetched.json())
        .then(response => dispatch({
          type: 'RESTAURANTS:RATE',
          response: response.restaurants
        }));
    }
  };
};

export default connect(stateToComputed, dispatchToActions)(Ember.Component);
