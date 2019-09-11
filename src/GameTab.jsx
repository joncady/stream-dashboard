import React, { Component } from 'react';
import { CustomInput, Input } from 'reactstrap';

export default class GameTab extends Component {

    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    drop = (ev) => {
        ev.preventDefault();
        let src = document.getElementById(ev.dataTransfer.getData("text"));
        let state1 = src.id;
        let state2 = ev.target.id;
        let value1 = src.value;
        let value2 = ev.target.value;
        this._onChange(state1, value2);
        this._onChange(state2, value1);
    }

    _onChange = (key, value) => {
        this.props.change(key, value);
    }

    render() {
        let { player1, player2, player3, player4, score1, score2, bracket, link,
            date, location, doubles, twitter1, twitter2, useTwitters, sponsor1, sponsor2 } = this.props.values;
        return (
            <div className="tab-spacing">
                <div>
                    <h4>Players</h4>
                    <div className="input-row">
                        <div className="form-group">
                            <label htmlFor="player1">Player 1</label>
                            <div className="tag-box">
                                {!doubles && <Input id="sponsor1" style={{ width: '65px' }} value={sponsor1} onChange={(e) => this._onChange("sponsor1", e.target.value)}
                                    draggable={true} type="text" onDragStart={this.drag}
                                    onDrop={this.drop} onDragOver={this.allowDrop} placeholder="Team"
                                    autoComplete="off" />
                                }
                                <Input id="player1" style={{ width: doubles ? "100%" : "155px" }} value={player1} onChange={(e) => this._onChange("player1", e.target.value)}
                                    draggable={true} type="text" onDragStart={this.drag}
                                    onDrop={this.drop} onDragOver={this.allowDrop} placeholder="Player 1 Tag"
                                    autoComplete="off" />
                            </div>
                        </div>
                        {!doubles &&
                            <div className="form-group">
                                <label htmlFor="twitter1">Player 1 Twitter</label>
                                <Input id="twitter1" value={twitter1} onChange={(e) => this._onChange("twitter1", e.target.value)}
                                    draggable={true} type="text" onDragStart={this.drag}
                                    onDrop={this.drop} onDragOver={this.allowDrop} placeholder="Player 1 Twitter"
                                    autoComplete="off" />
                            </div>
                        }
                        {doubles &&
                            <div className="form-group">
                                <label className="left" htmlFor="player3">Player 3</label>
                                <Input id="player3" value={player3}
                                    draggable={true} type="text" onDragStart={this.drag}
                                    onDrop={this.drop} onDragOver={this.allowDrop} placeholder="Player 3 Tag"
                                    autoComplete="off" onChange={(e) => this._onChange("player3", e.target.value)} />
                            </div>
                        }
                        <div className="form-group">
                            <label className="left">Score 1</label>
                            <Input type="number" min="0" id="score1" value={score1} onChange={(e) => this._onChange("score1", e.target.value)} />
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="form-group">
                            <label htmlFor="player2">Player 2</label>
                            <div className="tag-box">
                                {!doubles && <Input id="sponsor2" style={{ width: '65px' }} value={sponsor2} onChange={(e) => this._onChange("sponsor2", e.target.value)}
                                    draggable={true} type="text" onDragStart={this.drag}
                                    onDrop={this.drop} onDragOver={this.allowDrop} placeholder="Team"
                                    autoComplete="off" />
                                }
                                <Input id="player2" style={{ width: doubles ? "100%" : "155px" }} draggable={true} type="text" onDragStart={this.drag}
                                    onDrop={this.drop} onDragOver={this.allowDrop} placeholder="Player 2 Tag"
                                    autoComplete="off" onChange={(e) => this._onChange("player2", e.target.value)}
                                    value={player2} />
                            </div>
                        </div>
                        {!doubles &&
                            <div className="form-group">
                                <label htmlFor="twitter2">Player 2 Twitter</label>
                                <Input id="twitter2" value={twitter2} onChange={(e) => this._onChange("twitter2", e.target.value)}
                                    draggable={true} type="text" onDragStart={this.drag}
                                    onDrop={this.drop} onDragOver={this.allowDrop} placeholder="Player 2 Twitter"
                                    autoComplete="off" />
                            </div>
                        }
                        {doubles &&
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword4" className="left">Player 4</label>
                                <Input id="player4" draggable={true} type="text" onDragStart={this.drag}
                                    onDrop={this.drop} onDragOver={this.allowDrop} placeholder="Player 4 Tag"
                                    autoComplete="off" onChange={(e) => this._onChange("player4", e.target.value)}
                                    value={player4} />
                            </div>
                        }
                        <div className="form-group">
                            <label className="left">Score 2</label>
                            <Input type="number" min="0" id="score2" width="10" onChange={(e) => this._onChange("score2", e.target.value)}
                                value={score2} />
                        </div>
                    </div>
                    <button id="swapPlayers" type="button" className="btn btn-secondary" onClick={this.props.swap}>Swap</button>
                    <label>
                        <CustomInput id="doublesSwitch" checked={doubles} type="switch" name="doubles" label="Doubles" onChange={() => this._onChange("doubles", !doubles)} />
                    </label>
                    <label>
                        <CustomInput id="twitterSwitch" checked={useTwitters} type="switch" name="useTwitter" label="Use Twitter" onChange={() => this._onChange("useTwitters", !useTwitters)} />
                    </label>
                    <hr></hr>
                    <h4>Game Status</h4>
                    <div className="input-row">
                        <div className="form-group">
                            <label>Bracket</label>
                            <Input id="bracket" draggable={true} type="text" onDragStart={this.drag}
                                onDrop={this.drop} onDragOver={this.allowDrop}
                                placeholder="Location in Bracket" autoComplete="off"
                                onChange={(e) => this._onChange("bracket", e.target.value)} value={bracket} />
                        </div>
                        <div className="form-group">
                            <label>Bracket Link</label>
                            <Input id="link" draggable={true} type="text" onDragStart={this.drag}
                                onDrop={this.drop} onDragOver={this.allowDrop}
                                placeholder="Link for Bracket" autoComplete="off"
                                onChange={(e) => this._onChange("link", e.target.value)} value={link} />
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <Input id="date" draggable={true} type="text" onDragStart={this.drag}
                                onDrop={this.drop} onDragOver={this.allowDrop} placeholder="Date"
                                autoComplete="off" onChange={(e) => this._onChange("date", e.target.value)} value={date} />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <Input id="location" draggable={true} type="text" onDragStart={this.drag}
                                onDrop={this.drop} onDragOver={this.allowDrop} placeholder="location"
                                autoComplete="off" onChange={(e) => this._onChange("location", e.target.value)}
                                value={location} />
                        </div>
                    </div>
                </div>
                <div id="lower-button" className="border">
                    <button type="button" className="btn btn-primary" onClick={this.props.update} id="update">
                        <i className="fas fa-check-square" style={{ marginRight: '0.7rem' }}></i>
                        Update!
                </button>
                </div>
            </div>
        );
    }
}