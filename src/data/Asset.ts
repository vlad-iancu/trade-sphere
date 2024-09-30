export type AssetPreview = {
    ticker: string;
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

export type AssetAttributes = {
    price: number;
    priceChange: number;
    priceChangePercent: number;
};

export type AssetInfo = {
    last: AssetAttributes;
    afterHours?: AssetAttributes;
};
export type AssetData = {
    id: AssetPreview;
    data: OHLCV[];
    info: AssetInfo;
};
