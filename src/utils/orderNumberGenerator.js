export const generateOrderNumber = (randomName) => {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Zero-padded month
    const day = now.getDate().toString().padStart(2, '0'); // Zero-padded day
    const hours = now.getHours().toString().padStart(2, '0'); // Zero-padded hours
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Zero-padded minutes
    const seconds = now.getSeconds().toString().padStart(2, '0'); // Zero-padded seconds
        
    // Extract the initials from the name
    let initials;
    if (randomName.split(' ').length > 1) {
        initials = randomName.split(' ').map(name => name.charAt(0)).join('');
    } else {
        initials = randomName.substring(0, 2).toUpperCase();
    }
    const orderNumber = `${initials}${year}${month}${day}${hours}${minutes}${seconds}`;
    return orderNumber;
}