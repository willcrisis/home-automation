
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import presence from './presence';
import triggers from './triggers';

admin.initializeApp();
triggers();

const app = express();

app.post('/presence', presence);

export const api = functions.https.onRequest(app);
