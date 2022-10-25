import React, { Component } from 'react';
import GameTab from './GameTab';
import CommentaryTab from './CommentaryTab';
import SettingsPanel from './SettingsPanel';
import ChallongeTab from './ChallongeTab';
import io from 'socket.io-client';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TwitchTab from './TwitchTab';
import StartGGTab from './StartGGTab';
import BracketTab from './BracketTab';
import OverlaysTab from './OverlaysTab';
import bracketData from './startingBracket';
const socket = io('http://localhost:8889');
const { settings } = require('./renderer');

export default class App extends Component {

	componentDidMount() {
		let appSettings = settings.get('settings');
		let scoreboardValues = settings.get('data');
		let bracketData = settings.get('bracketData');
		if (appSettings) {
			this.setState({
				...appSettings
			});
		}
		if (scoreboardValues) {
			this.setState({
				...scoreboardValues.gameInfo,
				...scoreboardValues.commInfo,
				...scoreboardValues.startGGIds
			})
		}
		if (bracketData) {
			this.setState({
				bracketData
			});
		}
		socket.on("update", data => {
			let dataObj = { ...data.gameInfo, ...data.commInfo };
			this.setState(dataObj);
		});
	}

	constructor(props) {
		super(props);
		this.state = {
			player1: "",
			player1Id: "",
			player1Pronouns: "",
			player2: "",
			player2Id: "",
			player2Pronouns: "",
			player3: "",
			player3Pronouns: "",
			player4: "",
			player4Pronouns: "",
			twitter1: "",
			twitter2: "",
			sponsor1: "",
			sponsor2: "",
			useTwitters: false,
			score1: String(0),
			score2: String(0),
			bracket: "",
			link: "",
			date: "",
			location: "",
			doubles: false,
			commName1: "",
			commName2: "",
			commTwitter1: "",
			commTwitter2: "",
			challongeEnabled: false,
			challongeLink: "",
			startGGEnabled: false,
			startGGLink: "",
			twitchEnabled: false,
			twitchLink: "",
			color: "#343a40",
			bracketData: bracketData,
			overlaysPath: "",
			overlays: []
		}
	}

	update = () => {
		let {
			player1,
			player1Pronouns,
			player1Id,
			sponsor1,
			twitter1,
			player2,
			player2Pronouns,
			player2Id,
			sponsor2,
			twitter2,
			player3,
			player4,
			score1,
			score2,
			bracket,
			link,
			date,
			location,
			doubles,
			useTwitters,
			commName1,
			commName2,
			commTwitter1,
			commTwitter2
		} = this.state;
		let dataObj = {
			gameInfo: {
				player1: player1,
				player1Pronouns: player1Pronouns,
				sponsor1: sponsor1,
				twitter1: twitter1,
				player2: player2,
				player2Pronouns: player2Pronouns,
				sponsor2: sponsor2,
				twitter2: twitter2,
				score1: String(score1),
				score2: String(score2),
				bracket: bracket,
				link: link,
				date: date,
				location: location,
				doubles: doubles,
				useTwitters: useTwitters,
				player3: player3,
				player4: player4
			},
			commInfo: {
				commName1: commName1,
				commTwitter1: commTwitter1,
				commName2: commName2,
				commTwitter2: commTwitter2
			},
			startGGIds: {
				player1Id: player1Id,
				player2Id: player2Id
			}
		}
		settings.set('data', dataObj);
		socket.emit('update', dataObj);
	}

	emitBracketUpdate = () => {
		settings.set('bracketData', this.state.bracketData);
		socket.emit("updateBracket", this.state.bracketData);
	}

	updateOverlayPath = (overlaysPath) => {
		settings.set('settings.overlaysPath', overlaysPath);
		this.setState({
			overlaysPath
		});
	}

	updateOverlays = (overlays) => {
		settings.set('settings.overlays', overlays);
		this.setState({
			overlays
		});
	}

	resetBracket = () => {
		this.setState({
			bracketData: bracketData
		});
	}

	bracketChange = (match, matchTitle, key, value) => {
		let bracketData = this.state.bracketData;
		match[key] = value;
		bracketData = {
			...bracketData,
			[matchTitle]: match
		}
		this.setState({
			bracket: bracketData
		});
	}

	swap = () => {
		let {
			player1, player1Pronouns, sponsor1, twitter1, score1, player3,
			player2, player2Pronouns, sponsor2, twitter2, score2, player4
		} = this.state;
		this.setState({
			player1: player2,
			sponsor1: sponsor2,
			player1Pronouns: player2Pronouns,
			twitter1: twitter2,
			score1: score2,
			player2: player1,
			player2Pronouns: player1Pronouns,
			sponsor2: sponsor1,
			twitter2: twitter1,
			score2: score1,
			player3: player4,
			player4: player3
		});
	}

	swapCommentators = () => {
		let {
			commName1,
			commTwitter1,
			commName2,
			commTwitter2
		} = this.state;
		this.setState({
			commName1: commName2,
			commTwitter1: commTwitter2,
			commName2: commName1,
			commTwitter2: commTwitter1
		});
	}

	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}

	_onChange = (key, value) => {
		this.setState({
			[key]: value
		});
	}

	render() {
		document.querySelector("body").style.backgroundColor = this.state.color;
		return (
			<div id="scoreboard">
				<div id="area">
					<Tabs>
						<TabList>
							<Tab>
								<i className="fas fa-gamepad" style={{ marginRight: '0.7rem' }}></i>
								Game
							</Tab>
							<Tab>
								<i className="fas fa-headset" style={{ marginRight: '0.7rem' }}></i>
								Commentary
							</Tab>
							<Tab>
								<i className="fas fa-window-maximize" style={{ marginRight: '0.7rem' }}></i>
								Overlays
							</Tab>
							<Tab>
								<i className="fab fa-twitch" style={{ marginRight: '0.7rem' }}></i>
								Twitch
							</Tab>
							<Tab>
								Challonge
							</Tab>
							<Tab>
								start.gg
							</Tab>
							<Tab>
								Stream Bracket
							</Tab>
							<Tab>
								<i className="fas fa-cog" style={{ marginRight: '0.7rem' }}></i>
								Settings
							</Tab>
						</TabList>
						<TabPanel>
							<GameTab change={this._onChange} values={this.state} update={this.update} swap={this.swap} />
						</TabPanel>
						<TabPanel>
							<CommentaryTab change={this._onChange} values={this.state} update={this.update} swap={this.swapCommentators} />
						</TabPanel>
						<TabPanel>
							<OverlaysTab values={this.state} update={this.updateOverlayPath} updateOverlays={this.updateOverlays} />
						</TabPanel>
						<TabPanel>
							<TwitchTab values={this.state} />
						</TabPanel>
						<TabPanel>
							<ChallongeTab values={this.state} />
						</TabPanel>
						<TabPanel>
							<StartGGTab values={this.state} change={this._onChange} />
						</TabPanel>
						<TabPanel>
							<BracketTab bracketData={this.state.bracketData} bracketChange={this.bracketChange} resetBracket={this.resetBracket} updateBracket={this.emitBracketUpdate}></BracketTab>
						</TabPanel>
						<TabPanel>
							<SettingsPanel change={this._onChange} values={this.state} />
						</TabPanel>
					</Tabs>
				</div>
			</div>
		);
	}

}