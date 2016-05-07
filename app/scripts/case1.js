import 'babel-polyfill';
import _ from 'lodash';
import Rx from 'rx';
import moment from 'moment';

const feedTmlp = _.template(`
  <div class="feed">
    <p>event: <%= eventName %></p>
    <p>time: <%= timeStamp %></p>
  </div>
`);

// register DOM
const $btn = document.querySelector('#btn');
const $clr = document.querySelector('#clr');
const $feedBox = document.querySelector('#feed-box');

// click event
const clickStream = Rx.Observable.fromEvent($btn, 'click');

const multipleClickStream = clickStream
  .buffer(clickStream.debounce(250))
  .map((list) => {
    return {
      length: list.length,
      time: new Date()
    };
  })
  .filter((x) => x.length >= 2);

const singleClickStream = clickStream
  .buffer(clickStream.debounce(250))
  .map((list) => {
    return {
      length: list.length,
      time: new Date()
    };
  })
  .filter((x) => x.length === 1);

multipleClickStream.subscribe((obj) => {
  const timeStamp = moment(obj.time).format('h:mm:ss.SSS');
  const feed = feedTmlp({
    eventName: `${obj.length} click`,
    timeStamp
  });
  $feedBox.innerHTML += feed;
});

singleClickStream.subscribe((obj) => {
  const timeStamp = moment(obj.time).format('h:mm:ss.SSS');
  const feed = feedTmlp({
    eventName: 'single click 😜',
    timeStamp
  });
  $feedBox.innerHTML += feed;
});

// clear event
const clearStream = Rx.Observable.fromEvent($clr, 'click');
clearStream.subscribe(() => {
  // clear
  $feedBox.innerHTML = '';
});

