"use client";
import { useState } from "react";
import { getAssetData } from "@/data/yfinance/asset";
import { search, SearchResult } from "@/data/yfinance/search";
import styles from "@/styles/Search.module.scss";
import searchIcon from "@/assets/search.svg";
import colors from "@/styles/colors.module.scss";
//Use Route groups to move the search into a layout for dashboard stocks and 
// potentially other pages
export default function Search() {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [hasFocus, setHasFocus] = useState(false);
    return (
        <div className={styles["search-container"]}
            onFocus={() => setHasFocus(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node))
                    setHasFocus(false)
            }}>
            <input
                type="text"
                className={styles.search}

                style={{
                    background: `url(${searchIcon.src}) no-repeat calc(100% - 8px)`,
                    backgroundSize: "20px",
                    borderBottomLeftRadius: searchResults.length > 0 && hasFocus ? "0" : "10px",
                    borderBottomRightRadius: searchResults.length > 0 && hasFocus ? "0" : "10px",
                }}
                placeholder="Search for stocks and ETFs"
                onChange={async ({ target: { value } }) => {
                    if (value) {
                        const data = await search(value);
                        for (const asset of data) {
                            // const assetData = await getAssetData(asset.ticker);
                        }
                        setSearchResults(data);
                    }
                    else {
                        setSearchResults([]);
                    }


                }} />
            {hasFocus && searchResults.map((result, i) => (
                <a
                    onFocus={() => setHasFocus(true)}
                    href={`/stock/${result.ticker}`}
                    className={styles["search-result-item"]}
                    style={{
                        borderBottomLeftRadius: i === searchResults.length - 1 ? "10px" : "0",
                        borderBottomRightRadius: i === searchResults.length - 1 ? "10px" : "0",
                        borderBottom: i === searchResults.length - 1 ? `1px solid ${colors.gray}` : "none",
                    }}
                >
                    {result.ticker}
                </a>
            ))}
        </div>

    )
}