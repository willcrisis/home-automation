export default abstract class Trigger {
    subscriptions: Array<() => void>;
    firestore: FirebaseFirestore.Firestore;

    constructor(firestore: FirebaseFirestore.Firestore) {
        this.subscriptions = [];
        this.firestore = firestore;
    }

    abstract initialize(): any;
    
    destroy(): void {
        this.subscriptions.forEach(unsubscribe => unsubscribe());
    };
}