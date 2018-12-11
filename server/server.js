import mongoose from 'mongoose';
import util from 'util';

// config should be imported before importing any other file
import config from '../config/config';
import app from '../config/express';

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

const mongoUri = config.MONGO_HOST;
mongoose.connect(mongoUri, { keepAlive: true, useNewUrlParser: true, useCreateIndex: true });
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));

if (config.MONGOOSE_DEBUG) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
        debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
    });
}

export default app;