export default function validateRows(rows){
    const errors = {}; 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/


    for(let i = 0; i< rows.length; i++){
        const row = rows[i];
        const rowErrors = {};

        for(const key in row){
            const value = row[key]?.toString().trim();

            if(!value){
                rowErrors[key] = "* Required";
            } else if (key === "Email" && !emailRegex.test(value)){
                rowErrors[key] = "Invalid email";
            } else if (key === "Phone" && !phoneRegex.test(value)){
                const digitsOnly = value.replace(/\D/g, ""); // remove non-digits
                if (!phoneRegex.test(digitsOnly)) {
                    rowErrors[key] = "Phone must be exactly 10 digits";
                }
            }
        }

        if(Object.keys(rowErrors).length > 0){
            errors[i] = rowErrors;
        }
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

export function formatPhone(phone) {
    if (!phone) return null;
  
    const digitsOnly = phone.replace(/\D/g, "");
  
    if (digitsOnly.length === 10) return `+1${digitsOnly}`;
    if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) return `+${digitsOnly}`;
  
    return null;
  }
