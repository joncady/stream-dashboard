import React, { Component } from 'react';

import { GrapesjsReact } from 'grapesjs-react'
import "grapesjs/dist/css/grapes.min.css";
import 'grapesjs-blocks-basic';
import 'grapesjs-preset-webpage';

export default class EditorWindow extends Component {

    constructor() {
        super();
        this.state = {
            show: false
        }
    }

    componentDidMount() {
        console.log(this.state.show)
        this.setState({
            show: true
        })
    }

    render() {
        console.log(this.state.show)
        return this.state.show ? <div style={{ height: "200px"}}>
        <GrapesjsReact plugins={[
            'gjs-blocks-basic',
            'gjs-preset-webpage'
          ]} id="test" onInit={(editor) => console.log(editor)} height={"100%"}/>
          </div>
        : null
    }
}
