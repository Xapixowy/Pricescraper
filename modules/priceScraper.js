import puppeteer from 'puppeteer-extra';
import puppeteerStealth from 'puppeteer-extra-plugin-stealth';
import randomUseragent from 'random-useragent';
import fs from 'fs';

class Product {
   constructor(name, link) {
      this.name = '';
      this.links = {
         amazon: undefined,
         ceneo: undefined,
         euro: undefined,
         komputronik: undefined,
         media: undefined,
         morele: undefined,
         xkom: undefined,
      };
      this.prices = {
         amazon: 0,
         ceneo: 0,
         euro: 0,
         komputronik: 0,
         media: 0,
         morele: 0,
         xkom: 0,
      };
      link && this.setLink(link);
   }
   setName(name) {}
   setLink(link) {
      if (link === undefined) throw new Error('Link is undefined! You need to enter a link!');
      const type = typeof link;
      if (type === 'string') {
         if (link.indexOf('www.amazon.pl') >= 0) links.amazon = link;
         else if (link.indexOf('www.ceneo.pl') >= 0) this.links.ceneo = link;
         else if (link.indexOf('www.euro.pl') >= 0) this.links.euro = link;
         else if (link.indexOf('www.komputronik.pl') >= 0) this.__links.komputronik = link;
         else if (link.indexOf('www.media.pl') >= 0) this.links.media = link;
         else if (link.indexOf('www.morele.pl') >= 0) this.links.morele = link;
         else if (link.indexOf('www.xkom.pl') >= 0) this.links.xkom = link;
         else throw new Error('Provided link is incorrect! Check if your shop is supported.');
      } else if (type === 'object') {
         this.links.amazon = link.amazon;
         this.links.ceneo = link.ceneo;
         this.links.euro = link.euro;
         this.links.komputronik = link.komputronik;
         this.links.media = link.media;
         this.links.morele = link.morele;
         this.links.xkom = link.xkom;
      } else throw new Error('Incorrect type of data! You need to provide string or object.');
   }
   getLink(shop) {
      if (shop === undefined) throw new Error('Shop is undefined! You need to specify a shop!');
      else if (shop === 'amazon') return this.links.amazon;
      else if (shop === 'ceneo') return this.links.ceneo;
      else if (shop === 'euro') return this.links.euro;
      else if (shop === 'komputronik') return this.links.komputronik;
      else if (shop === 'media') return this.links.media;
      else if (shop === 'morele') return this.links.morele;
      else if (shop === 'xkom') return this.links.xkom;
      else throw new Error('Shop with that name is unsupported!');
   }
   setPrice(shop, price) {
      if (price === undefined) throw new Error('Price is undefined! You need to enter a price!');
      const priceFloat = parseFloat(price);
      if (shop === undefined) throw new Error('Shop is undefined! You need to specify a shop!');
      else if (shop === 'amazon') this.prices.amazon = priceFloat;
      else if (shop === 'ceneo') this.prices.ceneo = priceFloat;
      else if (shop === 'euro') this.prices.euro = priceFloat;
      else if (shop === 'komputronik') this.prices.komputronik = priceFloat;
      else if (shop === 'media') this.prices.media = priceFloat;
      else if (shop === 'morele') this.prices.morele = priceFloat;
      else if (shop === 'xkom') this.prices.xkom = priceFloat;
      else throw new Error('Shop with that name is unsupported!');
   }
   getPrice(shop) {
      if (shop === undefined) throw new Error('Shop is undefined! You need to specify a shop!');
      else if (shop === 'amazon') return this.prices.amazon;
      else if (shop === 'ceneo') return this.prices.ceneo;
      else if (shop === 'euro') return this.prices.euro;
      else if (shop === 'komputronik') return this.prices.komputronik;
      else if (shop === 'media') return this.prices.media;
      else if (shop === 'morele') return this.prices.morele;
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
}

export { Product, Scraper };
