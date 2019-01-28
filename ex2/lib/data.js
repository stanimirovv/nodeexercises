/*
 * Simple module for data storage
 * Offers read,write,delete functionality
 * All Errors should be considered non recoverable
 * Recomended way of using it is one object per file.
 * It isn't really scalable, but it is fine for the scale of this exercise
 */

// Dependencies
const fs = require('fs');
const path = require('path');

//Initialize objects
let lib = {};
lib.baseDir = path.join(__dirname,'/../.data/');

/*
 * Public functions
 */

// Write serialized data to file, create file if necissary
lib.write = (dir, file, data) => { 
  let path = computePath(dir,file);
  // open and create the file(if needed)
  let createFile = new Promise( (resolve, reject ) => {
    let filePath = computePath(dir, file);
    fs.open(filePath, 'w+', (err, fd) => {
      if(err) {
        reject(err);
      } else {
        resolve({fd:fd, data:data}); 
      }
    });
  })
  // Write data to the file// Write data to the file
  .then( (res) => { 
    return new Promise( (resolve, reject) => {
      let fd = res.fd;
      let data = res.data;
      let stringData = stringify(data);
      fs.writeFile(fd, stringData,(err) => { err? reject(err) : resolve("Data Written OK")}); 
    });
  });
  return createFile;
}

// Reads and parses entire file
lib.read = (dir, file) => { 
  let filePath = computePath(dir, file);

  // read entire file
  return new Promise( (resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err);
        console.log(data);
        return resolve( parse(data) ); 
    });
  });
};

// Delete entire file
lib.delete = (dir, file ) => { 
  let filePath = computePath(dir, file);
  
  return new Promise( (resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) { 
        return resolve(err);
      }
      console.log('Succesfully deleted path: ', filePath);
      return reject("OK");
    });
  });
};

/*
 * Private functions
 * The storage format and file extensions are implementation details
 * As implementation details, they should be hiddien from the public API
 */

const fileExt = '.json';
function computePath(dir, file) {
  return lib.baseDir+dir+'/'+file+fileExt;
}

function stringify(data) {
  return JSON.stringify(data);
}

function parse(data) {
  return JSON.parse(data);
}

// Exports
module.exports = lib;
