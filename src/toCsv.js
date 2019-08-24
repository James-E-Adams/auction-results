const fs = require("fs")
const converter = require("json-2-csv")

const toCSV = (resultsArray, outputFileName) => {
  const stream = fs.createWriteStream(outputFileName, { flags: "a" })
  const headers = "price,suburb,postcode,listing,outcome"
  stream.write(headers)
  stream.write("\n")
  resultsArray.forEach((result, i) => {
    converter.json2csv(
      result,
      (err, csv) => {
        if (err) {
          console.log("error in parse for result ", i, " error is: ", err)
          return
        }
        stream.write(csv)
        stream.write("\n")
      },
      {
        prependHeader: false,
        keys: ["price", "suburb", "postcode", "listing", "outcome"]
      }
    )
  })
}

module.exports = toCSV
