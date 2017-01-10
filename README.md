# query-paginate-mongo


Combines two other great projects ("mongo-querystring" and "query-to-mongo") and adds population.

### Sample

```javascript
// group.controller.js

import QPM from 'query-paginate-mongo';
import Group from './group.model';

let qpm = new QPM({
  id: '_id',                        // custom id field
  custom: {
    bbox:  'location.coords.point', // your geometry field
    near:  'location.coords.point', // your geometry field
    after:  'updated_at',           // your last modified field
    before: 'updated_at'            // your last modified field
  }
});

export function index(req, res) {
  qpm
  .parse(req.query, Group, function(err, query){
    query
      .setEnvelope('groups', '/api/groups')
      .exec(function(err, groups){
        if(err) return res.json(500, error);
        return res.json(groups);
      });
  });

}

export function show(req, res) {
  req.query.id = req.params.oid;
  qpm
  .parse(req.query, Group, function(err, query){
    query
      .exec(function(error, group){
        if(error) return res.json(500, error);
        return res.json(group);
      });
  });
}
```

Credits:
https://www.npmjs.com/package/mongo-querystring
https://www.npmjs.com/package/query-to-mongo
