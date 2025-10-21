<div align="center">

<img height="150" width="150" src="https://github.com/user-attachments/assets/9969c07b-2608-4ddd-930b-487485c07d80" alt="ForgeGiveaways">

# ForgeGiveaways
ForgeGiveaways is a lightweight, flexible, and reliable extension for managing giveaways. Fully customizable features let you automate, track, and control every giveaway seamlessly.

<a href="https://github.com/tryforge/ForgeGiveaways/"><img src="https://img.shields.io/github/package-json/v/tryforge/ForgeGiveaways/main?label=@tryforge/forge.giveaways&color=5c16d4" alt="@tryforge/forge.giveaways"></a>
<a href="https://github.com/tryforge/ForgeScript/"><img src="https://img.shields.io/github/package-json/v/tryforge/ForgeScript/main?label=@tryforge/forgescript&color=5c16d4" alt="@tryforge/forgescript"></a>
<a href="https://discord.gg/hcJgjzPvqb"><img src="https://img.shields.io/discord/997899472610795580?logo=discord" alt="Discord"></a>

</div>

---

## Contents

1. [Installation](#installation)
2. [Custom Messages](#custom-messages)
3. [Handling Interactions](#handling-interactions)
4. [Documentation](https://docs.botforge.org/p/ForgeGiveaways/)

<h3 align="center">Installation</h3><hr>

> [!WARNING]
> **ForgeGiveaways** requires the extension [**ForgeDB**](https://docs.botforge.org/p/ForgeDB/) installed in order to operate.

1. Run the following command to install the required `npm` packages:
    ```bash
    npm i @tryforge/forge.giveaways @tryforge/forge.db
    ```

2. Here’s an example of how your main file should look:
    ```js
    const { ForgeClient } = require("@tryforge/forgescript")
    const { ForgeGiveaways } = require("@tryforge/forge.giveaways")
    const { ForgeDB } = require("@tryforge/forge.db")

    const giveaways = new ForgeGiveaways({
        events: [
            "giveawayStart",
            "giveawayEnd"
        ],
        useDefault: true
    })

    const client = new ForgeClient({
        ...options // The options you currently have
        extensions: [
            giveaways,
            new ForgeDB()
        ]
    })

    client.commands.load("commands")
    giveaways.commands.load("giveaways")

    client.login("YourToken")
    ```

> [!NOTE]
> View all available client options [here](https://github.com/tryforge/ForgeGiveaways/blob/main/src/index.ts#L8).

<h3 align="center">Custom Messages</h3><hr>

You can disable the default messages by setting `useDefault: false` in the client options, and override them with custom messages emitted through events. Use desired functions to retrieve information about the current giveaway.

> [!WARNING]
> Only **one** `giveawayStart` event is allowed per client instance!

##### Examples
```js
module.exports = {
  type: "giveawayStart",
  code: `
  $return[
    $sendMessage[$giveawayChannelID;
      $addContainer[
        $addTextDisplay[### 🎉 Giveaway 🎉]
        $addSeparator
        $addTextDisplay[**Prize:** $giveawayPrize\n**Winners:** $giveawayWinnersCount]
        $addSeparator
        $addActionRow
        $addButton[giveawayEntry-$giveawayID;Join;Secondary;🎉]
      ;Green]
    ;true]
  ]
  `
}
```

```js
module.exports = {
  type: "giveawayEnd",
  code: `
  $sendMessage[$giveawayChannelID;
    $reply[$giveawayChannelID;$giveawayMessageID;true]
    🏆 **Winners:** <@$newGiveaway[winners;>, <@]>
  ]
  `
}
```

<h3 align="center">Handling Interactions</h3><hr>

 ```js
module.exports = {
  type: "giveawayEntryAdd",
  code: `
  $interactionReply[
    $ephemeral
    You have joined this giveaway as **$ordinal[$@[,]giveawayEntries]** participant! 
  ]
  `
}
```