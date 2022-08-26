// const { chromium } = require('playwright');
import { chromium } from 'playwright';
import { CSV_FILE_PATH, USER_AGENT } from './helpers/Constants.js';
import { readCsv, readCsvCore, writeCsv, writeCsvCore } from './helpers/csvHelper.js';
import { sendEmail } from './helpers/emailHelper.js';
import { ALIEXPRESS, AMAZON, BANGGOOD, EL_CORTE_INGLES, PCCOMPONENTES, BERSHKA, MEDIAMARKT, NIKE, PULL_AND_BEAR, WORTEN } from './helpers/Vendors.js';
import Product from './models/Product.js';


const checkPrice = async (page, priceLabel, productNameLabel) => {
  const price = await page.textContent(priceLabel)
  const name = await page.textContent(productNameLabel)
  return { price, name }
}

  ; (async () => {
    // -------------

    const data = await readCsvCore(CSV_FILE_PATH)

    const browser = await chromium.launch();
    
    let productsTemp = []
    
    for (const product of data) {
      const { vendor, url, id } = product
      console.log(`Checking ${vendor}...`)
      
      const page = await browser.newPage({ userAgent: USER_AGENT })
      await page.goto(url)

      let productToCheck = null

      if (url.includes(AMAZON)) productToCheck = await checkPrice(page, ".a-offscreen", "#productTitle")

      if (url.includes(ALIEXPRESS)) productToCheck = await checkPrice(page, ".product-price-value", ".product-title-text")

      if (url.includes(BANGGOOD)) productToCheck = await checkPrice(page, ".main-price", ".product-title-text")

      if (url.includes(EL_CORTE_INGLES)) productToCheck = await checkPrice(page, ".price", ".product_detail-title")

      if (url.includes(PCCOMPONENTES)) productToCheck = await checkPrice(page, ".h1", ".h4")

      if (url.includes(NIKE)) productToCheck = await checkPrice(page, ".product-price", "#pdp_product_title")

      if (url.includes(BERSHKA)) productToCheck = await checkPrice(page, ".current-price-elem", ".product-title")

      if (url.includes(PULL_AND_BEAR)) productToCheck = await checkPrice(page, ".hansolo", "#titleProductCard")

      if (url.includes(MEDIAMARKT)) productToCheck = await checkPrice(page, ".BrandedPriceFlexWrapper-sc-1r6586o-5", "h1")

      if (url.includes(WORTEN)) productToCheck = await checkPrice(page, ".w-product__price__current", ".w-product__name")

      productsTemp.push(new Product(id, productToCheck.name.trim(), vendor, url, productToCheck.price, new Date().toLocaleString()))
    }

    await browser.close()
    // writeCsv(productsTemp)


    // Enviar email con los productos

    let mensaje = `<h3>${new Date().toLocaleString()}</h3><h2>Total productos: ${productsTemp.length}</h2>`
    productsTemp.forEach(product => {
      mensaje += `<div style="border: 1px solid black;
      padding:15px;
      border-radius: 15px;
      margin-bottom:15px;">
      <p><b>${product.name}</b></p>
      <ul>
      <li>Vendor: <b>${product.vendor}</b></li>
        <li>Precio: <b>${product.price}</b></li>
        <li>Url: <b><a href="${product.url}">Enlace</a></b></li>
      </ul>
    </div> \n`
    })

    sendEmail("Productos actualizados", mensaje)


  })()
