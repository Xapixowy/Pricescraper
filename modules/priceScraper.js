import puppeteer from 'puppeteer-extra';
import puppeteerStealth from 'puppeteer-extra-plugin-stealth';
import randomUseragent from 'random-useragent';
import fs from 'fs';

class Product {
   constructor(name, link) {
      this.name = name;
      this.links = {
         amazon: undefined,
         euro: undefined,
         komputronik: undefined,
         media: undefined,
         morele: undefined,
         skapiec: undefined,
         xkom: undefined,
      };
      this.prices = {
         amazon: 0,
         euro: 0,
         komputronik: 0,
         media: 0,
         morele: 0,
         skapiec: 0,
         xkom: 0,
      };
      link && this.setLink(link);
   }
   setLink(link) {
      if (link === undefined) throw new Error('Link is undefined! You need to enter a link!');
      const type = typeof link;
      if (type === 'string') {
         if (link.indexOf('www.amazon.pl') >= 0) this.links.amazon = link;
         else if (link.indexOf('www.euro.pl') >= 0) this.links.euro = link;
         else if (link.indexOf('www.komputronik.pl') >= 0) this.links.komputronik = link;
         else if (link.indexOf('www.media.pl') >= 0) this.links.media = link;
         else if (link.indexOf('www.morele.pl') >= 0) this.links.morele = link;
         else if (link.indexOf('www.skapiec.pl') >= 0) this.links.skapiec = link;
         else if (link.indexOf('www.xkom.pl') >= 0) this.links.xkom = link;
         else throw new Error('Provided link is incorrect! Check if your shop is supported.');
      } else if (type === 'object') {
         this.links.amazon = link.amazon;
         this.links.euro = link.euro;
         this.links.komputronik = link.komputronik;
         this.links.media = link.media;
         this.links.morele = link.morele;
         this.links.skapiec = link.skapiec;
         this.links.xkom = link.xkom;
      } else throw new Error('Incorrect type of data! You need to provide string or object.');
      return true;
   }
   getLink(shop) {
      if (shop === undefined) throw new Error('Shop is undefined! You need to specify a shop!');
      else if (shop === 'amazon') return this.links.amazon;
      else if (shop === 'euro') return this.links.euro;
      else if (shop === 'komputronik') return this.links.komputronik;
      else if (shop === 'media') return this.links.media;
      else if (shop === 'morele') return this.links.morele;
      else if (shop === 'skapiec') return this.links.skapiec;
      else if (shop === 'xkom') return this.links.xkom;
      else throw new Error('Shop with that name is unsupported!');
   }
   setPrice(shop, price) {
      if (price === undefined) throw new Error('Price is undefined! You need to enter a price!');
      const priceFloat = parseFloat(price);
      if (shop === undefined) throw new Error('Shop is undefined! You need to specify a shop!');
      else if (shop === 'amazon') this.prices.amazon = priceFloat;
      else if (shop === 'euro') this.prices.euro = priceFloat;
      else if (shop === 'komputronik') this.prices.komputronik = priceFloat;
      else if (shop === 'media') this.prices.media = priceFloat;
      else if (shop === 'morele') this.prices.morele = priceFloat;
      else if (shop === 'skapiec') this.prices.skapiec = priceFloat;
      else if (shop === 'xkom') this.prices.xkom = priceFloat;
      else throw new Error('Shop with that name is unsupported!');
   }
   getPrice(shop) {
      if (shop === undefined) throw new Error('Shop is undefined! You need to specify a shop!');
      else if (shop === 'amazon') return this.prices.amazon;
      else if (shop === 'euro') return this.prices.euro;
      else if (shop === 'komputronik') return this.prices.komputronik;
      else if (shop === 'media') return this.prices.media;
      else if (shop === 'morele') return this.prices.morele;
      else if (shop === 'skapiec') return this.prices.skapiec;
      else if (shop === 'xkom') return this.prices.xkom;
      else throw new Error('Shop with that name is unsupported!');
   }
}

