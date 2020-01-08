import Trigger from "./trigger";
import WebhookAction from './webhookAction';

export default class EveryoneIsOut extends Trigger {
    initialize() {
        this.subscriptions.push(this.firestore.collection('homes').onSnapshot(allSnaps => {
            allSnaps.forEach(homeSnap => {
                this.subscriptions.push(
                    homeSnap.ref.collection('instance').doc('presence').onSnapshot(async presenceSnap => {
                        if (!presenceSnap.exists) {
                            return;
                        }
                        const presence = presenceSnap.data() || {};
                        const everyoneIsOut = Object.values(presence).every(value => !value);

                        if (everyoneIsOut) {
                            await new WebhookAction(this.firestore, 'everyone-is-out').execute(homeSnap);
                        }
                    })
                );
            });
        }));
    }
}