require('./connection.scss');

import Events from '../events';
import appState from '../stores/app-state'
import arrow from '../assets/arrow'

export default class Connection extends React.Component {
	static getConnectionLabel(routing) {
		let label = '';

		if(routing.connectionEnabledOptions.indexOf('allowedChannels') === -1)
		{
			label = 'Any Channel';
		}
		else
		{
			let channels = [];

			routing.connectionAllowedChannels.forEach(
				(channel, index) => { if(channel !== null) channels.push(index + 1); }
			);

			if(channels.length === 0)
			{
				label = 'No Channels'
			}
			else if(channels.length === 1)
			{
				label = 'Channel ' + channels[0];
			}
			else if(channels.length === 16)
			{
				label = 'Any Channel';
			}
			else if(channels.length <= 3)
			{
				label = 'Channels ' + channels.join(', ');
			}
			else
			{
				label = 'Channels ' + channels.slice(0, 3).join(', ') + '...';
			}
		}

		if(routing.connectionEnabledOptions.indexOf('mergeToChannel') !== -1)
		{
			label += ' to ' + routing.connectionMergeToChannel;
		}

		let additionalOpts = [];

		if(routing.connectionEnabledOptions.indexOf('forceVelocity') !== -1)
		{
			additionalOpts.push('Velocity: ' + routing.connectionForceVelocity);
		}
		if(routing.connectionEnabledOptions.indexOf('transpose') !== -1)
		{
			additionalOpts.push('Transpose: ' + routing.connectionTranspose);
		}

		if(additionalOpts.length > 0)
		{
			label += '\n' + additionalOpts.join(', ');
		}

		if(routing.connectionEnabledOptions.indexOf('whitelist') !== -1)
		{
			label = "*" + label;
		}

		return label;
	}

	render() {
		return (
			<div className={
				'connection'
			} onClick={appState.editRoutingConnection.bind(appState, this.props.model)}>
				{ arrow }
				<span>{this.constructor.getConnectionLabel(this.props.model)}</span>
			</div>
		)
	}
}