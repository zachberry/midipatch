require('./message-filter-field.scss');

import Label from './label'
import Events from '../events';

export default class MessageFilterField extends React.Component {
	get defaultProps() {
		return ({
			selected: {
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
			onItemSelected: function() {},
			disabled: true
		});
	}

	onChange(propName, event) {
		this.props.onItemSelected(propName, event.target.checked)
	}

	render() {
		let disabled = this.props.disabled;

		return (

			<div className={
				'message-filter-field'
				+ (disabled ? ' is-disabled' : ' is-enabled')
			}>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'note')} checked={this.props.selected.note} /><span>Note On/Off</span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'pitchBend')} checked={this.props.selected.pitchBend} /><span>Pitch Bend</span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'aftertouch')} checked={this.props.selected.aftertouch} /><span>Aftrtouch</span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'controlChange')} checked={this.props.selected.controlChange} /><span>CC</span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'programChange')} checked={this.props.selected.programChange} /><span>Prog Chg</span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'sysex')} checked={this.props.selected.sysex} /><span><i>Sysex</i></span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'activeSensing')} checked={this.props.selected.activeSensing} /><span><i>Actv Sen</i></span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'reset')} checked={this.props.selected.reset} /><span><i>Reset</i></span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'clock')} checked={this.props.selected.clock} /><span><i>Clock</i></span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'start')} checked={this.props.selected.start} /><span><i>Start</i></span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'continue')} checked={this.props.selected.continue} /><span><i>Continue</i></span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'stop')} checked={this.props.selected.stop} /><span><i>Stop</i></span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'midiTimeCode')} checked={this.props.selected.midiTimeCode} /><span><i>MTC</i></span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'songPositionPointer')} checked={this.props.selected.songPositionPointer} /><span><i>Song Ptr</i></span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'songSelect')} checked={this.props.selected.songSelect} /><span><i>Song Sel</i></span></label>
				<label><input type="checkbox" disabled={disabled} onChange={this.onChange.bind(this, 'tuneRequest')} checked={this.props.selected.tuneRequest} /><span><i>Tune Rq</i></span></label>
			</div>
		)
	}
}