require('./header.scss');

import Events from '../events';
import logo from '../assets/logo'

export default class Header extends React.Component
{
	panic() {
		Events.emit('app:panic')
	}

	reset() {
		Events.emit('app:reset')
	}

	render() {
		return (
			<header>
				<div className="wrapper">
					{ logo }
					<h1>Midipipe</h1>
					<button className='button-panic' onClick={this.panic.bind(this)}>Panic!</button>
					<button className='button-reset' onClick={this.reset.bind(this)}>Reset</button>
				</div>
			</header>
		)
	}
}