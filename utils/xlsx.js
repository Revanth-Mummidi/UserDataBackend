import XLSX from 'xlsx';
export default function readXlsxFile(filename) {

var workbook = XLSX.readFile(`./uploads/${filename}`);
var sheet_name_list = workbook.SheetNames;
console.log("Sheet Name",sheet_name_list[0]); 
var worksheet = workbook.Sheets[sheet_name_list[0]];
var headers = {};
var data = [];
for (var z in worksheet) {
  if (z[0] === "!") continue;
  var col = z.substring(0, 1);
  var row = parseInt(z.substring(1));
  var value = worksheet[z].v;
  if (row == 1) {
    headers[col] = value;
    continue;
  }

  if (!data[row]) data[row] = {};
  data[row][headers[col]] = value;
}
data.shift();
data.shift();
console.log(data);

return data;
}