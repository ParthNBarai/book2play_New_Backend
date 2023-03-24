const fs = require('fs');
const pdf = require('./createPdf')
// JSON data
// const data = require('./data.json');
// Build paths
let newDates = []
let i;
const { buildPathHtml } = require('./buildPaths');

/**
 * Take an object which has the following model
 * @param {Object} item 
 * @model
 * {
 *   "invoiceId": `Number`,
 *   "createdDate": `String`,
 *   "dueDate": `String`,
 *   "address": `String`,
 *   "companyName": `String`,
 *   "invoiceName": `String`,
 *   "price": `Number`,
 * }
 * 
 * @returns {String}
 */
const createRow = (item) =>

  `
  <tr>
  <td>${item.username}</td>
  <td>${item.phone}</td>
  <td>${item.booking.turfNo}</td>
  <td>${newDates[i++]}</td>
  <td>${item.booking.time}</td>
  <td>${item.booking.price}</td>
  <td>${item.booking.paymentId}</td>
  </tr>
  `
  // i++;
  


/**
* @description Generates an `html` table with all the table rows
* @param {String} rows
* @returns {String}
*/
const createTable = (rows,data) => `
  <table border="1px">
    <tr>
        <th>Customer Name</td>
        <th>Contact No.</td>
        <th>Turf No.</td>
        <th>Date</td>
        <th>Time</td>
        <th>Price</td>
        <th>Trans. Id</td>
    </tr>
    <h1 align = "center">Book2Play</h1>
    <h1 align = "center">${data[0].ownername}</h1>
    ${rows}
    <h3 align = "right">Turf Email : ${data[0].owneremail}</h3>
  </table>
`;

/**
 * @description Generate an `html` page with a populated table
 * @param {String} table
 * @returns {String}
 */
const createHtml = (table) => `
  <html>
    <head>
      <style>
        table {
          width: 100%;
        }
        tr {
          text-align: left;
          border: 1px solid black;
        }
        th, td {
          padding: 15px;
        }
        tr:nth-child(odd) {
          background: #CCC
        }
        tr:nth-child(even) {
          background: #FFF
        }
        .no-content {
          background-color: red;
        }
      </style>
    </head>
    <body>
      ${table}
    </body>
  </html>
`;

/**
 * @description this method takes in a path as a string & returns true/false
 * as to if the specified file path exists in the system or not.
 * @param {String} filePath 
 * @returns {Boolean}
 */
const doesFileExist = (filePath) => {
  try {
    fs.statSync(filePath); // get information of the specified file path.
    return true;
  } catch (error) {
    return false;
  }
};

async function htmlCreate(data,newDate) {

  try {
    newDates = []
    i = 0;
    newDates = newDate
    console.log(newDates);
    /* Check if the file for `html` build exists in system or not */
    if (doesFileExist(buildPathHtml)) {
      console.log('Deleting old build file');
      /* If the file exists delete the file from system */
      fs.unlinkSync(buildPathHtml);
    }
    /* generate rows */
    const rows = data.map(createRow).join('');
    /* generate table */
    // console.log(rows);
    const table = createTable(rows,data);
    // console.log(table)
    /* generate html */
    const html = createHtml(table);
    /* write the generated html to file */
    fs.writeFileSync(buildPathHtml, html);
    console.log('Succesfully created an HTML table');
    pdf.init();
  } catch (error) {
    console.log('Error generating table', error);
  }
}

// htmlCreate();


module.exports = {htmlCreate};