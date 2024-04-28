const sql = require('mysql');
const util = require('util');
const process = require("process");
require('dotenv').config();

const password = process.env.DB_Password;

const connection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: password,
  database: "met"
});

connection.connect(function (err) {
  if (err) console.error(err);
  console.log("connected to the database!");
});

connection.query = util.promisify(connection.query);

async function getStates() {
  const stateQuery = 'select distinct state from precipitation';
  const rawStates = await connection.query(stateQuery);
  return rawStates.map(row => row.state);
}

async function getDistricts() {
  const districtQuery = 'select distinct state, district from precipitation';
  const rawDistricts = await connection.query(districtQuery);
  return rawDistricts.map(row => ({ state: row.state, district: row.district }));
}

async function getYears() {
  const yearQuery = 'select distinct year from precipitation';
  const rawYears = await connection.query(yearQuery);
  return rawYears.map(row => row.year);
}

// async function getMonths() {
//   const monthQuery = 'select distinct month from precipitation';
//   const rawMonths = await connection.query(monthQuery);
//   return rawMonths.map(row => row.month);
// }
async function getMonthlyAvg(state, district, month) {
  const query = `SELECT AVG(rainfall) as avg FROM precipitation WHERE state = '${state}' AND district = '${district}' AND month = '${month}'`;
  const result = await connection.query(query);
  return result;
}

async function getMonthlyAverages(state, district) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const rawAverages = {};
  const averages = {};


  for (const month of months) {
    rawAverages[month] = await getMonthlyAvg(state, district, month);
    averages[month] = rawAverages[month].map(row=>row.avg) 
  }
  return averages;
}

async function getRainfallData(state, district, year) {
  const annualTotalQuery = `SELECT annual FROM precipitation WHERE state = ? AND district = ? AND year = ? and month='January'`;
  const annualMeanQuery = `SELECT AVG(rainfall) as avg FROM precipitation WHERE state = ? AND district = ? AND year = ?`;

  const rawAnnualTotal = await connection.query(annualTotalQuery, [state, district, year]);
  const rawAnnualMean = await connection.query(annualMeanQuery, [state, district, year]);

  const annualTotal = rawAnnualTotal.map(row => row.annual);
  const annualMean = rawAnnualMean.map(row => row.avg);
  const monthlyAverages = await getMonthlyAverages(state, district);
  
  return { state, district, year, annualTotal, annualMean, monthlyAverages };
}

// async function fetchData(){
//   const data = await getRainfallData('Maharashtra', 'Thane', 2005);
//   console.log(data)
// }

// fetchData();


// module.exports = { getStates, getDistricts, getYears, getMonths };
module.exports = { getStates, getDistricts, getYears, getRainfallData };