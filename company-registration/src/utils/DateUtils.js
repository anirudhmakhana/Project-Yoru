class DateUtils {

    constructor() {
        this.monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
        this.shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }
    

    daysInMonth = ( month, year) => {
        return new Date(year, month + 1, 0).getDate();
    }
}

export default new DateUtils()