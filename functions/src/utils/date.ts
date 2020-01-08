export const timestampToDate = (timestamp: { seconds: number, nanoseconds: number }) => 
    new Date(timestamp.seconds * 1000);