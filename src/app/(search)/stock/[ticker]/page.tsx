"use server";
import SignedIn from "@/app/components/SignedIn";
import RealtimeStockInfo from "./RealtimeStockInfo";
import { getAssetData } from "@/data/yfinance/asset";
import { AssetInfo } from "@/data/Asset";
import { notFound } from "next/navigation";

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
            <RealtimeStockInfo params={params} initialData={info} />
        </div>
    );
}
