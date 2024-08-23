"use server";
import styles from "@/styles/Ticker.module.scss"

export default async function TickerAvatar({ ticker, width = 48, height = 48 }: { ticker: string, width?: number, height?: number }) {
    
    let hasImg = true
    try {
        const res = await fetch(`https://finnhub.io/api/logo?symbol=${ticker}`)
        if(!res.ok) {
            hasImg = false
        }
    }
    catch (e) {
        hasImg = false
    }

    return (
        <>
            <div className={hasImg ? styles.hide : styles.ticker}>
                {ticker}
            </div>
            <img
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
            />
        </>

    )

}