import styles from "@/styles/Ticker.module.scss";

export default function TickerAvatar({
    ticker,
    width = 48,
    height = 48,
}: {
    ticker: string;
    width?: number;
    height?: number;
}) {
    return (
        <div className={styles.ticker} style={{ width, height }}>
            {ticker}
        </div>
        /* <img
            src={`https://finnhub.io/api/logo?symbol=${ticker}`}
            className={styles["ticker-img"]}
            width={hasImg ? width : 0}
            height={hasImg ? height : 0}
            // onError={() => {
            //     console.log("Error loading image")
            //     setImgLoading(false)
            // }}
            // onAbort={() => setImgLoading(false)}
            // onAbortCapture={() => setImgLoading(false)}
            // onLoad={() => {
            //     setImgLoaded(true)
            //     setImgLoading(false)
            // }}
        /> */
    );
}
