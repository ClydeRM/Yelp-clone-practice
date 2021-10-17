# PERN Stack Yelp clone practice

## Github
[Yelp clone practice](https://github.com/ClydeRM/Yelp-clone-practice)

##    SSR vs CSR
[參考](https://growingdna.com/ssr-versus-csr/)

##    Project introduction
###    PERN Stack 介紹
* P 是 Postgres SQL
* E 是 Express framework
* R 是 React framework
* N 是 Nodejs

### Yelp 功能介紹

* Yelp 主打餐廳評比
* 依據價錢分類
* 依據城市地點分配
* 用戶可給予餐廳評分
* 用戶可以新增新餐廳
* 此專案著重在熟悉Postgres的使用
* query 撰寫
* React的元件使用

```
啟動專案 
確認psql server 在5432 port
// cd server listen port on 3001 
npm run dev 

// cd client listen port on 3000 or another
npm start
```

##    Dependentcice

### Dev
* [nodemon](https://www.npmjs.com/package/nodemon)
* [cross-env](https://www.npmjs.com/package/cross-env)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [morgan](https://www.npmjs.com/package/morgan)

###    Server

* pg [(node-postgres ref)](https://node-postgres.com/guides/project-structure)
* cors // for cross demain fetch api


###    Client
*    npm i create-react-app -g
     *    create-react-app . 創建 react 專案
*    npm i react-dom
*    npm i react-router-dom
*    npm i axios // for fetch data apis


##    Postgres SQL Command Note

在 PSQL 中 所有資料庫管理指令都以 "\" 開頭 
SQL 指令 要以 ";" 結尾

```
psql -U postgres 進入資料庫 預設使用者
pwd : *********

--command help list:  \?

--check databases list:  \l

--check tables list: \d

--check single table attributes: \d t_name

--connect to others db: \c db_name

--create new db: 
    CREATE DATABASE db_name;

--create new table:
--建議屬性全部都要NOT NULL
--一定都要有PRIMARY KEY 一般 都是 id
--屬性名稱都是小寫，以蛇底命名法串連 ex restaurant_id
--外來鍵一般都是以參考的TABLENAME_id 命名 ex user_id
    CREATE TABLE reviews (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        restaurant_id BIGINT NOT NULL REFERENCES restaurants(id),
        name VARCHAR(50) NOT NULL,
        review TEXT NOT NULL,
        rating INT NOT NULL check(rating >=1 and rating<=5)
    );
    
--modify table ADD att: 
ALTER TABLE t_name 
ADD COLUMN att_name data_type;

--modify table drop att:
ALTER TABLE t_name
DROP COLUMN att_name;

--drop designate table: 
DROP TABLE t_name;

--drop designate DB:
DROP DATABASE db_name;

--insert data in table:
INSERT INTO t_name (col1, col2, ....)
VALUES (v1, v2, ....);

--check all data in table:
SELECT * from  t_name;

// Aggregate 
psql ""Aggregate"" function : to calculation on a set of rows return a single row

// 回傳到小數16位
select AVG(rating) from reviews WHERE restaurant_id=1; 

// trunc() 自定精確度 示範到2
select trunc(AVG(rating), 2) from reviews WHERE restaurant_id=1;


// trunc() 自定精確度 示範到2 AS 自訂回傳rows的名稱
select trunc(AVG(rating), 2) AS average_rating from reviews WHERE restaurant_id=1;

// 結果依照location的資料 相同的群組化顯示
SELECT loaction, count(location) FROM restaurants GROUP BY loaction;

// SQL JOIN  4 way inner, left, right, full outer
// 優點 單一QUERY 就可以得到所有資料
SELECT * FROM restaurants INNER JOIN reviews ON restaurants.id = reviews.restaurant_id;

select * from restaurants left join (select restaurant_id, count(*), trunc(avg(rating), 2) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;

select * from restaurants left join (select restaurant_id, count(*), trunc(avg(rating), 2) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id=1;

// DELETE 刪除
// 注意 如果刪除的資料正在被其他子資料參考
// 要先刪除子資料，才能刪除父資料
// 在設計api 可以發送多次請求，但是不建議直接刪除
DELETE FROM reviews WHERE restaurant_id=id RETURNING *`
    
```
## Express backend
### 專案結構
```
./server
├── db
    └── index.js // 使用postgres module pg 的 Pool 啟用查詢
├── server.js // 簡易搭建的 CRUD
└── config.env 配合 dotenv npm module 設定資料庫連線使用者密碼

```

##    PostgreSQL tutorial
[tutorial](https://www.postgresqltutorial.com)

Data type 
* SERIAL 適合用來創建ID型別的資料


## pg module
* 可以配合 dotenv module 使用
* 在 .env 中新增 [參考](https://node-postgres.com/features/connecting)
* [pg Pool connent ref](https://node-postgres.com/guides/async-express)
```
./config.env
PGUSER=--YourDBUser--
PGHOST=--YourHost--
PGPASSWORD=--YourPassword--
PGDATABASE=--YourTable--
PGPORT=5432

./db/index.js
const { Pool } = require('pg');

const pool = new Pool(); // auto search .env 
module.exports = {
    query: (text, params) => pool.query(text, params),
}

```


##    Middleware 
[參考](https://expressjs.com/zh-tw/guide/using-middleware.html)
![Middleware](https://i.imgur.com/p6q4U6O.png)

* Middleware處理請求與回覆
    * req 請求物件
    * res 回覆物件
    * next 傳給下一個middleware物件
    * err 除錯物件（只有在除錯middleware中會帶入）
        * (err, req, res, next) => ...
* 請求依照主程式上到下經過 **Middleware**
* 如有多個 **Middleware** 順序為上到下 **很重要**
* Route handler **通常放在所有Middleware之下**
* 語法
```
const app = express();

// middleware 1
app.use((req, res, next)=>{
    //code block...
});

// middleware 2
app.use((req, res, next)=>{
    // code block ...
});
```

##    Http status code
[參考](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status)
###    100 持續回應
* 100 Continue
###    200 回應成功
* 200 Ok
* 201 Create
* 204 No content (Delete)
###    300 重新導向
* ...
###    400 客戶端錯誤
* 400 Bad request
* 401 Unauthorized
* 403 Forbidden
* 404 Not Found
###    500 伺服端錯誤
* 500 Server Error

###    server.js 筆記註解
```
const express = require("express");
const cors = require("cors");  // 提供跨域請求
const db = require("./db"); // 連接 psql 設定檔
const dotenv = require("dotenv"); // 載入設定
const morgan = require("morgan"); // 顯示req log

// Create app
const app = express();

// Load .env
dotenv.config({ path: "config.env" });

// Logger request
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Rest APi route
// @desc Get all restaurants data
// @route GET /api/v1/restaurants
app.get("/api/v1/restaurants", async (req, res) => {...}

// Listening PORT
const PORT = process.env.PORT || 3001;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  )
);

```



## React front-end
Single Page Web App

##    專案檔案結構
```
./client
├── build // npm run build產生，是真正要發布的專案
    
├── public // index.html/Icon/圖案的資料夾
    └── index.html // 根頁面/Title/Icon/引入CDN
├── src 
    ├── apis // 發送axios請求 需要axios套件
        └──  RestaurantFinder.js 設定後端api的連接網址
    ├── components // 頁面中的各區塊元件
        └── ....
    ├── context // React context 元件資料夾
        └── ....
    ├── route // 由根頁面決定路由到的頁面的頁面檔
        └──  ....    
    ├── App.jsx // 頁面根節點的設計，設計Body的Layout/連接APi
    ├── index.js // 頁面渲染根節點
    └── index.css // 主要的客製化設計參數
├── package.json
├── package-lock.json
├── yarn.lock
```

###    快速生成 需要vscode套件 react-ES7
```
imr+tab = import React from 'react';

imrd+tab  = import ReactDOM from 'react-dom';

rafce+tab = 
    import React from 'react'

    const test = () => {
        return (
            <div>

            </div>
        )
    }

    export default test

```

###    Use bootstrap and CDN

* import those link in public/index.html
* 所有CDN查找 [CDN search](https://cdnjs.com)

* [bootstrap](https://getbootstrap.com/docs/5.1/getting-started/introduction/) 
```
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
```

* [font-awesome](https://cdnjs.com/libraries/font-awesome)
```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css" integrity="sha512-xA6Hp6oezhjd6LiLZynuukm80f8BoZ3OpcEYaqKoCV3HKQDrYjDE1Gu8ocxgxoXmwmSzM4iqPvCsOkQNiu41GA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
```

##    Component 

* {< component />} 可以為tag寫邏輯
* const Component({props....}) = >{
         return < attribute....> </>
}
```
const component = ({ color, text, onClick }) => {
    return <button
        onClick={onClick}
        style={{ background: color }}
        className='btn' >
        {text}
    </button>
}
```


##    React Hook 介紹

[Hook APi ref](https://zh-hant.reactjs.org/docs/hooks-reference.html) 

* [useState](https://zh-hant.reactjs.org/docs/hooks-state.html)
    * 有狀態性 statefull 的元件 避免太多抽象的class 複雜化設計
    * 不需要使用this 就能指定state
    * 局部範圍的資料儲存狀態
    * 在執行初期渲染時給予component 初值
    * 值更新時 需要重新選染配合 useEffect or useContext
```
import React, { useEffect } from "react";

const [name, setName] = useState("Init Name");

return (
    <div className="col">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
        />
    </div>
)
```
* [useEffect](https://zh-hant.reactjs.org/docs/hooks-effect.html)
    * function side effect
    * 在每次render執行
    * 可以依據設定 依照資料與state狀態 影響DOM渲染效果
    * 可以fetch資料 配合apis/dataFinder
    * 設定 subscription 但要記得清除 避免memory leak
    * 在useEffect中 最好以箭頭函式在定義功能 方便維護
    * 第二個參數是array型態，若傳入的state未改變，重新render 並不會觸發useEffect

```
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 相似於 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    const renameTitle = () =>{
        // 使用瀏覽器 API 更新文件標題
        document.title = `You clicked ${count} times`;
    };
    renameTitle();
  }, [count]);// 僅在計數更改時才重新執行 effect

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
* useContext
    * 檔案命名使用字首大寫連接 ex UserNameContext
    * 有點像是全域的 state 物件
    * 解決 props 要一層一層慢慢往下傳的問題
    * 將資料全部儲存在 Context.Provider中
    * 只要 Context.Provider資料更新時 會觸發重新render
    * 將最新的 context value 傳送到 Context.Provider
    * 如果資料太多 不想全部重新render 可以 [useMemo](https://github.com/facebook/react/issues/15156#issuecomment-474590693)

```
./context/YourContext.js

import React, { useState, createContext } from "react";

// 建立 RestaurantContext 接收 createCoontext的回傳值
export const RestaurantsContext = createContext();

// 建立一個 Provider 傳入 props 
// 可以利用props 找到子component 
// 提供子component 使用 context value
export const RestaurantsContextProvider = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const addRestaurants = (restaurant) => {
    // auto add new data in context array to render new data
    setRestaurants([...restaurants, restaurant]);
  };
  const [selectRestaurant, setSelectRestaurant] = useState(null);

  return (
    <RestaurantsContext.Provider
      value={{ // 提供使用 state
        restaurants,
        setRestaurants,
        addRestaurants,
        selectRestaurant,
        setSelectRestaurant,
      }}
    >
      {props.children} // 提供所有子component 使用
    </RestaurantsContext.Provider>
  );
};

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
./App.jsx

import React from "react";
import { RestaurantsContextProvider } from "./context/RestaurantsContext";

const App = () => {
  return (
      // 使用ContextProvider
      // 提供全域的props 資料傳遞
    <RestaurantsContextProvider> 
      <div className="container">
         ...Page.jsx or Component
      </div>
    </RestaurantsContextProvider>
  );
};

export default App;


```

###    React route dom Hook 介紹
[REF](https://reactrouter.com/web/api/Hooks)

1. 需要先設定根頁面 
2. Component元件(...Page.jsx)檔案須以英文大寫開頭
3. 提供使用者單頁面網頁應用不需要重新導向載入的體驗
```
./App.jsx 根頁面

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./routes/Home";
import RestaurantDetailPage from "./routes/RestaurantDetailPage";
import UpdatePage from "./routes/UpdatePage";


// 設定URL path與配對的 Page 
const App = () => {
  return (
      <div className="container">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/restaurants/:id"
              component={RestaurantDetailPage}
            />
            <Route
              exact
              path="/restaurants/:id/update"
              component={UpdatePage}
            />
          </Switch>
        </Router>
      </div>
  );
};

export default App;

```

* useHistory 
    * access to the history instance that you may use to navigate.
```
import { useHistory } from "react-router-dom";

const TestComponent = () => {
    let history = useHistory(); // 宣告
    const handleClick()  = (e) => {
         // for prevent click btn to alert router 
         // to do table route
        e.stopPropagation();
        history.push("/home"); // redirect to /home 
    }

    return (
        <button
          onClick={(e) => handleClick(e)}
          className="btn btn-warning"
        >
          Click to Home
        </button>
    );
};

export default TestComponent;
```
* useLocation
    * returns the location object that represents the current URL
```
import { useLocation, useLocation } from "react-router-dom";

const TestComponent = () => {
    let location = useLocation(); // 宣告
    let history = useHistory();
    const handleClickToReload()  = (e) => {
         // for prevent click btn to alert router 
         // to do table route
        e.stopPropagation();
        history.push("/"); // redirect to /home
        history.push(location.pathname); // redirect to current URL 
    }

    return (
        <button
          onClick={(e) => handleClickToReload(e)}
          className="btn btn-warning"
        >
          Click to Reload
        </button>
    );
};

export default TestComponent;
```
* useParams
    * returns an object of key/value pairs of URL parameters. 

```
import { useLocation, useParams } from "react-router-dom";

const TestComponent = () => {
    let { productID } = useParams// 宣告
    const getData()  = async (e) => {
         // for prevent click btn to alert router 
         // to do table route
        e.stopPropagation();
        const getData = await apis.get(`/${productID}`);
        ....setState(getData);
    }

    return (
        <button
          onClick={(e) => getData(e)}
          className="btn btn-warning"
        >
          Search Product
        </button>
    );
};

export default TestComponent;
```
##    專案發佈
* build folder 才是我們真正發佈的網站檔案
* Google React plugin Icon 紅色 未建置 藍色 已建置
```
npm run build >> build folder 


// serve 套件是一個小型的伺服器 用來測試build專案
sudo npm i -g serve


// 在 http://localhost:8000 上
serve -s build -p 8000 

```


##    Context && props
[參考](https://ithelp.ithome.com.tw/articles/10252519)
##    Props && Components
[參考](https://zh-hant.reactjs.org/docs/components-and-props.html)