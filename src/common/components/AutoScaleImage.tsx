import React, {Component} from "react";
import {Image} from "react-native";

interface Props {
    width: number;
    height: number;
    uri: string;
    style: any;
}

interface State {
    source: any;
    width: number;
    height?: number | null;
}

export default class AutoScaleImage extends Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {source: {uri: this.props.uri}};
    }

    componentWillMount() {
        Image.getSize(this.props.uri, (width, height) => {
            if (this.props.width && !this.props.height) {
                this.setState({
                    width: this.props.width,
                    height: height * (this.props.width / width)
                });
            } else if (!this.props.width && this.props.height) {
                this.setState({
                    width: width * (this.props.height / height),
                    height: this.props.height
                });
            } else {
                this.setState({width: width, height: height});
            }
        }, (error: any) => {
            // console.log('image error:', error);
        });
    }

    render() {
        return (
            <Image
                source={this.state.source}
                style={{...this.props.style, height: this.state.height, width: this.state.width,}}
            />
        );
    }
}
