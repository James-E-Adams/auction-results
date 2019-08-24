# REA Auction Results CSV Generator

- Having a quick browse on https://www.realestate.com.au/auction-results/vic, there is no easy way to see a sorted-by-price list of sold properties from that weeks auction results. All the info is available in REA's not-so-public API (i.e if you watch HTTP traffic in the dev tools when you click to an auction-results page).

This is just a quick script to grab that data and generate a CSV that allows you to browse all the auction results for the last week, sorted however you want. I've only grabbed the data I'm interested in, but you can easily alter the map to include any extra info.

You could run this each week once the auction results are posted and browse by price.

## Usage

```
git clone git@github.com:James-E-Adams/auction-results.git
cd auction-results
yarn
yarn do
```

You'll get a `results.csv` and a `results.json`.

Then you can open the CSV in google sheets and sort however you like.

## Notes:

- I've set the delay between calls to 100ms to avoid getting throttled. Seems to be fine. I haven't actually been throttled but from experience it's pretty easy for this to happen.
- The script just does it for VIC but could easily be modified to do other states/all states if you generate the suburbs list (instructions in `src/index.js`).
