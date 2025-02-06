var tasks = [];
var kigenzenn = ["紀元前７世紀以前","紀元前６世紀","紀元前５世紀","紀元前４世紀","紀元前３世紀","紀元前２世紀","紀元前１世紀"]
var yeartable= []
//var thtable=["アジア","アジア","アジア","年",時代,将軍,日本,欧米,アジア,科学・芸術（日本）,科学・芸術（欧米）]
var yearRow = []
var cellCount = 10
var DispCountryArray= new Array();
DispCountryArray["ローマ"]=["欧米","ローマ","midnightblue"]
DispCountryArray["ギリシア"]=["欧米","ギリシア","darkolivegreen"]
DispCountryArray["神聖ローマ"]=["欧米","神聖ローマ","darkred"]
DispCountryArray["ゲルマニア"]=["欧米","ゲルマニア","darkred"]
DispCountryArray["フランク王国"]=["欧米","フランク王国","brown"]
DispCountryArray["ビザンツ帝国"]=["欧米","ビザンツ帝国","darkolivegreen"]
DispCountryArray["仏"]=["欧米","フランス","navy"]
DispCountryArray["英"]=["欧米","イギリス","darkviolet"]
DispCountryArray["伊"]=["欧米","イタリア","olive"]
DispCountryArray["墺"]=["欧米","オーストリア","goldenrod"]
DispCountryArray["蘭"]=["欧米","オランダ","magenta"]
DispCountryArray["西"]=["欧米","スペイン","crimson"]
DispCountryArray["独"]=["欧米","ドイツ","darkred"]
DispCountryArray["白"]=["欧米","ベルギー","mediumorchid"]
DispCountryArray["波"]=["欧米","ポーランド","orangered"]
DispCountryArray["葡"]=["欧米","ポルトガル","darkcyan"]
DispCountryArray["露"]=["欧米","ロシア","red"]
DispCountryArray["北欧"]=["欧米","北欧","slateblue"]
DispCountryArray["米"]=["欧米","アメリカ","maroon"]
DispCountryArray["瑞"]=["欧米","スイス","limegreen"]
DispCountryArray["洪"]=["欧米","ハンガリー","mediumturquoise"]
DispCountryArray["勃"]=["欧米","ブルガリア","lightseagreen"]
DispCountryArray["エジプト"]=["欧米","エジプト","burlywood"]
DispCountryArray["アフリカ"]=["欧米","アフリカ","tan"]
DispCountryArray["南米"]=["欧米","南米","purple"]
//DispCountryArray["共通"]=["欧米","共通/不明","gray"]

DispCountryArray["中国"] =["アジア","中国","blue"]
DispCountryArray["モンゴル"] =["アジア","モンゴル","red"]
DispCountryArray["印"] =["アジア","インド","lightseagreen" ]
DispCountryArray["オスマン帝国"]=["アジア","オスマン帝国","orange"]
DispCountryArray["土"]=["アジア","トルコ","orange"]
DispCountryArray["中東"] =["アジア","中東","darkorange"]  
DispCountryArray["韓国"] =["アジア","韓国","green"]
DispCountryArray["ベトナム"] =["アジア","ベトナム","darkcyan"]
DispCountryArray["インドネシア"] =["アジア","インドネシア","tomato"]
DispCountryArray["タイ"] =["アジア","タイ","royalblue"]
DispCountryArray["フィリピン"] =["アジア","フィリピン","mediumturquoise"]
DispCountryArray["ミャンマー"] =["アジア","ミャンマー","mediumturquoise"]
DispCountryArray["カンボジア"] =["アジア","カンボジア","gold"]
DispCountryArray["シンガポール"] =["アジア","シンガポール","darkorange"]
DispCountryArray["朝鮮"] =["アジア","朝鮮","red"]

var matchTask = []
var matchRow = []

