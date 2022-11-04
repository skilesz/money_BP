import { Items, ItemStack, world } from '@minecraft/server';


// Event listeners

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

