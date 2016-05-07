import 'babel-polyfill';
import _ from 'lodash';
import Rx from 'rx';
import moment from 'moment';

const feedTmlp = _.template(`
  <div class="feed">
    <img src="<%= avatar_url %>" width="32">
    <p>id: <%= id %></p>
    <p>name: <%= login %></p>
  </div>
`);

// register DOM
const $btn = document.querySelector('#btn');
const $clr = document.querySelector('#clr');
const $feedBox = document.querySelector('#feed-box');

// click event
const clickStream = Rx.Observable.fromEvent($btn, 'click');

// render
const _render = (data) => {
  data.forEach((d) => {
    const feed = feedTmlp(d);
    $feedBox.innerHTML += feed;
  });
};

// request
const requestGithubApi = () => {
  // リクエストURLの文字列からStreamを生成
  const requestStream = Rx.Observable.just('https://api.github.com/users');
  // リクエストStreamからレスポンスStreamを生成する
  const responseStream = requestStream.flatMap((url) => {
    return Rx.Observable.fromPromise(fetch(url, { method: 'get' }));
  });

  responseStream.subscribe((res) => {
    res.json().then((data) => {
      _render(data);
    });
  });
};

clickStream.subscribe(() => {
  requestGithubApi();
});


// clear event
const clearStream = Rx.Observable.fromEvent($clr, 'click');
clearStream.subscribe(() => {
  // clear
  $feedBox.innerHTML = '';
});

