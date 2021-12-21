import React from "react";
import { Link } from "@material-ui/core";
import "./main.scss";
import JazzImg from "../../../../assets/icons/dixieland-icon.png";

function Main() {
    return (
        <div className="landing-main">
            <div className="landing-main-img-wrap">
                <img src={JazzImg} alt="" />
            </div>
            <div className="landing-main-btns-wrap">
                <Link href="https://app.dixieland.money" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>Enter App</p>
                    </div>
                </Link>
                <Link href="https://dixieland.gitbook.io/dixieland/" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>Documentation</p>
                    </div>
                </Link>
            </div>
            <div className="landing-main-title-wrap">
                <p>Coming Soon</p>
                <p>DixieLand</p>
            </div>
            <div className="landing-main-help-text-wrap">
                <p>a Decentralized reserve currency protocol built on the Songbird Network. Stake</p>
                <p>and earn auto compounding interest with JAZZ</p>
            </div>
        </div>
    );
}

export default Main;
