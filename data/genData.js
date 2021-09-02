const fetch = require("node-fetch");
const MongoClient = require("mongodb").MongoClient;
const dbName = "finalproject";
const url = "mongodb://localhost:27017";


MongoClient.connect(
    url, { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
        if (err) {
            console.error("FATAL ERROR", e);
            return;
        }

        const db = client.db(dbName);
        await db.collection("coins").deleteMany({});
        await db.collection("prices").deleteMany({});
        let list = [];
        let idList=[];
        const getCoins = async () => {
            let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`;
            let res = await fetch(url);
            let coinList = await res.json();

            for (let i = 0; i < coinList.length; i++) {
                const element = {
                    id: coinList[i].id, symbol: coinList[i].symbol, price: coinList[i].current_price, marketCap: coinList[i].market_cap,
                    marketCapRank: coinList[i].market_cap_rank
                };
                list.push(element);

                const id = {id: coinList[i].id};
                idList.push(id);

            }
            await db.collection("coins").insertMany(list);
            await db.collection("prices").insertMany(idList);
        }
        await getCoins();


        const getPrices = async (id, days, interval) => {
            let url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`;
            let res = await fetch(url);
            let json = await res.json();
            let prices = json.prices;
            if (interval === "hourly") {
                await db.collection("prices").updateOne({ id }, { $set: { prices_hourly: prices } });
            } else {
                await db.collection("prices").updateOne({ id }, { $set: { prices_daily: prices } });
            }
        }

        for (let i = 0; i < idList.length; i++) {
            let id = idList[i].id;
            await getPrices(id, 1, "hourly");
            await getPrices(id, 30, "daily");
        }

        client.close();
    });

