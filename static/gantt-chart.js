function loadCSV(targetFile) {

    // XMLHttpRequestの用意
    var request = new XMLHttpRequest();
    request.open("get", targetFile, false);
    request.send(null);
 
    // 読み込んだCSVデータ
    var csvData = request.responseText;
    return csvData

 }
class GanttChart{
    constructor(mainElement){
        this.MainElement = mainElement;
        this.DayElements = []; // 「日」の要素
        this.TotalWidth = 0;  // 全体の幅
        this.DayWidth = 50; // 「日」の幅
        this.YearTextSpan = 40;
        this.YearSpan = 25;
         
        this.yPos = 40; // タスクが追加されるときのY座標
        this.CategoryWidth = 10; // カテゴリ項目の幅
        this.TaskWidth = 5; // タスク項目の幅
        this.ManagerWidth = 0; // 担当者項目の幅
        this.PeriodWidth = 0; // 期間項目の幅
        this.ItemsWidth = this.CategoryWidth + this.TaskWidth + this.ManagerWidth + this.PeriodWidth; // 左側に表示される項目全体の幅（カテゴリ、タスク、担当者、期間の幅の合計）
        this.DayCount = 0; // 何日分表示させるか
    }
    SetGanttChartFirstDay(firstYear){
        this.GanttChartFirstDay = firstYear;
        //this.GanttChartFirstDay = "1400/01/01"
        
    }
 
    SetGanttChartEndDay(endYear){
       this.GanttChartEndDay = endYear
       // this.GanttChartEndDay = "2000/12/31";
    }
    DrawChart(){
        //this.MainElement.style.position = 'relative';
        var endday = this.GanttChartEndDay.split("/")
        var firstday = this.GanttChartFirstDay.split("/")
        let yearCount = Number(endday[0]) - Number(firstday[0]) + 1;
        this.YearTextSpan = 40;
        this.YearSpan = 25;
        let charWidth = 10; // 10px で記事を表示するので、これを元に幅を計算
        let totalWidth =  (yearCount /this.YearSpan) * this.YearTextSpan
        let netWidth = yearCount * charWidth
        if (netWidth < 1100){
            this.YearSpan = 10
            this.YearTextSpan = this.YearSpan * charWidth;
        } else if (netWidth < 2000){
            this.YearSpan = 20;
            this.YearTextSpan = this.YearSpan /2 * charWidth;
        } else{
            if (totalWidth < 300){
                this.YearTextSpan = 150;
            } else if (totalWidth < 500){
                this.YearTextSpan = 80;
            }else if (totalWidth < 750){
                this.YearTextSpan = 60;
            }
        }
        this.DrawItemsHeader();
        this.DrawDays();
        //this.MainElement.style.height = '400px';
        //this.MainElement.style.width = this.TotalWidth + 'px';
        //this.MainElement.style.border = '1px solid #cccccc';
    }
    DrawItemsHeader(){
        let widths =[this.CategoryWidth, this.TaskWidth, this.ManagerWidth, this.PeriodWidth];
        let texts =['カテゴリ'];
        let left = 0;
        this.MainElement.font = 'bold 9px Times Roman';
        for(let i=0; i<1; i++){
            this.MainElement.fillText(texts[i], left, 40 , widths[i]);
            left += widths[i];
        }
    }
    
