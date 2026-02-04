'use strict';

const statusDiv = document.getElementById('status');
const questionDiv = document.getElementById('question-area');
const resultDiv = document.getElementById('result-area');
const tweetDiv = document.getElementById('tweet-area');
const btnTrue = document.getElementById('btn-true');
const btnFalse = document.getElementById('btn-false');

const BEST_KEY = 'oxquiz-best-score-v1';

function loadBest() {
  const v = localStorage.getItem(BEST_KEY);
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function saveBest(score) {
  localStorage.setItem(BEST_KEY, String(score));
}

// 一般常識 10問（ヒント無し）
const questions = [
  { text: '日本の首都は東京である。', answer: true },
  { text: '地球は太陽の周りを回っている。', answer: true },
  { text: '富士山は日本で一番低い山である。', answer: false },
  { text: '1年は必ず365日である。', answer: false },
  { text: '水は0℃で凍り始める（標準的な気圧で）。', answer: true },
  { text: '人間の血液型はA・B・O・ABの4種類が代表的である。', answer: true },
  { text: '台風は主に冬に日本へ多く接近する。', answer: false },
  { text: '日本の通貨は円である。', answer: true },
  { text: '光の速さは音の速さより遅い。', answer: false },
  { text: 'オリンピックは基本的に4年に1回開催される。', answer: true },
];

let index = 0;
let score = 0;
let best = loadBest();

function updateStatus() {
  statusDiv.innerText = `進捗：${index + 1} / ${questions.length} 最高得点：${best} / ${questions.length}`;
}

function renderQuestion() {
  resultDiv.innerText = '';
  tweetDiv.innerText = '';
  updateStatus();
  questionDiv.innerText = questions[index].text;
}

function getCommentByScore(score) {
  if (score <= 3) return 'まずはOK！次は間違えた問題を見直そう。';
  if (score <= 7) return 'いい感じ！あと少しで高得点。';
  return 'すごい！一般常識ばっちり！';
}

function endQuiz() {
  if (score > best) {
    best = score;
    saveBest(best);
  }

  questionDiv.innerText = '終了！';

  const comment = getCommentByScore(score);
  resultDiv.innerText =
    `あなたの正解数：${score} / ${questions.length}\n` +
    `コメント：${comment}\n` +
    `最高得点：${best} / ${questions.length}`;

    // ツイートエリアの作成
  tweetDiv.innerText = '';

  const anchor = document.createElement('a');

  const hrefValue =
          'https://twitter.com/intent/tweet?button_hashtag=クイズの結果&ref_src=twsrc%5Etfw';

  anchor.setAttribute('href', hrefValue);
  anchor.setAttribute('class', 'twitter-hashtag-button');

    anchor.innerText = 'Tweet #クイズの結果';

    tweetDiv.appendChild(anchor);


    const tweetText =
    `【一般常識○×クイズ】結果：${score}/${questions.length}\n` +
    `${comment}\n` +
    `最高得点：${best}/${questions.length}`;

  anchor.setAttribute('data-text', tweetText);


  const script = document.createElement('script');
script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
script.setAttribute('async', '');
script.setAttribute('charset', 'utf-8');
tweetDiv.appendChild(script);


  // もう一回ボタン
  const retry = document.createElement('button');
  retry.innerText = 'もう一回';
  retry.addEventListener('click', () => {
    index = 0;
    score = 0;
    renderQuestion();
  });
  tweetDiv.appendChild(document.createTextNode(' '));
  tweetDiv.appendChild(retry);
}

function answer(userAnswer) {
 
  const q = questions[index];
  const correct = (userAnswer === q.answer);
  if (correct) score++;

  resultDiv.innerText = correct ? '正解！' : `不正解（正しい答え：${q.answer ? '○' : '×'}）`;

  setTimeout(() => {
    index++;
    if (index >= questions.length) {
      endQuiz();
    } else {
      renderQuestion();
    }
  }, 700);
}

btnTrue.addEventListener('click', () => answer(true));
btnFalse.addEventListener('click', () => answer(false));

renderQuestion();
