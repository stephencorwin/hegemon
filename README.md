### ⚠️ Disclaimer ⚠️
> This product is in early development and may have bugs and unexpected behaviors. Use at your own risk. Paper/Sandbox trading is recommended for users at this time.
> 
> **This repository and the application when installed is for informational purposes only and is not financial advice. Users should do their own research before making any financial decisions. Options trading carries inherent risk leading up to and including full investment loss.**
>
> *Images in this repository including URL references are mostly placeholder and are the property of their respective owners and their use does not imply endorsement or affiliation.*

# Hegemon
Tradier custom client with a strategy builder, macros, and algorithmic execution.

## Getting Started
- Sign up for an account on [Tradier](https://auth.tradier.com/signup)
  - Make sure it is a **Cash Account** if the intent is to fund it with less than $25,000 so that you are not restricted by Pattern Day-Trading regulations.
  - Request **"Options Level 2"** as this level is required for buying/selling naked calls and puts.
- Generate a paper/sandbox account
- Generate an API key for both accounts
- Download the latest stable release from the [releases page in this repository](https://github.com/stephencorwin/hegemon/releases/latest)
- Register both accounts using their respective API Keys flagging "Paper Trading" for the paper/sandbox account.
- *(Optional)* Tradier has a `$0.40` fee per options contract traded. This fee can be reduced to a maximum of `$35` a month in most cases by using their premium plan. **Paper trading does not incur any fees.**  
I am not sponsored, but would recommend doing cost analysis on which plan would be cheaper based on expected usage.
  - **Example:** 4 days a week (`16-20 days a month`) on an average of 3 options opened and closed in the same day (`6 contracts x 0.40`) would be `$38.40` in monthly fees. In this case, `$3.40` would have been saved by using the premium plan.

## Why Tradier and not...?

| Name                | API Documentation | Market Data   | Margin Accounts | Cash Accounts | Notes                                                                                                                                                                                                         |
| :------------------ | :---------------- | :------------ | :-------------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tradier             | 10/10             | Free          | ✅               | ✅             |                                                                                                                                                                                                               |
| Alpaca.markets      | 7/10              | $99 per month | ✅               | ❌             |                                                                                                                                                                                                               |
| Interactive Brokers | 2/10              | Free          | ✅               | ✅             | Authentication is horrible. Requires a separate program that requires reauthentication multiple times per day.                                                                                                |
| Robinhood           | 0/10              | ❌             | ✅               | ✅             | There is an unofficial API, but it is reported that Robinhood actively warns/bans accounts that leverage it. Their stance is that they do not want folks using an API for stocks/option trading at this time. |

I did a small proof of concept for each of the above and Tradier ultimately serviced my needs the best. I did like Alpaca.markets as it was the one I initially started with. However, I was disappointed to find out that they did not support cash accounts. Since my primary strategy is Options Day-Trading, this meant that I would need to meet the Pattern Day-Trader restrictions with Alpaca. Cash accounts are not bound by these restrictions.

## Automated bid-ask pricing
Execution speed of intended macros is prioritized over small differences in the range of the bid-ask spread. The formulas below explain how we are biasing it, but essentially we are not using the mid-point for both, but instead slightly biasing towards their respective "execution speed" price to help guarantee order fulfillment. In the future, there will be a customizable setting to prioritize how close towards the bid or ask is desired.

Macros can specify a `limitOffset` and `limitPercent` to further bias in a desired direction.

| Name      | Formula                | Notes                                   |
| :-------- | :--------------------- | :-------------------------------------- |
| `range`   | `ask` - `bid`          | Difference between the ask and the bid. |
| `midAsk`  | `bid` + `range` * 0.5  | Mid-point between the ask and the bid.  |
| `buyAsk`  | `bid` + `range` * 0.75 | Slightly biased towards the ask price.  |
| `sellAsk` | `bid` + `range` * 0.25 | Slightly biased towards the bid price.  |
