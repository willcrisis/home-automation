import fetch from 'node-fetch';
import TriggerAction from "./triggerAction";

export default class WebhookAction extends TriggerAction {
    actionName: string;

    constructor(firestore: FirebaseFirestore.Firestore, actionName: string) {
        super(firestore);
        this.actionName = actionName;
    }

    async execute(homeSnap: FirebaseFirestore.QueryDocumentSnapshot) {
        const actionRef = homeSnap.ref.collection('actions').doc(this.actionName);
        const actionSnap = await actionRef.get();

        const { webhookUrl = '' } = actionSnap.data() || {};

        if (webhookUrl) {
            await fetch(webhookUrl);
        }
        
        await actionRef.collection('history').add({
            timestamp: new Date(),
        });
    }
}