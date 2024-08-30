"use client";
import TickerAvatar from "@/app/components/TickerAvatar";
import { AssetInfo } from "@/data/Asset";
import { getAssetData } from "@/data/yfinance/asset";
import { useEffect, useState } from "react";

export default function RealtimeStockInfo({
    params,
    timeout = 1000 * 10,
    initialData,
}: {
    params: { ticker: string };
    timeout?: number;
    initialData: AssetInfo;
}) {
    const [assetData, setAssetData] = useState<AssetInfo | null>(initialData);
    // const fetchData = useCallback(async () => {
    //     const data = await getAssetData(params.ticker);
    //     setAssetData(data.info);
    // }, [params.ticker]);
    useEffect(() => {
        //fetchData();
        // const fetchData = () => {
        //     getAssetData(params.ticker).then((data) => {
        //         setAssetData(data.info);
        //     });
        // }
        const intervalId = setInterval(async () => {
            console.log("Fetching data");
            const data = (await getAssetData(params.ticker)).info;
            console.log(data);
            setAssetData(data);

            console.log("Fetched data");
            // getAssetData(params.ticker)
            //     .then((data) => {
            //         setAssetData(data.info);
            //     })
            //     .catch((e) => {
            //         console.error(e);
            //     });
        }, timeout);
        return () => {
            clearInterval(intervalId);
        };
    }, [timeout]);

    const pricesElements = assetData ? (
        <>
            {assetData.realtimePrice}
            {assetData.realtimePriceChange}
            {assetData.realtimePriceChangePercent}
        </>
    ) : (
        <span>We don't have data yet</span>
    );
    return (
        <>
            <TickerAvatar ticker={params.ticker} />
            {pricesElements}
        </>
    );
}
