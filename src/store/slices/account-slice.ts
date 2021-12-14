import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { JazzTokenContract, BlueTokenContract, GuacTokenContract, wBlueTokenContract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Bond } from "../../helpers/bond/bond";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";
import { IToken } from "../../helpers/tokens";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        blue: string;
        jazz: string;
        wblue: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const blueContract = new ethers.Contract(addresses.BLUE_ADDRESS, BlueTokenContract, provider);
    const blueBalance = await blueContract.balanceOf(address);
    const jazzContract = new ethers.Contract(addresses.JAZZ_ADDRESS, JazzTokenContract, provider);
    const jazzBalance = await jazzContract.balanceOf(address);
    const wblueContract = new ethers.Contract(addresses.WBLUE_ADDRESS, wBlueTokenContract, provider);
    const wblueBalance = await wblueContract.balanceOf(address);

    return {
        balances: {
            blue: ethers.utils.formatUnits(blueBalance, "gwei"),
            jazz: ethers.utils.formatUnits(jazzBalance, "gwei"),
            wblue: ethers.utils.formatEther(wblueBalance),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        jazz: string;
        blue: string;
        wblue: string;
    };
    staking: {
        jazz: number;
        blue: number;
    };
    wrapping: {
        blue: number;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let jazzBalance = 0;
    let blueBalance = 0;

    let wblueBalance = 0;
    let blueWblueAllowance = 0;

    let stakeAllowance = 0;
    let unstakeAllowance = 0;

    const addresses = getAddresses(networkID);

    if (addresses.JAZZ_ADDRESS) {
        const timeContract = new ethers.Contract(addresses.JAZZ_ADDRESS, JazzTokenContract, provider);
        jazzBalance = await jazzContract.balanceOf(address);
        stakeAllowance = await jazzContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    }

    if (addresses.BLUE_ADDRESS) {
        const blueContract = new ethers.Contract(addresses.BLUE_ADDRESS, BlueTokenContract, provider);
        blueBalance = await blueContract.balanceOf(address);
        unstakeAllowance = await blueContract.allowance(address, addresses.STAKING_ADDRESS);

        if (addresses.WBLUE_ADDRESS) {
            blueWblueAllowance = await blueContract.allowance(address, addresses.WBLUE_ADDRESS);
        }
    }

    if (addresses.WBLUE_ADDRESS) {
        const wblueContract = new ethers.Contract(addresses.WBLUE_ADDRESS, wBlueTokenContract, provider);
        wblueBalance = await wblueContract.balanceOf(address);
    }

    return {
        balances: {
            blue: ethers.utils.formatUnits(blueBalance, "gwei"),
            jazz: ethers.utils.formatUnits(jazzBalance, "gwei"),
            wblue: ethers.utils.formatEther(wblueBalance),
        },
        staking: {
            jazz: Number(stakeAllowance),
            blue: Number(unstakeAllowance),
        },
        wrapping: {
            blue: Number(blueWblueAllowance),
        },
    };
});

interface ICalcUserBondDetails {
    address: string;
    bond: Bond;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserBondDetails {
    allowance: number;
    balance: number;
    sgbBalance: number;
    interestDue: number;
    bondMaturationBlock: number;
    pendingPayout: number; //Payout formatted in gwei.
}

export const calculateUserBondDetails = createAsyncThunk("account/calculateUserBondDetails", async ({ address, bond, networkID, provider }: ICalcUserBondDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                bond: "",
                displayName: "",
                bondIconSvg: "",
                isLP: false,
                allowance: 0,
                balance: 0,
                interestDue: 0,
                bondMaturationBlock: 0,
                pendingPayout: "",
                sgbBalance: 0,
            });
        });
    }

    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = Number(bondDetails.vesting) + Number(bondDetails.lastTime);
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
        balance = "0";

    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    const balanceVal = ethers.utils.formatEther(balance);

    const sgbBalance = await provider.getSigner().getBalance();
    const sgbVal = ethers.utils.formatEther(sgbBalance);

    const pendingPayoutVal = ethers.utils.formatUnits(pendingPayout, "gwei");

    return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        allowance: Number(allowance),
        balance: Number(balanceVal),
        sgbBalance: Number(sgbVal),
        interestDue,
        bondMaturationBlock,
        pendingPayout: Number(pendingPayoutVal),
    };
});

interface ICalcUserTokenDetails {
    address: string;
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserTokenDetails {
    allowance: number;
    balance: number;
    isSgb?: boolean;
}

export const calculateUserTokenDetails = createAsyncThunk("account/calculateUserTokenDetails", async ({ address, token, networkID, provider }: ICalcUserTokenDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                token: "",
                address: "",
                img: "",
                allowance: 0,
                balance: 0,
            });
        });
    }

    if (token.isSgb) {
        const sgbBalance = await provider.getSigner().getBalance();
        const sgbVal = ethers.utils.formatEther(sgbBalance);

        return {
            token: token.name,
            tokenIcon: token.img,
            balance: Number(sgbVal),
            isSgb: true,
        };
    }

    const addresses = getAddresses(networkID);

    const tokenContract = new ethers.Contract(token.address, GuacTokenContract, provider);

    let allowance,
        balance = "0";

    allowance = await tokenContract.allowance(address, addresses.ZAPIN_ADDRESS);
    balance = await tokenContract.balanceOf(address);

    const balanceVal = Number(balance) / Math.pow(10, token.decimals);

    return {
        token: token.name,
        address: token.address,
        img: token.img,
        allowance: Number(allowance),
        balance: Number(balanceVal),
    };
});

export interface IAccountSlice {
    bonds: { [key: string]: IUserBondDetails };
    balances: {
        blue: string;
        jazz: string;
        wblue: string;
    };
    loading: boolean;
    staking: {
        jazz: number;
        blue: number;
    };
    wrapping: {
        blue: number;
    };
    tokens: { [key: string]: IUserTokenDetails };
}

const initialState: IAccountSlice = {
    loading: true,
    bonds: {},
    balances: { blue: "", jazz: "", wblue: "" },
    staking: { jazz: 0, blue: 0 },
    wrapping: { blue: 0 },
    tokens: {},
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserBondDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const bond = action.payload.bond;
                state.bonds[bond] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserTokenDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserTokenDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const token = action.payload.token;
                state.tokens[token] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserTokenDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
