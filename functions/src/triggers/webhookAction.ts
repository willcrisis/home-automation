import fetch from 'node-fetch';
import TriggerAction from "./triggerAction";

export default class WebhookAction extends TriggerAction {
    actionName: string;

    constructor(firestore: FirebaseFirestore.Firestore, actionName: string) {
        super(firestore);
        this.actionName = actionName;
    }

    async execute(homeSnap: FirebaseFirestore.QueryDocumentSnapshot) {
        console.log(`Action triggered: ${this.actionName}`);
        
        const actionRef = homeSnap.ref.collection('actions').doc(this.actionName);
        const actionSnap = await actionRef.get();

        const { webhookUrl = '' } = actionSnap.data() || {};

        if (webhookUrl) {
            await fetch(webhookUrl);
        }

        const now = new Date();
        
        await actionRef.collection('history').add({
            timestamp: now,
        });

        await homeSnap.ref.collection('history').add({
            timestamp: now,
            event: this.actionName,
            action: actionRef,
        });
    }
}