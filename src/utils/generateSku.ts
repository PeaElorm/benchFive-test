export const generateSku = (type: string) => {
    let counter = parseInt(localStorage.getItem('skuCounter') || '1');

    const timestamp = Date.now().toString().slice(-4);
    const prefix = type.slice(0,2).toUpperCase();
    const suffix = counter.toString().padStart(4, '0');

    counter = (counter % 9999) + 1;
    localStorage.setItem('skuCounter', counter.toString());

    return `${prefix}${timestamp}${suffix}`;
}