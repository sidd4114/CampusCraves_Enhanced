import { db } from "../Components/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getQueueCounts = async () => {
    const queueCounts = {};

    for (let i = 1; i <= 3; i++) {
        const queueSnap = await getDoc(doc(db, "queues", `queue${i}`));
        queueCounts[i] = queueSnap.exists() ? queueSnap.data().count : 0;
    }

    return queueCounts;
};
