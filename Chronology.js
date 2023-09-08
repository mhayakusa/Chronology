
    var timerId = '';
    var mindex = 0;
    var endindex = 0;
    var img = null;
    var pimg = null;
    var drop_color = ['pink', 'skyblue', 'green', 'gray', 'tomato', 'navy', 'violet'];
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var prefcanvas = document.getElementById("prefCanvas");
    var prefctx = prefcanvas.getContext("2d");
    var subcanvas = document.getElementById("subCanvas");
    var subctx = subcanvas.getContext("2d");
    var areacanvas = document.getElementById("areaCanvas");
    var areactx = areacanvas.getContext("2d");
    var dx = 2;
    var dy = -2;
    var mvPtn=2;
    var hanreiImage = new Image();
    var image = []
    var imageOn = [false,false,false,false]
    var image_srcName=["/static/生産年齢.png","/static/若者女.png","/static/子供.png","/static/女の子.png","/static/ojisan.png","/static/おばさん.png","/static/おじいさん.png","/static/おばあさん２.png"]
    var graphY = ["[15～64]","[0～14]","[65～74]","[74～]"]
    //var graphY = ["生産","年少","65以上","75以上"]
    var loadcounter=0
    var prefData = []; // 都道府県データを入れるための配列
    var populationData = []; // 市町村データ入れるための配列
    var titleCol={"総数_男":0,"総数_女":0,"年少人口_男":0,"年少人口_女":0,"生産年齢_男":0,"生産年齢_女":0,"老年人口_男":0,"老年人口_女":0,"後期高齢者_男":0,"後期高齢者_女":0,"面積(k㎡)":0,'人口密度':0,"可住地面積":0,"主要湖沼面積":0}
    var PrefTable = {};
    var CityTable = {};
    var PrefDataCol={"総数_男":0,"総数_女":0,"年少人口_男":0,"年少人口_女":0,"生産年齢_男":0,"生産年齢_女":0,"老年人口_男":0,"老年人口_女":0,"後期高齢者_男":0,"後期高齢者_女":0,"面積(k㎡)":0,'人口密度':0,"可住地面積":0,"主要湖沼面積":0}
    var PrefDataRow = {};
    var prefDataArray = []
    var prefAreaArray = []
    var popArray = []
    var AreaArray = []
    var kbnPop =[]
    var kbnRate=[]
    var kajyutiRate=0;
    var kosyouRate = 0;
    var shinrinRate = 0;
    var animePref=''
    var dspdata=[]
    var rankingTable=[] 
    var rankTableHd=["都道府県","市町村","総人口","人口密度","生産年齢比率","年少人口比率","65歳以上比率","75歳以上比率","面積","可住地面積","総人口R","総人口PR","人口密度R","人口密度PR","生産年齢比率R","生産年齢比率PR","年少人口比率R","年少人口比率PR","65歳以上比率R","65歳以上比率PR","75歳以上比率R","75歳以上比率PR","面積R","面積PR","可住地面積R","可住地面積PR"]        
    var ranking_kubun=["人口","人口密度","生産年齢比率","年少人口比率","65歳人口比率","75歳人口比率","面積","可住地面積"]
    var prefRunkCount = {}
    var postCity = ""
    var postPref = ""
    var landColor=['burlywood','#004400','#8EF1FF'] //可住地,森林など,湖沼
    var CityPrefJapanColor=['gray','green','tomato']

    function dummy(){

    };
    function SelectPage( page ) {
      /*

        各ページのエレメントを取得
    */
    var elementPage1 = document.getElementById( "page1" );
    var elementPage2 = document.getElementById( "page2" );
    var elementPage3 = document.getElementById( "page3" );
 
    switch( page ) {
    case 1:
        elementPage1.style.removeProperty('display')
        elementPage1.style.visibility = 'visible';
        elementPage2.style.visibility = 'hidden';
        elementPage3.style.visibility = 'hidden';
        
        break;
 
    case 2:
        elementPage1.style.visibility = 'hidden';
        elementPage2.style.visibility = 'visible';
        elementPage3.style.visibility = 'hidden';
        makepage2Table()     

//        pagetableinit("page2table",dspdata)
        break;
 
    case 3:
        elementPage1.style.visibility = 'hidden';
        elementPage1.style.display = 'none';
        elementPage2.style.visibility = 'hidden';
        elementPage3.style.visibility = 'visible';
        makepage3Table()
        pagetableinit("page3table",dspdata)
        
        break;
    }
    }   ;
    function tableinit(kbn){
      // データを表示するためにテーブルを動的に作成（左右同じものを作ってIDをFor文で利用するためにJSで作る）
//        document.getElementById(tableId).appendChild(table);
        let tableid = "tbody"+kbn
        tbody02 = document.getElementById(tableid)
        headerA =["生産年齢人口","年少人口","65～74歳人口","75歳以上人口"]
        headerB =["","総面積","可住地面積","森林面積","湖沼面積"]
        for(i=0;i<headerA.length;i++){
            var rowobj = tbody02.insertRow(i)            
//        tbody = table.createTBody();
            for(let j = 0; j <  5 ; j++){
              cell=rowobj.insertCell(-1);
              if(j == 0 ){
                cell.setAttribute("style","text-align:center")
                cell.appendChild(document.createTextNode(headerA[i]));
              }else{
                cell.setAttribute("id","tb"+kbn+"tr"+i+"tc"+(j-1))
              }
              
              if(j ==1 || j ==3){
//                cell.setAttribute("align","left")
                cell.setAttribute("style","text-align:right")
               }
            } 
         }
         for(i=0;i<3;i++){
          var rowobj = tbody02.insertRow(-1)
          rowobj.setAttribute("align","center")
          if (i==0){
              rowobj.setAttribute("style","text-align:center;background-color:#78fdf7");
            }
          for(let j = 0; j <  headerB.length ; j++){
              cell=rowobj.insertCell(-1);
              if(i == 0 ){
                cell.appendChild(document.createTextNode(headerB[j]))
                cell.setAttribute("style","font-weight: bold");
              }else{
                if(j==0){
                  switch (i) {
                    case 1:
//                      cell.appendChild(document.createTextNode("Km2"));
                        cell.appendChild(document.createTextNode("平方キロ"));
                        break
                    case 2:
                      cell.appendChild(document.createTextNode("%"));
                      break
                    }
                } else{
                  cell.setAttribute("id","tb"+kbn+"Area"+"tr"+(i-1)+"tc"+(j-1))
                }

              }
            } 

         }
    }
    async function loadImages(imgUrls){
        const promises = [];
        const images = [];
        imgUrls.forEach(function(url){
            var promise = new Promise(function(resolve){
                const img = new Image();
                img.onload = function(){
                    resolve();
                }
                img.src = url;  //読込開始
      
                images.push(img) //完了後にimagを配列に
            });
            promises.push(promise);
        });
        /// すべて読込完了まで待つ
        await Promise.all(promises);
        return images;
    }
     //CSVファイルを読み込む関数getCSV()の定義
    function oldgetCSV(csvFile){
        var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
        req.open("get", csvFile, true); // アクセスするファイルを指定
        req.send(null); // HTTPリクエストの発行

        // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
        req.onload = function(){
          convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
        }
    }
   async function asyncGetCSV(csvFile){
      var getreq =  null;
      var promise2 = new Promise(function(resolve2){
          getreq = new XMLHttpRequest();
          getreq.onload = function(){
              /// 読み込み完了後...
//              window.alert('loaded : '+csvFile);
              resolve2();
          }
          /// 読み込み開始...
          getreq.open("get", csvFile, true); // アクセスするファイルを指定
          getreq.send(null); // HTTPリクエストの発行
      });
      /// 読込完了まで待つ
      await promise2;
      return getreq.responseText;
    }

