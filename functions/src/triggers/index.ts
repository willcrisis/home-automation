import * as admin from 'firebase-admin';
import EveryoneIsOut from './everyoneIsOut';
import SomeoneIsIn from './someoneIsIn';

const init = () => {
    const firestore = admin.firestore();

    new EveryoneIsOut(firestore).initialize();
    new SomeoneIsIn(firestore).initialize();
};

export default init;
