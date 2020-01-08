import Trigger from "./trigger";
import WebhookAction from './webhookAction';

export default class SomeoneIsIn extends Trigger {
    previousData: any;
    
    initialize() {
        this.subscriptions.push(this.firestore.collection('homes').onSnapshot(allSnaps => {
            allSnaps.forEach(homeSnap => {
                this.subscriptions.push(
                    homeSnap.ref.collection('instance').doc('presence').onSnapshot(async presenceSnap => {
                        if (!presenceSnap.exists) {
                            this.previousData = null;
                            return;
                        }
                        
                        const presence = presenceSnap.data() || {};
                        const everyoneWasOut = this.previousData && Object.values(this.previousData).every(value => !value);
                        const someoneIsIn = Object.values(presence).some(value => value);

                        if (everyoneWasOut && someoneIsIn) {
                            await new WebhookAction(this.firestore, 'someone-is-in').execute(homeSnap);
                        }
                        this.previousData = presence;
                    })
                );
            });
        }));
    }
}