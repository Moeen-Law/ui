


export const formatPrice = (price: number, locale: string) =>
    new Intl.NumberFormat(locale, {
        maximumFractionDigits: 0,
    }).format(price);

export const getLocale = (language: string) => (language.startsWith("ar") ? "ar-EG" : "en-EG");