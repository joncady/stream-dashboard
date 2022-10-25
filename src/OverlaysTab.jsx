import React, { Component } from 'react';
import { Button, Alert } from 'reactstrap';
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
            name: "",
            message: "",
            error: ""
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
        try {
            let file = fs.readFileSync(selectedOverlay.filePath, { encoding: 'utf8', flag: 'r' });
            let cssFile = fs.readFileSync(selectedOverlay.cssFilePath, { encoding: 'utf8', flag: 'r' });
            if (this.editor) {
                this.editor.setComponents(file);
                this.editor.setStyle(cssFile);
                this.editor.setDragMode("absolute")
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
        } catch (err) {
            this.setState({
                error: "Overlay files not found."
            }, () => {
                setTimeout(() => {
                    this.setState({
                        error: ""
                    })
                }, 3000)
            })
        }
    }

    saveOverlay = () => {
        let html = this.editor.getHtml()
        let css = this.editor.getCss();

        let outputHtml = transformHtml(this.state.name, html);

        fs.outputFileSync(this.state.filePath, outputHtml, {});
        fs.outputFileSync(this.state.cssFilePath, css, {});

        this.setState({
            message: "Overlay saved."
        }, () => {
            setTimeout(() => {
                this.setState({
                    message: ""
                });
            }, 5000)
        });
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
                    {this.state.message &&
                        <Alert color="success">{this.state.message}</Alert>
                    }
                    {this.state.error &&
                        <Alert color="danger">{this.state.error}</Alert>
                    }
                    <Button onClick={this.saveOverlay} color="primary">Save</Button>
                </div>
                <div style={{ overflowX: "auto", whiteSpace: 'nowrap' }}>
                    {this.props.values.overlays.map(overlay => {
                        return (
                            <div key={overlay.name} style={{ display: 'inline-block', margin: '5px' }}>
                                <Button onClick={() => this.clickOverlayButton(overlay)} color={(this.state.name && this.state.name === overlay.name) ? "primary" : "secondary"}>{overlay.name}</Button>
                                <Button onClick={() => this.deleteOverlay(overlay.name)} color="danger">X</Button>
                            </div>
                        )
                    })}
                </div>

                {this.state.opened &&
                    <div style={{ height: "100%", width: "100%", overflow: "auto!important" }}>
                        <GrapesjsReact
                            id="gjs"
                            plugins={[
                                myNewComponentTypes,
                                'gjs-blocks-basic'
                            ]}
                            dragMode="absolute"
                            blockManager={{ blocks }}
                            devices={[
                                {
                                    id: '720',
                                    name: '720p size',
                                    width: '1280px', // This width will be applied on the canvas frame and for the CSS media
                                    height: "720px"
                                }
                            ]}
                            onInit={(editor) => {
                                this.editor = editor;

                                let canvas = this.editor.Canvas;
                                canvas.setZoom(70)
                            
                                // Below code is untest:
                                // {
                                //     name: '1080p size',
                                //     width: '1920px', // This width will be applied on the canvas frame and for the CSS media
                                //     height: "1080px"
                                // }
                                // let dm = editor.Devices;
                                // dm.add({
                                //     id: '720',
                                //     name: '720p size',
                                //     width: '1280px', // This width will be applied on the canvas frame and for the CSS media
                                //     height: "720px"
                                // })

                                // dm.select('720')

                                this.editor.setComponents(this.state.overlay);
                                this.editor.setStyle(this.state.style);

                                editor.on("device:select", function (model) {
                                    editor.setDragMode("absolute")
                                    console.log(editor.getConfig())
                                })

                                editor.refresh()
                                // this.editor.on("component:selected", (el) => {
                                //     console.log(el)
                                //     canvas.scrollTo(el, { behavior: 'smooth', block: "end" });
                                // })
                                // canvas.scrollTo(editor.DomComponents.getWrapper().find('body'), { force: true, behavior: "smooth", block: "center", inline: "center" })
                                // console.log(editor.DomComponents.getWrapper())
}} height={"100%"}>
                        </GrapesjsReact>
                    </div>
                }
            </div>
        )
    }

}