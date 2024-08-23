import TickerAvatar from "../../../components/TickerAvatar";

export default function Page({params}: {params: {ticker: string}}) {
    
    return (
        <div>
            <h1>{params.ticker}</h1>
            <TickerAvatar ticker={params.ticker} />
        </div>
    )
}