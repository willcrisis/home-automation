import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const ACTIONS: {[key: string]: string} = {
    entered: 'arrived',
    exited: 'left'
}

const validateRequest = (
    homeSnap: FirebaseFirestore.DocumentSnapshot,
    action: string, 
    userSnap: FirebaseFirestore.DocumentSnapshot, 
    res: functions.Response
) => {
    console.log(`homeSnap.exists: ${homeSnap.exists}`)
    console.log(`userSnap.exists: ${userSnap.exists}`)
    console.log(`action: ${action}`)
    if (![homeSnap.exists, action, userSnap.exists].every(value => value)) {
        res.sendStatus(400);
        throw new Error('Invalid request');
    };
}

type RequestBody = { 
    action: string; 
    home: string; 
    user: string;
};

const presence = async (req: functions.Request, res: functions.Response) => {
    const firestore = admin.firestore();
    
    const { body } = req;
    const { 
        action: actionKey, 
        home: homeKey, 
        user: userKey 
    }: RequestBody = body;
    
    console.log(`Action Key: '${actionKey}'`);
    console.log(`Home Key: '${homeKey}'`);
    console.log(`User Key: '${userKey}'`);
    
    const action = ACTIONS[actionKey.trim()];

    const homeRef = firestore.doc(`homes/${homeKey}`);
    const homeSnap = await homeRef.get();

    const userRef = firestore.doc(`users/${userKey}`);
    const userSnap = await userRef.get();

    validateRequest(homeSnap, action, userSnap, res);

    const isPresent = action === ACTIONS.entered;
    const now = new Date();
    
    // Updates presence on home
    const presenceRef = homeRef.collection('instance').doc('presence');
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
