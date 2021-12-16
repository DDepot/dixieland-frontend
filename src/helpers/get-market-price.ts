import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { guacJazz } from "../helpers/bond";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const guacJazz Address = guacJazz.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(guacJazzAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    return marketPrice;
}
