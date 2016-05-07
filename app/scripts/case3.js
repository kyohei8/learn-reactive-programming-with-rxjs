import 'babel-polyfill';
import _ from 'lodash';
import Rx from 'rx';
import moment from 'moment';

const feedTmlp = _.template(
  `
    <div class="feed">
    <p>url: <%= url %></p>
    </div>
  `
);


// register DOM
const $btn = document.querySelector('#btn');
const $clr = document.querySelector('#clr');
const $feedBox = document.querySelector('#feed-box');

// render
const _render = (data) => {
  const feed = feedTmlp({ url: data });
  $feedBox.innerHTML += feed;
};

// click event
const refreshClickStream = Rx.Observable.fromEvent($btn, 'click');

// clickStream to requestStream
const requestStream = refreshClickStream
// 画面初期表示時に呼び出すため、startWithを使う(いずれかの文字列が必要）
  .startWith('start')
  .map((a) => {
    const randomOffset = Math.floor(Math.random() * 500);
    return `https://api.github.com/users?since=${randomOffset}`;
  });

requestStream.subscribe((url) => {
  _render(url);
});

// clear event
const clearStream = Rx.Observable.fromEvent($clr, 'click');
clearStream.subscribe(() => {
    // clear
  $feedBox.innerHTML = '';
});

