require('./label.scss');

export default class Label extends React.Component {
	static get defaultProps() {
		return ({
			value: '',
			editMode: false,
			onChange: function() {}
		})
	}

	onChange(event) {
		this.props.onChange(event.target.value);
	}

	render() {
		return (
			<div className='label'>
				{
					this.props.editMode
					?
					<input className='label-input' value={this.props.children} onChange={this.onChange.bind(this)} />
					:
					this.props.children
				}
			</div>
		)
	}
}