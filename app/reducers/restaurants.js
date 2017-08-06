import _ from 'lodash';
import reselect from 'reselect';

const { createSelector } = reselect;

const initialState = {
  all: undefined,
  selectedId: undefined
};

export default ((state, action) => {
  switch(action.type) {
    case 'RESTAURANTS:TRANSFORM_LIST': {
      const restaurants = _.keyBy(action.response, r => r.id);
      return {
        ...state,
        all: {...state.all, ...restaurants}
      }
    }
    case 'RESTAURANTS:TRANSFORM_DETAIL': {
      const restaurant = {[action.response.id]: action.response};
      return {
        ...state,
        all: {...state.all, ...restaurant},
        selectedId: action.response.id
      }
    }
    case 'RESTAURANTS:RATE': {
      const restaurant = {[action.response.id]: action.response};
      return {
        ...state,
        all: {...state.all, ...restaurant}
      }
    }
    default: {
      return state || initialState;
    }
  }
});

const all = state => state.restaurants.all;
const selectedId = state => state.restaurants.selectedId;

export const getSelectedId = createSelector(
  selectedId,
  (selectedId) => selectedId
)

export const getRestaurants = createSelector(
  all,
  (all) => all
);

export const getSelectedRestaurant = createSelector(
  all,
  selectedId,
  (all, selectedId) => all[selectedId]
);

export const getReviews = createSelector(
  getSelectedRestaurant,
  (selectedRestaurant) => {
    return selectedRestaurant.reviews;
  }
);
