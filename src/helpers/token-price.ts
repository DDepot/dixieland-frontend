import axios from "axios";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=songbird,dogecoin&vs_currencies=usd";
    const { data } = await axios.get(url);

    cache["SGB"] = data["songbird"].usd;
    cache["GUAC"] = data["dogecoin"].usd;
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};
