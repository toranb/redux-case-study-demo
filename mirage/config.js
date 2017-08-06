var next = 15;

export default function() {
  this.timing = 1;
  this.logging = false;
  this.get('/api/restaurants');
  this.get('/api/restaurants/:id', (schema, request) => {
    var id = request.params.id;
    var restaurant = schema.restaurants.find(id);
    delete restaurant.attrs[0];
    return restaurant;
  });
  this.post('/api/restaurants/:id', (schema, request) => {
    var id = request.params.id;
    var restaurant = schema.restaurants.find(id);
    var json = JSON.parse(request.requestBody);
    var match = restaurant.reviews.filter(function(review) {
      return review.userId === 1 ? review : undefined;
    });
    if (match.length > 0) {
      match[0]['rating'] = json.rating;
      var updated = restaurant.update(match);
      delete updated.attrs[0];
      return updated;
    }
    next = next + 1;
    restaurant.reviews.push({id: next, rating: json.rating, userId: 1});
    return restaurant.update();
  });
}
