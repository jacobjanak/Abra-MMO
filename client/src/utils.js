const utils = {
    randomString: length => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*';

        let result = '';

        // Password field requires letter, number, and symbol, so let's force them in
        result += letters.charAt(Math.floor(Math.random() * letters.length));
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        result += symbols.charAt(Math.floor(Math.random() * symbols.length));

        const characters = letters + numbers + symbols;
        for (let i = 0; i < length - 3; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    },

    getMonthAndYear: unix => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];

        const date = new Date(unix);
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${month} ${year}`;
    },
};

export default utils;
