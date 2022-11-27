const {getRows, insertRow, updateRow, deleteRow} = require('../database/query');
var SqlString = require('sqlstring');

exports.find = async (offset, pageSize) => {
    const query = `SELECT  ce.customerName as customerNumber_Value, t.* FROM payments t  join customers ce on t.customerNumber = ce.customerNumber  LIMIT ?, ?`;
    return getRows(query,[offset,pageSize]);
}

exports.findOne = async (customerNumber,checkNumber) => {
    const query = `SELECT  ce.customerName as customerNumber_Value, t.* FROM payments t  join customers ce on t.customerNumber = ce.customerNumber  WHERE t.customerNumber=? AND t.checkNumber=? LIMIT 0,1`;
    return getRows(query,[customerNumber,checkNumber]);
}

exports.insert = async (object) => {
    const query = `INSERT INTO payments set ?`;
    const id = await insertRow(query, object);
    if(id>0){
        return this.findOne(id);
    }
    else{
        return this.findOne(object.customerNumber,checkNumber);
    }
    
}

exports.update = async (customerNumber,checkNumber, object) => {
    const updateKeys = [];
    let updateValues = [];
    for (const key in object) {
        updateKeys.push(`${key}=?`);
        updateValues.push(`${object[key]}`);
    }
    let query = `UPDATE payments SET ? WHERE customerNumber= ${customerNumber} AND checkNumber= ${checkNumber}`;
    updateValues = updateValues.concat([customerNumber,checkNumber])
    query = query.replace("?", updateKeys.join(","));
    const result = await updateRow(query, updateValues);
    return result ? this.findOne(customerNumber,checkNumber) : null;
}

exports.remove = async (customerNumber,checkNumber) => {
    const query = `DELETE FROM payments Where customerNumber=? AND checkNumber=?`;
    return deleteRow(query,[customerNumber,checkNumber]);
}

exports.count = async () => {
    const query = `SELECT count(*) TotalCount FROM payments t  join customers ce on t.customerNumber = ce.customerNumber  `;
    const result = await getRows(query);
    if (result && result[0] && result[0].TotalCount && result[0].TotalCount > 0) {
        return result[0].TotalCount;
    } else {
        return 0;
    }
}

exports.search = async (offset, pageSize, key) => {
    const query = `SELECT  ce.customerName as customerNumber_Value, t.* FROM payments t  join customers ce on t.customerNumber = ce.customerNumber  WHERE  LOWER(t.customerNumber) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.checkNumber) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.paymentDate) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.amount) LIKE `+SqlString.escape('%'+key+'%')+` LIMIT ?, ?`;
    return getRows(query,[offset, pageSize]);
}

exports.searchCount = async (key) => {
    const query = `SELECT count(*) TotalCount FROM payments t  join customers ce on t.customerNumber = ce.customerNumber  WHERE  LOWER(t.customerNumber) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.checkNumber) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.paymentDate) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.amount) LIKE `+SqlString.escape('%'+key+'%')+` `;
    const result = await getRows(query);
    if (result && result[0] && result[0].TotalCount && result[0].TotalCount > 0) {
        return result[0].TotalCount;
    } else {
        return 0;
    }
}


exports.getByCustomernumber = async (offset, pageSize, customerNumber) => {
    const query = `SELECT  ce.customerName as customerNumber_Value, t.* FROM payments t  join customers ce on t.customerNumber = ce.customerNumber  WHERE t.customerNumber= ? LIMIT ?, ?`;
    return getRows(query,[customerNumber,offset,pageSize]);
}

exports.getByCustomernumberCount = async (customerNumber) => {
    const query = `SELECT count(*) TotalCount FROM payments t  join customers ce on t.customerNumber = ce.customerNumber  WHERE t.customerNumber= ?`;
    const result = await getRows(query,[customerNumber]);
    if (result && result[0] && result[0].TotalCount && result[0].TotalCount > 0) {
        return result[0].TotalCount;
    } else {
        return 0;
    }
}
