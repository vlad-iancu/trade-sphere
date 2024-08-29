"use server";
export interface SearchResult {
    ticker: string;
    name: string;
}

export async function search(query: string): Promise<SearchResult[]> {
    const response = await fetch(
        `https://query2.finance.yahoo.com/v1/finance/search?q=${query}&quotesCount=6&newsCount=0`
    );
    const data = await response.json();
    const result: SearchResult[] = data.quotes.map(
        (quote: any): SearchResult => ({
            ticker: quote.symbol,
            name: quote.shortname,
            // exchange: quote.exchange,
            // type: quote.quoteType,
        })
    );

    return result;
}
