/* eslint-env browser */
"use client";
import { AssetInfo } from "@/data/Asset";
import { getAssetData } from "@/data/yfinance/asset";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/Stock.module.scss";
import { io, Socket } from "socket.io-client";

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
        price: "",
        priceChange: "",
        priceChangePercent: "",
    });
    //wrap getPriceClass in useCallback to prevent infinite loop
    const getPriceClass = useCallback((price: number) => {
        return price >= 0.0 ? "gain" : "loss";
    }, []);

    const priceRef = useRef<HTMLSpanElement>(null);
    const priceChangeRef = useRef<HTMLSpanElement>(null);
    const priceChangePercentRef = useRef<HTMLSpanElement>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    const priceRegex = /^(.*)MarketPrice$/;
    const priceChangeRegex = /^(.*)MarketChange$/;
    const priceChangePercentRegex = /^(.*)MarketChangePercent$/;

    useEffect(() => {
        const socket = io();
        setSocket(socket);
        socket.on("connect", () => {
            console.log("connected");
            socket.emit("message", params.ticker);
        });
        socket.on("message", (msg: string) => {
            const comps = msg.split(" ");
            console.log("message: " + msg);
            console.log(`first comp is ${comps[0]}`);
            if (comps[0] == "regularMarketPrice") {
                console.log("regularMarketPrice: " + msg);
                //setMessage(comps[1]);
            }

            if (comps[0].match(priceRegex)) {
                const price = parseFloat(comps[1]);
                setAssetData((prev) => {
                    priceRef.current?.classList.add(
                        styles[
                            `${getPriceClass(price - prev.last.price)}-animation`
                        ]
                    );
                    return {
                        ...prev,
                        last: {
                            ...prev.last,
                            price,
                        },
                    };
                });
            }

            if (comps[0].match(priceChangeRegex)) {
                const priceChange = parseFloat(comps[1]);
                setAssetData((prev) => {
                    console.log(
                        `difference in price change ${priceChange - prev.last.priceChange}`
                    );
                    priceChangeRef.current?.classList.add(
                        styles[
                            `${getPriceClass(priceChange - prev.last.priceChange)}-animation`
                        ]
                    );
                    return {
                        ...prev,
                        last: {
                            ...prev.last,
                            priceChange,
                        },
                    };
                });
            }
            if (comps[0].match(priceChangePercentRegex)) {
                const priceChangePercent = parseFloat(
                    comps[1].replace(/[^0-9.+-]/g, "")
                );
                setAssetData((prev) => {
                    priceChangePercentRef.current?.classList.add(
                        styles[
                            `${getPriceClass(priceChangePercent - assetData.last.priceChangePercent)}-animation`
                        ]
                    );
                    return {
                        ...prev,
                        last: {
                            ...prev.last,
                            priceChangePercent,
                        },
                    };
                });
            }
        });
        const dataCopy = { ...assetData };

        return () => {
            socket.disconnect();
            setSocket(null);
        };
    }, []);
    /* useEffect(() => {
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

            if (data.last.price != assetData.last.price) {
                priceRef.current?.classList.add(
                    styles[
                        `${getPriceClass(data.last.price - assetData.last.price)}-animation`
                    ]
                );
            }
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
 */
    useEffect(() => {
        setPriceClasses({
            price: getPriceClass(assetData.last.price),
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
                    ref={priceRef}
                    className={styles[priceClasses.price]}
                    onAnimationEnd={() => {
                        removeAnimation(priceRef);
                    }}
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
