/* eslint-env browser */
"use client";
import { AssetInfo } from "@/data/Asset";
import { getAssetData } from "@/data/yfinance/asset";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/Stock.module.scss";

export default function RealtimeStockInfo({
    params,
    timeout = 1000 * 20,
    initialData,
}: {
    params: { ticker: string };
    timeout?: number;
    initialData: AssetInfo;
}) {
    const [assetData, setAssetData] = useState<AssetInfo>(initialData);
    const [priceClasses, setPriceClasses] = useState({
        //price: "",
        priceChange: "",
        priceChangePercent: "",
    });
    //wrap getPriceClass in useCallback to prevent infinite loop
    const getPriceClass = useCallback((price: number) => {
        return price >= 0.0 ? "gain" : "loss";
    }, []);

    //const priceRef = useRef<HTMLSpanElement>(null);
    const priceChangeRef = useRef<HTMLSpanElement>(null);
    const priceChangePercentRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            const data = (await getAssetData(params.ticker)).info;
            console.log(data);
            if (
                data.last.price === assetData.last.price &&
                data.last.priceChange === assetData.last.priceChange &&
                data.last.priceChangePercent ===
                    assetData.last.priceChangePercent
            ) {
                return;
            }

            /* if (data.last.price != assetData.last.price) {
                priceRef.current?.classList.add(
                    styles[
                        `${getPriceClass(data.last.price - assetData.last.price)}-animation`
                    ]
                );
            } */
            if (data.last.priceChange != assetData.last.priceChange) {
                priceChangeRef.current?.classList.add(
                    styles[
                        `${getPriceClass(data.last.priceChange - assetData.last.priceChange)}-animation`
                    ]
                );
            }
            if (
                data.last.priceChangePercent !=
                assetData.last.priceChangePercent
            ) {
                priceChangePercentRef.current?.classList.add(
                    styles[
                        `${getPriceClass(data.last.priceChangePercent - assetData.last.priceChangePercent)}-animation`
                    ]
                );
            }
            setAssetData(data);
        }, timeout);
        return () => {
            clearInterval(intervalId);
        };
    }, [timeout, assetData, getPriceClass]);

    useEffect(() => {
        setPriceClasses({
            //price: getPriceClass(assetData.last.price),
            priceChange: getPriceClass(assetData.last.priceChange),
            priceChangePercent: getPriceClass(
                assetData.last.priceChangePercent
            ),
        });
    }, [assetData]);

    const removeAnimation = useCallback(
        (ref: React.RefObject<HTMLSpanElement>) => {
            ref.current?.classList.remove(styles["gain-animation"]);
            ref.current?.classList.remove(styles["loss-animation"]);
        },
        []
    );

    return (
        <>
            <div>
                <span
                    //ref={priceRef}
                    className={styles["price"]}
                    /* onAnimationEnd={() => {
                        removeAnimation(priceRef);
                    }} */
                >
                    {assetData.last.price}
                </span>
                <span
                    className={styles[priceClasses.priceChange]}
                    ref={priceChangeRef}
                    onAnimationEnd={() => {
                        removeAnimation(priceChangeRef);
                    }}
                >
                    {assetData.last.priceChange}
                </span>
                <span
                    className={styles[priceClasses.priceChangePercent]}
                    ref={priceChangePercentRef}
                    onAnimationEnd={() => {
                        removeAnimation(priceChangePercentRef);
                    }}
                >
                    {assetData.last.priceChangePercent}
                    {"%"}
                </span>
            </div>
        </>
    );
}
