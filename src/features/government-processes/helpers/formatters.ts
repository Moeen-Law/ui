export const formatGovernmentProcessDate = (date: Date | string) =>
    new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
