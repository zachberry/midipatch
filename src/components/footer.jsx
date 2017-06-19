require('./footer.scss');

export default class Footer extends React.Component
{
	render() {
		return (
			<footer>
				<div className="wrapper">
					Built by <a target="_blank" href="http://zachberry.com/">zachberry</a> - <a target="_blank" href="https://github.com/zachberry/midipipe">github</a>
				</div>
			</footer>
		)
	}
}