/// 画像読み込みするasyncな関数
    async function imageload(){
      image = await loadImages(image_srcName);
      hanreiImage.src = "/static/凡例.png"
    }
    async function getCSV(csvFile){
        console.log("getCsv Start")
        var readData = await asyncGetCSV(csvFile);
        console.log("getCsv typeof"+(typeof readData))
        return readData;
      
    }
    function inputChange(){      
      
      animeStop()
      
      let selObjelem = document.getElementById('selPref');
      var prefName = selObjelem.value        

        oldCityelme = document.getElementById("selCity");
        oldCityelme.remove() //全部削除
        selCityTD = document.getElementById("cityTD");
        selCityelem = document.createElement('select');          
        selCityelem.setAttribute("id","selCity")
        selCityelem.setAttribute("name","selCity")

        for (i = 1; i <  populationData.length;i++){
          if( populationData[i][1]==prefName){
              let option2 = document.createElement("option");
              option2.setAttribute("value", populationData[i][2]); //option.value = v.value;
              option2.innerHTML = populationData[i][2]
              selCityelem.appendChild(option2);
           // console.log("optin add"+prefName+":"+populationData[i][2])
          }
        }
        selCityelem.setAttribute('onChange', "cityChange()")  
        selCityTD.appendChild(selCityelem)
      

        draw100PPL()
    }
    function cityChange(){
      animeStop()
      
      draw100PPL()
    }

    function objectselectBox(populationData){
      // option 追加
      selObjelm = document.getElementById("selPref");
      selObjelm.onchange = inputChange;
      selno = 0
      for (var key in PrefTable) {
//        for (let [key, value] of Object.entries(PrefTable)) {
//          console.log("loop"+key)
        let option = document.createElement("option");

        option.setAttribute("value", key); //option.value = v.value;
        selno++;
        option.innerHTML = key
        selObjelm.appendChild(option);
        if (key == postPref) {                      //初期選択状態のセット　Postされた引数の都道府県にする
          option.setAttribute("selected", true);    // selectedの属性を付与
        }
      }
      selCityelm = document.getElementById("selCity");
      for (i = 1; i <  populationData.length;i++){
        if( populationData[i][1]==postPref){
              let option2 = document.createElement("option");
              option2.setAttribute("value", populationData[i][2]); //option.value = v.value;
              option2.innerHTML = populationData[i][2]
              if (populationData[i][2] == postCity) {                      //初期選択状態のセット　Postされた引数の都道府県にする
                  option2.setAttribute("selected", true);    // selectedの属性を付与
              }
              selCityelm.appendChild(option2);
        }
      }  
    }
    function CSVtoPopdata(str){ 
      var tmp = str.split("\r\n"); //windows は \r\n
      if(tmp.length ==1){
        var tmp = str.split("\n"); 
      }
      for(let i=0;i<tmp.length;i++){
          populationData[i] = tmp[i].split(',');
          if(populationData[i][1] == undefined){
            break
          }
          if(i==0){  //ヘッダから使用する項目のColを調べる
              for(let j = 0;j < populationData[0].length;j++){          
                if(populationData[0][j] in titleCol){
                  titleCol[populationData[0][j]] = j
//            console.log("TF"+ populationData[0][j] +":"+j)
                 }     
              }
          } else{
              if(!(populationData[i][1] in PrefTable)){
                    PrefTable[populationData[i][1]] =1
               }
              keySt = populationData[i][1] + populationData[i][2]
              CityTable[keySt] = i //市町村のRowを連想配列に記録しておく
               // ランキング用に集計用データを生成しておく
              let sousu = Number(populationData[i][titleCol["総数_女"]])+Number(populationData[i][titleCol["総数_男"]])
              populationData[i].push(sousu)
              if(i==1){
                titleCol["総人口"]=populationData[i].length -1
              }
              
              let seisan = Number(populationData[i][titleCol["生産年齢_男"]]) +  Number(populationData[i][titleCol["生産年齢_女"]])
              populationData[i].push(seisan)
              if(i==1){
                titleCol["生産年齢計"]=populationData[i].length -1
              }
              let nensyou = Number(populationData[i][titleCol["年少人口_男"]]) + Number(populationData[i][titleCol["年少人口_女"]])
              populationData[i].push(nensyou)
              if(i==1){
                titleCol["年少人口計"]=populationData[i].length -1
              }

              let rounen = Number(populationData[i][titleCol["老年人口_男"]]) + Number(populationData[i][titleCol["老年人口_女"]])
              populationData[i].push(rounen)
              if(i==1){
                titleCol["老年人口計"]=populationData[i].length -1
              }
              
              let kouki = Number(populationData[i][titleCol["後期高齢者_男"]]) + Number(populationData[i][titleCol["後期高齢者_女"]])
              populationData[i].push(kouki)
              if(i==1){
                titleCol["後期高齢者計"]=populationData[i].length -1
              }
              let Area0 = Number(populationData[i][titleCol["面積(k㎡)"]])
              let Area1 = Number(populationData[i][titleCol["可住地面積"]]);
              let Area3 = Number(populationData[i][titleCol["主要湖沼面積"]]);
              let Area2 = Number((Area0 - Area1 -  Area3).toFixed(2)) //森林面積

              populationData[i].push(Area2)
              if(i==1){
                titleCol["森林面積"]=populationData[i].length -1
//           window.alert("森林面積:"+Area2+"Col71;"+populationData[i][titleCol["森林面積"]]+"col;"+titleCol["森林面積"]+"70:"+populationData[i][70])
              }
              
            
          }
      }
       objectselectBox(populationData)
    }
    
    function CSVtoPrefdata(str2){ 
        var tmp = str2.split("\r\n"); //windows は \r\n
        if(tmp.length ==1){
          var tmp = str2.split("\n"); 
        }

        for(var i=0;i<tmp.length;i++){
            prefData[i] = tmp[i].split(',');
            if(i>0 && prefData[i][1] !== undefined){
              if(!(prefData[i][0] in PrefDataRow)){
                PrefDataRow[prefData[i][0]] =i
              }
            }
        }
        //ヘッダから使用するデータの位置を探す
        for(let j = 0;j < prefData[0].length;j++){          
          if(prefData[0][j] in PrefDataCol){            
            PrefDataCol[prefData[0][j]] = j
//            console.log("TF"+ populationData[0][j] +":"+j)
          }
       }
    }