class Scraper {
   constructor() {
      this.products = [];
   }
   getProducts() {
      return this.products;
   }
   addProduct(product) {
      if (!(product instanceof Product)) throw new Error('Product must be instance of Product class!');
      else this.products.push(product);
   }
   removeProduct(id) {
      if (id === undefined) throw new Error('You must provide product id or name!');
      else if (typeof id === 'number') this.products.splice(id, 1);
      else if (typeof id === 'string') {
         for (let i = 0; i < this.products.length; i++) {
            this.products[i].name.indexOf(id) >= 0 && this.products.splice(i, 1);
         }
      } else throw new Error('Data type is unsupported! Provide an integer or a string.');
   }
   async start(productId) {
      const logError = async function (name, page, err) {
         const date = new Date();
         const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
         // Create file with page content
         await fs.writeFile(`./logs/${dateString}_${name}.html`, await page.content(), (err) => {
            if (err) console.log(err);
            else console.log(`./logs/${dateString}_${name}.html written successfully!`);
         });
         // Create file with error
         if(err) {
            await fs.writeFile(`./logs/${dateString}_${name}.txt`, err, (err) => {
               if (err) console.log(err);
               else console.log(`./logs/${dateString}_${name}.txt written successfully!`);
            });
         }
         // Create screenshot with page content
         await page.screenshot({
            path: `./logs/${dateString}_${name}.jpeg`,
            fullPage: true,
         });
      };

      const getShopPrice = async function (page, product, shop) {
         if (!product.links[shop]) return false;
         else {
            const selectors = {
               amazon: {
                  price: {
                     waitFor: '.a-price .a-offscreen',
                     get: '.a-price .a-offscreen'
                  },
               },
               euro: {
                  price: {
                     waitFor: '.price-box .product-price',
                     get: '.price-box .product-price'
                  },
                  prompt: [
                     {
                        waitFor: '#onetrust-consent-sdk',
                        click: '#onetrust-accept-btn-handler'
                     }
                  ],
               },
               komputronik: {
                  price: {
                     waitFor: '.prices .price .proper',
                     get: '.prices .price .proper'
                  }
               },
               media: {
                  price: {
                     waitFor: '.price-box .prices .main-price',
                     get: '.price-box .prices .main-price'
                  }
               },
               morele: {
                  price: {
                     waitFor: '.product-price',
                     get: '.product-price'
                  }
               },
               skapiec: {
                  price: {
                     waitFor: '.price-history-modal-old-content__main__chart',
                     get: '.price-history-modal-old-content__details .details-list__item:nth-of-type(1) .price'
                  },
                  prompt: [
                     {
                        waitFor: '#rasp_cmp',
                        click: '.cmp-button_button.cmp-intro_acceptAll'
                     },
                     {
                        waitFor: '.gtm_ua_pricehistory',
                        click: '.gtm_ua_pricehistory'
                     },
                     {
                        waitFor: '.button.gtm_ua_ph_30d',
                        click: '.button.gtm_ua_ph_30d'
                     }
                  ]
               },
               xkom: {
                  price: {
                     waitFor: '.sc-n4n86h-4.jwVRpW',
                     get: '.sc-n4n86h-4.jwVRpW'
                  }
               },
            };
            console.log(`${shop}:`);
            try {
               console.log(`1) Loading website...`);
               const start = new Date();
               await page.goto(product.links[shop], { waitUntil: 'networkidle0' });
               const end = new Date();
               console.log(`1) Finished in ${(end - start) / 1000}s!`);
            } catch (e) {
               await logError(`${product.name}-${shop}-1`, page, `${e}`);
               return false;
            }

            try {
               console.log(`2) Waiting for selector...`);
               const start = new Date();
               if (selectors[shop].prompt) {
                  for(let prompt of selectors[shop].prompt) {
                     await page.waitForSelector(prompt.waitFor);
                     await page.click(prompt.click);
                  }
               } 
               const end = new Date();
               console.log(`2) Finished in ${(end - start) / 1000}s!`);
            } catch (e) {
               await logError(`${product.name}-${shop}-2`, page, `${e}`);
               return false;
            }
            
            let price;
            try {
               console.log('3) Evaluating value of selector...');
               const start = new Date();
               await page.waitForSelector(selectors[shop].price.waitFor);
               price = await page.evaluate((sel) => document.querySelector(sel).innerText, selectors[shop].price.get);
               const end = new Date();
               console.log(`3) Finished in ${(end - start) / 1000}s!`);
            } catch (e) {
               await logError(`${product.name}-${shop}-3`, page, `${e}`);
               return false;
            }

            console.log('4) Normalizing price...')
            console.log(`PRICE: ${price}`)
            price = price.replaceAll('\n','');
            price = price.replaceAll('\t','');
            price = price.replaceAll('zł','');
            price = price.replaceAll(',','.');
            product.prices[shop] = parseFloat(price);
            if(shop === 'media') product.prices[shop] /= 100;
         }
      };
      // Provided data check
      let index;
      if (productId === undefined) index = -1;         
      else if (typeof productId === 'number') index = productId;
      else if (typeof productId === 'string') {
         for (let i = 0; i < this.products.length; i++) {
            this.products[i].name.indexOf(productId) >= 0 && (index = i);
         }
      } else throw new Error('Data type is unsupported! Provide an integer or a string.');

      // Use stealth plugin in puppeteer
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
      // await page.setDefaultNavigationTimeout(0);
      // await page.setDefaultTimeout(0);

      // Random user agent
      const userAgent = randomUseragent.getRandom(function (ua) {
         return (ua.osName === 'Windows' && parseFloat(ua.browserVersion) >=20);
      });
      await page.setUserAgent(userAgent);
      console.log('USERAGENT:', userAgent);

      // Abort fonts and images in page loading
      await page.setRequestInterception(true);
      page.on('request', (req) => {
         if (req.resourceType() == 'font' || req.resourceType() == 'image')
            req.abort();
         else req.continue();
      });

      console.log('INDEX: ', index);

      if (index > -1) {
         const product = this.products[index];
         if (!product) throw new Error('Product is undefined!');
         else for (let shopName in product.links) await getShopPrice(page, product, shopName);
      } else {
         for (let product of this.products) {
            if (!product.name) break; // If product doesn't have name, don't evaluate its prices
            else {
               for (let linkName in product.links) {
                  const link = product.links[linkName];
                  if (!link) break;
                  else await getShopPrice(page, product, linkName);
               }
            }
         }
      }

      await browser.close();
   }
}

export { Product, Scraper };