var colorArray = ["mediumblue","darkgreen","crimson","darkcyan","darkorange","chocolate","limegreen","orangered","dimgray","magenta","darkgreen","deeppink","purple"]
var colorArray2 = ["skyblue","green","tomato","cyan","gold","pink","lime"]

function Initialize() {

    createCheckBox()
    var nullArray = []

    var csvData =loadCSV("/static/japan-hist.csv")
        
    // CSVの全行を取得
    var lines = csvData.split("\n");

    for (var i = 1; i < lines.length-1; i++) {
        // 1行ごとの処理

        var taskSet = lines[i].split(",");

        var task =  {
            TaskName: taskSet[3],
            AreaName: taskSet[6],
            Syubetu: taskSet[2],
            StartYear: taskSet[0],
            StartMonth: taskSet[1],
            EndYear: taskSet[4],
            EndMonth: taskSet[5],
            Dsplevel: taskSet[7],
            DataKbn: taskSet[8],
            RelCountry: taskSet[9],
            Memo: taskSet[10],
            Keyword: taskSet[11],
            dispRow: 0,
            dispEndRow: 0,
            dispCol: 0,
            ColorIndex: 0,
        }
        tasks.push(task);
    }

    tableinit(); //年の行数分の空のテーブルを生成
    createChronoTable(tasks,nullArray,nullArray)


}
function loadCSV(targetFile) {

    // XMLHttpRequestの用意
    var request = new XMLHttpRequest();
    request.open("get", targetFile, false);
    request.send(null);
 
    // 読み込んだCSVデータ
    var csvData = request.responseText;
    return csvData

}
function createChronoTable(tasks,EuroCountry,AisaCountry){
    var table = document.getElementById("table")
    debcount = 0
    for(dispdata of tasks){
        debcount ++
//        if(debcount > 300){
//            break;
//        }
        if (isNaN(dispdata.StartYear)){continue}
        if (Number(dispdata.StartYear) < -1000){continue;}

        var dispRow = CalcDispRow(dispdata.StartYear)
        // Col 計算 //
        if (dispdata.AreaName == "日本"){
            if (Number(dispdata.Syubetu) < 3){
                dispCol = 1
            } else if(Number(dispdata.Syubetu) == 3){
                dispCol = 2
            }else {
                dispCol = 3
            }
        } else if (dispdata.AreaName == "欧米"){
            dispCol = 4
        }else {
            dispCol = 5
        }
        if(dispdata.DataKbn != "" && dispCol > 2){
            if (dispCol == 5){
                dispcol = 7
            } else {
                dispCol = dispCol + 3
            }
        }
        createTDdata(table,dispdata,dispRow,dispCol,EuroCountry,AisaCountry)

    }
    //#table > tbody > tr:nth-child(2) > td

}
function tableinit(){

    yeartable = []
    for (let ii =0;ii < kigenzenn.length ;ii++){
        yeartable.push(kigenzenn[ii])
        yearRow.push(ii)
    }
    var row = ii
    yeartable.push("1")
    yearRow.push(row)
    row ++;

    for(var ii = 10;ii<=2030;ii+=10){
        var a = String(ii)
        yeartable.push(a)
        yearRow.push(row)
        row ++;
    }

    var table = document.getElementById("table")
    
    for(key of   yeartable ){
        rowobj=  table.insertRow(-1)
          cell=rowobj.insertCell(-1);
        cell.appendChild(document.createTextNode(key));
        for (let ii = 0 ; ii < cellCount -3;ii++){
            cell=rowobj.insertCell(-1);
        }
    } 
}
function CalcDispRow(year){
    
    StartYear = Number(year)
    if (StartYear < -600){
        return 1;
    }else if (StartYear < -500){
        return 2;
    }else if (StartYear < -400){
        return 3;
    }else if (StartYear < -300){
        return 4;

    }else if (StartYear < -200){
        return 5;

    }else if (StartYear < -100){
        return 6;

    }else if (StartYear < 0){
        return 7;
    }
    /*  BCは数値の比較　*/
    for (ii = 7; ii < yeartable.length;ii++){
        if (StartYear < Number(yeartable[ii])){
            return ii ;
        }
    }

}
function createTDdata(tableElm,dispData,tdRow,tdCol,euroArray,asiaArray){
    //    if(tdCol ==4 || tdCol ==5){
    //    if(Number(dispData.StartYear) < -900){
     //       console.log("tdCol"+tdCol+":"+dispData.StartYear+":"+ dispData.TaskName+":"+dispData.AreaName+":"+dispData.RelCountry)
     //       console.log(euroArray)
     //       console.log(asiaArray)   
     //   } 
 //    }

    /* 表示対象かチェックする */
    let check = ""
    if (tdCol ==4 ){
         check =  checkCountry(euroArray,dispData.RelCountry)
    } else if (tdCol ==5 ) {
         check =  checkCountry(asiaArray,dispData.RelCountry)
    } else {
        check = "OK"
    }

    if (check == "NG"){

        return
    }


    cellElm = tableElm.rows[tdRow].cells[tdCol]
    cellElm.setAttribute("class","tablecell")

    tmpst = cellElm.innerHTML

    if (tmpst=="" ){
        var ulElm =document.createElement('ul');
        ulElm.setAttribute("class","tableul")

        if (tdRow > 1){
                /* 最古のデータ以外が1セル10個に集約*/        
            for(let ii=0;ii<10;ii++){
                var li = document.createElement('li');
                ulElm.appendChild(li);
            }
        } 
        cellElm.appendChild(ulElm)   
    }
    // Row>1のセルは10行のLIの塊、Liの上からの位置を計算して、そこのイベントを追加
    //Row 0 は　task毎に　Li　を作るので作った最後のLIのデータを追加
    if (tdRow == 1){
        //li を生成して、そのLiの番号をliRowにセット
        var uls = cellElm.getElementsByClassName("tableul")
        var lielm = document.createElement('li');
        uls[0].appendChild(lielm);
        let lis = uls[0].getElementsByTagName("li")
        liRow = lis.length -1
    }else {
        
        if(tdRow < 8){
            //紀元前なので、1が一番で0が一番上
            let tmpno = Number(String(dispData.StartYear).slice(-2)) * 99
            liRow =  Number(String(tmpno).slice(-2,-1))
            
        }else {
            liRow = Number(String(dispData.StartYear).slice(-1))
        }
        if (isNaN(liRow)){
            liRow = 0
        }

    }
    var ulElm = cellElm.getElementsByClassName("tableul")
    let textspan = document.createElement('span');
    textspan.setAttribute("class","colortext")
   
    if (dispData.AreaName =="欧米" ||dispData.AreaName =="アジア"){
        var spanColor = ColorCheck(dispData)
        textspan.setAttribute("style","color:"+ spanColor + " ;")      
    }

    /* 同年に複数のイベントがあった場合はドロップダウンメニュー形式にする */
    liElm = ulElm[0].children[liRow]
    if (liElm.innerHTML != ""){
        
      /*  createSubMenu(liElm,dispData,tdRow,tdCol)*/
        // li cless 変更 //
        createDetail(liElm,dispData,tdRow,tdCol)
 

    } else {
        if(tdCol < 3){
            textspan.innerHTML= dispData.TaskName

            ulElm[0].children[liRow].appendChild(textspan) 
            ulElm[0].children[liRow].setAttribute("style","list-style:none;background-color: lightgreen;")
            

        }else{
            
            textspan.innerHTML =String(dispData.StartYear) + ":"+ dispData.TaskName
            ulElm[0].children[liRow].appendChild(textspan) 
        }
    }
    
}
function createDetail(liElm,dispData,tdRow,tdCol){
    var ulElm =liElm.getElementsByTagName('ul')
    //         = liElm.firstElementChild //<span>
    
    if (ulElm.length == 0){
        // li Class 変更
        // ul 生成
        let tmpSpan = liElm.firstElementChild
        liElm.firstElementChild.remove()
        
        let detailElm = document.createElement('details');
        detailElm.setAttribute("class","sumdetail")
        let summarylElm = document.createElement('summary');
        summarylElm.appendChild(tmpSpan)
        detailElm.appendChild(summarylElm)
        liElm.appendChild(detailElm)

        liElm.setAttribute("class","tablepmenu") 
        var subUl = document.createElement('ul');
        subUl.setAttribute("class","teblesubitem")
        detailElm.appendChild(subUl)

    } else {
        subUl = ulElm[0]
    }

    let subli = document.createElement('li');

    /*追加するイベントをLIとして追加　----*/
    subli.setAttribute("style","overflow: visible;text-wrap: inherit")
    let textspan = document.createElement('span');
    textspan.setAttribute("class","colortext")
    //欧米はテキストに色を付ける //

    if (dispData.AreaName =="欧米" ||dispData.AreaName =="アジア"){
        var spanColor = ColorCheck(dispData)
        textspan.setAttribute("style","color:"+ spanColor + " ;")      
    }

    subli.appendChild(textspan)
    if(tdCol < 3){
        textspan.innerHTML =  dispData.TaskName
    }else{
        textspan.innerHTML = String(dispData.StartYear) + ":"+ dispData.TaskName
    }
    subUl.appendChild(subli)
}
function createSubMenu(liElm,dispData,tdRow,tdCol){
        var ulElm =liElm.getElementsByTagName('ul')
        //         = liElm.firstElementChild //<span>

        if (ulElm.length == 0){
            // li Class 変更
            // ul 生成
            liElm.setAttribute("class","tablepmenu") 
            var subUl = document.createElement('ul');
            subUl.setAttribute("class","teblesubitem")
            liElm.appendChild(subUl)
        } else {
            subUl = ulElm[0]
        }

        let subli = document.createElement('li');
        subli.setAttribute("style","overflow: visible;text-wrap: inherit")
        let textspan = document.createElement('span');
        textspan.setAttribute("class","colortext")

        //欧米はテキストに色を付ける //

        if (dispData.AreaName =="欧米" ||dispData.AreaName =="アジア" ){
            var spanColor = ColorCheck(dispData)
            textspan.setAttribute("style","color:"+ spanColor + " ;")      
        }

        subli.appendChild(textspan)
        if(tdCol < 3){
            textspan.innerHTML =  dispData.TaskName
        }else{
            textspan.innerHTML = String(dispData.StartYear) + ":"+ dispData.TaskName
        }
        subUl.appendChild(subli)
}
function ColorCheck(dispData){
    /* 複数イベントがある場合に色を付けると紛らわしいので、当面色は付けない　
    return "black";*/
    
    var check = relCountryCheck("",dispData.RelCountry)
    if (check == "NG"){
                return "black";
    }
    if (check =="ALL"){
        return "black";
    }else if (check =="NON"){
                return "ashgray"
    }else{
        if (check in DispCountryArray){
            return DispCountryArray[check][2];
        } else {
            return "darkgray" ;
        }
    }

}
function relCountryCheck(dispCountrys,RelCountry )  {
    //dispCountrys :チェックボックスで表示すると選択されて国名　RelCountry: データの関連国
    if (RelCountry == ""){
        return "NON";
    }
    if (dispCountrys == ""){
        if (RelCountry.includes(":")){
                let relSt = RelCountry.split(":")
                return relSt[0]
        }else {
            return RelCountry
        }
    }
    var dispArray = dispCountrys.split(":")
    for (let i = 0 ; i < dispArray.length ; i++){
        //console.log("dispCountry check:"+ dispArray[i] + "rel:"+RelCountry+"="+RelCountry.includes(dispArray[i]))
        if (RelCountry.includes(dispArray[i])== true ){
            
            return dispArray[i];
        }
    
    }
    return "NG";        
}
function checkCountry(selectCountrys,RelCountry)  {
    //dispCountrys :チェックボックスで表示すると選択された国名の配列　RelCountry: データの関連国
    if (RelCountry == ""){
        return "OK";
    }
    //console.log("checkCountry:"+ selectCountrys + "rel:"+RelCountry)
    if (selectCountrys.length == 0){
        return "OK";
    }
    for (let i = 0 ; i < selectCountrys.length ; i++){
        if (RelCountry == "" && selectCountrys[i] =="共通"){
            return "OK";
        }
        if (RelCountry.includes(selectCountrys[i])== true ){
            
            return "OK"
        }
    
    }
    return "NG";        
}
function selectItems(ItemNO){
    const colwidth = [20,20,15,15,15]
    const hiddenwidth = ["5%","5%","5%","10%","10%"]
    let tmpwidth=[]
    let checks = document.getElementsByName('checkDispCat');
    let tableElm =document.getElementById("hiddenCol")
    let tableHD =document.getElementById("dynamicTH")
    let colNo = ItemNO + 3

    for(ii=0;ii<5;ii++){
        colNo = ii+3        
   
        if ( checks[ii].checked === true ) {
            //非表示
            tableElm.children[colNo].setAttribute("style", "visibility:collapse");
            tmpwidth[ii] = 0
        } else {
            //表示
            tableElm.children[colNo].setAttribute("style", "visibility:visibule");
        }
    }  
    let totalWidth = tmpwidth.reduce((sum, element) => sum + element, 0);
    

   for(ii=0;ii<8;ii++){
        if (ii < 3){
            tableHD.children[ii].setAttribute("width","5%"); 
        }else {
            if (tmpwidth[ii-3] == 0){
                tableHD.children[ii].setAttribute("width",  hiddenwidth[ii-3]);
            }else{
                let calwidth = Math.floor(tmpwidth[ii-3] * (85/totalWidth))

                tableHD.children[ii].setAttribute("width", String(calwidth)+"%px"); 
            }
     
        }
    

    } 

    
}
function jumppage(){
    var table = document.getElementById("table")    
    var inputRow = document.getElementById('inputFrom').value;
    let rowNo = 0;
    if(!isNaN(inputRow)){
       rowNo = Math.trunc(Number(inputRow) /10 + 4)
    }
    
    let distTd = table.rows[rowNo].cells[0]

    window.scrollTo({ 
        top: distTd.offsetTop , 
        behavior: 'smooth' 
    });

}
function fontChange(size){

    const SelectElement = document.querySelector('body');
    const SelectStyle = getComputedStyle(SelectElement);
    
    switch (size) {
        case 0:
            SelectElement.style.setProperty('--tablefontsize','14px');  
            break; 
        case 1:
            SelectElement.style.setProperty('--tablefontsize','11px');
            break;   
        case 2:
            SelectElement.style.setProperty('--tablefontsize','9px');   
            break;
    }
    
}

