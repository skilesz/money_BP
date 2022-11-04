import { Items, ItemStack, world } from '@minecraft/server';


// CONSTANTS
const wages = {
    "governor": 520,
    "construction": 200,
    "technology": 400,
    "planner": 280,
    "farmer": 360
};


// GLOBAL


// EVENT LISTENERS

// !wallet command to listen/give player a wallet
world.events.beforeChat.subscribe((eventData) => {
    const player = eventData.sender;
    switch (eventData.message) {
        case '!wallet':
            eventData.cancel = true;
            player.getComponent('inventory').container.addItem(new ItemStack(Items.get("money:wallet"), 1, 0));
            break;
        default: break;
    }
});

// Listen for wallet use event
world.events.beforeItemUse.subscribe((eventData) => {
    switch (eventData.item.typeId) {
        case 'money:wallet':
            world.broadcastClientMessage()
            break;
        default:
            break;
    }
});


// ON-TICK
world.events.tick.subscribe((eventData) => {
    if (eventData.currentTick % 24000) {
        // Give job money
        var players = world.getPlayers();
        players.forEach(player => {
            player.runCommand('testfor @s [hasitem={item=money:wallet}]')
        });
        world.say('§6§l[MONEY]: §rPay distributed!');
    }
});