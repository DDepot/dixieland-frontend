import { Networks } from "../../constants/blockchain";
import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import GuacIcon from "../../assets/tokens/GUAC.svg";
import SgbIcon from "../../assets/tokens/SGB.svg";
import GuacJazzIcon from "../../assets/tokens/JAZZ-GUAC.svg";
import SgbJazzIcon from "../../assets/tokens/JAZZ-SGB.svg";

import { StableBondContract, LpBondContract, WsgbBondContract, StableReserveContract, LpReserveContract } from "../../abi";

export const guac = new StableBond({
    name: "guac",
    displayName: "GUAC",
    bondToken: "GUAC",
    bondIconSvg: GuacIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.SGB]: {
            bondAddress: "0x694738EXXXXXXXXXXXXXXXXXXXXXX7B556",
            reserveAddress: "0x130966628XXXXXXXXXXXXXXXXXXXC18D",
        },
    },
    tokensInStrategy: "60500000000000000000000000",                                  //edit?
});

export const wsgb = new CustomBond({
    name: "wsgb",
    displayName: "wSGB",
    bondToken: "SGB",
    bondIconSvg: SgbIcon,
    bondContractABI: WsgbBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.SGB]: {
            bondAddress: "0xE02B1AA2XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX7318",
            reserveAddress: "0xb31f66aa3c1eXXXXXXXXXXXXXXXXXXb85fd66c7",
        },
    },
    tokensInStrategy: "756916000000000000000000",                               //edit?
});

export const guacJazz = new LPBond({
    name: "guac_jazz_lp",
    displayName: "JAZZ-GUAC LP",
    bondToken: "GUAC",
    bondIconSvg: GuacJazzIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.SGB]: {
            bondAddress: "0xA184AE1A71XXXXXXXXXXXXXXXXXXXXXXXXXXXXc4FFe",
            reserveAddress: "0x113f4133XXXXXXXXXXXXXXXXXXXXXXd7bf747df",
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0xb54f16fB19478766A268F172C9480f8da1a7c9C3",    //edit to dex?
});

export const sgbJazz = new CustomLPBond({
    name: "sgb_jazz_lp",
    displayName: "JAZZ-SGB LP",
    bondToken: "SGB",
    bondIconSvg: SgbJazzIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.SGB]: {
            bondAddress: "0xc26850686ce7XXXXXXXXXXXXXXXXXXXXXXXXDcBDE1",
            reserveAddress: "0xf64e1c5BXXXXXXXXXXXXXXXXXXXXXXc3eab4917",
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/AVAX/0xb54f16fB19478766A268F172C9480f8da1a7c9C3",                  //edit to dex?
});

export default [guac, wsgb, guacJazz, sgbJazz];
