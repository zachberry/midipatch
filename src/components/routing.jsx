require('./routing.scss');

import Device from './device';
import Connection from './connection';
import ConnectionMenu from './connection-menu';
import appState from '../stores/app-state';
import Events from '../events';

const MIDI_MESSAGE_TIMEOUT_MS = 150;

export default class Routing extends React.Component {
	constructor() {
		super();

		Events.on('midi:message', this.onMIDIMessage.bind(this));

		this.timeoutIntervalId = null;
		this.state = {
			status: null
		}
	}

	onMIDIMessage(result, routing)
	{
		if(routing !== this.props.model) return;

		this.setState({
			status: result
		});

		window.clearInterval(this.timeoutIntervalId);
		this.timeoutIntervalId = window.setTimeout(
			this.setState.bind(this, { status:null }),
			MIDI_MESSAGE_TIMEOUT_MS
		);
	}

	onEnableChange(event) {
		appState.setRoutingEnabled(this.props.model, !this.props.model.enabled);
	}

	onSelectInputDevice(item) {
		appState.setInputDevice(this.props.model, item);
	}

	onSelectOutputDevice(item) {
		appState.setOutputDevice(this.props.model, item);
	}

	render() {
		return (
			<div className={
				'routing'
				+ (this.props.model.enabled ? ' is-enabled' : ' is-disabled')
				+ (this.state.status !== null ? ' is-status-' + this.state.status : '')
			}>
				<div className="control enable">
					<input
						type="checkbox"
						checked={this.props.model.enabled}
						onChange={this.onEnableChange.bind(this)}
					/>
				</div>
				<Device model={this.props.model} onSelectDevice={this.onSelectOutputDevice.bind(this)} type='output' />
				<Connection model={this.props.model} />
				<Device model={this.props.model} onSelectDevice={this.onSelectInputDevice.bind(this)} type='input' />
				<div className="control remove">
					<button onClick={appState.removeRouting.bind(appState, this.props.model)}>X</button>
				</div>
				{
					appState.isEditingRouting(this.props.model)
					?
					<ConnectionMenu model={this.props.model} />
					:
					null
				}
			</div>
		)
	}
}