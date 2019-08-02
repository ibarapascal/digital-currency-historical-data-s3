# DigitalCurrencyHistoricalDataS3

Keywords: Bitcoin, Digital Currency, Trade Data, Local, Node, Javascript, Cryptocompare.

A tool to do the following things.

1.Check the trade data from [cryptocompare.com](https://min-api.cryptocompare.com).

2.Check data if continous and save to local json file like [db-btc-hours-20130401-20190715.json](https://github.com/ibarapascal/DigitalCurrencyHistoricalDataS3/blob/master/db-btc-hours-20130401-20190715.json).

3.Serve local to use offline using [json-server](https://github.com/typicode/json-server).

4.Use the local data via API in your own project.

- Step
```shell
git clone https://github.com/ibarapascal/digital-currency-historical-data-s3.git
cd digital-currency-historical-data-s3
node main.js
npm install -g json-server
json-server --watch {db.json} -> name of chosen json file
```

- Parameters in main.js to make your own data
```javascript
  // request trade pair
  const reqPair = ['BTC', 'USD'];
  // request type of days, hours, minutes
  const reqTimeType = 'histohour';
  // request start time
  const startTime = '2019/04/01';
  // request end time
  const endTime = '2019/07/01';
  // local DB json output path
  const outputPath = './dbtest.json';
```

- Note

  20190714 Basic API request and file writing

  20190715 Remove duplicates, check continous, sort
  
  20190727 README update