// -------------------------------ここが最初に呼ばれる関数 ------------------------------------ 
// CSVファイルや画像データを読込、データを初期化する
  async  function dataInitialize(){
        var readdata = "";
        var query = location.search;
        var value = query.split('=');

        var spPref=['和歌山県','鹿児島県','神奈川県']
        var prefcityname=""
        if (value[0]=="?city"){
          prefcityname = decodeURIComponent(value[1])
          for(let i=0;i<spPref.length;i++){
            if (prefcityname.substr(0, 4)==spPref[i]){
              postPref = prefcityname.substr(0, 4)
              postCity = prefcityname.substr(4)
              break; 
            }
          }
          if (postCity=="") {
            postPref = prefcityname.substr(0, 3)
            postCity = prefcityname.substr(3)
          }
        } else {
          postPref = "東京都"
          postCity = "千代田区"
        }
        await imageload()
//        console.log("getCsv before call")
        var readdata = await asyncGetCSV("/static/data_20220101.csv")
//        console.log("getCsv after call")
        CSVtoPopdata(readdata )
        readData2 = await asyncGetCSV("/static/PrefData_20220101.csv")
        CSVtoPrefdata(readData2 )
        tableinit("01")
        tableinit("02")
        SelectPage(1) 
        draw100PPL() 
    }

    function draw100PPL(){
    //  let pNumText = document.getElementById('pNum').value;
    //  if (pNumText.match(/[^0-9]+/)){
    //      window.alert('数字以外が入力されています'); // 数字以外が入力された場合は警告ダイアログを表示
    //      dataIdx = 522;
    //  } else{
    //      dataIdx = Number(pNumText)
    //  }
      SelectPage(1)

      let selObjelem = document.getElementById('selPref');
      var prefName = selObjelem.value    

      let selCityelem = document.getElementById("selCity");
      var cityName = selCityelem.value  

      let keySt =   prefName +  cityName
      if( keySt in CityTable){
        dataIdx = CityTable[keySt]
      }
      drawRightCity(dataIdx)
      drawPrefimage(prefName)
      compgraph()  // prefdata はdrawprefimageで作成するのでこの順が大事 
      makepage2Table() 

    }
    function drawRightCity(dataIdx){

            //      draw_line(wakuposX ,wakuendY + 10,wakuendX ,wakuendY + 10)
      //人口密度を表す　100人の面積
      popArray[0] = Number(populationData[dataIdx][titleCol["総数_女"]])+Number(populationData[dataIdx][titleCol["総数_男"]])
      allPop = popArray[0]
      popArray[1] = Number(populationData[dataIdx][titleCol["生産年齢_男"]])
      popArray[2] = Number(populationData[dataIdx][titleCol["生産年齢_女"]])
      popArray[3] = Number(populationData[dataIdx][titleCol["年少人口_男"]])
      popArray[4] = Number(populationData[dataIdx][titleCol["年少人口_女"]])
      popArray[7] = Number(populationData[dataIdx][titleCol["後期高齢者_男"]])
      popArray[8] = Number(populationData[dataIdx][titleCol["後期高齢者_女"]])
      popArray[5] = Number(populationData[dataIdx][titleCol["老年人口_男"]]) - popArray[7]
      popArray[6] = Number(populationData[dataIdx][titleCol["老年人口_女"]])- popArray[8]

      AreaArray[0] = Number(populationData[dataIdx][titleCol["面積(k㎡)"]])
      AreaArray[1]=Number(populationData[dataIdx][titleCol["可住地面積"]]);
      AreaArray[2] =0
      AreaArray[3] = Number(populationData[dataIdx][titleCol["主要湖沼面積"]]);
      AreaArray[2] = Number((AreaArray[0] - AreaArray[1] - AreaArray[2]).toFixed(2)) //森林面積

//      popRate = populationData[dataIdx][titleCol["人口密度"]]
      popRate = allPop /AreaArray[0] 
      var rateArray = calcKbnRate(popArray) //描画に必要なデータを計算 （人数）
      var kbnRate = Array.from(rateArray)

      var rAreaRate = calcAreaRate(AreaArray)
      var AreaRate = Array.from(rAreaRate)
      shinrinRate =AreaRate[2]
      kosyouRate =AreaRate[3]
//      drawRightCity(dataIdx)
      document.getElementById("allpop").innerHTML = populationData[dataIdx][2] +" 総人口 ： " + String(allPop.toLocaleString( undefined, { maximumFractionDigits: 20 }))

      drawCanvas(canvas,ctx,kbnRate,shinrinRate,kosyouRate,popRate)

 //     drawData(populationData[dataIdx][2],popArray)
      drawData(1,populationData[dataIdx][2],popArray,AreaArray,AreaRate,popRate)
      //dspTable(populationData[dataIdx][2],popArray,AreaArray,AreaRate,popRate)

    }
    function drawPrefimage(prefName){
      
      if( prefName in PrefDataRow){
        prefIdx = PrefDataRow[prefName]
      }
            //      draw_line(wakuposX ,wakuendY + 10,wakuendX ,wakuendY + 10)
      //人口密度を表す　100人の面積
      prefDataArray[0] = Number(prefData[prefIdx][PrefDataCol["総数_女"]])+Number(prefData[prefIdx][PrefDataCol["総数_男"]])
      prefallPop = prefDataArray[0]
      prefDataArray[1] = Number(prefData[prefIdx][PrefDataCol["生産年齢_男"]])
      prefDataArray[2] = Number(prefData[prefIdx][PrefDataCol["生産年齢_女"]])
      prefDataArray[3] = Number(prefData[prefIdx][PrefDataCol["年少人口_男"]])
      prefDataArray[4] = Number(prefData[prefIdx][PrefDataCol["年少人口_女"]])
      prefDataArray[7] = Number(prefData[prefIdx][PrefDataCol["後期高齢者_男"]])
      prefDataArray[8] = Number(prefData[prefIdx][PrefDataCol["後期高齢者_女"]])
      prefDataArray[5] = Number(prefData[prefIdx][PrefDataCol["老年人口_男"]]) - prefDataArray[7]
      prefDataArray[6] = Number(prefData[prefIdx][PrefDataCol["老年人口_女"]])- prefDataArray[8]

      prefAreaArray[0] = Number(prefData[prefIdx][PrefDataCol["面積(k㎡)"]])
      prefAreaArray[1]=Number(prefData[prefIdx][PrefDataCol["可住地面積"]]);
      prefAreaArray[2] =0
      prefAreaArray[3] = Number(prefData[prefIdx][PrefDataCol["主要湖沼面積"]]);
      prefAreaArray[2] = Number((prefAreaArray[0]- prefAreaArray[1]- prefAreaArray[2]).toFixed(2));

      prefpopRate = Number(prefallPop) / prefAreaArray[0] // 人口密度

      var prefrateArray = calcKbnRate(prefDataArray) //描画に必要なデータを計算 （人数）
      var prefkbnRate = Array.from(prefrateArray)

      var rvalue = calcAreaRate(prefAreaArray)
      prefAreaRate = Array.from(rvalue)

      prefshinrinRate =prefAreaRate[2]
      prefkosyouRate =prefAreaRate[3]
      
//      drawRightCity(prefIdx)
      drawCanvas(prefcanvas,prefctx,prefkbnRate,prefshinrinRate,prefkosyouRate,prefpopRate)
  
      document.getElementById("zenkoku").innerHTML = prefName +" 総人口 ： " + String(prefallPop.toLocaleString( undefined, { maximumFractionDigits: 20 }))
     
      //   drawData(prefData[prefIdx][2],popArray)
       drawData(2,prefName,prefDataArray,prefAreaArray,prefAreaRate,prefpopRate)


    }
    function calcAreaRate(AreaArray){
      var AreaRateArray = []
      allArea = AreaArray[0];
      kajyuti = AreaArray[1];
      kosyou = AreaArray[3];
      shinrin = AreaArray[2];

      kajyutiRate=Math.floor( (kajyuti / allArea) * 1000 ) / 1000;
      kosyouRate = Math.floor( (kosyou/ allArea) * 1000 ) / 1000;
      if(kosyouRate < 0.001){kosyouRate =0 }
      shinrinRate = Math.floor( (1-kajyutiRate - kosyouRate) * 1000 ) / 1000;
//     console.log("shinrin:"+shinrin+"rate:"+shinrinRate)
      if(shinrinRate < 0.001){shinrinRate =0 }
      
      AreaRateArray[0] = 1
      AreaRateArray[1] =kajyutiRate
      AreaRateArray[3] =kosyouRate
      AreaRateArray[2] =shinrinRate
      
      return AreaRateArray;
    }
    function calcKbnRate(kbnjinkou){
      // 人数比を計算して返す関数
      // 渡される引数の最初に総数が入っている、後の値を総数で割った比率を整数にして返す　（kbnjinkouの個数-1　を返す）

      var allPop = kbnjinkou[0]
      var kbnPop = []
      var ninzuu = []
      var fpArray = {}
      var bosuu = 100

      for(let i=1;i<kbnjinkou.length;i++){
          kbnPop[i - 1] = kbnjinkou[i]
      }

      var amari = 0
      var bunpai = 0
      for (let i = 0 ;i<kbnPop.length;i++){
        ninzuu[i] = bosuu * (kbnPop[i] / allPop)
//           console.log("step0:"+kbnRate[i])
      }

      for(let i = 0;i<ninzuu.length;i++){
        var a = Math.floor( ninzuu[i] )
        var fp = ninzuu[i] - a
        fpArray[String(i)] = fp
        ninzuu[i] = a
        bunpai += a
        //   console.log("kirisute:"+kbnRate[i])
      }

      // 小数点部分を整数に分配するために、小数点部分の大きい順にkbnRateを1増やす
      amari = bosuu - bunpai
      //        console.log("amari:"+amari)

      var pairs = Object.entries(fpArray);

      pairs.sort(function(p1, p2){
        var p1Val = p1[1], p2Val = p2[1];
        return p2Val - p1Val;
      })
      //console.log("pairs:"+pairs)

      Object.keys(pairs).forEach(
        key => {
         if(amari > 0){
        // console.log("Key:["+key+"]:"+pairs[key][0])
            keyIdx = Number(pairs[key][0]);
            amari -= 1
            ninzuu[keyIdx] += 1 
          }
        }
      );

      return ninzuu
      
    }

