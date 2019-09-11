import React, { Component } from 'react';
import { Input } from 'reactstrap';

export default class CommentaryTab extends Component {

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
        let { commName1, commName2, commTwitter1, commTwitter2 } = this.props.values;
        return (
            <div className="tab-spacing">
                <div>
                    <h4>Commentators</h4>
                    <div className="input-row">
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Commentator 1</label>
                            <Input id="commName1" placeholder="Commentator Name" draggable={true} type="text" onDragStart={this.drag}
                                onDrop={this.drop} onDragOver={this.allowDrop} onChange={(e) => this._onChange("commName1", e.target.value)} value={commName1} />
                        </div>
                        <div className="form-group">
                            <label className="left" htmlFor="exampleInputPassword1">Commentator 1 Twitter</label>
                            <Input id="commTwitter1" placeholder="Commentator 1 Twitter" draggable={true} type="text" onDragStart={this.drag}
                                onDrop={this.drop} onDragOver={this.allowDrop} onChange={(e) => this._onChange("commTwitter1", e.target.value)} value={commTwitter1} />
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Commentator 2</label>
                            <Input id="commName2" placeholder="Commentator 2 Name"
                                draggable={true} type="text" onDragStart={this.drag}
                                onDrop={this.drop} onDragOver={this.allowDrop} onChange={(e) => this._onChange("commName2", e.target.value)} value={commName2} />
                        </div>
                        <div className="form-group">
                            <label className="left" htmlFor="exampleInputPassword1">Commentator 2 Twitter</label>
                            <Input id="commTwitter2" placeholder="Commentator 2 Twitter"
                                draggable={true} type="text" onDragStart={this.drag}
                                onDrop={this.drop} onDragOver={this.allowDrop} onChange={(e) => this._onChange("commTwitter2", e.target.value)} value={commTwitter2} />
                        </div>
                    </div>
                    <div>
                        <button type="button" id="swapComm" className="btn btn-secondary" onClick={this.props.swap}>Swap</button>
                    </div>
                    <hr></hr>
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