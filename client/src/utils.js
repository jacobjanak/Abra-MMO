const utils = {
    randomString: length => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        for (let i = 0; i < length; i++) {
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
