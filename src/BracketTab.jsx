import React, { Component } from 'react';

export default class BracketTab extends Component {

    renderOneMatch = (matchData, match) => {
        let inputs = [];
        Object.keys(matchData).forEach(key => {
            inputs.push(
                <div key={`${match}-${key}`}>
                    <label style={{ width: '50px' }}>{key}</label>
                    <input style={{ width: '100px' }} value={matchData[key]} onChange={(e) => this.props.bracketChange(matchData, match, key, e.target.value)}></input>
                </div>)
        });
        return (
            <div key={match} style={{ margin: '1rem', padding: '0.5rem', border: '2px solid lightgray', borderRadius: '5px' }}>
                <h4>{match}</h4>
                {inputs}
            </div>
        )
    }

    render() {
        let bracketData = this.props.bracketData;
        return (
            <div className="tab-spacing">
                <h4>Stream Bracket</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {Object.keys(bracketData).map(match => this.renderOneMatch(bracketData[match], match))}
                </div>
                <div id="lower-button" className="border">
                    <button type="button" className="btn btn-primary" onClick={this.props.updateBracket} id="update">
                        <i className="fas fa-check-square" style={{ marginRight: '0.7rem' }}></i>
                        Update Bracket!
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={this.props.resetBracket} id="update" style={{ marginLeft: '10px' }}>
                        Reset Bracket
                    </button>
                </div>
            </div>
        );
    }


}