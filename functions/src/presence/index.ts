import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const ACTIONS: {[key: string]: string} = {
    Entered: 'arrived',
    Exited: 'left'
}

const validateRequest = (
    homeSnap: FirebaseFirestore.DocumentSnapshot,
    action: string, 
    userSnap: FirebaseFirestore.DocumentSnapshot, 
    res: functions.Response
) => {
    if (![homeSnap.exists, action, userSnap.exists].every(value => value)) {
        res.sendStatus(400);
        throw new Error('Invalid request');
    };
}

const presence = async (req: functions.Request, res: functions.Response) => {
    const firestore = admin.firestore();
    
    const { body } = req;
    const { action: actionKey, home: homeKey, user: userKey } = body;
    console.log(`Action Key: ${actionKey}`);
    const action = ACTIONS[actionKey];

    const homeRef = firestore.doc(`homes/${homeKey}`);
    const homeSnap = await homeRef.get();

    const userRef = firestore.doc(`users/${userKey}`);
    const userSnap = await userRef.get();

    validateRequest(homeSnap, action, userSnap, res);

    const isPresent = action === ACTIONS.Entered;
    const now = new Date();
    
    // Updates presence on home
    const presenceRef = firestore.doc(`homes/${homeKey}/instance/presence`);
    await presenceRef.set({
        [userKey]: isPresent,
    }, { merge: true });

    // Creates history
    await homeRef.collection('history').add({
        timestamp: now,
        event: action,
        user: userRef,
    });

    return res.status(200).send({ status: 'OK' });
};

export default presence;
