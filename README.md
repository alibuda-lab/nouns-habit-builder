# Alibuda Habit Builder - ETHGlobal Sydney 2024

## About

Our project is a habit builder that encourages commitment to new habits through a unique staking system. The users **first register via Base Smart Wallet** in 3 taps. To Participate in the challenge, users will stake a certain amount as a symbol of their commitment to the habit they wish to establish. Even if you’re a web3 newbie with no balance in the wallet, you can also **easily on-ramp with Unlimit.** 

We're offering two habit-building tracks: one for mental health and the other for physical health, both of which are crucial in today's world. For mental health improvement, we encourage participants to enjoy nature and engage in offline interactions with friends. Participation can be confirmed by tapping the ARX NFC at the designated location. For physical health, we're integrating with Strava so exercise records can be directly logged into Alibuda. Participants who maintain these habits have the opportunity to win unique Nouns NFTs and a share of the unsuccessful participants' stakes.

If participants fail to maintain their habit, 50% of their stake is automatically directed towards public goods. The remaining 50% is used to reward those who consistently keep their habits. This system promotes personal growth and contributes to public goods, benefiting both the individual and the larger community.

### Links

- [Presentation](https://pitch.com/v/alibuda-habit-builder-n7tzbm)
- [Video (Presentation)](https://www.youtube.com/watch?v=MqjX1VSq-GY)
- [Video (Live Demo)](https://shorturl.at/jsG02)

## Tech Stack

### Base

Keyless sign-in is available with the Base smart wallet. We have integrated the Coinbase smart wallet using the beta version of the Coinbase Wallet SDK. Utilizing ERC4337 allows users to browse and join a challenge on any device using a passkey without the need to create or connect to a crypto wallet. With Base also sponsoring the gas fee, the onboarding process is made incredibly easy. Based.

Here is the [Base smart wallet]() used in this project.

### Unlimit

Unlimit is an on-ramp service. We integrated Unlimit to allow new web3 user to easily deposit assets to their wallet and join the challenge. To motivate the users to build a new habit, they’ll need to stake to join a challenge. As new users, their Base Smart Wallet balance will be starting at 0. We use Unlimit to on-ramp and bootstrap their new Base Smart Wallet. In the sandbox environment, Unlimit didn’t support Base Sepolia, and Base Smart Wallet only support Base Sepolia. Luckily, we have Webhook with Unlimit, which enables us to let users deposit to our protocol treasury, and we can use our protocol treasury on Base Sepolia to bridge to the Base Smart Wallet.

Here is the part where Unlimit is [used](https://github.com/alibuda-lab/nouns-habit-builder/blob/bd3fe9695c947f25eaa90ef73b9f77667151b3bf/web/app/habit/components/step2stake.tsx#L63)

### Nouns DAO

Our whole project is inspired by the Nouns Running Club (https://twitter.com/NounsRC). We are from Taiwan, and we have one of the biggest NRC communities. Be Nounish and supporting public goods is the core of our project. We use art pieces from Nouns DAO to indicate different mental or physical health activities a user has attended, using them as “stamps” when users are building new habits. 

Here is the part where Nouns is [used](https://github.com/alibuda-lab/nouns-habit-builder/blob/bd3fe9695c947f25eaa90ef73b9f77667151b3bf/web/app/habit/components/step3checkin.tsx#L248)

## References
