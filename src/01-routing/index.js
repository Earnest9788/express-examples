/**
 * Routing
 * reference: https://expressjs.com/en/guide/routing.html
 */

const express = require('express');

/******************************
 * Tilte: Route methods
 * Desc: 라우트 메서드는 express class의 인스턴스 메서드를 통해서 사용할 수 있으며, 
 *       각 HTTP 메서드에 대응되는 메서드가 존재한다.
 ****************************/
const app1 = express();

app1.get('/', function (req, res) {
    res.send('GET request to the homepage')
})
app1.post('/', function (req, res) {
    res.send('POST request to the homepage')
})

// MORE: 라우팅 메서드 중에서 all 메서드는 특별한 역할을 한다.
//       지정된 경로로 들어오는 모든 HTTP 요청에 대해서 미들웨어 함수를 로드하는데 사용된다.

app1.all('/secret', (req, res, next) => {
    console.log('Accessing the secret section...');
    next();
})



/******************************
 * Tilte: Route paths
 * Desc: 라우팅 경로는 라우팅 메서드와 함께 HTTP 요청의 endpoints를 구성한다.
 *       라우팅 경로는 문자열, 문자 패턴 또는 정규식을 사용할 수 있다.
 ****************************/
const app2 = express();

// MORE: - ?, +, *, ()는 각각 정규식의 서브셋이고 하이픈(-)과 점(.)은 문자그대로 문자열 기반 경로로 해석된다. 
//       - $를 경로상의 문자로 사용하고 싶다면 '([])'를 사용해서 이스케이프해야한다. 
//         예를 들어 "/data/$book" => "/data/([\$])book"

// WAY1: 문자열 라우트 경로
app2.get('/', (req, res) => {
    res.send('root');
});
app2.get('/about', (req, res) => {
    res.send('about');
});
app2.get('/random.text', (req, res) => {
    res.send('rendom.text');
});

// WAY2: 패턴 라우트 경로
app2.get('/ab?cd', (req, res) => { // acd or abcd
    res.send('ab?cd');
});
app2.get('/ab+cd', (req, res) => { // abcd, abbcd, abbbcd ...
    res.send('ab+cd');
});
app2.get('/ab*cd', (req, res) => { // abcd, abxcd, abRANDOMcd, ab123cd ...

});
app2.get('/ab(cd)?e', (req, res) => { // abe or abcde
    res.send('ab(cd)?e');
});

// WAY3: 정규표현식
app2.get(/a/, (req, res) => { // a가 포함된 모든 경로
    res.send('/a/');
});
app2.get(/.*fly$/, (req, res) => { // fly로 끝나는 모든 경로
    res.send('/.*fly$/');
});



/******************************
 * Tilte: Route parameters
 * Desc: 경로 매개변수는 URL의 위치에서 지정된 값을 가져오는데 사용되는 URL 세그먼트라고 명명된다.
 *       여기서 지정된 값들은 req.params 객체에 key가 되며, URL에서 대응되는 위치의 값을 value로 저장한다.
 *       - 라우트 경로   : /users/:userId/books/:bookId
 *       - 요청 URL    : http://localhost:3000/users/34/books/8989
 *       - req.params : { "userId": "34", "bookId": "8989" }
 ****************************/
app.get('/users/:userId/books/:bookId', function (req, res) {
    res.send(req.params)
});

// MORE: 하이픈과 점은 문자열로 인식되기 때문에 라우트 파라미터와 함께 사용할 수 있다.

// - Example1
// - Route path  :  /flights/:from-:to
// - Request URL :  http://localhost:3000/flights/LAX-SFO
// - req.params  :  { "from": "LAX", "to": "SFO" }

// - Example2
// - Route path  :  /plantae/:genus.:species
// - Request URL :  http://localhost:3000/plantae/Prunus.persica
// - req.params  :  { "genus": "Prunus", "species": "persica" }

// MORE: 정규식을 사용하여 좀더 문자열을 제어할 수도 있다.
// - Route path  :  /user/:userId(\d+)
// - Request URL :  http://localhost:3000/user/42
// - req.params  :  {"userId": "42"}



/******************************
 * Tilte: Route handlers
 * Desc: 요청을 처리하기 위해서 미들웨어 처럼 동작하는 다수의 콜백함수를 사용할 수 있다.
 *       한가지 예외 사항은 이러한 콜백들이 next('route')를 호출하는 경우이다.
 *       next() 함수가 호출되면 남은 다음 콜백들을 우회할 수 있다.
 *       이러한 특성을 이용한다면 조건문을 부과한 후 그 결과 따른 후속 조치를 다양하게 취할 수 있다.
 ****************************/

// MORE: 라우트 핸들러는 함수, 함수의 배열, 또는 둘의 조합을 사용할 수 있다.

// WAY1: 일반 함수
app.get('/example/a', (req, res) => {
    res.send('Hello from A!')
});

app.get('/example/b', (req, res, next) => {
    console.log('the response will be sent by the next function ...')
    next()    
}, (req, res) => {
    res.send('Hello from B!')
})

// WAY2: 함수의 배열을 사용하는 방법
const cb0 = (req, res, next) => {
    console.log('CB0')
    next()
}
const cb1 = (req, res, next) => {
    console.log('CB1')
    next()
}
const cb2 = (req, res) => {
    res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2]);

// WAY3: 함수의 배열 + 일반 함수
const cb0 = (req, res, next) => {
    console.log('CB0')
    next()
};
const cb1 = (req, res, next) => {
    console.log('CB1')
    next()
};

app.get('/example/d', [cb0, cb1], (req, res, next) => {
    console.log('the response will be sent by the next function ...')
    next()
}, function (req, res) {
    res.send('Hello from D!')
});



/******************************
 * Tilte: Response methods
 * Desc: res 객체는 메서드를 통해서 클라이언트에 응답을 보낼 수 있다.
 ****************************/

// MORE: res.METHOD 리스트
//       - res.download()
//       - res.end()
//       - res.json()
//       - res.jsonp()
//       - res.redirect()
//       - res.render()
//       - res.send()
//       - res.sendFile()
//       - res.sendStatus()



/******************************
 * Tilte: app.route()
 * Desc: app.route()를 사용해서 어떤 단일한 경로에 대해서 체인 가능한 핸들러를 만들 수 있다.
 *       경로가 단일한 위치에 지정되기 때문에 중복과 오타를 줄일 수 있고 모듈 형태로 경로를 구성할 수 있다.
 ****************************/
app.route('/book')
    .get((req, res) => {
        res.send('Get a random book')
    })
    .post((req, res) => {
        res.send('Add a book')
    })
    .put((req, res) => {
        res.send('Update the book')
    });



/******************************
 * Tilte: express.Router()
 * Desc: 라우터 클래스를 사용하면 모듈의 형식으로 마운트 가능한 라우트 핸들러를 만들 수 있다.
 ****************************/
const birds = require('./bird');
app.use('/birds', birds);