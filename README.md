<div align="center">

# ForgeGiveaways
ForgeGiveaways is a lightweight, flexible, and reliable extension for managing giveaways. Fully customizable features let you automate, track, and control every giveaway seamlessly.

<a href="https://github.com/tryforge/ForgeGiveaways/"><img src="https://img.shields.io/github/package-json/v/tryforge/ForgeGiveaways/main?label=@tryforge/forge.giveaways&color=5c16d4" alt="@tryforge/forge.giveaways"></a>
<a href="https://github.com/tryforge/ForgeScript/"><img src="https://img.shields.io/github/package-json/v/tryforge/ForgeScript/main?label=@tryforge/forgescript&color=5c16d4" alt="@tryforge/forgescript"></a>
<a href="https://discord.gg/hcJgjzPvqb"><img src="https://img.shields.io/discord/997899472610795580?logo=discord" alt="Discord"></a>

</div>

---

## Contents

1. [Installation](#installation)
2. [Documentation](https://docs.botforge.org/p/ForgeGiveaways/)

<h3 align="center">Installation</h3><hr>

1. Run the following command to install the required `npm` packages:
    ```bash
    npm i @tryforge/forge.giveaways @tryforge/forge.db
    ```

    > [!WARNING]
    > **ForgeGiveaways** requires the extension [**ForgeDB**](https://docs.botforge.org/p/ForgeDB/) installed in order to operate.

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
