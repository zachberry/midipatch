// WebMIDI defines inputs as incomning MIDI input
// Our definition is more traditonal in the form
// of input meaning a MIDI IN port, an input to
// recieve MIDI messages.

export default class MIDI {
	constructor(onReadyCallback = function() {}) {
		this.onReadyCallback = onReadyCallback;
		this.midiAccess = null;

		if(navigator.requestMIDIAccess)
		{
			navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this))
		}
		else
		{
			this.onMIDIUnsupported();
		}
	}

	get isReady() {
		return this.midiAccess !== null;
	}
	
	onMIDIFailure()
	{
		alert('ERROR: Could not connect to MIDI');
	}

	onMIDIUnsupported()
	{
		alert('ERROR: Browser does not support MIDI');
	}

	onMIDISuccess(midiAccess)
	{
		this.midiAccess = midiAccess;

		this.onReadyCallback(this);
	}

	clearAllMIDIListeners() {
		if(!this.isReady) return;

		this.outputsArray.forEach( (device) => {
			device.onmidimessage = null;
		});
	}

	get inputs() {
		if(!this.isReady) return new Map();
		return this.midiAccess.outputs;
	}

	get inputsArray() {
		return [...this.inputs].map( (a) => a[1] );
	}

	get outputs() {
		if(!this.isReady) return new Map();
		return this.midiAccess.inputs;
	}

	get outputsArray() {
		return [...this.outputs].map( (a) => a[1] );
	}

	getInputDeviceById(id) {
		if(!this.isReady) return null;
		return this.midiAccess.outputs.get(id);
	}

	getOutputDeviceById(id) {
		if(!this.isReady) return null;
		return this.midiAccess.inputs.get(id);
	}

	getMidiMessageValues(data) {
		return ({
			command: data[0] >> 4,
			channel: data[0] & 0x0F,
			noteNumber: data[1],
			value: data[2]
		});
	}

	composeMidiMessageData(command, channel, noteNumber, value) {
		return [command << 4 | channel, noteNumber, value];
	}

	sendNoteOffToAllDevices() {
		let messages = [];
		for(var i = 0, len = 16; i < len; i++)
		{
			for(var j = 0, len2 = 127; j < len2; j++)
			{
				messages.push(this.composeMidiMessageData(0x8, i, j, 0));
			}
		}

		this.inputsArray.forEach( (device) => {
			messages.forEach( (message) => {
				device.send(message);
			})
		});
	}
}