function drawCanvas(drawcanvas,drawCtx,kbnRate,shinrinRate,kosyouRate,popRate){
      if (drawcanvas.getContext) {
        drawCtx.clearRect(0, 0, drawcanvas.width, drawcanvas.height);
      }
    //画像の描画

      xgap = 31
      ygap = 31
      startPosX = 20
      startPosY = 20
      imgWidth = 35
      imgHight = 50
      rowC = 0
      colC = 0
      tate = 9 // tateに表示する人数  - 1
      dspNum = tate // 最初に改列の処理をするために
      wakuposX = startPosX -5
      wakuposY = startPosY-5
      wakuHeight = ygap*9+imgHight+5
     // wakuWidth =  xgap*10 +5
      wakuWidth = wakuHeight  // 正方形にするために同じ数字にしてしまう

      wakuendX =  wakuposX + wakuWidth
      wakuendY = wakuposY + wakuHeight
      
      drawCtx.fillStyle= landColor[0];
      drawCtx.fillRect(wakuposX, wakuposY, wakuWidth , wakuHeight );

      // 森林、湖畔、可住地を色分けする
      if(shinrinRate >= 0.001){
          greenHeight = Math.floor(shinrinRate * wakuHeight);
          
          drawCtx.fillStyle= landColor[1];
          drawCtx.fillRect(wakuposX, wakuposY, wakuWidth , greenHeight );
          var kosyouposY = wakuposY + greenHeight
         // console.log("greenposY"+wakuposY+" greenHeight:"+greenHeight+"kosyouposY:"+kosyouposY)
      } else {
          var kosyouposY = wakuposY;
      }
    //  console.log("kosyouRate:"+kosyouRate)
      if(kosyouRate >= 0.001){
          let kosyouHeight = Math.floor(kosyouRate * wakuHeight);
          
          drawCtx.fillStyle= landColor[2];
    //      console.log("kosyouposY"+kosyouposY+" kosyouHeight:"+kosyouHeight)
          drawCtx.fillRect(wakuposX, kosyouposY, wakuWidth , kosyouHeight );
      }
//      draw_line(wakuposX ,wakuendY + 10,wakuendX ,wakuendY + 10)
      //人口密度を表す　100人の面積
//      popRate = populationData[dataIdx][titleCol["人口密度"]]
//      console.log("密度 "+popRate)
      aa = Math.sqrt((1 / popRate) * 100000000) 
      mitudo = "１辺 【"+String(aa.toFixed(2))+"ｍ 】の土地"
      drawCtx.font = '12pt Arial';
      //ctx.fillStyle = 'rgba(0,128 , 0)';
      drawCtx.fillStyle = 'black';
      mStPosX = (wakuposX + wakuendX) /2 - 120
      mStPosY = wakuendY + 20
      drawCtx.fillText(mitudo,mStPosX  ,mStPosY  );

      //　人形を比率したがって描画
      for (let i = 0 ;i<kbnRate.length;i++){
        for(let j = 0;j<kbnRate[i];j++){
          if (dspNum >= tate){
            dspNum = 0
            startY = startPosY
            startX = startPosX + xgap * colC
            colC ++;
          } else {
            startY+= ygap;
            dspNum ++;
          }
          draw_fig(drawCtx,image[i],startX,startY,imgWidth,imgHight)
        }
      }
    //凡例（色）の説明
      drawCtx.font = '11pt Arial';
      
      let haba = 80
      for(let j = 0;j<3;j++){
//          let x0 = endX + 10
          let takasa = 10
          let x0 = wakuposX + 20 + j *haba
          let y0 = mStPosY + 15 
          let x1 = x0
          let y1 = y0 - takasa
          let x2 = x0 + takasa
          let y2 = y1
          let x3 = x2
          let y3 = y0
          draw_polygon(drawCtx,x0,y0,x1,y1,x2,y2,x3,y3,landColor[j])
          switch (j){
            case 0:
              var kubun = '可住地'
              break;
            case 1:
              var kubun = '森林など'
              break;
            case 2:
              var kubun = '湖沼'
              break;
          }
          drawCtx.fillStyle = 'black';
          drawCtx.fillText(kubun, x2 + 4,y2 + 12 )
      }

  //    drawGraph(drawCtx,kbnRate,wakuendX+ 10 ,wakuendY)
    }

  function drawGraph(drawCtx,kbnRate,dx,dy){
//  drawGraph 人数グラスを描画する
      // 人数比をグラフにして表示

      gimgWidth = 25
      gimgHight = 40
      gap = 3
      takasa = 8
      for (let i = 0 ;i<kbnRate.length;i++){
        let x0 = dx + i * (gimgWidth + gap)
        let y0 = dy
        let x1 = x0
        let y1 = y0 - (kbnRate[i] * takasa)
        let x2 = x0 + gimgWidth
        let y2 = y1
        let x3 = x2
        let y3 = y0
        draw_fig(drawCtx,image[i],x0 ,dy+gap,gimgWidth,gimgHight)  // 人形を表示
        draw_polygon(drawCtx,x0,y0,x1,y1,x2,y2,x3,y3,"#555555")
        drawCtx.fillStyle="black"
        drawCtx.font = '11pt Arial'; // '10px serif'
        if(i%2==0){
          ii = Math.floor(i /2)
          drawCtx.fillText(graphY[ii], x0+1,dy+gap+gimgHight+12 );
        }
      }
    }
    
    function animeStart(){
      let selObjelem = document.getElementById('selPref');
      var prefName = selObjelem.value 
      window.alert( prefName+"の市町村を4秒毎に自動描画します\nどれかのボタンをクリックすれば停止します")

      let selCityelem = document.getElementById("selCity");
      if(selCityelem.options.length > 0){
        mindex = 0
        endindex = selCityelem.options.length
//        drawPrefimage(prefName)  // 都道府県イメージが描画されていないときのために描画しておく
        animePref = prefName
        animeData()
        
        timerId = setInterval(animeData,4000);
      }

    };
    function animeData(){
      if(mindex >= endindex){
        clearInterval(timerId);
        timerId=''
        window.alert("最後まで描画しました")
        return
      }
      let selObjelem = document.getElementById('selPref');
      var prefName = selObjelem.value
      if(animePref != prefName ){
        // 連続描画中に選択を変更された
        clearInterval(timerId);
        timerId=''
        window.alert("連続描画を停止しました") 
        return 
      }
      let selCityelem = document.getElementById("selCity");
      selCityelem.options[mindex].selected = true;
      cityName = selCityelem.options[mindex].value 

      mindex++;
      let keySt =   prefName +  cityName
      if( keySt in CityTable){
          dataIdx = CityTable[keySt]
          draw100PPL()
      } else {
        clearInterval(timerId);
        timerId=''
        window.alert("最後まで描画しました")
      }
    }
    function compgraph(){
      //右側キャンバスに比較グラフを描写
      // 
      var jpnData=[]

      let drawCtx= subctx  //将来ctxを引数にできるようにするため
      let drawCanvas = subcanvas
      //キャンバスをクリア
      if (drawCanvas.getContext) {
        drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
      }

      if( "全国" in PrefDataRow){
        jpnIdx = PrefDataRow["全国"]
      }
      jpnData[0] = Number(prefData[jpnIdx][PrefDataCol["総数_女"]])+Number(prefData[jpnIdx][PrefDataCol["総数_男"]])
      jpnData[1] = Number(prefData[jpnIdx][PrefDataCol["生産年齢_男"]])
      jpnData[2] = Number(prefData[jpnIdx][PrefDataCol["生産年齢_女"]])
      jpnData[3] = Number(prefData[jpnIdx][PrefDataCol["年少人口_男"]])
      jpnData[4] = Number(prefData[jpnIdx][PrefDataCol["年少人口_女"]])
      jpnData[5] = 0
      jpnData[6] = 0
      jpnData[7] = Number(prefData[jpnIdx][PrefDataCol["後期高齢者_男"]])
      jpnData[8] = Number(prefData[jpnIdx][PrefDataCol["後期高齢者_女"]])
      jpnData[5] = Number(prefData[jpnIdx][PrefDataCol["老年人口_男"]]) - jpnData[7]
      jpnData[6] = Number(prefData[jpnIdx][PrefDataCol["老年人口_女"]])- jpnData[8]


      let selObjelem = document.getElementById('selPref');
      var prefName = selObjelem.value    

      let selCityelem = document.getElementById("selCity");
      var cityName = selCityelem.value  

      //document.getElementById("zenkoku").innerHTML = "【"+ cityName+ "】の "+ prefName + " と全国との比較"

//      var prefDataArray = []      var prefAreaArray = []      var popArray = []      var AreaArray = []
      
      var citydRate = calcKbnRate(popArray)  //
      var prefdRate = calcKbnRate(prefDataArray) 
      var jpndRate = calcKbnRate(jpnData) 

      let startPosX = 10  //人形グラフの描画開始位置
      let startPosY = 310

      let takasa = 8
      let gimgWidth = 30  //人形の幅
      let gimgHight = 48
      let gap = 1
      //------------------------------------
      let spanwidth = 45
      let gwidth = Math.floor(((spanwidth - (3*gap))/3))
      let fillColor=[]
      let endX =0

      for (let i = 0 ;i<citydRate.length;i++){
        //描画位置を計算
        dx = startPosX + i * spanwidth
        dy = startPosY
        imagX = Math.floor((dx+(spanwidth - gimgHight)/2))
        //横軸の人形と説明を描画
        draw_fig(drawCtx,image[i],imagX+5,dy+gap,gimgWidth,gimgHight)  // 人形を表示    
        drawCtx.fillStyle="black"
        drawCtx.font = '12pt Arial'; // '10px serif'
        if(i%2==0){
          ii = Math.floor(i /2)
          var kbnstPosy = dy+gap+gimgHight+12
          drawCtx.fillText(graphY[ii], dx+15,kbnstPosy );  //   年齢の説明テキスト
        }
        for(let j = 0;j<3;j++){
          switch (j){
            case 0:
              var ninzuu = citydRate[i]
              fillColor[j] = CityPrefJapanColor[j]
              break;
            case 1:
              var ninzuu = prefdRate[i]
              fillColor[j] = CityPrefJapanColor[j]
              break;
            case 2:
              var ninzuu = jpndRate[i]
              fillColor[j] = CityPrefJapanColor[j]
              break;
          }

          let x0 = dx + j * (gwidth + gap)
          let y0 = dy
          let x1 = x0
          let y1 = y0 - (ninzuu * takasa)
          let x2 = x0 + gwidth
          let y2 = y1
          let x3 = x2
          let y3 = y0
//          console.log("gwidth:"+gwidth+" x0,y0,x2,y2:"+x0+","+y0+","+x2+","+y2)
          draw_polygon(drawCtx,x0,y0,x1,y1,x2,y2,x3,y3,fillColor[j])
          endX = x3
        }
      }
      //凡例（色）の説明
      drawCtx.font = '11pt Arial';
      let haba = 120
      for(let j = 0;j<3;j++){
//          let x0 = endX + 10
//          let x0 = startPosX + 30
//          let y0 = kbnstPosy + 18 + j * (takasa +10)
            let x0 = startPosX + 30 + j * haba 
          if(j==1){
            //市町村名は長いので余分に余白をとる
            if(cityName.length > 5){
              x0 += 30
            }
          }
          let y0 = kbnstPosy + 18 
          let x1 = x0
          let y1 = y0 - takasa
          let x2 = x0 + takasa
          let y2 = y1
          let x3 = x2
          let y3 = y0
          draw_polygon(drawCtx,x0,y0,x1,y1,x2,y2,x3,y3,fillColor[j])
          switch (j){
            case 0:
              var kubun = cityName
              break;
            case 1:
              var kubun = prefName 
              break;
            case 2:
              var kubun = '全国'
              break;
          }
          drawCtx.fillText(kubun, x2 + 4,y2 + 8 )
      }
      for(let j = 0;j<3;j++){
        let x0 = startPosX
        let y0 = startPosY - 10*takasa*(j+1)
        let x1 = endX
        let y1 = y0
        drawCtx.fillStyle = "gray"
        draw_lineDash(drawCtx,x0,y0,x1,y1)
      }

      areaComp()

   
    }
    function areaComp(){
      // 人口密度の比較を描画
      var jpnArea=[]
            //キャンバスをクリア
      if (areacanvas.getContext) {
        areactx.clearRect(0, 0, areacanvas.width, areacanvas.height);
      }

      let drawMaxWidth = (areacanvas.width *0.8)

      let selObjelem = document.getElementById('selPref');
      let prefName = selObjelem.value    

      let selCityelem = document.getElementById("selCity");
      let cityName = selCityelem.value  

      if( "全国" in PrefDataRow){
        jpnIdx = PrefDataRow["全国"]
      }

      jpnArea[0] = Number(prefData[jpnIdx][PrefDataCol["面積(k㎡)"]])
      jpnArea[1]=Number(prefData[jpnIdx][PrefDataCol["可住地面積"]]);
      jpnArea[2] =0
      jpnArea[3] = Number(prefData[jpnIdx][PrefDataCol["主要湖沼面積"]]);
      jpnArea[2] = Number((jpnArea[0]- jpnArea[1]- jpnArea[2]).toFixed(2));

      var jpnPPL = Number(prefData[jpnIdx][PrefDataCol["総数_女"]])+Number(prefData[jpnIdx][PrefDataCol["総数_男"]])

      cityDensity = Number(popArray[0]) / AreaArray[0]
      prefDensity = Number(prefDataArray[0]) / prefAreaArray[0]
      jpnDensity = Number(jpnPPL) / jpnArea[0]

      cityLeng = Math.sqrt((1 / cityDensity) * 100000000) 
      prefLeng = Math.sqrt((1 / prefDensity) * 100000000) 
      jpnLeng = Math.sqrt((1 / jpnDensity) * 100000000)

      let polyleng = {}
      if (jpnLeng > (prefLeng*1.5)){
        polyleng[2] = drawMaxWidth * 0.8                //基準は全国の長さ
        polyleng[0] = cityLeng /jpnLeng * polyleng[2] 
        polyleng[1] =  prefLeng /jpnLeng * polyleng[2]


      }else{
        polyleng[1] =drawMaxWidth * 0.8               //基準は都道府県の長さ
        polyleng[0] = cityLeng /prefLeng * polyleng[1] //city
        polyleng[2] =  jpnLeng /prefLeng * polyleng[1]//japan
      }
//---------　連想配列 polylengを値順にキーをソートする　---------
      let drawOrder=[];
      for(var key in polyleng)drawOrder.push(key);

      function PolyCompare(a,b){
          return polyleng[b]-polyleng[a];    
      }

      drawOrder.sort(PolyCompare);

      let x0 = 5
      let y0 = areacanvas.height -10
      for (let i = 0 ;i < 3;i++){
        let x1 = x0
        let y1 = y0 - polyleng[drawOrder[i]]
        let x2 = x0 + polyleng[drawOrder[i]]
        let y2 = y1
        let x3 = x2
        let y3 = y0
        draw_polygon(areactx,x0,y0,x1,y1,x2,y2,x3,y3,CityPrefJapanColor[drawOrder[i]])
      }

      
      var rateimgPosX =  30
      var rataimgPosY = 20

      areactx.fillStyle="blue"
      areactx.font = '11pt Arial';
      areactx.fillText("【100人の土地の広さ】", rateimgPosX,rataimgPosY )

      areactx.font = '10pt Arial';

      citymitudo = "【"+String(cityLeng.toFixed(2))+"ｍ 】"
      prefmitudo = "【"+String(prefLeng.toFixed(2))+"ｍ 】"
      jpnmitudo = "【"+String(jpnLeng.toFixed(2))+"ｍ 】"

      areactx.fillText(cityName+":"+citymitudo, rateimgPosX,rataimgPosY + 40 )
      areactx.fillText(prefName+":"+prefmitudo , rateimgPosX,rataimgPosY + 60)
      areactx.fillText("全国:"+jpnmitudo, rateimgPosX,rataimgPosY + 80 )




    }

    function drawData(dKbn,dataName,dataArray,AreaArray,AreaRateArray,popRate){
      // dKbn = 1:市町村 tabl01に表示 2: 都道府県 tabl02に表示

      // 行は生産年齢、年少人口、老年、後期高齢の順、列は男女、データは、0:総計、１：生産男、３：年少、５：老年 で男、女の順
      
      tblidSt = dKbn.toString().padStart( 2, '0'); //先頭 0の2文字に

      document.getElementById("dataName"+tblidSt).innerHTML = dataName

      let allPop = dataArray[0]
      let dataidx =0
      for(let i = 0;i<4;i++){
          for(let j = 0;j<4 ;j++){
            if(j < 2){
              dataidx = i*2 + 1
            }else{
              dataidx = i*2 + 2
            }
            cellid ="tb"+tblidSt+"tr" + i + "tc"+j
            if (j==0 || j ==2){
             //　人口
              document.getElementById(cellid).innerHTML = String(dataArray[dataidx].toLocaleString( undefined, { maximumFractionDigits: 20 }))
            }else{
            //　人口比率
              document.getElementById(cellid).innerHTML = String((dataArray[dataidx]/allPop*100).toFixed(1)) + "%"
           }
          }
      }
      //面積
      for(let i = 0;i<2;i++){
          for(let j = 0;j<4 ;j++){
            cellid ="tb"+tblidSt+"Areatr" + i + "tc"+j
            if (i==0){
              document.getElementById(cellid).innerHTML = String(AreaArray[j].toLocaleString( undefined, { maximumFractionDigits: 20 }))
            }else{
            //　比率
              if(j==0){
                document.getElementById(cellid).innerHTML = "－"
              }else{
                document.getElementById(cellid).innerHTML = String((AreaRateArray[j] *100 ).toFixed(1)) + "%"
              }
           }
          }
      }  
    }
    function animeStop(){
      if(timerId !=''){
        clearInterval(timerId);
        timerId=''
        window.alert("連続描画を停止しました")
      }
    }
