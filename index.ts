const puppeteer = require('puppeteer');
const DOMPurify = require('isomorphic-dompurify');

const PAGE_URL =
    "https://www.hansimmo.be/appartement-te-koop-in-borgerhout/10321";


const main = async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(PAGE_URL);

    const items = await page.evaluate(() => {
        const description = document.querySelector('meta[property="og:description"]').getAttribute('content');
        const title = document.querySelector('title').textContent;
        const price = document.querySelector('.price').textContent;
        const address = document.querySelector('.address').textContent;

        return {
            description: description,
            title: title,
            price: price,
            address: address,
        };
    });

    const sanitizedDescription = DOMPurify.sanitize(items.description);
    items.description = sanitizedDescription;

    console.log(items);

    return items;
};

main().then((items) => console.log(items));