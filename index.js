import puppeteer from 'puppeteer-extra';
import puppeteerStealth from 'puppeteer-extra-plugin-stealth';
import randomUseragent from 'random-useragent';
import fs from 'fs';

const shops = [
   {
      name: 'amazon',
      fullName: 'Amazon',
      price: null,
      link: 'https://www.amazon.pl/dp/B083T9STQS/?tag=ceneo0c-21&creative=380333&creativeASIN=B083T9STQS&linkCode=asn&utm_source=ceneo&utm_medium=referral&ceneo_cid=f6e305f7-6111-db4d-55d8-de711ad2ce30&th=1',
      priceSelector: '.a-price .a-offscreen',
   },
   {
      name: 'morele',
      fullName: 'Morele',
      price: null,
      link: 'https://www.morele.net/zasilacz-be-quiet-straight-power-11-850w-bn308-6470639/',
      priceSelector: '.product-price',
   },
   {
      name: 'xkom',
      fullName: 'x-kom',
      price: null,
      link: 'https://www.x-kom.pl/p/540597-zasilacz-do-komputera-be-quiet-straight-power-11-850w-80-plus-platinum.html',
      priceSelector: '.sc-n4n86h-4.jwVRpW',
   },
   {
      name: 'euro',
      fullName: 'RTV Euro AGD',
      price: null,
      link: 'https://www.euro.com.pl/zasilacze-do-komputerow-pc/be-quiet-zasilacz-bequiet-straight-power-11-850w.bhtml',
      priceSelector: '.price-tabs > .price-tab',
   },
   {
      name: 'media',
      fullName: 'Media Expert',
      price: null,
      link: 'https://www.mediaexpert.pl/komputery-i-tablety/podzespoly-komputerowe/zasilacze/zasilacz-be-quiet-straight-power-11-850w-80-plus-platinum',
      priceSelector: '.price-box .prices .main-price',
   },
   {
      name: 'komputronik',
      fullName: 'Komputronik',
      price: null,
      link: '',
      priceSelector: '.price-box .prices .main-price',
   },
];

const errorPage = async (shop) => {
   fs.writeFile('media.html', await page.content(), (err) =>
      err ? console.log(err) : '1. Writing content to media done!',
   );
};

const getPrices = async () => {
   puppeteer.use(puppeteerStealth());

   const browser = await puppeteer.launch({
      executablePath: '/home/xapixowy/.cache/puppeteer/chrome/linux-1056772/chrome-linux/chrome',
   });
   const page = await browser.newPage();

   await page.setViewport({
      width: 1024 + Math.floor(Math.random() * 100),
      height: 768 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
   });
   await page.setDefaultNavigationTimeout(0);
   await page.setDefaultTimeout(0);
   await page.setUserAgent(randomUseragent.getRandom());
   await page.setRequestInterception(true);

   page.on('request', (req) => {
      if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image')
         req.abort();
      else req.continue();
   });

   for (let shop of shops) {
      let itt = 1;
      if (!shop.link) break;
      console.log(shop.fullName);
      try {
         console.log('1. Loading website...');
         const start = new Date();
         await page.goto(shop.link, { waitUntil: 'networkidle0' });
         const end = new Date();
         console.log(`1. Finished in ${(end - start) / 1000}s!`);
      } catch (e) {
         console.log(e);
         break;
      }
      // try {
      //    console.log('2. Taking screenshot...');
      //    const start = new Date();
      //    await page.screenshot({
      //       path: `./screenshots/${shop.name}.png`,
      //       fullPage: true,
      //    });
      //    const end = new Date();
      //    console.log(`2. Finished in ${(end - start) / 1000}s!`);
      // } catch (e) {
      //    console.log(e);
      //    break;
      // }
      try {
         console.log('3. Waiting for selector...');
         const start = new Date();
         await page.waitForSelector(shop.priceSelector);
         const end = new Date();
         console.log(`3. Finished in ${(end - start) / 1000}s!`);
      } catch (e) {
         console.log(e);
         break;
      }
      try {
         console.log('4. Evaluating value of selector...');
         const start = new Date();
         shop.price = await page.evaluate((sel) => document.querySelector(sel).innerText, shop.priceSelector);
         const end = new Date();
         console.log(`4. Finished in ${(end - start) / 1000}s!`);
      } catch (e) {
         console.log(e);
         break;
      }
   }
   await browser.close();
};

const showPrices = () => {
   for (let shop of shops) console.log(`${shop.name} - ${shop.price}`);
};

getPrices().then(showPrices);
