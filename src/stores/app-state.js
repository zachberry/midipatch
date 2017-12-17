import Events from '../events';
import MIDI from '../midi';
import DeviceToRoutingsMap from '../device-to-routings-map'
import { LOCAL_STORAGE_KEY } from '../config'

class AppState {
	static createNewRouting() {
		return ({
			enabled: true,
			inputDeviceId: null,
			outputDeviceId: null,
			connectionEnabledOptions: [],
			connectionAllowedChannels: [true, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
			connectionMergeToChannel: 1,
			connectionForceVelocity: 127,
			connectionTranspose: 0,
			connectionWhitelist: {
				note: false,
				pitchBend: false,
				aftertouch: false,
				controlChange: false,
				programChange: false,
				sysex: false,
				midiTimeCode: false,
				songPositionPointer: false,
				songSelect: false,
				tuneRequest: false,
				clock: false,
				start: false,
				continue: false,
				stop: false,
				activeSensing: false,
				reset: false
			},
			connectionCustomMapping: null
		})
	}

	static createInitialState() {
		return ({
			routings: [this.createNewRouting()],
			editingRouting: null
		});
	}

	constructor() {
		this.deviceToRoutings = new DeviceToRoutingsMap();
		this.midi = new MIDI(this.onMIDIInit.bind(this));
		this.state = this.constructor.createInitialState();

		this.history = []
	}

	reset(newState = null) {
		this.history = [];
		this.midi.clearAllMIDIListeners();
		this.state = Object.assign(this.constructor.createInitialState(), newState);
		this.onUpdate();
	}

	onMIDIInit() {
		this.refreshMIDIListeners();
		this.onUpdate();
	}

	refreshMIDIListeners() {
		this.midi.clearAllMIDIListeners();
		this.deviceToRoutings.clear();

		this.state.routings.forEach( (routing) => {
			this.addMessageCallback(routing);
		})
	}

	addRouting() {
		this.state.routings.push(this.constructor.createNewRouting());
		this.onUpdate();
	}

	refreshDeviceToRoutingsMap() {
		this.deviceToRoutings.clear();
		this.state.routings.forEach( (routing) => {
			let device = this.midi.getOutputDeviceById(routing.outputDeviceId);

			if(device)
			{
				this.deviceToRoutings.add(device, routing);
			}
		})
	}

	removeRouting(routing) {
		let index = this.state.routings.indexOf(routing)

		if(index === -1) return false;

		this.state.routings.splice(index, 1);
		this.refreshDeviceToRoutingsMap();
		this.onUpdate();
		return true;
	}

	setOutputDevice(routing, device) {
		this.clearMessageCallback(routing);

		routing.outputDeviceId = device.id;

		this.addMessageCallback(routing);
		this.onUpdate();
	}

	setInputDevice(routing, device) {
		routing.inputDeviceId = device.id;
		this.onUpdate();
	}

	addMessageCallback(routing) {
		if(routing.outputDeviceId === null) return;

		let outputDevice = this.midi.getOutputDeviceById(routing.outputDeviceId);

		if(outputDevice)
		{

			this.deviceToRoutings.add(outputDevice, routing);
			outputDevice.onmidimessage = this.onMIDIMessage.bind(this, outputDevice);
			outputDevice.onstatechange = this.onMIDIStateChange.bind(this, outputDevice);
		}
	}

	clearMessageCallback(routing) {
		if(routing.outputDeviceId === null) return;

		let outputDevice = this.midi.getOutputDeviceById(routing.outputDeviceId);

		if(outputDevice) outputDevice.onmidimessage = null;
	}

	isRoutingConnected(routing) {
		return (
			routing.enabled
			&& routing.inputDeviceId !== null
			&& routing.outputDeviceId !== null
		);
	}

	// channels = null is OMNI mode (aka any channel)
	// system type message have no channel specified
	isMIDIDataInChannels(midiData, channels) {
		return midiData.type === 'system' || channels[midiData.channel] === true;
	}

	isMIDIDataInWhitelist(midiData, whitelist) {
		switch(this.midi.getMidiCommandType(midiData))
		{
			case 'noteOn': return whitelist.note;
			case 'noteOff': return whitelist.note;
			case 'aftertouchPolyKeyPressure': return whitelist.aftertouch;
			case 'controlChange': return whitelist.controlChange;
			case 'programChange': return whitelist.programChange;
			case 'aftertouchChannelPressure': return whitelist.aftertouch;
			case 'pitchBend': return whitelist.pitchBend;
			case 'sysex': return whitelist.sysex;
			case 'sysexEnd': return whitelist.sysex;
			case 'midiTimeCode': return whitelist.midiTimeCode;
			case 'songPositionPointer': return whitelist.songPositionPointer;
			case 'songSelect': return whitelist.songSelect;
			case 'tuneRequest': return whitelist.tuneRequest;
			case 'clock': return whitelist.clock;
			case 'start': return whitelist.start;
			case 'continue': return whitelist.continue;
			case 'stop': return whitelist.stop;
			case 'activeSensing': return whitelist.activeSensing;
			case 'reset': return whitelist.reset;
		}
	}

	isOptionEnabled(routing, opt) {
		return routing.connectionEnabledOptions.indexOf(opt) !== -1;
	}

	onMIDIStateChange(device, event) {
		this.onUpdate();
	}

	onMIDIMessage(device, message) {
		let midiData;

		this.deviceToRoutings.get(device).forEach( (routing) => {
			if(!this.isRoutingConnected(routing))
			{
				this.emitMIDIMessage(message.data, 'blocked', routing);
				return;
			}

			// special performance case - if there is no filtering/transformation going
			// on in the midi message we don't touch it and simply send it to
			// it's destination:
			if(routing.connectionEnabledOptions.length === 0)
			{
				this.sendMIDI(routing, message.data);
				return;
			}

			midiData = this.midi.getMidiMessageValues(message.data);
			if(this.isOptionEnabled(routing, 'allowedChannels') && !this.isMIDIDataInChannels(midiData, routing.connectionAllowedChannels))
			{
				Events.emit('midi:message', 'blocked', routing)
				return;
			}
			if(this.isOptionEnabled(routing, 'whitelist') && !this.isMIDIDataInWhitelist(midiData, routing.connectionWhitelist))
			{
				Events.emit('midi:message', 'blocked', routing)
				return;
			}

			this.transformMIDIData(routing, midiData);

			this.sendMIDI(
				routing,
				this.midi.composeMidiMessageData(midiData)
			);
		})


	}

	sendMIDI(routing, data)
	{
		this.midi.getInputDeviceById(routing.inputDeviceId).send(data);
		this.emitMIDIMessage(data, 'sent', routing);
	}

	emitMIDIMessage(data, status, routing)
	{
		// Don't emit for System real time messages
		// since some devices send this very often
		if(data[0] >> 4 === 0xF) return;
		Events.emit('midi:message', status, routing);
	}

	transformMIDIData(routing, midiData) {
		// merge to channel
		if(this.isOptionEnabled(routing, 'mergeToChannel'))
		{
			midiData.channel = parseInt(routing.connectionMergeToChannel, 10) - 1;
		}

		switch(midiData.command)
		{
			case 0x9: // note on
				// force velocity
				// we don't transform velocity if it's 0 (meaning it's a fake note off event)
				if(this.isOptionEnabled(routing, 'forceVelocity') && midiData.value2 > 0)
				{
					midiData.value2 = parseInt(routing.connectionForceVelocity, 10);
				}

			case 0x8: // note off
			case 0xA: // poly key pressure
				// transpose
				if(this.isOptionEnabled(routing, 'transpose'))
				{
					midiData.value1 += parseInt(routing.connectionTranspose, 10);
				}
		}

		// custom mapping (@TODO)
		return midiData;
	}

	panic()
	{
		this.midi.sendNoteOffToAllDevices();
	}

	setRoutingEnabled(routing, enabled) {
		routing.enabled = enabled;
		this.onUpdate();
	}

	setConnectionOptionEnabled(routing, opt, shouldBeEnabled) {
		let index = routing.connectionEnabledOptions.indexOf(opt);

		if(shouldBeEnabled && index === -1)
		{
			routing.connectionEnabledOptions.push(opt);
		}
		else if(!shouldBeEnabled && index !== -1)
		{
			routing.connectionEnabledOptions.splice(index, 1);
		}

		this.onUpdate();
	}

	setConnectionOptions(routing, opts) {
		routing = Object.assign(routing, {
			connectionAllowedChannels: opts.allowedChannels || routing.connectionAllowedChannels,
			connectionMergeToChannel: opts.mergeToChannel || routing.connectionMergeToChannel,
			connectionForceVelocity: opts.forceVelocity || routing.connectionForceVelocity,
			connectionTranspose: opts.transpose || routing.connectionTranspose,
			connectionWhitelist: opts.whitelist || routing.connectionWhitelist
		});
		this.onUpdate();
	}

	editRoutingConnection(routing) {
		this.state.editingRouting = routing;
		this.onUpdate();
	}

	stopEditing() {
		this.state.editingRouting = null;
		this.onUpdate();
	}

	isEditingRouting(routing) {
		return this.state.editingRouting === routing;
	}

	get isCurrentlyEditingRouting() {
		return this.state.editingRouting !== null;
	}

	get stateObject() {
		return Object.assign({}, this.state)
	}

	set stateObject(o) {
		this.reset(o);
	}

	onUpdate() {
		this.recordHistory();
		Events.emit('app:change', this.stateObject)
	}

	recordHistory() {
		let state = this.stateObject;

		this.history.push(state);
		window.localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(state);
	}

	tryRestoreStateFromStorage() {
		let storedStateJSON = window.localStorage[LOCAL_STORAGE_KEY];

		if(!storedStateJSON) return;

		try
		{
			let state = JSON.parse(storedStateJSON);

			this.stateObject = state;
		}
		catch(e)
		{
			console.error(e);
		}
	}
}

let appState = new AppState

export default appState