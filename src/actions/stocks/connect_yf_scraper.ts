/* eslint-env node */
//"use server";
import { Socket } from "socket.io";
import * as puppeteer from "puppeteer";
import { decode } from "@auth/core/jwt";
import cookie from "cookie";

/* eslint-disable */
let tickerPages = new Map<
    string,
    { page: puppeteer.Page; sockets: Socket[]; timer?: NodeJS.Timeout }
>();
/* eslint-enable */
function printServerStatus() {
    const keys = Array.from(tickerPages.keys());
    for (const key of keys) {
        console.log(
            `Key: ${key}, sockets: ${tickerPages.get(key)?.sockets.length}`
        );
    }
}
async function skipTerms(page: puppeteer.Page) {
    const navigationPromise = page.waitForNavigation({
        waitUntil: "domcontentloaded",
    });

    await page.evaluate(`
        (async () => {
        const formAction = window.location.href;
        const formData = new URLSearchParams();

        const form = document.querySelector(".consent-form");
        const csrfToken = form.querySelector("input[name='csrfToken']").value;
        const sessionId = form.querySelector("input[name='sessionId']").value;
        const originalDoneUrl = form.querySelector(
            "input[name='originalDoneUrl']"
        ).value;
        const namespace = form.querySelector("input[name='namespace']").value;
        formData.append("csrfToken", csrfToken);
        formData.append("sessionId", sessionId);
        formData.append("originalDoneUrl", originalDoneUrl);
        formData.append("namespace", namespace);
        formData.append("agree", "agree");
        formData.append("agree", "agree");
        const reject = form.querySelector("button[name='reject']");
        reject.remove();
        
        await form.submit();   
    })();     
    `);
    const selectorPromise =  page.waitForSelector(
        "section[data-testid='quote-price'] div section div:nth-child(1) fin-streamer"
    );
    const skipPromise = Promise.all([navigationPromise, selectorPromise]);
    await skipPromise
    //await delay(2000);
}
async function delay(time: number): Promise<void> {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

function send_to_client(priceType: string, priceText: string, ticker: string) {
    const entry = tickerPages.get(ticker);
    /* console.log(`Is entry null? ${entry == null}`);
    console.log(`Is entry undefined? ${entry == undefined}`); */
    //console.log(`Ticker: ${ticker}`);
    if (entry) {
        //console.log(`Entry found for ticker: ${ticker}`);
        const { sockets } = entry;
        for (const socket of sockets) {
            socket.emit("message", `${priceType} ${priceText}`);
            //console.log(`Send to client: ${priceType} ${priceText}`);
        }
    }
}
async function sendCurrentPrice(socket: Socket, ticker: string) {
    const entry = tickerPages.get(ticker);
    if (entry) {
        const { page } = entry;
        const priceSelector =
            "section[data-testid='quote-price'] div section:last-child div:nth-child(1) fin-streamer span";
        const priceTexts = await page.$$eval(priceSelector, (spans) => {
            return spans.map((span) => span.textContent);
        });
        const priceTypes = await page.$$eval(priceSelector, (spans) => {
            return spans.map((span) =>
                span.parentElement?.getAttribute("data-field")
            );
        });
        //Send all prices with their equivalent price type to client
        priceTexts.forEach((priceText, index) => {
            const priceType = priceTypes[index];
            console.log(`Send to existing client: ${priceType} ${priceText}`);

            socket.emit("message", `${priceType} ${priceText}`);
            console.log(
                `Send current price to client: ${priceType} ${priceText}`
            );
        });
        //socket.emit("message", `${priceType} ${priceText}`);
        //console.log(`Sent current price to client: ${priceType} ${priceText}`);
    } else {
        console.log(`No entry found for ticker: ${ticker}`);
    }
}

function server_print(msg: string) {
    console.log(msg);
}

export async function createTickerPage(
    ticker: string,
    socket?: Socket
): Promise<puppeteer.Page> {
    const browser = await puppeteer.launch({
        //executablePath: "/usr/bin/google-chrome",
        headless: true,
        devtools: true,
    });
    const page = await browser.newPage();
    await page.exposeFunction("send_to_client", send_to_client);
    await page.exposeFunction("server_print", server_print);
    await page.goto(`https://finance.yahoo.com/quote/${ticker}`, {
        waitUntil: "networkidle2",
    });
    //
    await skipTerms(page);
    console.log("Skipped terms");
    // Add page to tocker sockets
    if (socket) {
        if (tickerPages.has(ticker)) {
            tickerPages.get(ticker)?.sockets.push(socket);
            console.log(`Added socket to existing ticker page: ${ticker}`);
        } else {
            tickerPages.set(ticker, { page, sockets: [socket] });
            console.log(`Created new ticker page: ${ticker}`);
        }
    }
    await page.evaluate(() => {
        /* eslint-disable */
        //print_server("Evaluating");
        //console.log("Evaluating");
        const spanFinstreamerSelector =
            "section[data-testid='quote-price'] div section div fin-streamer span";
        const spans = document.querySelectorAll(spanFinstreamerSelector);
        const lastSpanFinstreamerSelector =
            "section[data-testid='quote-price'] div section:last-child  div:nth-child(1) fin-streamer span";
        const lastSpans = document.querySelectorAll(
            lastSpanFinstreamerSelector
        );
        const intervalId = setInterval(() => {
            lastSpans.forEach((span) => {
                const priceText = span.textContent;
                const priceType =
                    span.parentElement?.getAttribute("data-field");
                const symbol = span.parentElement?.getAttribute("data-symbol");
                send_to_client(priceType!, priceText!, symbol!);
                /* server_print(
                `Send last spans to client: ${priceType} ${priceText}`
            ); */
            });
        }, 1000);
        // Attach a mutation observer to the span elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type == "childList") {
                    const node = mutation.target;
                    const parent = node.parentElement;
                    const priceText = node.textContent;
                    const priceType = parent?.getAttribute("data-field");
                    const symbol = parent?.getAttribute("data-symbol");
                    send_to_client(priceType!, priceText!, symbol!);
                    //server_print("Send to client");
                    //clearInterval(intervalId);
                }
            });
        });
        const config = { attributes: true, childList: true, subtree: true };
        spans.forEach((span) => {
            observer.observe(span, config);
        });
        /* eslint-enable */
    });
    await delay(100);
    const lastSpanFinstreamerSelector =
        "section[data-testid='quote-price'] div section:last-child  div:nth-child(1) fin-streamer span";
    const lastSpans = await page.$$(lastSpanFinstreamerSelector);
    lastSpans.forEach(async (span) => {
        const priceText = await span.evaluate((node) => node.textContent);
        const priceType = await span.evaluate((node) =>
            node.parentElement?.getAttribute("data-field")
        );
        const symbol = await span.evaluate((node) =>
            node.parentElement?.getAttribute("data-symbol")
        );
        send_to_client(priceType!, priceText!, symbol!);
        //server_print(`Send last spans to client: ${priceType} ${priceText}`);
    });
    return page;
}

