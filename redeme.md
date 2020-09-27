baselanguage: tyscript

**basic configurations**
nodemon -> 저장할 때 마다  start시켜준다.
"watch": "tsc -w" -> 저장할 때 마다 ts를 js로 컴파일시켜준다.
constants -> 따로 ts파일을 만들어서 export

yarn dev -> nodemon 실행
yarn watch -> compile

**postgresql - mikroORM**
createdb 해준다.
entities -> schema와 비슷, mikroORM documentation을 참조해서 만든다.
migrations ->  migration을 create할 때 
***

Createuser: could not connect to database postgres: FATAL: role “ ” does not exist.

or authentication failed
***
와 같은 에러메세지를 받을 수 있다.

pg_hba.conf 파일의 위치를 찾아서 peer-> trust로 바꾸니 해결됨.
파일 위치는 etc/postgresql/12/main/pg_hba.conf


**express apollo-server graphql type-graphql**


**오류들**
*헤멘시간 ~ 30분*
duplicate identifier Resolver 라는 에러메시지가 뜨면
npm i uninstall -g typescript 를 해보자

*헤멘시간 ~ 1시간*
***
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/home/develop/clone-reddit/dist/resolver/post.js',
    '/home/develop/clone-reddit/dist/index.js'
  ]
***
*헤멘시간 2~4시간*
posgresql이 익숙하지 않아서 많이 해맸다.. 
*이미 relation이 있는 column 에 또 추가할 수 없습니다*
와 같은 에러세지가 뜨면 데이터베이스를 바꾸거나
이미있는 자료들을 다 지워야하는데
바꿔도 바꿔도 계속 같은메세지만 떠서 엄청해맸다..
다음날 일어나서 재부팅하고 보니까 잘되는데
vscode를꺼도 ubuntu가 계속돌아가서 바꾼게 적용이 안됐었나보다.. 진짜 어제 너무 힘들었다
postgresql이 strict하구나..
현타 씨게옴




라는 문구가 나오면 import를 잘 못한게 뭐가 있는지 찾아보자.
import 를 vscode자동완성으로 쓰니까 원하는 파일이 아닌 같은이름인 다른 파일을 가져왔다. 조심하자.



**세션저장**(쿠키)
세션저장을 위해 꼭 레디스를 써야하는건 아님
redis ->  Remote Dictionary Server
오픈 소스 기반의 비관계형 데이터베이스 관리 시스템(nosql)
빠르다


1.
req.session.userId = user.id;
입력을 받아서 레디스에 저장함
2.
qwrqwr:safsvobok -> {userId :1} 형태로 저장됨
express-session이 브라우저에 qwlrpwqlrpwqrinvicv형태로 저장(키)
3.
사용자로부터 요청이 들어오면, 레디스로 키를 보낸다
4.
암호키를 해독한다
qwlrpwqlrpwqrinvicv -> qwrqwr:safsvobok

5.
레디스에 요청을 보냄
qwrqwr:safsvobok -> {userId :1}

잘 변하지 않는 값을 저장하는 것이 좋다
user객체로 저장 X
id로 저장

redis시작 -> redis-server
postgresql시작 -> sudo service postgresql restart



세션 쿠키다룰때 
graphql-> settings에서
"request.credentials": "ommit" ->"include",
로 바꿔줘야함


nextjs chakra ts






**clone-reddit 앞단**
nextjs에서 변수는 [boo].js or [boo].tsx식으로 저장 


nextjs-> 생성된 파일이름이 자동으로 라우팅된다.
chakraui -> nextjs 스타일링
apollo-client-> graphql이 왜 안켜지나 했더니 뒷단에서 안켜놓고 작업하고 있었다, 친절한 documentation을 잘 확인하자
request를 보내고 network-> grahql 검색 -> preview에서 data가 어떻게 됐는지 확인할 수 있다.
urql<-> apollo-client (비슷)


graphql code generator을 쓸시의 work flow
1.grahql폴더에 ???.graphql을 추가한다
2.generator을 실행
3.hook이 생성됨 -> hook사용


graphql->  fragment 사용, 
graphql 폴더안에 fragment폴더 생성후 ...RegularUser 식으로 써주면됨(import code gen에서 저절로됨)

**서버사이드렌더링**
구글에 검색노출시키고 싶으면 ssr, ->서버사이드 렌더링
동적인 데이터 -> 서버사이드렌더링

me -> browse http://localhost:3000
-> next.js server
-> request graphql server localhost:4000
-> building the HTML
-> sending back to your broser

어떤경로에서 접근하냐에따라 client-side-rendering / server-side-rendering이 된다.


**forgot password?**
nodemailer



**쿠키**


page
      server side rendering - > browser -> nextjs -> graphql api (cookie X)
page 
      client side rendering -> browser -> graphql api (cookie O)
 
 위의 방법으로 사이트에 접근시 사이트가 깨진다(쿠키가없는것처럼) 그래서 nextjs에 넘겨줘야함


**시간**

0:00:00 Intro
0:02:02 Node/TypeScript Setup
0:11:29 MikroORM Setup
0:39:50 Apollo Server Express Setup
0:47:32 MikroORM TypeGraphQL Crud
1:09:23 Register Resolver
1:23:27 Login Resolver
1:41:11 Session Authentication
2:03:06 Sessions Explained
2:08:24 Next.js + Chakra
2:32:36 URQL Basics
2:46:07 GraphQL Code Generator
2:53:16 Register Error Handling
3:10:57 NavBar
3:26:21 URQL Cache Updates
3:39:33 Logout
3:50:11 Next.js URQL SSR
4:12:34 Forgot Password
4:35:31 Change Password
5:22:14 Why Switching to TypeORM
5:25:27 Switching to TypeORM
5:50:44 Many to One
6:02:26 Global Error Handling
6:24:15 Next.js Query Params
6:31:26 URQL Pagination Start
6:50:02  Adding Mock Data
7:01:19 Chakra Styling
7:12:37 More URQL Pagination
7:32:07 Fix Mock Data
7:40:41 URQL Pagination Has More
8:00:53 GraphQL Fetching Relationships
8:18:43 GraphQL Field Permissions
8:23:16 Many to Many
8:46:46 Invalidate Queries
9:00:49 Upvote UI
9:23:11 Change Vote
9:31:57 Write Fragments
9:39:00 Vote Status
9:51:57 SSR Cookie Forwarding
10:04:08 Single Post
10:21:55 Delete Post
10:38:19 Edit Post
11:09:23 DataLoader
11:40:06 Cache Reset
11:43:55 Deploy Backend
11:52:56 Docker
12:03:29 Environment Variables
12:14:55 DB Migrations
12:21:40 Docker Hub
12:28:23 DNS
12:36:39 Deploy Frontend
12:57:28 Fix Cookie
13:03:08 Switch to Apollo