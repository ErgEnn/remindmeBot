const fs = require("fs");
const puppeteer = require("puppeteer");

const email = '';
const password = '';

(async () => {
	const browser = await puppeteer.launch({headless:false, timeout: 120000});
	const page = await browser.newPage()
	const navigationPromise = page.waitForNavigation({waitUntil: 'networkidle0'});

	await page.goto('https://www.facebook.com/');

	await page.waitForSelector('#email');
	await page.type('#email', email);
	await page.type('#pass', password);
	await page.waitForSelector('button[title="Allow all cookies"]');
	await page.click('button[title="Allow all cookies"]');
	await new Promise(r => setTimeout(r, 500));
	await page.click('button[name="login"]');

	await page.waitForSelector('div[aria-label="stories tray"]', {timeout: 120000});
 
	cookies = await page.cookies();
	cookies = cookies.map(({name: key, ...rest}) => ({key, ...rest}));
	fs.writeFileSync('appstate.json', JSON.stringify(cookies));

	await browser.close();
})();