import Ember from 'ember';
import { connect } from 'ember-redux';
import { getRestaurants } from '../reducers/restaurants';

var stateToComputed = (state) => {
  return {
    restaurants: getRestaurants(state)
  };
};

export default connect(stateToComputed)(Ember.Component);
