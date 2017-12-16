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
			navigator.requestMIDIAccess({ sysex:true }).then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this))
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
		console.error(arguments);
		alert('ERROR: Could not connect to MIDI');
	}

	onMIDIUnsupported()
	{
		console.error(arguments);
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
		let status1 = data[0] >> 4;
		let status2 = data[0] & 0x0F;

		if(status1 === 0xF)
		{
			return ({
				type: 'system',
				command: status2,
				channel: null,
				value1: data[1],
				value2: data[2]
			})
		}

		return ({
			type: 'channel',
			command: status1,
			channel: status2,
			value1: data[1],
			value2: data[2]
		});
	}

	getMidiCommandType(messageObject) {
		switch(messageObject.type === 'system' ? 0xF0 | messageObject.command : messageObject.command << 4)
		{
			case 0x80: return 'noteOn';
			case 0x90: return 'noteOff';
			case 0xA0: return 'aftertouchPolyKeyPressure';
			case 0xB0: return 'controlChange';
			case 0xC0: return 'programChange';
			case 0xD0: return 'aftertouchChannelPressure';
			case 0xE0: return 'pitchBend';
			case 0xF0: return 'sysex';
			case 0xF7: return 'sysexEnd';
			case 0xF1: return 'midiTimeCode';
			case 0xF2: return 'songPositionPointer';
			case 0xF3: return 'songSelect';
			case 0xF6: return 'tuneRequest';
			case 0xF8: return 'clock';
			case 0xFA: return 'start';
			case 0xFB: return 'continue';
			case 0xFC: return 'stop';
			case 0xFE: return 'activeSensing';
			case 0xFF: return 'reset';
		}

		return null;
	}

	composeMidiMessageData(messageObjectOrStatus1, status2, value1, value2) {
		if(typeof messageObjectOrStatus1 === 'object')
		{
			let msg = messageObjectOrStatus1;

			if(msg.type === 'system')
			{
				return [0xF0 | msg.command, msg.value1, msg.value2];
			}
			else
			{
				return [msg.command << 4 | msg.channel, msg.value1, msg.value2];
			}
		}

		if(typeof messageObjectOrStatus1 === 'number')
		{
			return [messageObjectOrStatus1 << 4 | status2, value1, value2];
		}
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
