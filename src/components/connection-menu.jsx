require('./connection-menu.scss');

import ChannelField from './channel-field';
import MessageFilterField from './message-filter-field';
import appState from '../stores/app-state'

export default class ConnectionMenu extends React.Component {
	onAllowedChannelChange(channelNum, newValue) {
		let allowedChannels = Object.assign([], this.props.model.connectionAllowedChannels);

		allowedChannels[channelNum - 1] = newValue || null;
		appState.setConnectionOptions(this.props.model, { allowedChannels });
	}

	onWhitelistItemSelected(propName, isEnabled) {
		let whitelist = Object.assign({}, this.props.model.connectionWhitelist);

		whitelist[propName] = isEnabled;
		appState.setConnectionOptions(this.props.model, { whitelist });
	}

	onMergeToChannelChange(mergeToChannel) {
		appState.setConnectionOptions(this.props.model, { mergeToChannel });
	}

	onOptionEnabledChange(opt, event) {
		appState.setConnectionOptionEnabled(this.props.model, opt, event.target.checked);
	}

	onVelocityChange(event) {
		appState.setConnectionOptions(this.props.model, { forceVelocity:event.target.value });
	}

	onTransposeChange(event) {
		appState.setConnectionOptions(this.props.model, { transpose:event.target.value });
	}

	render() {
		let model = this.props.model;
		let enabled = model.connectionEnabledOptions;

		return (
			<div className='connection-menu'>
				<div className='allowed-channels'>
					<label>
						<input type='checkbox' onChange={this.onOptionEnabledChange.bind(this, 'allowedChannels')} checked={enabled.indexOf('allowedChannels') !== -1} />
						<span>Allow messages from these channels only:</span>
					</label>
					<ChannelField disabled={enabled.indexOf('allowedChannels') === -1} selected={model.connectionAllowedChannels} onChannelChange={this.onAllowedChannelChange.bind(this)} />
				</div>
				<div className='merge-to-channel'>
					<label>
						<input type='checkbox' onChange={this.onOptionEnabledChange.bind(this, 'mergeToChannel')} checked={enabled.indexOf('mergeToChannel') !== -1} />
						<span>Remap to channel:</span>
					</label>
					<ChannelField disabled={enabled.indexOf('mergeToChannel') === -1} selectOne selected={model.connectionMergeToChannel} onChannelChange={this.onMergeToChannelChange.bind(this)} />
				</div>
				<div className='force-velocity-to'>
					<label>
						<input type='checkbox' onChange={this.onOptionEnabledChange.bind(this, 'forceVelocity')} checked={enabled.indexOf('forceVelocity') !== -1} />
						<span>Force velocity to:</span>
					</label>
					<input type='number' disabled={enabled.indexOf('forceVelocity') === -1} onChange={this.onVelocityChange.bind(this)} min='0' max='127' step='1' value={model.connectionForceVelocity} />
				</div>
				<div className='transpose-notes-by'>
					<label>
						<input type='checkbox' onChange={this.onOptionEnabledChange.bind(this, 'transpose')} checked={enabled.indexOf('transpose') !== -1} />
						<span>Transpose notes by:</span>
					</label>
					<input type='number' disabled={enabled.indexOf('transpose') === -1} onChange={this.onTransposeChange.bind(this)} min='-60' max='60' step='1' value={model.connectionTranspose} />
				</div>
				<div className='whitelist'>
					<label>
						<input type='checkbox' onChange={this.onOptionEnabledChange.bind(this, 'whitelist')} checked={enabled.indexOf('whitelist') !== -1} />
						<span>Allow these messages only:</span>
					</label>
					<MessageFilterField disabled={enabled.indexOf('whitelist') === -1} selected={model.connectionWhitelist} onItemSelected={this.onWhitelistItemSelected.bind(this)} />
				</div>
			</div>
		)
	}
}