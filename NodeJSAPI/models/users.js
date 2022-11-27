const {getRows, insertRow, updateRow, deleteRow} = require('../database/query');
var SqlString = require('sqlstring');

exports.find = async (offset, pageSize) => {
    const query = `SELECT  t.* FROM users t  LIMIT ?, ?`;
    return getRows(query,[offset,pageSize]);
}

exports.findOne = async (id) => {
    const query = `SELECT  t.* FROM users t  WHERE t.id=? LIMIT 0,1`;
    return getRows(query,[id]);
}

exports.insert = async (object) => {
    const query = `INSERT INTO users set ?`;
    const id = await insertRow(query, object);
    if(id>0){
        return this.findOne(id);
    }
    else{
        return this.findOne(object.id);
    }
    
}

exports.update = async (id, object) => {
    const updateKeys = [];
    let updateValues = [];
    for (const key in object) {
        updateKeys.push(`${key}=?`);
        updateValues.push(`${object[key]}`);
    }
    let query = `UPDATE users SET ? WHERE id= ?`;
    updateValues = updateValues.concat([id])
    query = query.replace("?", updateKeys.join(","));
    const result = await updateRow(query, updateValues);
    return result ? this.findOne(id) : null;
}

exports.remove = async (id) => {
    const query = `DELETE FROM users Where id= ? `;
    return deleteRow(query,[id]);
}

exports.count = async () => {
    const query = `SELECT count(*) TotalCount FROM users t  `;
    const result = await getRows(query);
    if (result && result[0] && result[0].TotalCount && result[0].TotalCount > 0) {
        return result[0].TotalCount;
    } else {
        return 0;
    }
}

exports.search = async (offset, pageSize, key) => {
    const query = `SELECT  t.* FROM users t  WHERE  LOWER(t.Username) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.password) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.email) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.role) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.firstname) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.lastname) LIKE `+SqlString.escape('%'+key+'%')+` LIMIT ?, ?`;
    return getRows(query,[offset, pageSize]);
}

exports.searchCount = async (key) => {
    const query = `SELECT count(*) TotalCount FROM users t  WHERE  LOWER(t.Username) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.password) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.email) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.role) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.firstname) LIKE `+SqlString.escape('%'+key+'%')+` OR LOWER(t.lastname) LIKE `+SqlString.escape('%'+key+'%')+` `;
    const result = await getRows(query);
    if (result && result[0] && result[0].TotalCount && result[0].TotalCount > 0) {
        return result[0].TotalCount;
    } else {
        return 0;
    }
}


