export type AssetPreview = {
    ticker: string;
    url: string;
    name: string;
};
export interface OHLCV {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
}

export type Candle = OHLCV;

export type AssetInfo = {
    realtimePrice: number;
    realtimePriceChange: number;
    realtimePriceChangePercent: number;
};
export type AssetData = {
    id: AssetPreview;
    data: OHLCV[];
    info: AssetInfo;
};
