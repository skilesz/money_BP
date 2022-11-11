import { Items, ItemStack, ScoreboardIdentity, world } from '@minecraft/server';
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";


// CONSTANTS
const wages = {
    "governor": 520,
    "construction": 200,
    "technology": 400,
    "planner": 280,
    "farmer": 360,
    "interior": 400
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
    let { item, source } = eventData;
    switch (item.typeId) {
        case 'money:wallet':
            var parts = world.scoreboard.getObjective('money').getParticipants();
            parts.forEach(part => {
                if (part.displayName === source.name) {
                    var money = world.scoreboard.getObjective('money').getScore(part);
                    // world.getDimension('minecraft:overworld').runCommand('msg ' + source.name + ' You have §a§l$' + money + '§r!');

                    // Define forms
                    let walletForm = new ActionFormData();
                    walletForm.title('§l§6Wallet');
                    walletForm.body('You have §a§l$' + money + ' §rin your account!');
                    walletForm.button('Spend', 'textures/items/Wallet Item Icon');
                    walletForm.button('Transfer', 'textures/items/pack_icon');

                    let walletSpendForm = new ModalFormData();
                    walletSpendForm.title('§6§lSpend Money');
                    walletSpendForm.textField('Amount', 'Amount to Spend');
                    
                    let walletTransferForm = new ModalFormData();
                    walletTransferForm.title('§6§lTransfer Money');
                    walletTransferForm.textField('Amount', 'Amount to Transfer');
                    walletTransferForm.textField('Recipient', 'Who To Transfer To');


                    // Wallet form
                    walletForm.show(source).then(r => {
                        if (r.isCanceled) return;

                        let response = r.selection;
                        switch (response) {
                            case 0:
                                // Spend money
                                walletSpendForm.show(source).then(r => {
                                    if (r.isCanceled) return;

                                    let [ spend ] = r.formValues;
                                    spend = parseInt(spend);
                                    if (Number.isNaN(spend)) return;
                                    if (spend > 1000 + money) {
                                        world.getDimension('minecraft:overworld').runCommand('w ' + source.name + ' §c§lInsufficient funds')
                                        return;
                                    }
                                    source.runCommand('scoreboard players remove @s money ' + spend);
                                    world.say('§l' + source.name + ' §rspent §a§l$' + spend + '§r!');
                                }).catch (e => {
                                    console.error(e, e.stack);
                                });
                                break;
                            case 1:
                                // Transfer money
                                walletTransferForm.show(source).then(r => {
                                    if (r.isCanceled) return;

                                    let [ spend, recipient ] = r.formValues;
                                    spend = parseInt(spend);
                                    if (Number.isNaN(spend)) return;
                                    if (spend > 1000 + money) {
                                        world.getDimension('minecraft:overworld').runCommand('w ' + source.name + ' §c§lInsufficient funds')
                                        return;
                                    }
                                    source.runCommand('scoreboard players remove @s money ' + spend);
                                    source.runCommand('scoreboard players add ' + recipient + ' money ' + spend);
                                    world.say('§l' + source.name + ' §rtransferred §a§l$' + spend + ' §rto §l' + recipient + '§r!');
                                }).catch (e => {
                                    console.error(e, e.stack);
                                });
                                break;
                            default:
                                break;
                        }
                    }).catch(e => {
                        console.error(e, e.stack);
                    });
                }
            });
            break;
        default:
            break;
    }
});

// Listen for world initialization
world.events.worldInitialize.subscribe(eventData => {
    if (world.scoreboard.getObjective('money') === null) {
        world.scoreboard.addObjective('money', 'Money');
    }
});


// ON-TICK
world.events.tick.subscribe((eventData) => {
    // Every Minecraft day
    if (eventData.currentTick % 24000 === 0) {
        // Give job money
        var players = Array.from(world.getPlayers());
        players.forEach(async player => {
            var inv = player.getComponent('inventory').container;

            for (let i = 0; i < inv.size; i++) {
                var item = inv.getItem(i);
                if (item != undefined) {
                    switch (item.typeId) {
                        case 'money:governor_job':
                            player.runCommand('scoreboard players add @s money ' + wages.governor);
                            player.runCommand('titleraw @s actionbar {"rawtext":[{"text":"§l§6GOVERNOR"},{"text":"§r: "},{"text":"§aYou\'ve received $520!"}]}');
                            break;
                        case 'money:construction_job':
                            player.runCommand('scoreboard players add @s money ' + wages.construction);
                            player.runCommand('titleraw @s actionbar {"rawtext":[{"text":"§l§6CONSTRUCTION"},{"text":"§r: "},{"text":"§aYou\'ve received $200!"}]}');
                            break;
                        case 'money:technology_job':
                            player.runCommand('scoreboard players add @s money ' + wages.technology);
                            player.runCommand('titleraw @s actionbar {"rawtext":[{"text":"§l§6TECHNOLOGY"},{"text":"§r: "},{"text":"§aYou\'ve received $400!"}]}');
                            break;
                        case 'money:planner_job':
                            player.runCommand('scoreboard players add @s money ' + wages.planner);
                            player.runCommand('titleraw @s actionbar {"rawtext":[{"text":"§l§6PLANNER"},{"text":"§r: "},{"text":"§aYou\'ve received $280!"}]}');
                            break;
                        case 'money:farmer_job':
                            player.runCommand('scoreboard players add @s money ' + wages.farmer);
                            player.runCommand('titleraw @s actionbar {"rawtext":[{"text":"§l§6FARMER"},{"text":"§r: "},{"text":"§aYou\'ve received $360!"}]}');
                            break;
                        case 'money:interior_job':
                            player.runCommand('scoreboard players add @s money ' + wages.interior);
                            player.runCommand('titleraw @s actionbar {"rawtext":[{"text":"§l§6INTERIOR"},{"text":"§r: "},{"text":"§aYou\'ve received $400!"}]}');
                            break;
                        default:
                            break;
                    }
                }
            }
        });
        world.say('§6§l[MONEY]: §rPay distributed!');
    }
});


// HELPER FUNCTIONS

// Sleep
function sleep(callback, delay = 1) {
    if (delay < 1) {
      Promise.resolve().then(callback);
      return;
    }
    const n = Math.floor(delay);
    let i = 0;
    (function tick() {
      i++;
      if (i >= n) {
        system.run(callback);
        return;
      }
      system.run(tick);
    })();
}