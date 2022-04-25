import { ICircleOptions } from "./types";


const colors: { [key: string]: string } = {
    "Береза": "#696969",
    "Вяз": "#800080",
    "Липа": "#654321",
    "Лиственница": "#218766",
    "default": "blue"
}


export const fetchData = (url: string , options: {[key: string]: any}) => {
    return fetch(url, options)
        .then(r => r.json());
}

export const getColorByTreeName = (name: string = "default"): string => {
    return colors[name] ?? colors["default"]
};

export const getCircleOptions = (treeName: string): ICircleOptions => {
    const color = getColorByTreeName(treeName);
    return {fillColor: color, color};
}

export const getCircleRadius = (diameter_crown: number): number => {
    const circleDiameter = diameter_crown < 5 ? 5 * 0.8 : diameter_crown * 0.8;
    return circleDiameter / 2;
}
