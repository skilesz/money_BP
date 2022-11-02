// This file demonstrates that the code is working by
// Spamming the chat with "Hello World"
 
// Import world component from "@minecraft/server"
import { world } from '@minecraft/server';

world.events.beforeChat.subscribe(async (eventData) => {
	const player = eventData.sender;
	switch (eventData.message) {
		case '!wallet':
			eventData.cancel = true;
			await player.runCommandAsync('give @s minecraft:glass');
			break;
		default: break;
	}
});
