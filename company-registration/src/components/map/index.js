import React, { Component } from 'react';
import { render } from 'react-dom';

class Map extends Component {
    constructor(props) {
    super(props);
    }

    onScriptLoad() {
        console.log(window.google)
    const map = new window.google.maps.Map(
        document.getElementById(this.props.id),
        this.props.options);
    this.props.setMapRef(map)
    }

    componentDidMount() {
        if (!window.google) {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = `https://maps.google.com/maps/api/js?key=` + process.env.REACT_APP_MAP_API_KEY;
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
            
            s.addEventListener('load', e => {
            this.onScriptLoad()
            })
        } else {
            this.onScriptLoad()
    }
    }

    render() {
    return (
        <div className="map" id={this.props.id} />
    );
    }
}

export default Map