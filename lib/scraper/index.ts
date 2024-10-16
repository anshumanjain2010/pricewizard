"use server"

import axios from 'axios'
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';

export async function scrapeAmazonProduct(url: string){
    if(!url) return;
    
    // BrightData proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port= 22225;
    const session_id= (1000000* Math.random())|0;
    const options ={
        auth: {
            username: `${username}-session-$(session_id)`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }
    try{
//// Fetch the product page
        const response = await axios.get(url,options);
        const $= cheerio.load(response.data);

        //Extract he product title
        const title= $('#productTitle').text().trim();
        console.log(title);
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a-price.a-text-price')
        );

        const originalPrice= extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        )

        const OutOfStock= $('#availability span').text().trim().toLowerCase()
        ==='currently unavailable'

        const images= 
            $('#imgBlkFront').attr('data-a-dynamic-image')||
            $('#landingImage').attr('data-a-dynamic-image')||
            '{}' // this is used to parse in the below line. as we are using Object.

        const imageUrls = Object.keys(JSON.parse(images));

        const currency = extractCurrency($('.a-price-symbol'))
        const discountRate= $('.savingPercentage').text().replace(/[-%]/g,"");

        // console.log({title,currentPrice,originalPrice,OutOfStock,imageUrls,currency,discountRate}); 

        // Construct data object with scraped information
        const description= extractDescription($)
        const data= {
            url,
            currency: currency || '$',
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice)|| Number(originalPrice),
            originalPrice: Number(originalPrice)|| Number(currentPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: 'category',
            reviewsCount: 100,
            stars: 4.5,
            isOutOfStock: OutOfStock,
            description,
            lowestPrice: Number(currentPrice)|| Number(originalPrice),
            highestPrice: Number(originalPrice)|| Number(currentPrice),
            averagePrice: Number(currentPrice)|| Number(originalPrice),
        }
        return data;
        // console.log(data)
    }
    catch (error: any){
        throw new Error('Failed to scrape product: ${error.message}')
    }
}

/*
axios-> used to make API calls,
cherio-> parsing and manipulating html.
*/