export default function excelDateToJSDate(excelDate) {

    const offset = 25569;
    const date = new Date((excelDate - offset) * 86400 * 1000);
    
    // Format the date as DD-MM-YYYY
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getUTCFullYear();
    
    return `${year}-${month}-${day}`;
}