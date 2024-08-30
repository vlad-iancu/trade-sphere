"use server";
import axios from "axios";
import xpath from "xpath";
//import {SelectReturnType} from "xpath"
import { DOMParser as dom } from "@xmldom/xmldom";
//import * as cheerio from "cheerio";
import { AssetData } from "@/data/Asset";

export const getAssetData = async (ticker: string): Promise<AssetData> => {
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
    const realtimePrice = results[0].firstChild.data ?? "0";
    const realtimePriceChange = results[1].firstChild.data ?? "0";
    const realtimePriceChangePercent = results[2].firstChild.data ?? "0";
    const nameSelector = "//section[contains(@class, 'container')]/h1";
    results = xpath.select(nameSelector, doc);
    const name = results[0].firstChild.data ?? "";

    return {
        data: [],
        id: { ticker, url, name },
        info: {
            realtimePrice,
            realtimePriceChange,
            realtimePriceChangePercent,
        },
    };

    //return res.json();
};
