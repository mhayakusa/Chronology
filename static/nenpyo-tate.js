function loadCSV(targetFile) {

    // XMLHttpRequestの用意
    var request = new XMLHttpRequest();
    request.open("get", targetFile, false);
    request.send(null);
 
    // 読み込んだCSVデータ
    var csvData = request.responseText;
    return csvData

 }
 function mouseEventHandler(e){
    // マウス座標を取得
    const rect = e.target.getBoundingClientRect();

    // ブラウザ左上座標からのキャンバスまでのオフセットを引いてキャンバス上のXY座標を求める
    var relPosx = e.clientX - rect.left;
    var relPosy = e.clientY - rect.top;
    //var relPosx = e.pageX - rect.left;
    //var relPosy = e.pageY - rect.top;
    var absPosx = e.pageX
    var absPosy = e.pageY

    //console.log('x:'+relPosx+' y:'+relPosy+"width"+ ganttChart.getCatWidth());
    if (subChrono != undefined){
        
        subChrono.SetDisplay('none')
        delete this.subChrono
        
    }
//        var dCol = Math.floor((relPosx - this.CategoryWidth )/this.TaskWidth)
    var dCol = Math.floor((relPosx - ganttChart.CategoryWidth )/ganttChart.TaskWidth)
    var dRow = Math.floor((relPosy - ganttChart.HeaderHight )/ganttChart.TaskHight)

    //console.log("dRow= "+dRow+";dCol="+dCol);
    if ( relPosx >= 80){
        var subCanvas = document.getElementById('subCanvas');
        this.subChrono = new SubChrono(subCanvas)
        var tasknames =ganttChart.getTasksbyRow(dRow,dCol,tasks )
       
        if (tasknames == ""){
            return
        }
       // this.subChrono.clearRect(0,0,600,200)
        var dRowHeight = 15 
        this.subChrono.SetHeight(30 + dRowHeight * tasknames.length)
        for (var i = 0;i <tasknames.length;i++){
            var textPosy = 20 + i * dRowHeight
            this.subChrono.SetTexts(tasknames[i],  textPosy , 20,500,'bold 11px Times Roman')
        }
//        this.subChrono.SetPosition(absPosy,absPosx)
        dPosx =  ganttChart.CategoryWidth + 100 + (dCol * ganttChart.TaskWidth) 
        this.subChrono.SetPosition(absPosy,absPosx)
        
        this.subChrono.SetDisplay('block')
    }
    

}
 class SubChrono{
    constructor(subCanvas){
        this.subCanvas = subCanvas;
        this.subElement = subCanvas.getContext("2d");
        this.subCanvas.addEventListener('click', this.subEventHandler,false);
    }
    SetDisplay(mode){
        this.subCanvas.style.display=mode
    }
    SetPosition(top,left){
        var subCanvas = document.getElementById('DivsubCanvas');
        subCanvas.style.top=top + "px";
        subCanvas.style.left = left + "px";
    }
    SetHeight(height){
        var subCanvas = document.getElementById('subCanvas');
        subCanvas.height = height

    }

    SetTexts(text, top, left,maxWidth,font){
        //alert("settext"+text+"top"+String(top)+"left"+String(left)+"width"+maxWidth)
        this.subElement.fillStyle ="black"
        this.subElement.font = font
        this.subElement.fillText(text, left, top ,maxWidth);
        
    }
    clearRect(x,y,wi,he){
        this.subElement.clearRect(x,y,wi,he)
    }
    subEventHandler(e){
        subChrono.SetDisplay('none')
        delete this.subChrono

    }

 }

 class GanttChart{
    constructor(mainCanvas){
        this.myCanvas = mainCanvas;
        this.myCanvasWidth = mainCanvas.width
        this.myCanvasHeight = mainCanvas.height
        this.MainElement = mainCanvas.getContext("2d");
        this.MainElement.textBaseline = "top"
        this.ItemNameArray = ['年','日本','欧米','アジア','科学・芸術（日本)','科学・芸術（欧米)']
        this.ItemColorArray = ["silver","springgreen","skyblue","burlywood","palegreen","paleturquoise"]
        this.TaskWidth = 300; // タスク項目の幅
        this.CategoryWidth = 80; // 年代・将軍の幅
        this.ColsWidthArray = [this.CategoryWidth,this.TaskWidth,this.TaskWidth,this.TaskWidth,this.TaskWidth,this.TaskWidth] 
        this.RowforYears = {};
        this.TotalWidth = 0;  // 全体の幅
        this.YearTextSpan = 40;
        this.YearSpan = 25;
        this.xPos = 40; // タスクが追加されるときのX座標         
        this.yPos = 40; // タスクが追加されるときのY座標
        this.HeaderHight = 20;
        this.TaskHight = 11;      //１行の高さ Fontも11pxに   
     //   this.TaskHight = 10;         
        this.ManagerWidth = 0; // 担当者項目の幅
        this.PeriodWidth = 0; // 期間項目の幅
        this.ItemsWidth = this.CategoryWidth + this.TaskWidth + this.ManagerWidth + this.PeriodWidth; // 左側に表示される項目全体の幅（カテゴリ、タスク、担当者、期間の幅の合計）
        this.DspYearCount = 0; // 
        this.DsplayHeight = this.myCanvasHeight -this.HeaderHight
        this.RowCount =  Math.floor(this.DsplayHeight / this.TaskHight); 
        this.ColorIdx0 = 0
        this.ColorIdx1 = 0 
        this.Scale = 0
        this.firstyear = 1300
        this.lastyear = 1400
        this.dispCountrys = ""
        this.dispAsiaCountrys = ""
        this.RowTable = new Array(this.ItemNameArray.length -1)
        for (var i = 0; i < this.RowTable.length; i++) {
            this.RowTable[i] = new Array(this.RowCount);
        }
        this.myCanvas.addEventListener('click', mouseEventHandler,false);
        this.dispItemsCol = [0,1,2,3,4,5]
        this.seachString = ""
        this.matchTask = []
    }
    
    getCatWidth(){
        return this.CategoryWidth
    }
    getTasksbyRow(dRow,dCol,tasks){
        var indexString = String(this.RowTable[dCol][dRow])
        if (indexString == ""){
            return ""
        }
       // console.log("Rowtable="+indexString)
        var tIndexs = []
        if (indexString.includes(":")){
            tIndexs = indexString.split(":")
        }
        else {
            tIndexs.push(indexString)
        }
        var tNameArray = []
        for (var i=0;i<tIndexs.length;i++){
            if (isNaN(tIndexs[i])){
                return ""
            }
            var tidx = Number(tIndexs[i])
            //console.log("tasks"+tasks[tidx])
            var dpsSt = tasks[tidx].StartYear + " " + tasks[tidx].TaskName +" "+ tasks[tidx].RelCountry
            tNameArray.push( dpsSt)
        }
        return tNameArray
        
    }
    SetGanttChartFirstDay(firstYear){
        this.GanttChartFirstDay = firstYear;
        var firstday = this.GanttChartFirstDay.split("/")
        this.firstyear = Number(firstday[0])
        //this.GanttChartFirstDay = "1400/01/01"
        
    }
 
    SetGanttChartEndDay(endYear){
       this.GanttChartEndDay = endYear
       var lastday = this.GanttChartEndDay.split("/")
       this.lastyear = Number(lastday[0])
       // this.GanttChartEndDay = "2000/12/31";
    }
    SetScale(scaleval){
        this.Scale = scaleval
    }
    SetDispCountry(countrys){
        this.dispCountrys = countrys
        this.SetSchedules(tasks)      
    }
    SetDispAsiaCountry(countrys){
        this.dispAsiaCountrys = countrys
        this.SetSchedules(tasks)      
    }
    SetSearchStings(seaString,tasks){
        var subCanvas = document.getElementById('subCanvas');
        this.subChrono = new SubChrono(subCanvas)
        this.subChrono.clearRect(0,0,600,200)
        var dRowHeight = 15 

        this.seachString = seaString
        var mathcCount = 0
        this.matchTask = []
        tasks.forEach((task,index) => {
            
            var check = this.searchStringCheck(task)
            if (check != "NG"){
                    this.matchTask.push(task)                    
                    mathcCount++;
            }
    
        })
        this.subChrono.SetHeight(30 + dRowHeight *mathcCount)
        for (var i = 0;i <this.matchTask.length;i++){
            var textPosy = 20 + i * dRowHeight
            var dpsSt = this.matchTask[i].StartYear + " " + this.matchTask[i].TaskName +" "+ this.matchTask[i].RelCountry
            this.subChrono.SetTexts(dpsSt,  textPosy , 20,500,'bold 11px Times Roman')
        }
        
//        this.subChrono.SetPosition(absPosy,absPosx)
        var dPosx =  this.CategoryWidth + 100 + this.TaskWidth 
        this.subChrono.SetPosition(100, dPosx)
        this.subChrono.SetDisplay('block')

        this.MainElement.clearRect(0, 0, myCanvas.width, myCanvas.height)
        var firstday = this.matchTask[0].StartYear.split("/")
        var firstYear = Number(firstday[0])
        var NewfirstYear =  firstYear - this.YearSpan
        this.SetGanttChartFirstDay(String(NewfirstYear)+"/1/1")
        this.SetScale(scaleVal);
        this.DrawChart();
        this.SetSchedules(tasks);
    }
    scrollUp(){
        var firstday = this.GanttChartFirstDay.split("/")
        var firstYear = Number(firstday[0])
        var NewfirstYear =  firstYear - this.YearSpan
        this.SetGanttChartFirstDay(String(NewfirstYear)+"/1/1")
        this.DrawChart()
        this.SetSchedules(tasks)
        return NewfirstYear

    }
    scrollDown(){
        var firstday = this.GanttChartFirstDay.split("/")
        var firstYear = Number(firstday[0])
        var NewfirstYear =  firstYear + this.YearSpan
        this.SetGanttChartFirstDay(String(NewfirstYear)+"/1/1")
        this.DrawChart()
        this.SetSchedules(tasks)
        return NewfirstYear
    }
    
    DrawChart(){
        //年表の表示領域の計算と、表示する年代を決定する
        let yearCount =  this.RowCount * this.Scale;   
        var firstday = this.GanttChartFirstDay.split("/")
        var endYear = Number(firstday[0]) + yearCount
        this.SetGanttChartEndDay(String(endYear)+"/12/31")

        
        this.DrawItemsHeader();
        this.DrawYears();
        //this.MainElement.style.height = '400px';
        //this.MainElement.style.width = this.TotalWidth + 'px';
        //this.MainElement.style.border = '1px solid #cccccc';
    }
    DrawItemsHeader(){
        let left = 0;
        this.MainElement.textBaseline = "top"
        
        this.MainElement.textAlign = "center";
        this.MainElement.font = 'bold 11px Times Roman';
//        this.MainElement.fillStyle = this.ItemColorArray[0]
//        this.MainElement.fillRect(left,0, this.ColsWidthArray[0], this.HeaderHight)
//        this.MainElement.fillStyle ="black"
//        this.MainElement.fillText(this.ItemNameArray[0], left,0)
        
        for(let i=0; i< this.dispItemsCol.length; i++){
            var dispCol = this.dispItemsCol[i]
            this.MainElement.fillStyle = this.ItemColorArray[dispCol]
            this.MainElement.fillRect(left,0, this.ColsWidthArray[dispCol], this.HeaderHight)
            this.MainElement.fillStyle ="black"
            this.MainElement.fillText(this.ItemNameArray[dispCol], left + this.ColsWidthArray[i]/2,4);
            left += this.ColsWidthArray[i] ;
        }
    }
   
    DrawYears(){
        let yearCount = this.lastyear - this.firstyear + 1; 
        var firstyear = this.firstyear
        this.MainElement.font = 'bold 11px Times Roman';
        this.MainElement.textAlign = "left";

        //　年を１年ずつ表示するとビジーなので間引いて表示する
        this.YearTextSpan = 40;
        this.YearSpan = 25;        
        let totalWidth =  (yearCount /this.YearSpan) * this.YearTextSpan
        
        if (this.Scale == 1 ){
            this.YearSpan = 10 //10年毎に表示する
            this.YearTextSpan = this.YearSpan * this.TaskHight;
        } else if (this.Scale == 2){
            this.YearSpan = 20;
            this.YearTextSpan = this.YearSpan /2 * this.TaskHight;
        } else{
            this.YearSpan = 50;
            this.YearTextSpan = this.YearSpan /this.Scale * this.TaskHight;
        }

//        let firstDispRow = (firstyear) =>{if (firstyear % 10 == 0){return 0}else{return 10 - firstyear % 10}}
        let j = 0
        for(let i=0; i< yearCount; i+=this.YearSpan){
            let textyear = String(i + firstyear);

            let ypos = this.HeaderHight + (this.YearTextSpan + 1)* j
            j ++;
            //console.log("text:"+textyear+" left:"+left)
            
            this.MainElement.fillText(textyear, 0, ypos );
        }
        // すべての日を表示しおわったときに全体の幅が決まる
        this.TotalWidth = this.HeaderHight + (this.YearTextSpan + 1)* yearCount - 1;
    }
    SetSchedules(tasks){
        var barKbn = 0
        var dCol = 0
        let countryArray = ["ローマ","仏","英","独","西","蘭","葡","フランク王国","露","アジア","米","洪"]
        let colorArray = ["mediumblue","darkgreen","crimson","darkcyan","darkorange","chocolate","limegreen","orangered","dimgray","magenta","darkgreen","deeppink","purple"]
        let colorArray2 = ["skyblue","green","tomato","cyan","gold","pink","lime"]

        for (var i = 0; i < this.RowTable.length; i++) {
            this.RowTable[i].fill("")
        }
        tasks.forEach((task,index) => {
            
            if (task.Dsplevel == '1') {
                if (task.Syubetu == '1' && task.AreaName == "日本") {
                    // 年代バーの表示
                    var xPos = 40
                    barKbn = 1
                    var dspText = task.TaskName
                    
                }else if (task.Syubetu == '2' && task.AreaName == "日本") {
                    return
                    // 天皇か年代の詳細区分の表示の予定
                    var xPos = 15
                    barKbn = 1
                    var dspText = task.TaskName
                }else if (task.Syubetu == '3' && task.AreaName == "日本") {
                    //将軍バーの表示
                    var xPos = 60
                    barKbn = 1
                    var dspText = task.TaskName
                }else{  
                    if (this.Scale >= 5 && task.Syubetu == '5'){
                        //スケールが5以上の場合は、重要項目だけ表示する　Syubetu <=5 は表示をスキップ
                        return
                    }
                    task.setTaskColor('black')
                    if (task.AreaName == "日本"){
                        if ( task.DataKbn == 2){
                            //　芸術文化項目の表示
                            dCol = 3
                        }else{
                            //通常事象の表示
                            
                            dCol = 0
                        }
                    } else if (task.AreaName == "欧米"){
                        for (let i = 0 ; i < countryArray.length ; i++){
                              // データの関連国がセレクターで選択した表示国にふくまれるかチェック
                                if (task.RelCountry.includes(countryArray[i])){
                                    task.setTaskColor(colorArray[i])
                                    break;
                                }
                        }
                        if ( task.DataKbn == 2){
                            //　芸術文化項目の表示
                           dCol = 4
                        }else{
                           dCol = 1
                        }
                    } else { //アジア
                        
                        dCol = 2
                    }
                    //console.log(this.dispItemsCol)
                    if (this.dispItemsCol.includes(Number(dCol+1))  ){

                    var relDispCol = this.dispItemsCol.indexOf(dCol + 1)
                    
                   
                    relDispCol -=1
                    if (relDispCol < 0 ){
                        return;
                    }
                    } else {
                        console.log("not include")
                        return;
                    }

                    barKbn = 2
                    var xPos = this.CategoryWidth + this.TaskWidth *relDispCol + 2
                }
                if (barKbn == 1 && task.ColorIndex ==""){
                    this.ColorIdx0 ++
                    let colindex = this.ColorIdx0 % 7
                    task.setTaskColor(colorArray2[colindex])
                    
                }
                this.calcDspRow(task,index,barKbn) // タスクの年から表示する列を計算する
                if (task.dispRow < 0){return}
                this.DspName(task,index,xPos,relDispCol,barKbn)
            }
        });
    }
    searchItem(tasks,Item){

        for (var i = 0; i < this.RowTable.length; i++) {
            this.RowTable[i].fill("")
        }

        tasks.forEach((task,index) => {
            
            if (task.Dsplevel == '1') {
                if (task.Syubetu == '1' && task.AreaName == "日本") {
                    // 年代バーの表示
                    var xPos = 40
                    barKbn = 1
                    var dspText = task.TaskName
                    
                }else if (task.Syubetu == '2' && task.AreaName == "日本") {
                    return
                    // 天皇か年代の詳細区分の表示の予定
                    var xPos = 15
                    barKbn = 1
                    var dspText = task.TaskName
                }else if (task.Syubetu == '3' && task.AreaName == "日本") {
                    //将軍バーの表示
                    var xPos = 60
                    barKbn = 1
                    var dspText = task.TaskName
                }else{  
                    if (this.Scale >= 5 && task.Syubetu == '5'){
                        //スケールが5以上の場合は、重要項目だけ表示する　Syubetu <=5 は表示をスキップ
                        return
                    }
                    task.setTaskColor('black')
                    if (task.AreaName == "日本"){
                        if ( task.DataKbn == 2){
                            //　芸術文化項目の表示
                            dCol = 3
                        }else{
                            //通常事象の表示
                            
                            dCol = 0
                        }
                    } else if (task.AreaName == "欧米"){
                        for (let i = 0 ; i < countryArray.length ; i++){
                              // データの関連国がセレクターで選択した表示国にふくまれるかチェック
                                if (task.RelCountry.includes(countryArray[i])){
                                    task.setTaskColor(colorArray[i])
                                    break;
                                }
                        }
                        if ( task.DataKbn == 2){
                            //　芸術文化項目の表示
                           dCol = 4
                        }else{
                           dCol = 1
                        }
                    } else { //アジア
                        
                        dCol = 2
                    }
                    //console.log(this.dispItemsCol)
                    if (this.dispItemsCol.includes(Number(dCol+1))  ){

                    var relDispCol = this.dispItemsCol.indexOf(dCol + 1)
                    
                   
                    relDispCol -=1
                    if (relDispCol < 0 ){
                        return;
                    }
                    } else {
                        console.log("not include")
                        return;
                    }

                    barKbn = 2
                    var xPos = this.CategoryWidth + this.TaskWidth *relDispCol + 2
                }
                if (barKbn == 1 && task.ColorIndex ==""){
                    this.ColorIdx0 ++
                    let colindex = this.ColorIdx0 % 7
                    task.setTaskColor(colorArray2[colindex])
                    
                }
                this.calcDspRow(task,index,barKbn) // タスクの年から表示する列を計算する
                if (task.dispRow < 0){return}
                this.DspName(task,index,xPos,relDispCol,barKbn)
            }
        });

        var firstday = this.GanttChartFirstDay.split("/")
        var firstYear = Number(firstday[0])
        var NewfirstYear =  firstYear + this.YearSpan
        this.SetGanttChartFirstDay(String(NewfirstYear)+"/1/1")
        this.DrawChart()
        this.SetSchedules(tasks)
        return NewfirstYear
    }

    ZeroPadding(num,length){
        return ('0000000000' + num).slice(-length);
    }
    calcDspRow(task,index,barKbn){
        
        let startyear = 0
        let endyear = 0
        task.dispRow = -1
        task.dispEndRow = -1

        if (isNaN(task.StartYear)) {
            return
        }
        startyear = Number(task.StartYear)

        if (isNaN(task.EndYear)){
            endyear = startyear
        } else{
            endyear = Number(task.EndYear)
        }
        /*if (this.seachString != "") {
            var check = this.searchStringCheck(task)
            if (check == "NG"){
                return;
            }
        }*/
        if (task.AreaName =="欧米"){
            var check = this.relCountryCheck(this.dispCountrys,task.RelCountry)
            if (check == "NG"){
                return;
            }
            if (check =="ALL"){
                task.setTaskColor("black")
            }else if (check =="NON"){
                task.setTaskColor("gray")
            }else{
                if (check in DispCountryArray){
                    task.setTaskColor(DispCountryArray[check][1])
                } else {
                    task.setTaskColor("gray")
                }
            }
        } else if (task.AreaName =="アジア"){
            var check = this.relCountryCheck(this.dispAsiaCountrys,task.RelCountry)
            if (check == "NG"){
                return;
            }
            if (check =="ALL"){
                task.setTaskColor("black")
            }else if (check =="NON"){
                task.setTaskColor("gray")
            }else{
                //console.log("check="+check+"this"+DispAsiaCountryArray)
                if (check in DispAsiaCountryArray){
                    task.setTaskColor(DispAsiaCountryArray[check][1])
                } else {
                    task.setTaskColor("gray")
                }
    
            }
        }
        
        if (barKbn == 1){
            if (endyear < this.firstyear){
                return
            }
            if( startyear > this.lastyear){
                return
            }
            if (startyear < this.firstyear){
                task.dispRow = 0
            } else {
                task.dispRow = Math.floor( (startyear - this.firstyear) / this.Scale)
            }
            if (endyear > this.lastyear){
                task.dispEndRow = Math.floor((this.lastyear - this.firstyear) / this.Scale)
            } else {
                task.dispEndRow = Math.floor((endyear - this.firstyear) / this.Scale)
            }

        } else{

            if (startyear < this.firstyear){
                return;           

            }else if (startyear > this.lastyear){
                return;
            }
            task.dispRow = Math.floor( (startyear - this.firstyear) / this.Scale)
            
        }
    }
    relCountryCheck(dispCountrys,RelCountry )  {
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
        //dispArray.forEach(element => {
           
        //    if (RelCountry.includes(element)== true ){
        //        console.log("dispCountry check:"+ element + "rel:"+RelCountry+"="+RelCountry.includes(element))
        //        return true;
        //    }
        //})
        //console.log("dispCountry check:")
        return "NG";        
    }
    searchStringCheck(task)  {
        
        var strings = []
        if (task.TaskName == ""){
            return "NG";
        }
        if (this.seachString.includes(":")){
            strings =this.seachString.split(":")
        }else{
            strings[0] = this.seachString
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
    Tategaki(ctx,posX,posY,text,font){
        ctx.font = font
        ctx.fillStyle ="black"
        var mesure = ctx.measureText('あ')
        var width = mesure.width
        ctx.textAlign = "center";
        var startX = posX + width /2
        //var yy = posY + width  //文字のベースの位置になるので文字の高さ分足しておく
        var yy = posY
        // 通常のfor文で行う
       // console.log("tategaki"+startX+":"+yy+"width"+width)
        
        for (var i = 0; i < text.length; i++) {
            this.MainElement.fillText(text[i], startX, yy );
            yy = yy + width + 2 
        }
    }
    DspName(task,index, xPos,dCol, kbn){
        var left = xPos;
        var width = 20;
        let color = task.ColorIndex
        this.MainElement.textBaseline = "top"

        
        let top = this.HeaderHight + task.dispRow *  this.TaskHight
        let endpos = this.HeaderHight + task.dispEndRow *  this.TaskHight
        var height = endpos - top
        //console.log(title + "--"+ startYear+"～"+endYear+": task pos("+left+","+top+")["+width+"]")

        if (kbn == 2){
            if (this.RowTable[dCol][task.dispRow] != ""){
                //console.log("RowTabl:"+dCol+"row"+task.dispRow+"="+this.RowTable[dCol][task.dispRow])
                this.MainElement.clearRect(left,top, this.TaskWidth , this.TaskHight)
                this.RowTable[dCol][task.dispRow] = this.RowTable[dCol][task.dispRow] + ":" + index
                var title = "▼" +task.StartYear+ " " + task.TaskName
                this.MainElement.font = 'normal 11px Arial'

            } else {
                this.RowTable[dCol][task.dispRow] = index
                var title = task.StartYear + " " + task.TaskName
                this.MainElement.font = 'bold 11px Times Roman'
            }
            
        } else{
            var title = task.TaskName
        }
        if (kbn==1){
            
            this.MainElement.fillStyle = color
            this.MainElement.beginPath();
            this.MainElement.moveTo(left,top);
            this.MainElement.lineTo(left+ width,top);
            this.MainElement.lineTo(left+width,endpos);
            this.MainElement.lineTo(left,endpos);
            this.MainElement.closePath();
            this.MainElement.fill();
        
            let titleTop = top + 2
            let titleLeft = left +2
    //        this.MainElement.fillStyle ="#33ff33"
            this.MainElement.textAlign = "left";
            this.MainElement.fillStyle =color
            this.Tategaki(this.MainElement,titleLeft,titleTop,title,'bold 11px Times Roman')
        } else {
            var dspText = title
            this.MainElement.textAlign = "left";
            this.MainElement.fillStyle =color

            this.MainElement.fillText(dspText, left, top ,this.TaskWidth);
            
        }

    }
    DrawBand(startYear, endYear, xPos, title,kbn,color){
        var lastday = this.GanttChartEndDay.split("/")
        var firstday = this.GanttChartFirstDay.split("/")
        let firstyear = Number(firstday[0])
        let lastyear = Number(lastday[0])
        let startyear = 0
        let endyear = 0
   
        //let newElement1 = document.createElement('div');
        if (endyear <= firstyear){
            return;
        }else if (startyear < firstyear){
                startyear = firstyear            

        }else if (startyear > lastyear){
            return;
        }
        var top = this.HeaderHight ;
        var left = xPos;
        var width = 20;
        
        top = this.HeaderHight + (startyear - firstyear) / this.YearSpan * this.YearTextSpan
        let endpos = this.HeaderHight + (endyear - firstyear) / this.YearSpan * this.YearTextSpan
        var height = endpos - top
        //console.log(title + "--"+ startYear+"～"+endYear+": task pos("+left+","+top+")["+width+"]")

        if (kbn==1){
            
            this.MainElement.fillStyle = color
            this.MainElement.beginPath();
            this.MainElement.moveTo(left,top);
            this.MainElement.lineTo(left+ width,top);
            this.MainElement.lineTo(left+width,top+ height);
            this.MainElement.lineTo(left,top+height);
            this.MainElement.closePath();
            this.MainElement.fill();
        
            let titleTop = top + 2
            let titleLeft = left +2
    //        this.MainElement.fillStyle ="#33ff33"
            this.MainElement.textAlign = "left";
            this.MainElement.fillStyle =color
            this.Tategaki(this.MainElement,titleLeft,titleTop,title,'bold 11px Times Roman')
        } else {
            var dspText = title
            this.MainElement.textAlign = "left";
            this.MainElement.fillStyle =color
            this.MainElement.fillText(dspText, left, top ,this.TaskWidth);
        }

    }
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