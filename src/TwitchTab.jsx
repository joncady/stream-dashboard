import React, { Component } from 'react';
import TwitchEmbedVideo from 'react-twitch-embed-video';

export default class TwitchTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            renderTwitch: true
        }
    }

    componentWillUnmount() {
        this.setState({
            renderTwitch: false
        });
    }

    render() {
        let { twitchEnabled, twitchLink } = this.props.values;
        return (
            <div className="tab-spacing">
                {twitchEnabled ?
                    twitchLink ?
                        this.state.renderTwitch && <TwitchEmbedVideo channel={twitchLink} width={'100%'} theme="dark" />
                        :
                        <div className="set-link">
                            <i className="fas fa-exclamation-circle fa-2x" style={{ marginBottom: '1rem' }} />
                            <p>Make sure you set the link for Twitch!</p>
                        </div>
                    :
                    <div className="set-link">
                        <i className="fas fa-exclamation-circle fa-2x" style={{ marginBottom: '1rem' }} />
                        <p>Head to settings to enable Twitch support and set the link!</p>
                    </div>
                }
            </div>
        );
    }

}