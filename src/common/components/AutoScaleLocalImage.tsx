import React, {Component} from "react";
import {Image} from "react-native";

interface Props {
    width: number;
    height: number;
    uri: any;
    style: any;
}

interface State {
    source: any;
    width: number;
    height: number;
}

export default class AutoScaleLocalImage extends Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {source: this.props.uri};
    }

    componentDidMount() {

        let source = Image.resolveAssetSource(this.props.uri);
        let {height, width} = source;

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
