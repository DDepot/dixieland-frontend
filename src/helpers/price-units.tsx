import { SvgIcon } from "@material-ui/core";
import { ReactComponent as GuacImg } from "../assets/tokens/GUAC.svg";
import { IAllBondData } from "../hooks/bonds";
import { guac } from "../helpers/bond";

export const priceUnits = (bond: IAllBondData) => {
    if (bond.name === guac.name) return <SvgIcon component={GuacImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />;

    return "$";
};