    MoveTextCellCenter(element){
        let innerElement = document.createElement('div');
        innerElement.innerHTML = element.innerHTML; // element.innerHTMLを入れ替える
        innerElement.style.width = element.style.width;
        innerElement.style.height = element.style.height;
        innerElement.style.fontSize = element.style.fontSize;
        innerElement.style.display = "table-cell";
        innerElement.style.textAlign = "center";
        innerElement.style.verticalAlign = "middle";
        element.innerHTML = '';
        element.appendChild(innerElement);
    }
    DrawDays(){
        var endday = this.GanttChartEndDay.split("/")
        var firstday = this.GanttChartFirstDay.split("/")
        let yearCount = Number(endday[0]) - Number(firstday[0]) + 1; 
        var firstyear = Number(firstday[0]);
        this.MainElement.font = 'bold 10px Times Roman';
        
        let j = 0
        for(let i=0; i< yearCount; i+=this.YearSpan){
 
            let textyear = String(i + firstyear);

            let left = this.ItemsWidth + (this.YearTextSpan + 1)* j
            j ++;
            //console.log("text:"+textyear+" left:"+left)
            
            this.MainElement.fillText(textyear, left, 10 );
        }
        // すべての日を表示しおわったときに全体の幅が決まる
        this.TotalWidth = this.ItemsWidth + (this.YearTextSpan + 1)* yearCount - 1;
    }
    SetSchedules(tasks){
        //tasks = this.GroupBy(tasks);
        let prevCategoryName = '';
        var barKbn = 0
        tasks.forEach(task => {
            if (task.Syubetu == '1') {
                var yPos = 40
                barKbn = 1
                var dspText = task.TaskName
                
            }else if (task.Syubetu == '2') {
                var yPos = 65
                barKbn = 1
                var dspText = task.TaskName
            }else if (task.Syubetu == '3') {
                var yPos = 90
                barKbn = 1
                var dspText = task.TaskName
            }else{
                var yPos = 120
                barKbn = 2
                var dspText = task.StartYear + " " + task.TaskName
            }
            
            this.DrawBand(task.StartYear,task.EndYear,yPos,dspText,barKbn)
            
        });
    }
    GroupBy(tasks){
        const groupBy = (array, getKey) =>
            array.reduce((obj, cur, idx, src) => {
                const key = getKey(cur, idx, src);
                (obj[key] || (obj[key] = [])).push(cur);
                return obj;
            }, {});
 
        const groups = groupBy(tasks, task => task.CategoryName);
        const result = Object.entries(groups)
            .map(([CategoryName, list]) => ({
                CategoryName,
                list,
            }));
 
        let ret = [];
        for(let i=0; i<result.length; i++){
            for(let j=0; j<result[i].list.length; j++)
                ret.push(result[i].list[j]);
        }
        return ret;
    }
    SetSchedule(task){
        // startDay、endDayを「2021 / 01 / 01」のような形で表わす
        // ZeroPadding関数はゼロ埋めのための関数
        let startDayText = task.startYear;
        let endDayText = endDay;
 
        // 各項目の文字列と幅をそれぞれ配列に格納してSetTexts関数に渡す
        let widths =[this.CategoryWidth, this.TaskWidth, this.ManagerWidth, this.PeriodWidth];
        let texts =[categoryName, taskName, managerName, startDayText + '<br>' + endDayText];
 
        // 項目を描画する。戻り値は追加された要素の高さ
        let newElementMaxHeight = this.SetTexts(texts, widths, yPos);
 
        // バーを描画する
        this.DrawBand(startDay, endDay, yPos, newElementMaxHeight,1);
 
        // 次の項目を描画するときのY座標を返す
        return yPos + newElementMaxHeight;
    }
    ZeroPadding(num,length){
        return ('0000000000' + num).slice(-length);
    }
    SetTexts(texts, widths, yPos){
        let left = 0;
        let newElements = [];
 
        // ここで要素が4つ追加されるがそのなかで一番高さが高いものを記憶しておく
        let newElementMaxHeight = 0;
 
        for(let i=0; i<4; i++){
            let innerHTML = texts[i];
            let width = (widths[i]);
            let top = yPos;
            
            this.MainElement.fillText(innerHTML, left, top ,this.DayWidth);

            newElementMaxHeight = 40;
            left += widths[i];
        }
 
        // 実際に描画するときは一番高いものに20を追加した高さでそろえる
        newElementMaxHeight += 20;
 
        for(let i=0; i<newElements.length; i++){
            let newElement = newElements[i];
 
            // 高さはnewElementMaxHeightにする
           // newElement.style.height = newElementMaxHeight + 'px';
 
            // 文字列を中央（Y方向だけ）にする
           // this.MoveTextCellMiddle(newElement);
 
            // 各要素の境界線も描画する
           // newElement.style.borderRight = "solid 1px";
           // newElement.style.borderRightColor = '#cccccc';
 
           // if(i!= 0 || texts[0] != ''){
            //    newElement.style.borderTop = "solid 1px";
             //   newElement.style.borderTopColor = '#cccccc';
           // }
        }
        // 追加された要素の高さを返す
        return newElementMaxHeight;
    }
    Tategaki(ctx,posX,posY,text,font){
        ctx.font = font
        ctx.fillStyle ="black"
        var mesure = ctx.measureText('あ')
        var width = mesure.width
        ctx.textAlign = "center";
        var startX = posX + width /2
        var yy = posY
        // 通常のfor文で行う
        console.log("tategaki"+startX+":"+yy+"width"+width)
        
        for (var i = 0; i < text.length; i++) {
            this.MainElement.fillText(text[i], startX, yy );
            yy = yy + width + 2 
        }
    }
    MoveTextCellMiddle(element){
        let innerElement = document.createElement('div');
        innerElement.innerHTML = element.innerHTML;
        innerElement.style.width = element.style.width;
        innerElement.style.height = element.style.height;
        innerElement.style.fontSize = element.style.fontSize;
        innerElement.style.display = "table-cell";
        innerElement.style.verticalAlign = "middle";
        innerElement.style.paddingLeft = 5 + 'px';
        innerElement.style.paddingRight = 5 + 'px';
        element.innerHTML = '';
        element.appendChild(innerElement);
    }
    DrawBand(startYear, endYear, yPos, title,kbn){

        var lastday = this.GanttChartEndDay.split("/")
        var firstday = this.GanttChartFirstDay.split("/")
        let firstyear = Number(firstday[0])
        let lastyear = Number(lastday[0])
        let startyear = 0
        let endyear = 0
        let colorArray = ["blue","green","tomato","darkcyan","skyblue","pink","gold"]

        if (isNaN(startYear)) {
            return
        }
        startyear = Number(startYear)
        if (isNaN(endYear)){
            endyear = startyear
        } else{
            endyear = Number(endYear)
        }
        let yearCount = endyear - startyear + 1 
//        console.log("startyear"+startyear)
 
        //let newElement1 = document.createElement('div');
        if (endyear <= firstyear){
            return;
        }else if (startyear < firstyear){
                startyear = firstyear            

        }else if (startyear > lastyear){
            return;
        }
        var top = yPos ;
        var left = this.ItemsWidth;
        var height = 20;
        
        left = this.ItemsWidth + (startyear - firstyear) / this.YearSpan * this.YearTextSpan
        let endpos = this.ItemsWidth + (endyear - firstyear) / this.YearSpan * this.YearTextSpan
        var width = endpos - left
        //console.log(title + "--"+ startYear+"～"+endYear+": task pos("+left+","+top+")["+width+"]")

        if (kbn==1){
            let colindex = (startyear%100) % 7
            this.MainElement.fillStyle = colorArray[colindex]
            this.MainElement.beginPath();
            this.MainElement.moveTo(left,top);
            this.MainElement.lineTo(left+ width,top);
            this.MainElement.lineTo(left+width,top+ height);
            this.MainElement.lineTo(left,top+height);
            this.MainElement.closePath();
            this.MainElement.fill();
        
            let titleTop = top + height /2
            let titleLeft = left 
    //        this.MainElement.fillStyle ="#33ff33"
            this.MainElement.textAlign = "left";
            this.MainElement.fillStyle ="black"
            this.MainElement.font = 'bold 10px Times Roman';
            this.MainElement.fillText(title, titleLeft, titleTop );
        } else {
            var dspText = title
            this.MainElement.fillStyle ="black"
            this.Tategaki(this.MainElement,left,top,dspText,'bold 9px Times Roman')
        }

    }
}
class Task {
    constructor(taskName, areaName, syubetu, startYear, startMonth,endYear,endMonth){
        this.AreaName = areaName;
        this.TaskName = taskName;
        this.Syubetu = syubetu;
        this.StartYear = startYear;
        this.StartMonth = startMonth;
        this.EndYear = endYear;
        this.EndMonth = endMonth;
 
    }
}