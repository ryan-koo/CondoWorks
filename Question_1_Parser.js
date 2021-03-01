const got = require('got');
const fs = require('fs');

const URL = 'https://app-dev.condoworks.co/test-q1.txt'; // Requires changes for different URLS or different files
const FILE = 'C:\\Users\\ryann\\Desktop\\test-q1.txt'; // Requires changes to file path and file name for local files

const REGEXES = {
    customer_no: /\d{7}(?=\s-)/,
    account_no: /(?<=-\s)\d{8}/,
    bill_period: /([a-z]{3}\s\d{1,2},\s\d{4}\sto\s[a-z]{3}\s\d{1,2},\s\d{4})/i,
    bill_no: /(?<=:\s)\d{8}/,
    bill_date: /(?<=:\s)([a-z]{3}\s\d{1,2},\s\d{4})/i,
    amount: /(?<=Total new charges)\s*\$[\d,]*.\d{2}/,
};

// This function is for if the bill has a URL

async function online () {
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
};

online();

// This function is for if the bill is a local file

function local () {
    fs.readFile(FILE, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let bill_info = {
            Customer_Number: data.match(REGEXES.customer_no)[0],
            Account_Number: data.match(REGEXES.account_no)[0],
            Bill_Period: data.match(REGEXES.bill_period)[0],
            Bill_Number: data.match(REGEXES.bill_no)[0],
            Bill_Date: data.match(REGEXES.bill_date)[0],
            Total_New_Charges: data.match(REGEXES.amount)[0].trim(),
        };
        console.log(bill_info);
    });
};

local();