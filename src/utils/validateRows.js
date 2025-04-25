export default function validateRows(rows){
    const errors = {}; 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\d{10}|\d{3}-\d{3}-\d{4})$/


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
                rowErrors[key] = "Must be 10 digits";
            }
        }

        if(Object.keys(rowErrors).length > 0){
            errors[i] = rowErrors;
        }
    }

    return Object.keys(errors).length > 0 ? errors : null;
}