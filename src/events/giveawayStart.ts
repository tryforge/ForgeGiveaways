import { GiveawayEventHandler } from '../structures/GiveawayEventManager'
import { DatabaseType, Giveaway } from 'discord-giveaways-super'
import { GiveawayManager } from '../structures/GiveawayManager'
import { Interpreter } from 'forgescript'

export default new GiveawayEventHandler<'giveawayStart'>({
    name: 'giveawayStart',
    description: 'Emitted when a giveaway starts.',
    listener: async function(giveaway: Giveaway<DatabaseType.JSON>) {
        const commands = GiveawayManager.Client?.giveawayManager?.commands?.get('giveawayStart')

        if (commands?.length) {
            for (const command of commands) {
                Interpreter.run({
                    command,
                    client: GiveawayManager.Client!,
                    data: command.compiled.code,
                    obj: giveaway
                })
            }
        }

    },
    intents: ['GuildMessageReactions']
})
