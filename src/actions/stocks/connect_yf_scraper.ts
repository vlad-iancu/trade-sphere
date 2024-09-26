//"use server";
import { Socket } from "socket.io";
import * as puppeteer from "puppeteer";

let tickerPages = new Map<
    string,
    { page: puppeteer.Page; sockets: Socket[] }
>();

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
    await navigationPromise;

    await page.waitForSelector(
        "section[data-testid='quote-price'] div section div:nth-child(1) fin-streamer"
    );
    //await delay(2000);
}

function send_to_client(priceType: string, priceText: string, ticker: string) {
    const entry = tickerPages.get(ticker);
    /* console.log(`Is entry null? ${entry == null}`);
    console.log(`Is entry undefined? ${entry == undefined}`); */
    if (entry) {
        const { sockets } = entry;
        for (const socket of sockets) {
            socket.emit("message", `${priceType} ${priceText}`);
        }
    }
}
export async function createTickerPage(
    ticker: string
): Promise<puppeteer.Page> {
    const browser = await puppeteer.launch({
        //executablePath: "/usr/bin/google-chrome",
        headless: true,
        devtools: true,
    });
    const page = await browser.newPage();
    await page.exposeFunction("send_to_client", send_to_client);
    await page.goto(`https://finance.yahoo.com/quote/${ticker}`, {
        waitUntil: "networkidle2",
    });
    //
    await skipTerms(page);
    //console.log("Skipped terms");
    await page.evaluate(() => {
        /* eslint-disable */
        //print_server("Evaluating");
        //console.log("Evaluating");
        const spanFinstreamerSelector =
            "section[data-testid='quote-price'] div section div fin-streamer span";
        const spans = document.querySelectorAll(spanFinstreamerSelector);
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
                }
            });
        });
        const config = { attributes: true, childList: true, subtree: true };
        spans.forEach((span) => {
            observer.observe(span, config);
        });
        /* eslint-enable */
    });
    return page;
}
export async function connect(socket: Socket) {
    socket.on("message", async (msg: string) => {
        const ticker: string = msg;
        if (tickerPages.has(ticker)) {
            const entry = tickerPages.get(ticker);
            if (entry) {
                entry.sockets.push(socket);
            }
        } else {
            const page = await createTickerPage(ticker);
            tickerPages.set(ticker, { page, sockets: [socket] });
        }
    });
    socket.on("disconnect", () => {
        // Delete the page associated with the socket
        tickerPages.forEach((value, key) => {
            if (value.sockets.includes(socket)) {
                value.sockets.splice(value.sockets.indexOf(socket), 1);
                if (value.sockets.length == 0) {
                    value.page.browser().close();
                    tickerPages.delete(key);
                }
            }
        });
    });
}
