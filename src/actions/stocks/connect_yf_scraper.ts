//"use server";
import { Socket } from "socket.io";
import * as puppeteer from "puppeteer";

let tickerPages = new Map<
    string,
    { page: puppeteer.Page; sockets: Socket[] }
>();
async function delay(time: number): Promise<void> {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
async function skipTerms(page: puppeteer.Page) {
    await page.waitForSelector("button[type='submit'][name='agree']");
    //readline.question('Press any key to continue...');
    await page.waitForSelector("button[id='scroll-down-btn']");
    await page.click("button[id='scroll-down-btn']");
    const element = await page.$("button[type='submit'][name='agree']");
    await element?.scrollIntoView();
    //readline.question('Press any key to continue...');
    console.log("Agreeing to terms");
    /* const navigationPromise = page.waitForNavigation({ waitUntil: "load" });
  await page.click("button[type='submit'][name='agree']");
  await navigationPromise; */

    /* page.click("button[type='submit'][name='agree']")
  await page.waitForNavigation({ waitUntil: "load" }); */
    //navigationPromise = page.waitForNavigation({ waitUntil: "load" });
    await page.click("button[type='submit'][name='agree']");
    await page.waitForSelector(
        "section[data-testid='quote-price'] div section div:nth-child(1) fin-streamer"
    );
    await delay(2000);
}
function print_server(msg: string) {
    console.log(msg);
}

function send_to_client(priceType: string, priceText: string, ticker: string) {
    const entry = tickerPages.get(ticker);
    /* console.log(`Is entry null? ${entry == null}`);
    console.log(`Is entry undefined? ${entry == undefined}`); */
    if (entry) {
        const { sockets } = entry;
        /* console.log("Is socket null? " + (socket == null));
        console.log("Is socket undefined? " + (socket == undefined));
        console.log("Sending to client"); */
        for (const socket of sockets) {
            socket.emit("message", `${priceType} ${priceText}`);
        }
    }
    // console.log(msg);
}
export async function createTickerPage(
    ticker: string,
    socket: Socket
): Promise<puppeteer.Page> {
    const browser = await puppeteer.launch({
        //executablePath: "/usr/bin/google-chrome",
        headless: true,
        devtools: true,
    });
    const page = await browser.newPage();
    await page.exposeFunction("print_server", print_server);
    await page.exposeFunction("send_to_client", send_to_client);
    await page.goto(`https://finance.yahoo.com/quote/${ticker}`, {
        waitUntil: "networkidle2",
    });
    //
    await skipTerms(page);
    //console.log("Skipped terms");
    await page.evaluate(() => {
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
                    /* print_server(
                        `priceType: ${priceType}, priceText: ${priceText}`
                    ); */
                    send_to_client(priceType!, priceText!, symbol!);
                    /* console.log(
                        `priceType: ${priceType}, priceText: ${priceText}`
                    ); */
                }
                /* console.log("mutation: " + mutation); */
            });
        });
        const config = { attributes: true, childList: true, subtree: true };
        spans.forEach((span) => {
            observer.observe(span, config);
        });
    });
    return page;
}
export async function connect(socket: Socket) {
    /* const io = new Server();
    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    }); */
    socket.on("message", async (msg: string) => {
        //console.log("message (on server): " + msg);
        const ticker: string = msg;
        if(tickerPages.has(ticker)) {
            const entry = tickerPages.get(ticker);
            if(entry) {
                entry.sockets.push(socket);
                //console.log(`Added socket to ${ticker}`);
            }
        }
        else {
            console.log(`Creating page for ${ticker}`);
            const page = await createTickerPage(ticker, socket);
            tickerPages.set(ticker, { page, sockets: [socket] });
            //console.log(`Set page for ${ticker}`);
        }
        /* const page = await createTickerPage(ticker, socket);
        tickerPages.set(ticker, { page, socket }); */
        //tickerPages.set("AAPL", {page, socket});
    });
    socket.on("disconnect", () => {
        // Delete the page associated with the socket
        tickerPages.forEach((value, key) => {
            if (value.sockets.includes(socket)) {
                value.sockets.splice(value.sockets.indexOf(socket), 1);
                //console.log(`Deleted socket from ${key}`);
                if(value.sockets.length == 0) {
                    value.page.browser().close();
                    tickerPages.delete(key);
                    //console.log("Deleted page for ticker " + key);
                }
            }
        });
        console.log(`Now there are ${tickerPages.size} pages`);
    });
}
