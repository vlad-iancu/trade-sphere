type AssetPreview = {
    ticker: string,
    url: string,
    name: string,
}
interface OHLCV {
    o: number,
    h: number,
    l: number,
    c: number,
    v: number,
}

type Candle = OHLCV;

type AssetInfo = {
    realtimePrice: number,
    realtimePriceChange: number,
    realtimePriceChangePercent: number,
}
type AssetData = {
    id: AssetPreview,
    data: OHLCV[],
    info: AssetInfo,
}