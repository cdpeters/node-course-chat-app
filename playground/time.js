const moment = require('moment');

// // relative to the unix epoch: Jan 1st 1970 00:00:00 am
// // stored in milliseconds in javascript
// var date = new Date();

// // returns a zero-indexed value for the month
// console.log(date.getMonth());

// var date = moment();

// date.add(100, 'year').subtract(9, 'months');
// console.log(date.format('MMM'));
// console.log(date.format('MMM YYYY'));
// console.log(date.format('MMM Do YYYY'));

// Example: unpadded hours:padded minutes, 12-hour clock

// var createdAt = new Date().getTime();
// var date = moment(createdAt);

var someTimeStamp = moment().valueOf();
var date = moment(someTimeStamp);

console.log(date.format('h:mm a'));
