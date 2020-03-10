const fs = require("fs")
const rp = require("request-promise")
const allSettled = require("promise.allsettled")

allSettled.shim()

// Run in browser console on https://www.realestate.com.au/auction-results/vic to get the suburbs
// [...document.querySelectorAll('a')].map(a=>a.href).filter(a=>a.indexOf('3')>-1).map((a)=>a.split('auction-results/')[1])
const suburbs = require("./suburbs.json").suburbs
const toCSv = require("./toCsv")
const BASE_URL =
  "https://sales-events-api.realestate.com.au/sales-events/location"

const CSV_FILENAME = "results.csv"
const JSON_FILENAME = "results.json"
const delayBetweenCalls = 100

//Eg url: "https://sales-events-api.realestate.com.au/sales-events/location/ascot-vale-vic-3032"
const uris = suburbs.map(suburb => `${BASE_URL}/${suburb}`).slice(0, 10)

const currencyStringToNumber = currencyString =>
  Number(currencyString.replace(/[^0-9.-]+/g, ""))

const mapAuctionResult = ({ suburb, postcode }) => auctionResult => ({
  outcome: auctionResult.outcome && auctionResult.outcome.display,
  price:
    auctionResult.price &&
    auctionResult.price.display &&
    currencyStringToNumber(auctionResult.price.display),
  listing:
    auctionResult.listing &&
    auctionResult.listing.trackedCanonical &&
    auctionResult.listing.trackedCanonical.templatedUrl,
  suburb,
  postcode,
  rawAuctionResult: auctionResult
})

const sleeper = ms => new Promise(resolve => setTimeout(resolve, ms))

;(async () => {
  const apiResults = await Promise.allSettled(
    uris.map((uri, index) =>
      sleeper(index * delayBetweenCalls).then(() => {
        console.log(`calling ${index}`)
        return rp({
          uri,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"
          },
          json: true
        })
      })
    )
  )
  debugger
  const results = apiResults
    .map(({ data }) => {
      console.log(data)
      const auctionResults = data && data.auctionResults
      if (!auctionResults) return
      return auctionResults.map(
        mapAuctionResult({
          suburb: data.suburb && data.suburb.name,
          postcode: data.suburb && data.suburb.postcode
        })
      )
    })
    .flat()

  fs.writeFileSync(
    JSON_FILENAME,
    JSON.stringify(
      {
        results
      },
      null,
      2
    )
  )
  toCSv(results, CSV_FILENAME)
})()
