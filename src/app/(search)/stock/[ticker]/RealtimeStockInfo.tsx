/* eslint-env browser */
"use client";
import { AssetInfo } from "@/data/Asset";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/Stock.module.scss";
import { io, Socket } from "socket.io-client";

export default function RealtimeStockInfo({
    params,
}: {
    params: { ticker: string };
    timeout?: number;
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [assetData, setAssetData] = useState<AssetInfo>({
        last: { price: 0, priceChange: 0, priceChangePercent: 0 },
    });
    const [socket, setSocket] = useState<Socket | null>(null);
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

    const priceRegex = /^(.*)MarketPrice$/;
    const priceChangeRegex = /^(.*)MarketChange$/;
    const priceChangePercentRegex = /^(.*)MarketChangePercent$/;

    const makeSocket = useCallback(() => {
        const socket = io({
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 3,
            timeout: 20000,
        });
        setSocket(socket);
        socket.on("connect", () => {
            socket.emit("message", params.ticker);
        });
        socket.on("disconnect", () => {
            setSocket(null);
        });
        socket.on("connect_error", () => {
            console.log("Connection error");
            setSocket(null);
        });

        socket.on("message", (msg: string) => {
            setIsLoaded(true);
            const comps = msg.split(" ");
            console.log(msg);
            if (comps[0].match(priceRegex)) {
                const price = parseFloat(comps[1]);
                console.log(`Price: ${price}`);
                setAssetData((prev) => {
                    if (prev.last.price === price) return prev;
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
                    if (prev.last.priceChange === priceChange) return prev;
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
                    if (prev.last.priceChangePercent === priceChangePercent)
                        return prev;
                    priceChangePercentRef.current?.classList.add(
                        styles[
                            `${getPriceClass(priceChangePercent - prev.last.priceChangePercent)}-animation`
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
        return socket;
    }, []);
    useEffect(() => {
        const socket = makeSocket();
        return () => {
            socket.disconnect();
        };
    }, []);

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

    const formatDifference = useCallback((nr: number) => {
        return nr >= 0 ? `+${nr}` : nr;
    }, []);
    if (!isLoaded) {
        return <div className={styles.loading}>Loading...</div>;
    }
    return (
        <div>
            <div
                style={{
                    opacity: socket == null ? 0.5 : 1.0,
                    display: "inline",
                }}
            >
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
                    {formatDifference(assetData.last.priceChange)}
                </span>
                <span
                    className={styles[priceClasses.priceChangePercent]}
                    ref={priceChangePercentRef}
                    onAnimationEnd={() => {
                        removeAnimation(priceChangePercentRef);
                    }}
                >
                    {formatDifference(assetData.last.priceChangePercent)}
                    {"%"}
                </span>
            </div>
            {socket == null && (
                <button
                    onClick={() => {
                        makeSocket();
                        /* socket.on("disconnect", () => {
                            setSocket(null);
                        }); */
                    }}
                >
                    Retry connection
                </button>
            )}
        </div>
    );
}