async function recreatePage(ticker: string) {
    const entry = tickerPages.get(ticker);
    if (!entry) {
        return;
    }
    const page = await createTickerPage(ticker);
    const existingPage = entry.page;
    await existingPage.browser().close();
    entry.page = page;
    console.log(`Recreated page for ticker: ${ticker}`);
}

export async function connect(socket: Socket) {
    socket.on("message", async (msg: string) => {
        //const token = socket.handshake.headers.
        if (!socket.handshake.headers.cookie) {
            socket.disconnect();
            return;
        }
        const token = cookie.parse(socket.handshake.headers["cookie"] ?? "")[
            "authjs.session-token"
        ];
        //console.log(`Token: ${token}`);
        const decodedToken = await decode({
            token,
            secret: process.env.AUTH_SECRET ?? "",
            salt: "authjs.session-token", // __Secure-authjs.session-token
        });
        if (decodedToken == null) {
            socket.disconnect();
            return;
        } /*  else {
            console.log(`Decoded token id: ${decodedToken?.auth0Id}`);
        } */
        const ticker: string = msg;
        if (tickerPages.has(ticker)) {
            const entry = tickerPages.get(ticker);
            if (entry) {
                entry.sockets.push(socket);
                sendCurrentPrice(socket, ticker);
            }
        } else {
            await createTickerPage(ticker, socket);
            const entry = tickerPages.get(ticker);
            if (entry) {
                const MINUTES = 60 * 1000;
                const timer = setInterval(
                    () => {
                        recreatePage(ticker);
                    },
                    parseFloat(
                        process.env.STOCK_PRICE_PAGE_RECREATE_INTERVAL ?? "1"
                    ) * MINUTES
                );
                console.log(
                    `Recreating page once in ${
                        parseFloat(
                            process.env.STOCK_PRICE_PAGE_RECREATE_INTERVAL ??
                                "1"
                        ) * MINUTES
                    } milliseconds`
                );
                entry.timer = timer;
            }
            //tickerPages.set(ticker, { page, sockets: [socket] });
        }
        printServerStatus();
    });
    socket.on("disconnect", () => {
        // Delete the page associated with the socket
        tickerPages.forEach((value, key) => {
            if (value.sockets.includes(socket)) {
                value.sockets.splice(value.sockets.indexOf(socket), 1);
                if (value.sockets.length == 0) {
                    value.page.browser().close();
                    if (value.timer) {
                        clearInterval(value.timer);
                        console.log(`Cleared timer for ticker: ${key}`);
                    }
                    tickerPages.delete(key);
                }
            }
        });
        printServerStatus();
    });
}
