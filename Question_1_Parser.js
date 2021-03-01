const cheerio = require('cheerio');
const got = require('got');

const URL = 'https://app-dev.condoworks.co/test-q1.txt';
const REGEXES = {
    customer_no: /\d{7}(?=\s-)/,
    account_no: /(?<=-\s)\d{8}/,
    bill_period: /([a-z]{3}\s\d{1,2},\s\d{4}\sto\s[a-z]{3}\s\d{1,2},\s\d{4})/i,
    bill_no: /(?<=:\s)\d{8}/,
    bill_date: /(?<=:\s)([a-z]{3}\s\d{1,2},\s\d{4})/i,
    amount: /(?<=Total new charges)\s*\$[\d,]*.\d{2}/,
};

(async () => {
    let bill_string = await got(URL).then((res) => {
        return res.body;
    }).catch((err) => {
        console.log(err);
    });
    let bill_info = {
        Customer_Number: bill_string.match(REGEXES.customer_no)[0],
        Account_Number: bill_string.match(REGEXES.account_no)[0],
        Bill_Period: bill_string.match(REGEXES.bill_period)[0],
        Bill_Number: bill_string.match(REGEXES.bill_no)[0],
        Bill_Date: bill_string.match(REGEXES.bill_date)[0],
        Total_New_Charges: bill_string.match(REGEXES.amount)[0].trim(),
    }
    console.log(bill_info);
})();