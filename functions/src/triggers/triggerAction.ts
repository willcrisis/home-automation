export default abstract class TriggerAction {
    firestore: FirebaseFirestore.Firestore;

    constructor(firestore: FirebaseFirestore.Firestore) {
        this.firestore = firestore;
    }

    abstract execute(params: any): Promise<void>;
}