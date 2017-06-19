require('./index.scss');

import Events from '../events';

import Header from './header';
import Routing from './routing';
import appState from '../stores/app-state'
import Footer from './footer';


class Site extends React.Component {
	constructor(props) {
		super(props)

		this.history = [];

		Events.on('app:reset', appState.reset.bind(appState));
		Events.on('app:panic', appState.panic.bind(appState));
		Events.on('app:change', this.setState.bind(this));

		this.state = appState.stateObject;
	}

	componentDidMount() {
		appState.tryRestoreStateFromStorage();
	}

	render() {
		return (
			<div className={
				'site'
				+ (appState.midi.isReady ? ' is-ready-for-midi' : ' is-not-ready-for-midi')
				+ (appState.isCurrentlyEditingRouting ? ' is-editing-routing' : ' is-not-editing-routing')
			}>
				<Header />
				<div className="routings wrapper">
					<div className="labels">
						<div className="output-device">Sender</div>
						<div className="connection">Connection</div>
						<div className="input-device">Receiver</div>
					</div>
					{
						this.state.routings.map( (routing, index) => {
							return <Routing model={routing} key={index} />
						})
					}
				</div>
				<button className="button-add-routing" onClick={appState.addRouting.bind(appState)}>+</button>
				<div className="loading wrapper" />
				<div className="modal-blocker" onClick={appState.stopEditing.bind(appState)} />
				<Footer />
			</div>
		)
	}
}

ReactDOM.render(<Site />, document.getElementById('site'))