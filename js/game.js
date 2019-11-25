var btnRestart = document.getElementById('restart');
var btnTips = document.getElementById('tips');
var textNums = document.getElementById('nums');
var btnSwitch = document.getElementById('switch');
var next = document.getElementById('next');
var textConfig = document.getElementById('config');
var result = document.getElementById('resList');
var nextRun = document.getElementById('nextRun');
/**
 * Fisher–Yates shuffle
 */
Array.prototype.shuffle = function() {
    var input = this;

    for (var i = input.length-1; i >=0; i--) {

        var randomIndex = Math.floor(Math.random()*(i+1));
        var itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

var cards =[];


nextRun.onclick = btnRestart.onclick = function(){
    if(cards.length<1)
    {
        for(var i=1;i<5;i++){
            for(var index=1; index<14; index++){
                cards.push(i*100+index);
            }
        }
        cards.shuffle();
        btnRestart.textContent ="Next";
    }
    else if(cards.length<5){
        btnRestart.textContent ="Start";
    }else{
        btnRestart.textContent ="Next";
    }

    next4cards();
}

var numbers = [];
btnTips.onclick = function () {
    while(result.hasChildNodes()){
        result.removeChild(result.firstChild);
    }

    if(numbers.length === 4){
        var res = calc24(numbers[0],numbers[1],numbers[2],numbers[3]);
        var len = res.length>5? 5: res.length;
        for(var index=0;index<len;index++){
            var li = document.createElement("li");
            var text = document.createTextNode(res[index]);
            li.appendChild(text);
            result.appendChild(li);
        }
    }
}

var isNormal = true;
btnSwitch.onclick = function () {
    if(!isNormal){
        textConfig.textContent= "NORMAL- J:11 Q:12 K:13";
        isNormal= true;
    }else{
        textConfig.textContent= "SIMPLE- J:2 Q:3 K:4";
        isNormal= false;
    }
}

function next4cards(){
    while(result.hasChildNodes()){
        result.removeChild(result.firstChild);
    }

    var numsDisplay = [];
    numbers = [];
    for(var j=0;j<4;j++)
    {
        var a = cards.pop()%100;
        var b = a;
        if(a===11){
            a='J';
            b=isNormal?11:2;
        }else if(a===12){
            a='Q';
            b=isNormal?12:3;
        }else if(a===13){
            a='K';
            b=isNormal?13:4;
        }
        numsDisplay.push(a);
        numbers.push(b);
    }

    textNums.textContent = numsDisplay.toString().replace(new RegExp(",",'g')," ");
}

//https://github.com/mumuy/calc24/blob/master/calc24.js
function calc24(){
	var expression = [].slice.call(arguments).sort();
	var operator = ['+','-','*','/'],result = [],hash = {};
	(function(expression){
		var len = expression.length;
		var group_str = expression.slice(0).sort().toString();
		if(!hash[group_str]){
			hash[group_str] = true;
			if(len>1){
				for(var i=0;i<len-1;i++){
					for(var j=i+1;j<len;j++){
						var sort_expression = expression.slice(0);
						var exp1 = sort_expression.splice(j,1)[0];
						var exp2 = sort_expression.splice(i,1)[0];
						for(var n=0;n<4;n++){
							var new_expression = sort_expression.slice(0);
							new_expression.splice(0,0,n>1||len==2?exp1+operator[n]+exp2:'('+exp1+operator[n]+exp2+')');
							arguments.callee(new_expression);
							if(exp1!=exp2&&n%2){
								new_expression.splice(0,1,n>1||len==2?exp2+operator[n]+exp1:'('+exp2+operator[n]+exp1+')');
								arguments.callee(new_expression);						
							}
						}
					}
				}
			}else if(Math.abs(eval(expression[0])-24)<1e-6){
				result.push(expression[0]);
			}
		}
    })(expression);
    //alert(result);
	return result;
}

