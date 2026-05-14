import type { TFunction, i18n } from "i18next";

export const getTerminologyStatusLabel = (
    status: string,
    t: TFunction,
    i18nInstance: i18n
) => {
    const key = `legalTerminologies.status.${status}`;
    return i18nInstance.exists(key) ? t(key) : status;
};
