export const isCompletedContractAnalysisStatus = (status: string) =>
    ["success", "completed"].includes(status.toLowerCase());
