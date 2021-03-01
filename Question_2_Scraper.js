const puppeteer = require('puppeteer');
const downloadsFolder = require('downloads-folder');

const URL = 'https://app-dev.condoworks.co/';
const user = 'coop.test@condoworks.co';
const pass = 'MyTesting711';
const inv_search = '123';
const inv_no = '123444';

const SELECTORS = {
    username: '#Email',
    password: '#Password',
    invoices: '[id*=InvoicesMenuLink]',
    dropdown_item: '.dropdown-item[href="/invoices/all"]',
    invoice_search: 'input[id*="InvoiceNumber"]',
    invoice_no: 'td[aria-describedby*="InvoiceNumber"]',
    pdf: '.kv-preview-data.file-preview-pdf',
    download_btn: '.kv-file-download.btn.btn-sm.btn-kv.btn-default.btn-outline-secondary'
};

const ERROR_MESSAGE = {
    registry_js: /registry-js/,
}

(async () => {
    const browser = await puppeteer.launch({
        defaultViewport: {width: 1920, height: 1080},
        headless: false,
        slowMo: 50,
        devtools: true,
    });
    const page = await browser.newPage();

    let pages = await browser.pages();
    if (pages.length > 1){
        pages[0].close();
    }
    
    await page.goto(URL);
    await page.type(SELECTORS.username, user);
    await page.type(SELECTORS.password, `${pass}\u000d`);
    await page.waitForSelector(SELECTORS.invoices);

    await page.click(SELECTORS.invoices);
    await page.click(SELECTORS.dropdown_item);

    await page.waitForSelector(SELECTORS.invoice_no);
    await page.type(SELECTORS.invoice_search, `${inv_search}\u000d`);
    
    await page.evaluate((SELECTORS, inv_no) => {
        let table_rows = document.querySelectorAll(SELECTORS.invoice_no);
        console.log(table_rows);
        for (let i of table_rows){
            console.log(i);
            if (i.textContent == inv_no){
                i.parentElement.querySelector('button').click();
            }
        }
    }, SELECTORS, inv_no);

    await page.waitForSelector(SELECTORS.download_btn);
    await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: downloadsFolder()}).catch((err) =>{
        if (err.message.match(ERROR_MESSAGE.registry_js)){
            throw 'May potentially need to install an older version of registry-js (1.9.0 worked for me)';
        };
    });
    await page.click(SELECTORS.download_btn);
    await page.waitForTimeout(3000);
    console.log(downloadsFolder());

    await page.close();
})();