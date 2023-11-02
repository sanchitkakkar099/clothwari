export const PHONE_REGEX = new RegExp(/^\d{10}$/, "i");

export const handleValidatePhone = (phoneNumber) => {
    if(!phoneNumber){
        return 'Phone Number is required';
    }
    else if (!PHONE_REGEX.test(phoneNumber)) {
        return "Please enter a valid phone number"
      }
    return PHONE_REGEX.test(phoneNumber)   
}