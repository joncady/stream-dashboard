import React, { Component } from 'react';

export default class ChallongeTab extends Component {

    render() {
        let { challongeEnabled, challongeLink } = this.props.values;
        return (
            <div className="tab-spacing">
                {challongeEnabled ?
                    challongeLink ?
                        <iframe id="challonge-frame" src={`https://challonge.com/${challongeLink}/module`}></iframe>
                        :
                        <div className="set-link">
                            <i className="fas fa-exclamation-circle fa-2x" style={{ marginBottom: '1rem' }} />
                            <p>Make sure you set the link for Challonge!</p>
                        </div>
                    :
                    <div className="set-link">
                        <i className="fas fa-exclamation-circle fa-2x" style={{ marginBottom: '1rem' }} />
                        <p>Head to settings to enable Challonge support and set the link!</p>
                    </div>
                }
            </div>
        );
    }

}