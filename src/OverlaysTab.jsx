import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { GrapesjsReact } from 'grapesjs-react'
import "grapesjs/dist/css/grapes.min.css";
import 'grapesjs-blocks-basic';
import 'grapesjs-preset-webpage';
import { dialog, remote, fs } from './renderer';
import { options, starterHtml } from './constants/dashboard';
import { createComponent, createBlock, transformHtml } from './helpers/overlayhelper';

const myNewComponentTypes = editor => {
    options.forEach((option) => editor.Components.addType(option, createComponent(option)))
};

const blocks = options.map((option) => createBlock(option));

export default class OverlaysTab extends Component {

    constructor() {
        super();
        this.state = {
            opened: false,
            overlay: null,
            text: "",
            overlayOutput: "",
            style: "",
            filePath: "",
            cssFilePath: "",
            name: ""
        }
    }

    editor = null

    addOverlay = () => {
        let filePath = `${this.props.values.overlaysPath}/${this.state.text}/${this.state.text}.html`;
        let cssFilePath = `${this.props.values.overlaysPath}/${this.state.text}/${this.state.text}.css`
        console.log(filePath)
        fs.outputFileSync(filePath, starterHtml(this.state.text), {});
        fs.outputFileSync(cssFilePath, "", {});

        let newOverlay = {
            name: this.state.text,
            filePath,
            cssFilePath,
            code: ""
        }
        this.props.updateOverlays([...this.props.values.overlays, newOverlay])
    }

    clickOverlayButton = (selectedOverlay) => {
        let file = fs.readFileSync(selectedOverlay.filePath, { encoding: 'utf8', flag: 'r' });
        let cssFile = fs.readFileSync(selectedOverlay.cssFilePath, { encoding: 'utf8', flag: 'r' });
        if (this.editor) {
            this.editor.setComponents(file);
            this.editor.setStyle(cssFile);
        }
        if (!this.state.opened) {
            this.setState({
                opened: true,
                overlay: file,
                style: cssFile,
                filePath: selectedOverlay.filePath,
                cssFilePath: selectedOverlay.cssFilePath,
                name: selectedOverlay.name
            })
        } else {
            this.setState({
                overlay: file,
                style: cssFile,
                filePath: selectedOverlay.filePath,
                cssFilePath: selectedOverlay.cssFilePath,
                name: selectedOverlay.name
            })
        }
    }

    saveOverlay = () => {
        let html = this.editor.getHtml()
        let css = this.editor.getCss();

        let outputHtml = transformHtml(this.state.name, html);

        fs.outputFileSync(this.state.filePath, outputHtml, {});
        fs.outputFileSync(this.state.cssFilePath, css, {})
    }

    deleteOverlay = (name) => {
        let overlays = this.props.values.overlays.filter((overlay) => overlay.name !== name);
        this.props.updateOverlays(overlays);
    }

    choosePath = () => {
        const options = {
            title: "Choose folder for overlay output",
            properties: ["openDirectory"]
        }

        let saveDialog = dialog.showOpenDialog(remote.getCurrentWindow(), options);
        saveDialog.then((saveTo) => {
            this.props.update(saveTo.filePaths[0])
        })
    }

    render() {
        let { overlaysPath } = this.props.values;

        return (
            <div className="tab-spacing" style={{ height: "80vh" }}>
                <div>
                    <label>Choose output directory</label>
                    <Button onClick={this.choosePath}>Choose</Button>
                    &nbsp;{overlaysPath}
                </div>

                <div style={{ margin: '5px', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <input type="text" onChange={(event) => this.setState({ text: event.target.value })} value={this.state.text}></input>
                        <Button onClick={this.addOverlay}>Add Overlay</Button>
                    </div>
                    <Button onClick={this.saveOverlay} color="primary">Save</Button>
                </div>
                <div style={{ overflowX: "auto", whiteSpace: 'nowrap' }}>
                    {this.props.values.overlays.map(overlay => {
                        return (
                            <div key={overlay.name} style={{ display: 'inline-block', margin: '5px' }}>
                                <Button onClick={() => this.clickOverlayButton(overlay)}>{overlay.name}</Button>
                                <Button onClick={() => this.deleteOverlay(overlay.name)} color="danger">X</Button>
                            </div>
                        )
                    })}
                </div>

                {this.state.opened &&
                    <div style={{ height: "100%", width: "100%", overflow: "auto!important" }}>
                        <GrapesjsReact
                            id="test"
                            plugins={[
                                myNewComponentTypes,
                                'gjs-blocks-basic'
                            ]}
                            dragMode="absolute"
                            blockManager={{ blocks }}
                            onInit={(editor) => {
                                this.editor = editor;

                                this.editor.setComponents(this.state.overlay);
                                this.editor.setStyle(this.state.style);
                            }} height={"100%"}>
                        </GrapesjsReact>
                    </div>
                }
            </div>
        )
    }

}