import 'babel-polyfill';
import _ from 'lodash';
import Rx from 'rx';
import moment from 'moment';

const feedTmlp = _.template(
  `
  <div class="feed">
    <img src="<%= avatar_url %>" width="32">
    <p>id: <%= id %></p>
    <p>name: <%= login %></p>
  </div>
  `
);


// register DOM
const $btn = document.querySelector('#btn');
const $feedBox = document.querySelector('#feed-box');

// render
const _render = (data) => {
  const feed = feedTmlp(data);
  $feedBox.innerHTML += feed;
};

// click event
const refreshClickStream = Rx.Observable.fromEvent($btn, 'click');

// clickStream to requestStream
const requestStream = refreshClickStream
.startWith('start')
// 画面初期表示時に呼び出すため、startWithを使う(いずれかの文字列が必要）
.map(() => {
  const randomOffset = Math.floor(Math.random() * 500);
  return `https://api.github.com/users?since=${randomOffset}`;
});

// レスポンスStreamを生成
const responseStream = requestStream.flatMap((url) => {
  return Rx.Observable.fromPromise(fetch(url, { method: 'get' }));
}).flatMap((res) => {
  return Rx.Observable.fromPromise(res.json());
});

const suggestion1Stream = responseStream.map((listUsers) => {
  return listUsers[Math.floor(Math.random() * listUsers.length)];
})
// ただのnullを返すstream
.merge(refreshClickStream.map(() => null))
.startWith(null);


suggestion1Stream.subscribe((suggestion) => {
  if(suggestion === null){
    $feedBox.innerHTML = '';
  } else {
    _render(suggestion);
  }
});

