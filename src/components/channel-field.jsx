require('./channel-field.scss');

import Label from './label'

export default class ChannelField extends React.Component {
	get defaultProps() {
		return ({
			selected: (new Array(16)).fill(null),
			selectOne: false,
			onChannelChange: function() {},
			disabled: true
		});
	}

	onChange(num, event) {
		this.props.onChannelChange(num, event.target.checked)
	}

	isChecked(num) {
		if(this.props.selectOne)
		{
			return num === this.props.selected;
		}
		else
		{
			return this.props.selected[num - 1] === true;
		}
	}

	render() {
		let type = this.props.selectOne ? 'radio' : 'checkbox';
		let disabled = this.props.disabled;

		return (

			<div className={
				'channel-field'
				+ (disabled ? ' is-disabled' : ' is-enabled')
			}>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 1)} checked={this.isChecked(1)} /><span>1</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 2)} checked={this.isChecked(2)} /><span>2</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 3)} checked={this.isChecked(3)} /><span>3</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 4)} checked={this.isChecked(4)} /><span>4</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 5)} checked={this.isChecked(5)} /><span>5</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 6)} checked={this.isChecked(6)} /><span>6</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 7)} checked={this.isChecked(7)} /><span>7</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 8)} checked={this.isChecked(8)} /><span>8</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 9)} checked={this.isChecked(9)} /><span>9</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 10)} checked={this.isChecked(10)} /><span>10</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 11)} checked={this.isChecked(11)} /><span>11</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 12)} checked={this.isChecked(12)} /><span>12</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 13)} checked={this.isChecked(13)} /><span>13</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 14)} checked={this.isChecked(14)} /><span>14</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 15)} checked={this.isChecked(15)} /><span>15</span></label>
				<label><input type={type} disabled={disabled} onChange={this.onChange.bind(this, 16)} checked={this.isChecked(16)} /><span>16</span></label>
			</div>
		)
	}
}