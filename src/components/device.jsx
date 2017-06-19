require('./device.scss');

import Menu from './menu';
import appState from '../stores/app-state';

export default class Device extends React.Component {
	static get defaultProps()
	{
		return({
			model: null,
			type: 'input', // input | output,
			onSelectDevice: function() {}
		})
	}

	constructor(props) {
		super(props);

		this.boundDocumentClick = this.onDocumentClick.bind(this);

		this.state = {
			selecting: false
		};
	}

	isElementInMenu(el) {
		return ReactDOM.findDOMNode(this.refs.menu).contains(el);
	}

	stopSelecting() {
		document.removeEventListener('click', this.boundDocumentClick);
		this.setState({
			selecting: false
		})
	}

	onDeviceClick(event) {
		if(this.isElementInMenu(event.target)) return;

		document.addEventListener('click', this.boundDocumentClick);

		this.setState({
			selecting: true
		});
	}

	onDocumentClick(event) {
		if(this.isElementInMenu(event.target)) return;

		this.stopSelecting();
	}

	onSelectDevice(item) {
		if(item !== null)
		{
			this.props.onSelectDevice(item);
		}

		this.stopSelecting();
	}

	render() {
		let midiArray = null;
		let deviceName = 'Select device...';
		let id;
		let device;
		let cantFindDevice = false;

		if(this.props.type === 'input')
		{
			id = this.props.model.inputDeviceId;
			device = appState.midi.getInputDeviceById(id);
			midiArray = appState.midi.inputsArray;
		}
		else
		{
			id = this.props.model.outputDeviceId;
			device = appState.midi.getOutputDeviceById(id);
			midiArray = appState.midi.outputsArray;
		}

		if(id !== null && !device) cantFindDevice = true;
		if(device) deviceName = device.name || '(No Name)';

		return (
			<div className={
				'device' + (id === null ? ' is-unset' : ' is-set')
				+ (this.state.selecting ? ' is-selecting' : ' is-not-selecting')
				+ (' is-' + this.props.type)
				+ (cantFindDevice ? ' is-missing-device' : '')
			} onClick={this.onDeviceClick.bind(this)}>
				{ cantFindDevice ? 'Missing Device' : deviceName}
				<Menu
					ref='menu'
					onClick={this.onSelectDevice.bind(this)}
					items={midiArray}
					emptyMessage={'No ' + this.props.type + ' ports found'}
				/>
			</div>
		)
	}
}