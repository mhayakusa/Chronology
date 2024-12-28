var tasks = [];
var kigenzenn = ["新石器時代","紀元前４世紀以前","紀元前３世紀","紀元前２世紀","紀元前１世紀"]
var yeartable= []
//var thtable=["年",時代,将軍,日本,欧米,アジア,科学・芸術（日本）,科学・芸術（欧米）]
var yearRow = []
var cellCount = 10
var DispCountryArray= new Array();
DispCountryArray["ローマ"]=["ローマ","midnightblue"]
DispCountryArray["ギリシア"]=["ギリシア","darkolivegreen"]
DispCountryArray["神聖ローマ"]=["神聖ローマ","darkred"]
DispCountryArray["オスマン帝国"]=["オスマン帝国","orange"]
DispCountryArray["ゲルマニア"]=["ゲルマニア","darkred"]
DispCountryArray["フランク王国"]=["フランク王国","brown"]
DispCountryArray["ビザンツ帝国"]=["ビザンツ帝国","darkolivegreen"]
DispCountryArray["仏"]=["フランス","navy"]
DispCountryArray["英"]=["イギリス","darkviolet"]
DispCountryArray["伊"]=["イタリア","olive"]
DispCountryArray["墺"]=["オーストリア","goldenrod"]
DispCountryArray["蘭"]=["オランダ","magenta"]
DispCountryArray["西"]=["スペイン","crimson"]
DispCountryArray["独"]=["ドイツ","darkred"]
DispCountryArray["土"]=["トルコ","orange"]
DispCountryArray["白"]=["ベルギー","mediumorchid"]
DispCountryArray["波"]=["ポーランド","orangered"]
DispCountryArray["葡"]=["ポルトガル","darkcyan"]
DispCountryArray["露"]=["ロシア","red"]
DispCountryArray["北欧"]=["北欧","slateblue"]
DispCountryArray["米"]=["アメリカ","maroon"]
DispCountryArray["瑞"]=["スイス","limegreen"]
DispCountryArray["洪"]=["ハンガリー","mediumturquoise"]
DispCountryArray["勃"]=["ブルガリア","lightseagreen"]
DispCountryArray["中東"]=["中東","burlywood"]
DispCountryArray["アフリカ"]=["アフリカ","tan"]
DispCountryArray["南米"]=["南米","purple"]

var matchTask = []
var matchRow = []


