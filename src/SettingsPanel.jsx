import React, { Component } from 'react';
import { CustomInput, Row, Col, Button, Input } from 'reactstrap';
const { settings } = require('./renderer');

export default class SettingsModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            twitchText: "",
            challongeText: "",
            startGGText: "",
            apiKey: "",
            confirmTwitch: false,
            confirmChallonge: false,
            confirmStartGG: false,
            confirmAPI: false
        }
    }

    componentDidMount() {
        this.setState({
            twitchText: this.props.values.twitchLink,
            challongeText: this.props.values.challongeLink,
            startGGText: this.props.values.startGGLink,
            apiKey: this.props.values.apiKey
        });
    }

    _onChange = (key, value) => {
        settings.set(`settings.${key}`, value);
        this.props.change(key, value);
    }

    confirmLink = (type, confirm) => {
        if (type === "startGG") {
            this._onChange("apiKey", this.state.apiKey);
            this._onChange('startGGLink', this.state.startGGText);
            this.setState({
                confirmStartGG: true,
                confirmAPI: true
            });
        } else {
            if (this.state[`${type}Text`] !== "") {
                this._onChange(`${type}Link`, this.state[`${type}Text`]);
                this.setState({
                    [`confirm${confirm}`]: true
                });
            } else {

            }
        }
    }

    render() {
        let { challongeEnabled,
            startGGEnabled,
            twitchEnabled,
            color
        } = this.props.values;
        return (
            <div className="tab-spacing">
                <div>
                    <h4>Settings</h4>
                    <form style={{ margin: "1rem" }}>
                        <h5 style={{ marginTop: '1.5rem' }}>Plugins</h5>
                        <Row>
                            <Col>
                                <CustomInput id="twitchSwitch" checked={twitchEnabled} type="switch" name="twitch" label="Twitch Enabled" onChange={() => this._onChange("twitchEnabled", !twitchEnabled)} />
                            </Col>
                            <Col>
                                {twitchEnabled &&
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Input type="text" placeholder="Twitch Link" value={this.state.twitchText} valid={this.state.confirmTwitch} onChange={(ev) => this.setState({ twitchText: ev.target.value })} style={{ height: "100%" }} />
                                        <Button onClick={() => this.confirmLink("twitch", "Twitch")}>
                                            <i className="fas fa-check-circle fa-xs" />
                                        </Button>
                                    </div>
                                }
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <Col>
                                <CustomInput id="challongeSwitch" checked={challongeEnabled} type="switch" name="challonge" label="Challonge Enabled" onChange={() => this._onChange("challongeEnabled", !challongeEnabled)} />
                            </Col>
                            <Col>
                                {challongeEnabled &&
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Input type="text" placeholder="Challonge Link" valid={this.state.confirmChallonge} value={this.state.challongeText} onChange={(ev) => this.setState({ challongeText: ev.target.value })} style={{ height: "100%" }} />
                                        <Button onClick={() => this.confirmLink("challonge", "Challonge")}>
                                            <i className="fas fa-check-circle fa-xs" />
                                        </Button>
                                    </div>}
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <Col>
                                <CustomInput id="smartGGSwitch" checked={startGGEnabled} type="switch" name="startGG" label="Start.gg Enabled" onChange={() => this._onChange("startGGEnabled", !startGGEnabled)} />
                            </Col>
                            <Col>
                                {startGGEnabled &&
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: "100%" }}>
                                            <Input type="text" placeholder="start.gg Link" valid={this.state.confirmStartGG} value={this.state.startGGText} onChange={(ev) => this.setState({ startGGText: ev.target.value })} style={{ height: "100%" }} />
                                            <Input placeholder="API Key" type="password" valid={this.state.confirmAPI} defaultValue={this.state.apiKey} value={this.state.apiKey} onChange={(ev) => this.setState({ apiKey: ev.target.value })} />
                                        </div>
                                        <Button onClick={() => this.confirmLink("startGG", "StartGG")}>
                                            <i className="fas fa-check-circle fa-xs" />
                                        </Button>
                                    </div>}
                            </Col>
                        </Row>
                        <hr></hr>
                        <h5 style={{ marginTop: '2rem' }}>Customization</h5>
                        <Row>
                            <Col>Background Color</Col>
                            <Col>
                                <div style={{ width: '30%' }}>
                                    <Input type="color" width={'30%'} value={color} onChangeCapture={(e) => this._onChange("color", e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                    </form>
                </div>
            </div>
        );
    }

}