import JazzImg from "../assets/tokens/JAZZ.svg";
import BlueImg from "../assets/tokens/BLUE.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "jazz") {
        return toUrl(JazzImg);
    }

    if (name === "blue") {
        return toUrl(BlueImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