function createCheckBox(){
    let checkID = ["checktable","checktableAsia"]
    let syubetu = ["欧米","アジア"]

    for(ii=0;ii<2;ii++){
        var checkCountry = document.getElementById(checkID[ii])
        var cc = 0
        countrytable = document.createElement("table") 
        checkbox = ""
    //    const countryArray = DispCountryArray.filter((row,index) =>  row[index][0] === syubetu[ii] );
    //console.log(countryArray)


        for (let key in DispCountryArray) {
            if (DispCountryArray[key][0]==syubetu[ii]){  
                checkbox = checkbox + "<td  align='left'><input type='checkbox' name='" + checkID[ii] + "' " 
                checkbox = checkbox + "value='" +key+ "'>" 
                checkbox = checkbox + '<font size= "2" color="' + DispCountryArray[key][2] + '">' + DispCountryArray[key][1] + '</font></td>' 
                if (cc == 1){
                    checkbox += "</tr><tr>"
                    cc  = 0
                } else{
                    cc += 1
                }
            }
        }
        checkbox += "</tr></table></b>"
        countrytable.innerHTML = checkbox
        checkCountry.appendChild(countrytable)
    }

    
}
function SelectCountry(){
    let checkID = ["checktable","checktableAsia"]
    let syubetu = ["欧米","アジア"]
    
    let euroArray = [];
    let asiaArray = [];

    for(ii=0;ii<2;ii++){
        var checks = document.getElementsByName(checkID[ii]);
        
        for ( i = 0; i <checks.length; i++) {
            if ( checks[i].checked === true ) {
                if(ii == 0){
                    euroArray.push([checks[i].value])
                } else {
                    asiaArray.push([checks[i].value])
                }               
            }
        }
    }
    let table = document.getElementById("table") 
    let tablecell = document.getElementsByClassName("tablecell") 
    // 年以外のTDをすべてクリアして、再度作り直す //
    for(cell of tablecell){
        cell.innerHTML =""
    }
    createChronoTable(tasks,euroArray,asiaArray)
    
}
function searchItem(){

    var strings = document.getElementById('seachString').value

    var mathcCount = 0
    matchTask = []
    tasks.forEach((task,index) => {
        
        var check = searchStringCheck(task,strings)
        if (check != "NG"){
                matchTask.push(task)                    
                mathcCount++;
        }

    })

    var relWin = document.getElementById('resultUl')
    relWin.innerHTML = ""
    matchRow = []
    for (var i = 0;i < matchTask.length;i++){
        matchRow.push(CalcDispRow(matchTask[i].StartYear))
        let subli = document.createElement('li');
        subli.innerHTML = matchTask[i].StartYear +":" + matchTask[i].TaskName +"("+ matchTask[i].RelCountry +")"
        relWin.appendChild(subli)
    }
    let distTd = table.rows[matchRow[0]].cells[0]

    window.scrollTo({ 
        top: distTd.offsetTop , 
        behavior: 'smooth' 
    });
    // 
    
    var reldiv = document.getElementById('searchResult')
    reldiv.setAttribute("style","visibility:visible")


}
function searchStringCheck(task,seachString)  {
        
    var strings = []
    if (task.TaskName == ""){
        return "NG";
    }
    if (seachString.includes(":")){
        strings = seachString.split(":")
    }else{
        strings[0] = seachString
    }
    for(let i = 0;i < strings.length;i++){
        if (task.TaskName.includes(strings[i]) == true){
            return "OK"
        }
        if (task.Memo.includes(strings[i]) == true){
            return "OK"
        }
        if (task.Keyword.includes(strings[i]) == true){
            return "OK"
        }
    }
    return "NG";        
}
function searchclose(){
    var reldiv = document.getElementById('searchResult')
    reldiv.setAttribute("style","visibility:hidden")

}

class Task {

    constructor(taskName, areaName, syubetu, startYear, startMonth,endYear,endMonth,dsplevel,datakbn,RelatedCountries,Memo,Keyword){
        this.AreaName = areaName;
        this.TaskName = taskName;
        this.Syubetu = syubetu;
        this.StartYear = startYear;
        this.StartMonth = startMonth;
        this.EndYear = endYear;
        this.EndMonth = endMonth;
        this.Dsplevel = dsplevel
        this.DataKbn = datakbn
        this.RelCountry = RelatedCountries
        this.Memo = Memo
        this.Keyword = Keyword
        this.dispRow = 0
        this.dispEndRow = 0
        this.dispCol = 0
        this.ColorIndex = ""
        
    }
    setTaskColor(color){
        this.ColorIndex = color
    }
    
}
class subWind{
    constructor(taskName, areaName, syubetu, startYear, startMonth,endYear,endMonth,dsplevel,datakbn,RelatedCountries){
    }

}