require('./menu.scss');

export default class Menu extends React.Component {
	static get defaultProps() {
		return {
			items: [],
			onClick: function() {}
		}
	}

	render() {
		return (
			<ul className='menu'>
				{
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