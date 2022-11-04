import world from '@minecraft/server';

var serverSystem = server.registerSystem(0, 0);

// Setup which events to listen for
serverSystem.initialize = function () {
	// set up your listenToEvents and register server-side components here.
	world.events.beforeChat.subscribe(async (eventData) => {
		const player = eventData.sender;
		switch (eventData.message) {
			case '!wallet':
				eventData.cancel = true;
				//player.getComponent('minecraft:inventory').container.addItem(new ItemStack(Items.get('money:wallet'), 1, 0));
				player.asyncRunCommand('say hello');
				break;
			default: break;
		}
	});
}

// per-tick updates
serverSystem.update = function () {
	// Any logic that needs to happen every tick on the server.
}