import 'babel-polyfill';
import _ from 'lodash';
import Rx from 'rx-lite';
import 'gsap';
import moment from 'moment';

const feedTmlp = _.template(`
  <div class="feed" style="position: absolute; transform: translateY(<%= y %>px)">
    <p>event: <%= eventName %></p>
    <p>time: <%= timeStamp %></p>
  </div>
`);

// register DOM
const $btn = document.querySelector('#btn');
const $clr = document.querySelector('#clr');
const $feedBox = document.querySelector('#feed-box');

const tlHeight = 1000;
let tween = null;

// click event
const clickStream = Rx.Observable.fromEvent($btn, 'click')
  .map(() => new Date());

clickStream.subscribe((date) => {
  if(tween){
    const y = tween.ratio * tlHeight - 50;
    // Click
    const timeStamp = moment(date).format('h:mm:ss.SSS');
    const feed = feedTmlp({
      eventName: 'click',
      timeStamp,
      y
    });
    $feedBox.innerHTML += feed;
  } else {
    // Start
    $btn.textContent = 'Click Me!';
    tween = TweenLite.to($feedBox, 15, {
      height: tlHeight,
      ease: Power0.easeNone
    });
  }
});

// clear event
const clearStream = Rx.Observable.fromEvent($clr, 'click');
clearStream.subscribe(() => {
  if(tween && tween.kill){
    TweenLite.set($feedBox, {
      height: 0
    });

    tween.kill();
    tween = null;
  }
  $btn.textContent = 'Start';
  $feedBox.innerHTML = '';
});


