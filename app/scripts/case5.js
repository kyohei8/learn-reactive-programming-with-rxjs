import 'babel-polyfill';
import _ from 'lodash';
import Rx from 'rx';
import moment from 'moment';

const feedTmlp = _.template(
  `
  <div>
    <img src="<%= avatar_url %>" width="32" >
    <p>id: <%= id %></p>
    <p>name: <%= login %></p>
  </div>
  `
);


// register DOM
const $btn = document.querySelector('#btn');
const $close1 = document.querySelector('#close1');
const $close2 = document.querySelector('#close2');
const $close3 = document.querySelector('#close3');
const $user1Box = document.querySelector('#user1');
const $user2Box = document.querySelector('#user2');
const $user3Box = document.querySelector('#user3');

// render
const _render = (data, $userBox) => {
  if(data === null){
    $userBox.innerHTML = '';
  } else {
    const feed = feedTmlp(data);
    $userBox.innerHTML = feed;
  }
};

// click event stream
const refreshClickStream = Rx.Observable.fromEvent($btn, 'click');
const close1ClickStream = Rx.Observable.fromEvent($close1, 'click');
const close2ClickStream = Rx.Observable.fromEvent($close2, 'click');
const close3ClickStream = Rx.Observable.fromEvent($close3, 'click');

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

const createSuggetionStream = (clickStream) => {
  return clickStream.startWith('startup')
    .combineLatest(
      responseStream,
      (click, listUsers) => {
        console.log(click);
        return listUsers[Math.floor(Math.random() * listUsers.length)];
      }
    )
    // ただのnullを返すstream
    .merge(refreshClickStream.map(() => null))
    .startWith(null);
};

const suggestion1Stream = createSuggetionStream(close1ClickStream);
const suggestion2Stream = createSuggetionStream(close2ClickStream);
const suggestion3Stream = createSuggetionStream(close3ClickStream);

suggestion1Stream.subscribe((suggestion) => {
  _render(suggestion, $user1Box);
});
suggestion2Stream.subscribe((suggestion) => {
  _render(suggestion, $user2Box);
});
suggestion3Stream.subscribe((suggestion) => {
  _render(suggestion, $user3Box);
});

