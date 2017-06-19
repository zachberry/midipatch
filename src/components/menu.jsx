require('./menu.scss');

export default class Menu extends React.Component {
	static get defaultProps() {
		return {
			items: [],
			emptyMessage: 'Empty',
			onClick: function() {}
		}
	}

	render() {
		let isEmpty = this.props.items.length === 0;

		return (
			<ul className={
				'menu'
				+ (isEmpty ? ' is-empty': ' is-not-empty')	
			}>
				{
					isEmpty
					?
					<li onClick={this.props.onClick.bind(this, null)}>{this.props.emptyMessage}</li>
					:
					this.props.items.map( (function(item, index) {
						return (
							<li key={index} onClick={this.props.onClick.bind(this, item)}>{item.name || '(No Name)'}</li>
						);
					}).bind(this))
				}
			</ul>
		)
	}
}