import axios from "axios";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=songbird,olympus,avocadoge&vs_currencies=usd";           
    const { data } = await axios.get(url);

    cache["SGB"] = data["songbird"].usd;        
    cache["GUAC"] = data["avocadoge"].usd;
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};
