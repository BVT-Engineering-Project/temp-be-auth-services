var moment = require('moment-timezone');
const currentDate = () =>{
    let date_ob         = new Date();
    let date            = ("0" + date_ob.getDate()).slice(-2);
    let month           = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let years           = date_ob.getFullYear();
    let hours           = ("0" + date_ob.getHours()).slice(-2);
    let minutes         = ("0" + date_ob.getMinutes()).slice(-2);
    let seconds         = ("0" + date_ob.getSeconds()).slice(-2);
    let timestampNow    = years+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds;

    let dateAsiaJakarta = moment().tz("Asia/Jakarta").format();
    return {
        date        :date,
        month       :month,
        years       :years,
        hours       :hours,
        minutes     :minutes,
        seconds     : seconds,
        timestampNow: timestampNow,
        dateAsiaJakarta: dateAsiaJakarta
    }
}
module.exports = currentDate;