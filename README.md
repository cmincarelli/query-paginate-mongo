# query-paginate-mongo


Combines two other great projects ("mongo-querystring" and "query-to-mongo") and adds population.

### Sample

```javascript
// ?near=-115.01,36.065,90000&sort=name&limit=10&offset=1

import QPM from 'query-paginate-mongo';
import Group from './group.model';

let qpm = new QPM({
  custom: {
    bbox: 'location.coords.point',// your geometry field
    near: 'location.coords.point',// your geometry field
    after: 'updated_at'           // your last modified field
  }
});

export function index(req, res) {

  let query = qpm(req.query);

  let collection = Group.find(query.criteria);

  Group.count(query.criteria, function(err, count){

    if(query.options.fields){
      collection.select(query.options.fields);
    }
    if(query.options.sort){
      collection.sort(query.options.sort);
    }
    if(query.options.limit){
      collection.limit(query.options.limit);
    }
    if(query.options.offset){
      collection.skip(query.options.offset);
    }

    return collection.exec()
    .then(function(entity){
      let pagination = query.links( process.env.DOMAIN + '/api/v1/groups', count);
      let response = {
        'groups': entity,
      };
      if(null !== pagination){ response.pagination = pagination; }
      return res.status(200).json(response);
    })
    .catch(handleError(res));
  });

}
```

Credits:
https://www.npmjs.com/package/mongo-querystring
https://www.npmjs.com/package/query-to-mongo
