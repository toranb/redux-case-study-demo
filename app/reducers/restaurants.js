import _ from 'lodash';
import reselect from 'reselect';
import { normalize, schema } from 'normalizr';
import shallowEqual from 'shallow-equal';

const reviewSchema = new schema.Entity('reviews');
const restaurantSchema = new schema.Entity('restaurants', {
  reviews: [reviewSchema]
});

const { createSelector } = reselect;

const initialState = {
  all: undefined,
  reviews: undefined,
  selectedId: undefined
};

export default ((state, action) => {
  switch(action.type) {
    case 'RESTAURANTS:TRANSFORM_LIST': {
      const normalized = normalize(action.response, [restaurantSchema]);
      const { restaurants, reviews } = normalized.entities;
      return {
        ...state,
        all: {...state.all, ...restaurants},
        reviews: {...state.reviews, ...reviews}
      }
    }
    case 'RESTAURANTS:TRANSFORM_DETAIL': {
      const restaurant = {[action.response.id]: action.response};
      const normalized = normalize(restaurant, [restaurantSchema]);
      const { restaurants, reviews } = normalized.entities;
      return {
        ...state,
        all: {...state.all, ...restaurants},
        reviews: {...state.reviews, ...reviews},
        selectedId: action.response.id
      }
    }
    case 'RESTAURANTS:RATE': {
      const restaurant = {[action.response.id]: action.response};
      const normalized = normalize(restaurant, [restaurantSchema]);
      const { restaurants, reviews } = normalized.entities;
      const id = action.response.id;
      const merged = shallowEqual(state.all[id], restaurants[id]) ? state.all : {...state.all, ...restaurants};
      return {
        ...state,
        all: merged,
        reviews: {...state.reviews, ...reviews}
      }
    }
    default: {
      return state || initialState;
    }
  }
});

const all = state => state.restaurants.all;
const reviews = state => state.restaurants.reviews;
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
  reviews,
  getSelectedRestaurant,
  (reviews, selectedRestaurant) => {
    return selectedRestaurant.reviews.map(reviewId => reviews[reviewId]);
  }
);
