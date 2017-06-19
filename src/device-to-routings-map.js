export default class DeviceToRoutingsMap {

	constructor() {
		this.map = new Map();
	}

	clear() {
		this.map.clear();
	}

	add(device, routing) {
		if(!this.map.has(device))
		{
			this.map.set(device, new Set());
		}

		this.map.get(device).add(routing);
	}

	get(device) {
		if(!this.map.has(device)) return new Set();
		return this.map.get(device);
	}

	delete(device, routing) {
		if(!this.map.has(device)) return false;
		
		let routings = this.map.get(device);

		routings.delete(routing);
		if(routings.size === 0)
		{
			this.map.delete(device);
		}
	}

	// deleteRouting(routing) {
	// 	[...this.map].forEach( (pair) => {
	// 		let device = pair[0];

	// 		this.delete(device, routing);
	// 	})
	// }

	has(key) {
		return this.map.has(key)
	}
}