// --------------- CANVAS 描画用にルーチン --------------
    function draw_fig(drawCtx,img,x0,y0,x1,y1){
      drawCtx.drawImage(img, x0,y0,x1,y1);
    }
    function draw_polygon(drawCtx,x0,y0,x1,y1,x2,y2,x3,y3,color){
      drawCtx.fillStyle =color
      drawCtx.beginPath();
      drawCtx.moveTo(x0,y0);
      drawCtx.lineTo(x1,y1);
      drawCtx.lineTo(x2,y2);
      drawCtx.lineTo(x3,y3);
      drawCtx.closePath();
      drawCtx.fill();
//        drawCtx.stroke();
    }
    function draw_line(drawCtx,x0,y0,x1,y1){
      drawCtx.beginPath();
      drawCtx.moveTo(x0,y0);
      drawCtx.lineTo(x1,y1);
      drawCtx.stroke(); 
    }
    function draw_lineDash(drawCtx,x0,y0,x1,y1){
      drawCtx.beginPath();
      drawCtx.setLineDash([2, 2]);
      drawCtx.moveTo(x0,y0);
      drawCtx.lineTo(x1,y1);
      drawCtx.stroke(); 
    }
//------------------------------------　Page2 データ表示用スクリプト --------------------------------
function makepage3Table(){
        // 表の作成開始
        //window.alert("page2 start")
        var rowobj;
        var spt=[];
        dataArray=[];
        tablehd = [];
        idokeido = {};

        var layerNum = 0
        var cbox = 0
//        cbox = window.parent.document.getElementById('layernum').innerHTML;
        if (cbox == '0'){
              layerNum = 0
        } else {
            layerNum = 1  
        } 
        dspdata=[]
        makedata()
        dspdata = dataArray.concat(); // tableinitはdspdataを表示する仕様に統一するためdspdata にdataArrayをコピー
        
    }
    function makedata(){
        tablehd=[]
        dataArray=[]
        tablehd[0] = populationData[0][1] // 都道府県
        tablehd[1] = populationData[0][2] //市町村
        j=2
        for(let key in titleCol){
            tablehd[j++] =  key
        }
        for(i = 1; i < populationData.length-1; i++){

            dataArray[i-1]=[]
            dataArray[i-1][0] =populationData[i][1]
            dataArray[i-1][1] =populationData[i][2]
            j=2
            for(let key in titleCol){
              dataArray[i-1][j++] =  populationData[i][titleCol[key]]
            } 
        }
    }
    function makepage2Table(){
        //
        
        if(rankingTable.length==0){
  //        window.alert("ランキング計算中")
          calcRank()
        }
//        window.alert("ランキング計算終了")
//        console.log("rankingTabl["+rankingTable)

        let selObjelem = document.getElementById('selPref');
        let prefName = selObjelem.value    

        let selCityelem = document.getElementById("selCity");
        let cityName = selCityelem.value  

 //       console.log("ranking pref["+prefName+"]["+cityName)
        tablehd=[]
        let outSw=false
        let outStartCol = 0
        tablehd[0]=" "
        for(let i = 0;i<rankTableHd.length;i++){
          if(rankTableHd[i]=="総人口R"){
            outSw = true
            outStartCol = i 
          }
          if(outSw==true){
            if (rankTableHd[i].slice(-2) !="PR"){
              let tabHdST =  rankTableHd[i].slice(0,rankTableHd[i].length -1) 
              tablehd.push(tabHdST)
            }
          }
        }
        dspdata=[]
        let alljapan=["全国順位"]
        let tmpst = prefName+"内順位"
        let allpref=[tmpst]
        for(let i = 0;i < rankingTable.length;i++){
            if(rankingTable[i][0]==prefName && rankingTable[i][1]==cityName){
              for(let j = outStartCol;j<rankingTable[0].length;j++){
                let rIdx = Math.floor(  (outStartCol - j)/ 2)
                let kbnidx = (outStartCol - j) % 2 
                if(kbnidx == 0){
                    alljapan.push(rankingTable[i][j]+"位")
                } else {
                    allpref.push(rankingTable[i][j]+"位")
                }
              }
              dspdata.push(alljapan)
              dspdata.push(allpref)
              break;
              //  dspdata[0].push(rankingTable[i][j])
            }
        }
        console.log("dspdata"+dspdata)
        pagetableinit("page2table",dspdata)
    }
    function calcRank(){
        // ランキングテーブル作成
        // 人口、人口密度、生産年齢比率、65歳以上比率、75歳以上比率、面積、可住地面積
        let hiritu=["生産年齢計","年少人口計","老年人口計","後期高齢者計"]
        dataArray=[]
        let calcRankCol=[]
        let calcCol = 2
//        for(let key in titleCol){
//            window.alert("titleCol["+key+"]col:"+titleCol[key])
//        } 

        for(i = 1; i < populationData.length -1; i++){
            ridx = i-1
            rankingTable[ridx] = []
            let dataTBL = []
            dataTBL[0] = populationData[i][1]
            dataTBL[1]= populationData[i][2]
            let allPPL = Number(populationData[i][titleCol["総人口"]])
            dataTBL[dataTBL.length]=allPPL
            if(i==1){
              calcRankCol.push(calcCol++)
            }
            dataTBL[dataTBL.length] = (Number(populationData[i][titleCol["人口密度"]]))
            if(i==1){
              calcRankCol.push(calcCol++)
            }
            for (j = 0;j<hiritu.length;j++){
                let bunshi = Number(populationData[i][titleCol[hiritu[j]]])
                dataTBL[dataTBL.length] = (bunshi / allPPL)
                if(i==1){
                  calcRankCol.push(calcCol++)
                }
            }
            dataTBL[dataTBL.length] = (Number(populationData[i][titleCol["面積(k㎡)"]]))
            if(i==1){
                  calcRankCol.push(calcCol++)
            }
//            window.alert("森林面積Col"+titleCol["森林面積"]+":"+populationData[i][titleCol["森林面積"]])
            dataTBL[dataTBL.length] =(Number(populationData[i][titleCol["森林面積"]])) 

            if(i==1){
                  calcRankCol.push(calcCol++)
            } 

//            console.log(dataTBL)
            rankingTable[ridx]=dataTBL.concat()
        }
   // ----------------ソート----------------------------------------
//        console.log(calcRankCol)

        for(let i=0;i<calcRankCol.length;i++){
          rankingTable.sort(function(a, b) {
	        return b[calcRankCol[i]] - a[calcRankCol[i]];
          });
          for(let j=0;j<rankingTable.length;j++){
            let rank = j+1
            rankingTable[j][rankingTable[j].length]=rank;

            prefKey = rankingTable[j][0]
            if(!(prefKey in prefRunkCount)){
              prefRunkCount[prefKey] = 1
            } else {
              prefRunkCount[prefKey]++
            }
            rankingTable[j][rankingTable[j].length]=prefRunkCount[prefKey];
//            if(j < 3 ){
//              window.alert("sort:"+rankingTable[j])
//            }
          }
          prefRunkCount={}
//          window.alert("sort comp:"+calcRankCol[i])
        }
      }

    function pagetableinit(dspTableid,dspdata,NoKbn){
        var tableid = document.getElementById(dspTableid)
        var tableelm = tableid.getElementsByTagName("table")
        if(tableelm.length != 0){
          console.log(tableelm)
          document.getElementById(dspTableid).removeChild(tableelm[0]);
        }
        var table = document.createElement("table");
        table.border = 1
        table.setAttribute('class','st-tbl1')
        thead = table.createTHead();
        rowobj= thead.insertRow(); 
        
        cell = document.createElement('th')
        if(NoKbn == "auto"){
        //最初の列はNo.を表示する列にする
            cell.appendChild(document.createTextNode("No."));
            thead.appendChild(cell);
        }
        //データの列のためのヘッダを作る
        for(j = 0; j < tablehd.length; j++){
            cell = document.createElement('th')
            cell.appendChild(document.createTextNode(tablehd[j]));
            thead.appendChild(cell);
        } 
        tbody = table.createTBody();
        for(i = 0; i < dspdata.length ; i++){
          rowobj=  tbody.insertRow(-1)
          if(NoKbn == "auto"){
            
              //No.を列を作成
            cell=rowobj.insertCell(-1);
            cell.appendChild(document.createTextNode(String(i)));  //行番号(i）を表示
          }
          for(j = 0 ;j < dspdata[i].length; j++){
                cell=rowobj.insertCell(-1);
                if(j < 2 ){
                  cell.setAttribute("align","left")
                  if(j==1){
                    cell.setAttribute("width","15%")
                  } else {
                    cell.setAttribute("width","10%")
                  }
                } else{
                  cell.setAttribute("align","right")
//                  cell.setAttribute("width","12%")
                  
                }
                if (!isNaN(dspdata[i][j])) {
                    cmmaSt = Number(dspdata[i][j]).toLocaleString( undefined, { maximumFractionDigits: 20 });
                    cell.setAttribute("align","right")
                } else {
                    cmmaSt =dspdata[i][j]
                }
                cell.appendChild(document.createTextNode(cmmaSt));
              } 
          } 
          // 指定したdiv要素に表を加える
         document.getElementById(dspTableid).appendChild(table);
    }
    
    function page3tableinit(dspdata){
        var table = document.createElement("table");
        table.border = 1
        table.setAttribute('class','st-tbl1')
        thead = table.createTHead();
        rowobj= thead.insertRow(); 
        //最初の列はNo.を表示する列にする
        cell = document.createElement('th')
        cell.appendChild(document.createTextNode("No."));
        thead.appendChild(cell);
        //データの列のためのヘッダを作る
        for(j = 0; j < tablehd.length; j++){
            cell = document.createElement('th')
            cell.appendChild(document.createTextNode(tablehd[j]));
            thead.appendChild(cell);
        } 
        tbody = table.createTBody();
        for(i = 1; i < dspdata.length -1; i++){
          rowobj=  tbody.insertRow(-1)
          //No.を列を作成
          cell=rowobj.insertCell(-1);
          cell.appendChild(document.createTextNode(String(i)));  //行番号(i）を表示
          for(j = 0 ;j < dspdata[i].length; j++){
                cell=rowobj.insertCell(-1);
                if(j < 2 ){
                  cell.setAttribute("align","left")
                  if(j==1){
                    cell.setAttribute("width","10%")
                  } else {
                    cell.setAttribute("width","10%")
                  }
                  cmmaSt = dspdata[i][j]
                } else{
                  cell.setAttribute("align","right")
//                  cell.setAttribute("width","12%")
                  cmmaSt = Number(dspdata[i][j]).toLocaleString( undefined, { maximumFractionDigits: 20 });
                }
                cell.appendChild(document.createTextNode(cmmaSt));
              } 
          } 
          // 指定したdiv要素に表を加える
         document.getElementById(tableId).appendChild(table);
    }
    function selectTable(objNum,seltext,detailCond){
      var tableid = document.getElementById("table")
      var tableelm = tableid.getElementsByTagName("table")
      if(tableelm != null){
        tableid.removeChild(tableelm[0]);
      }
      index = 0
      dcount = 50
      var outrow = 0
      if (objNum < 0){
        dspdata = Array.from(dataArray)
      } else {
        dspdata=[]
        if(objNum < dataArray[0].length){
          index = objNum
        }else {
          index = 0
        }
       // console.log("objNum:"+objNum+"seltext"+seltext+"index:"+index)
        if (isNaN(seltext)){
          for(i = 0;i < dataArray.length ;i++){
            if ( dataArray[i][index].indexOf(seltext) != -1) {
              dspdata[outrow] = Array.from(dataArray[i]);
              outrow = outrow + 1
            }
          }
        } else {
          //条件が数字の時は、以上、以下で絞り込む
            for(i = 0;i < dataArray.length ;i++){
              if(detailCond==1){
                //以上
                if ( Number(dataArray[i][index]) >= Number(seltext)) {
                    dspdata[outrow] = Array.from(dataArray[i]);
                  outrow = outrow + 1
                }
              } else {
                if ( Number(dataArray[i][index]) <= Number(seltext)) {
                    dspdata[outrow] = Array.from(dataArray[i]);
                  outrow = outrow + 1
                }
              }
            }
        }

        
      }
//      console.log(dspdata)
      pagetableinit("page3tabel",dspdata)
    }
    function sortAllTable(dindex,proc){
      var tableid = document.getElementById("table")
      var tableelm = tableid.getElementsByTagName("table")
      if(tableelm != null){
        tableid.removeChild(tableelm[0]);
      }
      
      if (dindex >= dataArray[0].length || dindex < 0){
        dindex = 0
      }
      if(proc == 1){
        // 昇順
          dataArray.sort(function(a, b) {
	        return a[dindex] - b[dindex];
        })
      } else{
        // 降順
        dataArray.sort(function(a, b) {
	      return b[dindex] - a[dindex];
        });
      }
      dspdata = dataArray.concat();
      pagetableinit("page3tabel",dspdata)
    }
    function sortPage2Table(dindex,proc){
      var tableid = document.getElementById("table")
      var tableelm = tableid.getElementsByTagName("table")
      if(tableelm != null){
        tableid.removeChild(tableelm[0]);
      }
      
      if (dindex >= dspdata[0].length || dindex < 0){
        dindex = 0
      }
      if(proc == 1){
        // 昇順
          dspdata.sort(function(a, b) {
	        return a[dindex] - b[dindex];
        })
      } else{
        // 降順
        dspdata.sort(function(a, b) {
	      return b[dindex] - a[dindex];
        });
      }
      pagetableinit("page3tabel",dspdata)
    }
    function dpsdataido(){
      dspmax = 10
      idoarray=[]
//      console.log("dspdata.length"+dspdata.length+"dataaray"+dataArray.length)
      for(let i=0;i<dspdata.length;i++){
        if (i >= dspmax){
          break
        }
        idoarray.push(idokeido[dspdata[0]])
  //      console.log("ido"+idoarray[0]+idoarray[1])

      }
    }