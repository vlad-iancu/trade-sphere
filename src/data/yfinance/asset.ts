"use server";
import axios from "axios";
import xpath from "xpath";
//import {SelectReturnType} from "xpath"
import { DOMParser as dom } from "@xmldom/xmldom";
//import * as cheerio from "cheerio";
import { AssetData /* AssetInfo */ } from "@/data/Asset";
import SignedIn from "@/app/components/SignedIn";

/* const sampleInfo: AssetInfo[] = [
    {
        last: {
            price: 100.0,
            priceChange: 1.0,
            priceChangePercent: 1.0,
        },
        afterHours: {
            price: 101.0,
            priceChange: 1.0,
            priceChangePercent: 1.0,
        },
    },
    {
        last: {
            price: 200.0,
            priceChange: 2.0,
            priceChangePercent: 2.0,
        },
        afterHours: {
            price: 201.0,
            priceChange: 2.0,
            priceChangePercent: 2.0,
        },
    },
    {
        last: {
            price: 300.0,
            priceChange: 3.0,
            priceChangePercent: 3.0,
        },
        afterHours: {
            price: 301.0,
            priceChange: 3.0,
            priceChangePercent: 3.0,
        },
    },
]; */

//let sampleIndex = 0;

export const getAssetData = async (ticker: string): Promise<AssetData> => {
    await SignedIn();
    //ticker = "SPY"
    // axios.defaults.headers["Cache-Control"] = "no-cache";
    // axios.defaults.headers["Pragma"] = "no-cache";
    // axios.defaults.headers["Expires"] = "0";
    const res = await axios.get(
        `https://finance.yahoo.com/quote/${ticker}?custom_user_timestamp=${new Date().getTime()}`
    );
    const doc = new dom({
        locator: {},
        errorHandler: {
            warning: function () {},
            error: function () {},
            fatalError: function (e) {
                console.error(e);
            },
        },
    }).parseFromString(res.data);
    const pricesSelector =
        "//section[@data-testid='quote-price']/div/section//*/span";
    let results: any = xpath.select(pricesSelector, doc);
    const marketPrice = results[0].firstChild.data ?? "0";
    const marketPriceChange = results[1].firstChild.data ?? "0";
    const marketPriceChangePercent = (
        results[2].firstChild.data ?? "0"
    ).replace(/[^0-9.+-]/g, "");
    const nameSelector = "//section[contains(@class, 'container')]/h1";
    results = xpath.select(nameSelector, doc);
    const name = results[0].firstChild.data ?? "";
    //sampleIndex++;
    
    //Make it so that when a user browses a stock page, there will be a real time websocket connection to the server which would stream data from
    // a puppeteer instance that would be running in the background. The puppeteer instance would be scraping the data from the yahoo finance page
    return {
        data: [],
        id: { ticker, name },
        info: /* sampleInfo[(sampleIndex - 1) % sampleInfo.length] */ {
            last: {
                price: marketPrice,
                priceChange: marketPriceChange,
                priceChangePercent: marketPriceChangePercent,
            },
            afterHours: {
                price: 0,
                priceChange: 0,
                priceChangePercent: 0,
            },
        },
    };

    //return res.json();
};
