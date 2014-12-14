# WAIT-FOR-IT

Wait until some named asynchronous activity is complete before scheduling any dependent functions to execute.

When combined with Node's event loop, you get very similar semantics to a [Mesa-style Monitor](http://en.wikipedia.org/wiki/Monitor_(synchronization)#Nonblocking_condition_variables) synchronization primitive. This code implements the `wait C`, and `notify all C` steps with Node's event loop providing the `schedule` step.

## Use

```javascript
var Monitor = require('wait-for-it').uncached;

// Create an instance of the monitor
var fileMon = new Monitor('file monitor');

// Assume we are in an express route
getIndex = function (req, res, next) {

  // Start a queue for all requests that come in for 'index.html'
  var notifyFn = fileMon.add('index.html', next);

  // if notifyFn is not null then we should start the activity
  if (notifyFn) {

    // Perform potentially slow asynchronous operation that builds 'index.html'
    createIndexIfItDoesntExist(function (err) {

      if (!err) {
        // Asynchonously read index.html passing along the notifyFn as the callback
        return readIndexFile(notifyFn);
      }

      notifyFn(err);
    });
  }
}
```

In the example above, `index.html` will be created and read only once even in the face of multiple concurrent requests.

The only problem is that once there are no more concurrent requests pending, the file may be read multiple times. The value returned by *reading* isn't cached.

In order to cache potentially expensive-to-aquire resources, there is a cached version of the monitor:

```javascript
var Monitor = require('wait-for-it').cached;
```

That's it!

Everthing else remains the same but now all requests for 'index.html' (except for the first) will use the version stored in memory.

## Installation

```bash
$ npm install wait-for-it
```

## License
Copyright 2014 Brightcove, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
