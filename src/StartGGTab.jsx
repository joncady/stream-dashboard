import React, { Component } from 'react';
import { Button, Alert } from 'reactstrap';
const StartGGClient = require('./startGGActions');


export default class StartGGTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            streamSets: null,
            time: null,
            loading: false,
            errorMessage: null,
            clicked: false
        }
    }

    updatePlayer = (type, value, prefix, genderPronoun, twitter, startGGId, bracketLocation) => {
        this.update(type, value);
        this.update("bracket", bracketLocation);
        if (prefix) {
            this.update(type.includes("1") ? "sponsor1" : "sponsor2", prefix);
        } else {
            this.update(type.includes("1") ? "sponsor1" : "sponsor2", "");
        }
        if (twitter) {
            this.update(type.includes("1") ? "twitter1" : "twitter2", twitter);
        } else {
            this.update(type.includes("1") ? "twitter1" : "twitter2", "");
        }
        if (startGGId) {
            this.update(type.includes("1") ? "player1Id" : "player2Id", startGGId);
        } else {
            this.update(type.includes("1") ? "player1Id" : "player2Id", "");
        }
        console.log(type, genderPronoun)
        switch (type) {
            case "player1":
                this.update("player1Pronouns", genderPronoun)
                break;
            case "player2":
                this.update("player2Pronouns", genderPronoun)
                break;
            case "player3":
                this.update("player3Pronouns", genderPronoun)
                break;
            case "player4":
                this.update("player4Pronouns", genderPronoun)
                break;
            default:
                break;
        }
    }

    update = (key, value) => {
        this.props.change(key, value)
    }

    getSets = () => {
        this.setState({
            loading: true,
            streamSets: null
        });
        try {
            let client = new StartGGClient(this.props.values.apiKey);
            client.call(this.props.values.startGGLink).then((streams) => {
                let setsToDisplay = [];
                console.log(streams)
                streams.forEach(stream => {
                    if (stream && stream.stream && stream.stream.streamName) {
                        setsToDisplay.push(
                            <div>
                                <h2 style={{ fontWeight: 'bold' }}>{stream.stream.streamName}</h2>
                                <hr></hr>
                            </div>
                        );
                    }
                    let sets = stream.sets.map((set, index) => {
                        let players = set.slots;
                        let finalArray = [];
                        let fullRoundText = set.fullRoundText;
                        players.forEach((player) => {
                            if (player.entrant && player.entrant.participants) {
                                player.entrant.participants.forEach((participant) => {
                                    let { gamerTag, prefix, player: playerObj } = participant;
                                    let twitter = playerObj.user && playerObj.user.authorizations && playerObj.user.authorizations[0] && playerObj.user.authorizations[0].externalUsername;
                                    let id = playerObj.id;
                                    let genderPronoun = playerObj.user && playerObj.user.genderPronoun || "";
                                    let playerEl = (<div key={gamerTag}>
                                        <span>{prefix ? `${prefix} | ${gamerTag}` : gamerTag}</span>
                                        <Button className="player-space" onClick={() => { this.setState({ clicked: true }); this.updatePlayer("player1", gamerTag, prefix, genderPronoun, twitter, id, fullRoundText); }}>P1</Button>
                                        <Button className="player-space" onClick={() => { this.setState({ clicked: true }); this.updatePlayer("player2", gamerTag, prefix, genderPronoun, twitter, id, fullRoundText); }}>P2</Button>
                                        {this.props.values.doubles &&
                                            <div style={{ display: 'inline' }}>
                                                <Button className="player-space" onClick={() => { this.updatePlayer("player3", gamerTag, prefix, genderPronoun, twitter, id, fullRoundText); this.setState({ clicked: true });}}>P3</Button>
                                                <Button className="player-space" onClick={() => { this.updatePlayer("player4", gamerTag, prefix, genderPronoun, twitter, id, fullRoundText); this.setState({ clicked: true });}}>P4</Button>
                                            </div>
                                        }
                                    </div>);
                                    finalArray.push(playerEl);
                                })
                            }
                        });
                        return (
                            <div key={"set" + index}>
                                <h5>{fullRoundText}</h5>
                                <div className="matches">
                                    {finalArray}
                                </div>
                                <hr></hr>
                            </div>
                        );
                    });
                    setsToDisplay.push(sets);
                });
                this.setState({
                    streamSets: setsToDisplay,
                    time: (new Date()).toLocaleTimeString(),
                    loading: false
                });
            }).catch((err) => {
                this.setState({
                    errorMessage: err.message,
                    time: (new Date()).toLocaleTimeString(),
                    loading: false
                });
            });
        } catch (err) {
            this.setState({
                errorMessage: err.message,
                time: (new Date()).toLocaleTimeString(),
                loading: false
            });
        }
    }

    render() {
        let { startGGEnabled, startGGLink } = this.props.values;
        return (
            <div className="tab-spacing">
                {startGGEnabled ?
                    startGGLink ?
                        <div style={{ textAlign: 'center' }}>
                            <Button onClick={this.getSets}>
                                <i className="fas fa-sync-alt" style={{ marginRight: '0.7rem' }} />
                                Get Current Matches
                        </Button>
                            {this.state.time &&
                                <p style={{ marginTop: '0.5rem' }}><span>Last Run:</span> {this.state.time}</p>
                            }
                            {this.state.clicked &&
                                <Alert color="info">Make sure to click the Update button on the Game page to update your players!</Alert>
                            }
                            {this.state.loading &&
                                <div style={{ marginTop: '1rem' }}>
                                    <i className="fas fa-circle-notch fa-spin fa-3x" />
                                </div>
                            }
                            {this.state.streamSets &&
                                <div id="stream-matches">
                                    {this.state.streamSets}
                                </div>}
                            {this.state.errorMessage &&
                                <Alert style={{ marginTop: '3rem' }} color="danger">{this.state.errorMessage}</Alert>
                            }
                        </div>
                        :
                        <div className="set-link">
                            <i className="fas fa-exclamation-circle fa-2x" style={{ marginBottom: '1rem' }} />
                            <p>Make sure you set the link and API key for start.gg!</p>
                        </div>
                    :
                    <div className="set-link">
                        <i className="fas fa-exclamation-circle fa-2x" style={{ marginBottom: '1rem' }} />
                        <p>Head to settings to enable start.gg support and set the link and API key!</p>
                    </div>
                }
            </div>
        );
    }

}