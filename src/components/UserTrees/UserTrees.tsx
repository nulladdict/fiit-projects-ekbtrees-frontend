import React, {Component} from 'react'; 
import './UserTrees.css';
import {IMyTreesProps, IMyTreesState} from "./types";


export default class MyTrees extends Component<IMyTreesProps, IMyTreesState>{
    state = {
        trees:[
            {"название": "клен", "высота": "5 метров"}
        ]
    }
}
