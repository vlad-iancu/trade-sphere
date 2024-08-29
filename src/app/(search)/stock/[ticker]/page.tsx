import TickerAvatar from "../../../components/TickerAvatar";

export default function Page({ params }: { params: { ticker: string } }) {
    return (
        <div id="stock-div" style={{ height: "100%" }}>
            <TickerAvatar ticker={params.ticker} />
        </div>
    );
}
