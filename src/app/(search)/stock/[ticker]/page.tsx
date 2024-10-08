"use server";
import SignedIn from "@/app/components/SignedIn";
import RealtimeStockInfo from "./RealtimeStockInfo";
import { getAssetData } from "@/data/yfinance/asset";
import { AssetInfo } from "@/data/Asset";
import { notFound } from "next/navigation";
import TickerAvatar from "@/app/components/TickerAvatar";

export default async function Page({ params }: { params: { ticker: string } }) {
    await SignedIn();
    let info: AssetInfo;
    try {
        info = (await getAssetData(params.ticker)).info;
    } catch (e) {
        console.error(e);
        notFound();
    }

    return (
        <div id="stock-div" style={{ height: "100%" }}>
            <TickerAvatar ticker={params.ticker} />
            <RealtimeStockInfo params={params} />
        </div>
    );
}