function Initialize() {

    createCheckBox()
    var selectCountryEuro = []

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
    createChronoTable(tasks,selectCountryEuro)


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
function createChronoTable(tasks,SelectCountry){
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
        createTDdata(table,dispdata,dispRow,dispCol,SelectCountry)

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
    if (StartYear < -400){
        return 1;
    }else if (StartYear < -300){
        return 2;

    }else if (StartYear < -200){
        return 3;

    }else if (StartYear < -100){
        return 4;

    }else if (StartYear < 0){
        return 5;
    }
    /*  BCは数値の比較　*/
    for (ii = 5; ii < yeartable.length;ii++){
        if (StartYear < Number(yeartable[ii])){
            return ii ;
        }
    }

}
function createTDdata(tableElm,dispData,tdRow,tdCol,SelectCountry){
    /* 表示対象かチェックする */
    if (dispData.AreaName =="欧米" && dispData.RelCountry != ""){
        if(SelectCountry.length > 0){
            let CountryArray = dispData.RelCountry.split(':')
            let matchFlag = false;
            for(rc of CountryArray){
                if(SelectCountry.includes(rc)){
                    matchFlag = true;
                    break;
                }
            }
            if (matchFlag == false){return}
        }
    }

    cellElm = tableElm.rows[tdRow].cells[tdCol]
    cellElm.setAttribute("class","tablecell")

    tmpst = cellElm.innerHTML
    if(tdRow < 5){
        tmpst = tmpst + dispData.TaskName + "<BR>"
        tableElm.rows[tdRow].cells[tdCol].innerHTML = tmpst
        return;

    }

    if (tmpst==""){
        
        var ulElm =document.createElement('ul');
        ulElm.setAttribute("class","tableul")
        for(let ii=0;ii<10;ii++){
            var li = document.createElement('li');
            ulElm.appendChild(li);
        }
        cellElm.appendChild(ulElm)
    }
    liCol = Number(String(dispData.StartYear).slice(-1))
    if (isNaN(liCol)){
        liCol = 0
    }
    var ulElm = cellElm.getElementsByClassName('tableul');
    let textspan = document.createElement('span');
    textspan.setAttribute("class","colortext")
   
    if (dispData.AreaName =="欧米"){
        var spanColor = ColorCheck(dispData)
        textspan.setAttribute("style","color:"+ spanColor + " ;")      
    }

    /* 同年に複数のイベントがあった場合はドロップダウンメニュー形式にする */
    liElm = ulElm[0].children[liCol]
    if (liElm.innerHTML != ""){
        
      /*  createSubMenu(liElm,dispData,tdRow,tdCol)*/
        // li cless 変更 //
        createDetail(liElm,dispData,tdRow,tdCol)
 

    } else {
        if(tdCol < 3){
            textspan.innerHTML= dispData.TaskName
            ulElm[0].children[liCol].appendChild(textspan)  
        }else{
            
            textspan.innerHTML =String(dispData.StartYear) + ":"+ dispData.TaskName
            ulElm[0].children[liCol].appendChild(textspan) 
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

    if (dispData.AreaName =="欧米"){
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

        if (dispData.AreaName =="欧米"){
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
                return "gray"
    }else{
        if (check in DispCountryArray){
            return DispCountryArray[check][1];
        } else {
            return "gray" ;
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
function selectItems(ItemNO){
    let checks = document.getElementsByName('checkDispCat');
    let tableElm =document.getElementById("hiddenCol")
    let colNo = ItemNO + 3
    if ( checks[ItemNO].checked === true ) {
        //非表示
        tableElm.children[colNo].setAttribute("style", "visibility:collapse")
        //tableElm.rows[0].cells[colNo].setAttribute("style", "visibility:collapse")
    } else {
        //表示
        tableElm.children[colNo].setAttribute("style", "visibility:visible")
//        tableElm.rows[0].cells[colNo].setAttribute("style", "visibility:visible")
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

function createCheckBox(summaryText,dispText,cId,changeFunc,dispArray){
    var checkCountry = document.getElementById("checktable")
    var cc = 0
    countrytable = document.createElement("table") 
    checkbox = ""
    for (let key in DispCountryArray) {  
        checkbox = checkbox + "<td  align='left'><input type='checkbox' name='checkboxCountry' " 
        checkbox = checkbox + "value='" +key+ "'>" 
        checkbox = checkbox + '<font size= "2" color="' + DispCountryArray[key][1] + '">' + DispCountryArray[key][0] + '</font></td>' 
        if (cc == 1){
            checkbox += "</tr><tr>"
            cc  = 0
        } else{
            cc += 1
        }
    }
    checkbox += "</tr></table></b>"
    countrytable.innerHTML = checkbox
    checkCountry.appendChild(countrytable)
}
function SelectCountry(){
    
    var checks = document.getElementsByName('checkboxCountry');
    
    let checkCountryArray = [];
    
    for ( i = 0; i <checks.length; i++) {
        if ( checks[i].checked === true ) {
            checkCountryArray.push(checks[i].value)                
        }
    }

    let table = document.getElementById("table") 
    let tablecell = document.getElementsByClassName("tablecell") 
    // 年以外のTDをすべてクリアして、再度作り直す //
    for(cell of tablecell){
        cell.innerHTML =""
    }
    createChronoTable(tasks,checkCountryArray)

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
    matchRow = []
    for (var i = 0;i < matchTask.length;i++){
        matchRow.push(CalcDispRow(matchTask[i].StartYear))
    }
    let distTd = table.rows[matchRow[0]].cells[0]

    window.scrollTo({ 
        top: distTd.offsetTop , 
        behavior: 'smooth' 
    });

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