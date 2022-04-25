import React, { Component } from 'react';
import { fetchData } from '../ApiDataLoadHelper/DataLoadHelper';
import styles from "./ImageView.module.css";
import {IImageViewProps, IImageViewState} from "./types";


export default class ImageView extends Component<IImageViewProps, IImageViewState> {
    constructor(props: IImageViewProps) {
        super(props);

        this.state = {imageData: null};
    }

    componentDidMount() {
        fetchData(`https://ekb-trees-help.ru/api/file/${this.props.match.params.id}`)
            .then((jsonData) => {
                this.setState({imageData: jsonData});
            });
    }

    render() {
        return (
            <div className={styles.viewImagePageContainer}>
                <img src={this.state.imageData?.uri}/>
            </div>
        )
    }
}
