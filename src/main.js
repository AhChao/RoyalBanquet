var cardHeight = 200;
var cardWidth = 150;
var spacing = 20;
var textSpacing = 20;
var cardCornerRadius = 5;
var basicX = spacing;
var basicY = spacing;
var deck = JSON.parse(JSON.stringify(basicDeck));
var cardInPile = [];
var cardInDeck = [];
var cardInField = [];
var firstCardIn = false;//第一張牌入場
var pileCardSelected = false;
var nowSelectedCard = [];
var nowSelectedCardNo = -1;
var turnTo = 1;//turnToPlayerWho
var coinCount = [0];//Players' Coin, could be many player
var p1BadReputation = 0;
var mode="stageMode";// stageMode,randomMode,pkMode
var nowStage = 1;

function setUp()
{
	if(mode=="randomMode")
	{
		deck = JSON.parse(JSON.stringify(generateRandomDeck()));
	}
	else if(mode=="stageMode")
	{
		var stageName = "stage"+nowStage;
		deck = stageSet[stageName]["stageDeck"];
		document.getElementById("stageTargetText").innerText = stageSet[stageName]["stageTarget"];
	}
	init();
}

function stageSelectByOption()
{
	var stageName = document.getElementById("stageSelect").value;
	nowStage = stageName.slice(5);
	deck = stageSet[stageName]["stageDeck"];
	document.getElementById("stageTargetText").innerText = stageSet[stageName]["stageTarget"];
	init();
}

function stageClear()
{
	d3.select("#basicSVG").append("image")
	.attr({
		    'x': 100,
		    'y': 300,
		    'width': 660,
		    'id':"successPNG",
		    'href':"./src/pattern/successImg.png",
		    'onclick':"toNextStage()",
		    });
}
function toNextStage()
{
	nowStage++;  
    var stageName = "stage"+nowStage;
    deck = stageSet[stageName]["stageDeck"];
	document.getElementById("stageTargetText").innerText = stageSet[stageName]["stageTarget"];
	init();
}
function restartStage()
{  
    var stageName = "stage"+nowStage;
    deck = stageSet[stageName]["stageDeck"];
	document.getElementById("stageTargetText").innerText = stageSet[stageName]["stageTarget"];
	init();
}

function init()
{
	if(mode=="stageMode")
		document.getElementById("gameTitle").innerText = "RoyalBanquet"+" - stage"+nowStage;

	firstCardIn = false;
	cardInPile = [];
	cardInDeck = [];
	cardInField = [];
	pileCardSelected = false;
	nowSelectedCard = [];
	coinCount = [0];
	nowSelectedCardNo = -1;
	turnTo = 1;
	p1BadReputation = 0;

	cardInDeck = JSON.parse(JSON.stringify(deck));
	for(var i=0;i<5;i++)
	{
		drawACard();
	}
	initScene();
	updatePileShow();
}

function initScene()
{	
	d3.select("#basicSVG").remove();
	d3.select("#pileSVG").remove();
	d3.select("#divForBasicSVG").append("svg")
	.attr({
	    'height': cardHeight*5 + spacing*6 ,
	    'width': cardWidth*5 + spacing*6,
	    'id':'basicSVG',
	    });
	d3.select("#basicSVG").append("rect")
	.attr({
	    'height': cardHeight*5 + spacing*6 ,
	    'width': cardWidth*5 + spacing*6,
	    'stroke':'black',
	    'stroke-width':'5',
	    'fill':'None',
	    'id':'basicSVGBG',
	    });
	d3.select("#basicSVG").append("defs")
	.append("pattern").attr('id',"bgPattern").attr('patternUnits','userSpaceOnUse').attr('width','2000').attr('height','1200')
	.append("image")
	.attr({
	    'height': 1200 ,
	    'width': 2000,
	    'x':-600,
	    'y':0,
	    'href': "./img/banquetBackground.jpg",
	    'stroke':'black',
	    'stroke-width':'5',
	    'fill':'None',
	    'id':'basicSVGBGPic',
	    });
	d3.select("#basicSVGBG").attr('fill','url(#bgPattern)');
	/*d3.select("#basicSVG").append("image")
	.attr({
	    'height': cardHeight*5 + spacing*6 ,
	    'width': cardWidth*5 + spacing*6,
	    'x':0,
	    'y':0,
	    'href': "./img/banquetBackground.jpg",
	    'stroke':'black',
	    'stroke-width':'5',
	    'fill':'None',
	    'id':'basicSVGBGPic',
	    });*/
	d3.select("#divForPileSVG").append("svg")
	.attr({
	    'height': cardHeight*5 + spacing*6 ,
	    'width': cardWidth*1 + spacing*2,
	    'id':'pileSVG',
	    });
	d3.select("#pileSVG").append("rect")
	.attr({
	    'height': cardHeight*5 + spacing*6 ,
	    'width': cardWidth*1 + spacing*2,
	    'stroke':'black',
	    'stroke-width':'5',
	    'fill':'None',
	    'id':'pileSVGBG',
	    });
	for(var i=0;i<25;i++)//空白牌位
	{
		d3.select("#basicSVG").append("g").attr('id','G'+i).append("rect")
		.attr({
		    'width': cardWidth,
		    'height': cardHeight,
		    'x': cardWidth*(i%5)+spacing*(i%5+1),
		    'y': cardHeight*parseInt((i/5))+spacing*parseInt((i/5+1)),
		    'cx':cardCornerRadius,
		    'cy':cardCornerRadius,
		    'stroke':'black',
		    'stroke-width':'5px',
		    'fill':'white',
		    'id':"BG"+i,
		    'opacity':"0.5",
		    'onclick':"selectCard(this.id)",
		    });
	}	
	d3.select("#P1HP1").attr("fill","red");
	d3.select("#P1HP2").attr("fill","red");
	d3.select("#P1HP3").attr("fill","red");
}

function clearSelect()
{
	d3.select("#cardSelectStroke").remove();
}

function selectCard(id)
{	
	var theCard = d3.select("#"+id);
	var strokeX = theCard.attr("x")-0.5*spacing;
	var strokeY = theCard.attr("y")-0.5*spacing;
	var strokeWidth = theCard.attr("width")*1+spacing*1;
	var strokeHeight = theCard.attr("height")*1+spacing*1;

	for(var i=0;i<cardInPile.length;i++)
	{
		if(cardInPile[i][0]+"BG"==id)
		{
			nowSelectedCard = cardInPile[i];
			nowSelectedCardNo = i;
		}
	}
	
	//console.log(strokeX,strokeY,strokeWidth,strokeHeight);
	if(theCard.node().parentNode.parentNode.id=="pileSVG")
	{
		pileCardSelected = true;
		if(d3.select("#cardSelectStroke")[0][0]==null)
		{
			d3.select("#"+theCard.node().parentNode.parentNode.id).append("rect").
		    attr({
		      'x':strokeX,
		      'y':strokeY,
		      'height':strokeHeight,
		      'width':strokeWidth,
		      'fill':"None",
		      'id': "cardSelectStroke",
		      'stroke':"#AA0000",
		      'stroke-width':"5",
		      //'stroke-dasharray':"10",
		      });
		}
		else
		{
			d3.select("#cardSelectStroke").
		    attr({
		      'x':strokeX,
		      'y':strokeY,
		      });
		}
	}
	else if(theCard.node().parentNode.parentNode.id=="basicSVG"&&pileCardSelected)
	{
		var location = id.substr(2);
		pileCardSelected=false;
		clearSelect();
		cardInField[location]=JSON.parse(JSON.stringify(nowSelectedCard));
		madeACard(cardWidth*(location%5)+spacing*(location%5+1),
				  cardHeight*parseInt((location/5))+spacing*parseInt((location/5+1)),
				  cardInField[location][0],
				  cardInField[location][1],
				  cardInField[location][2],
				  cardInField[location][3],
				  "basicSVG");
		cardInPile.splice(nowSelectedCardNo,1);
		nowSelectedCard = [];
		var wantTarget = [];//want Target
		for(var i=0 ;i<cardInField[location][2].length;i++)
		{
			wantTarget.push(cardInField[location][2][i]);
		}
		var rewardBase = cardInField[location][3];//reward money
		var rewardTimes = 0;
		var checkTargetLocation = [-1,1,-5,5];

		for(var i=0;i<wantTarget.length;i++)
		{
			for(var j=0;j<checkTargetLocation.length;j++)
			{
				if(typeof cardInField[location*1+checkTargetLocation[j]*1]!="undefined")
				{
					if(cardInField[location*1+checkTargetLocation[j]*1][1]==wantTarget[i]) rewardTimes++;
				}
			}					
		}
		if(rewardTimes==0&&firstCardIn)
		{
			p1BadReputation++;
			d3.select("#P1HP"+p1BadReputation).attr("fill","black");
		}
		if(!firstCardIn) firstCardIn = true;
		if(p1BadReputation>=3)
		{
			d3.select("#basicSVG").append("image")
			.attr({
			    'x': 0,
			    'y': 250,
			    'width': 800,
			    'id':"firedPNG",
			    'href':"./src/pattern/firedImg.png",
			    'onclick':"restartStage()",
			    });
		}
		coinCount[turnTo-1] = coinCount[turnTo-1] + rewardTimes*rewardBase;
		document.getElementById("player1Coin").innerText=coinCount[turnTo-1];
		drawACard();
		updatePileShow();

		if(stageSet["stage"+nowStage]["stageTarget"]<=coinCount[turnTo-1])
		{
			stageClear();
		}
	}
}

function madeACard(x,y,name,cardClass,want,reward,targetSVGID)
{
	//Sample Text Ψ ♠ ♥ ♦ ♣ Θ
	//madeACard(20,20,"Royal","♦","♥","3","pileSVG")
	d3.select("#"+targetSVGID).append("g")
		.attr({
		    'id':name,
		    'onclick':"selectCard(this.id+'BG')",	    	    
		    });
	d3.select("#"+name).append("rect")
		.attr({
		    'width': cardWidth,
		    'height': cardHeight,
		    'x': x,
		    'y': y,
		    'cx':cardCornerRadius,
		    'cy':cardCornerRadius,
		    'stroke':'black',
		    'stroke-width':'5px',
		    'fill':'black',
		    'id':name+"BG",
		    //'onclick':"selectCard(this.id)",   
		    });

	//talkStroke
	d3.select("#"+name).append("ellipse")
		.attr({
		    'cx': x*1+cardWidth/2,
		    'cy': y*1+100,
		    'rx': cardWidth/2,
		    'ry': 30,
		    'fill':'white', 
		    });
	var triBaseX = x*1+25;
	var triBaseY = y*1+50;
	d3.select("#"+name).append("polygon")
		.attr({
		    'points': triBaseX+","+triBaseY+" "+triBaseX+","+(triBaseY*1+40)+" "+(triBaseX*1+40)+","+(triBaseY*1+40)+" ",
		    'fill':'white', 
		    });

	/*d3.select("#"+name).append("text")
		.text(cardClass)
		.attr({
		    'x': x*1+textSpacing*0.5,
		    'y': y*1+textSpacing*2,
		    'fill':'white',
		    'style':'font-size:30;'
		    });*/
	var classImgSrc = "./src/pattern/";
	if(cardClass=="Ψ") classImgSrc=classImgSrc.concat("King.png");
	if(cardClass=="♠") classImgSrc=classImgSrc.concat("Royal.png");
	if(cardClass=="♥") classImgSrc=classImgSrc.concat("Warrior.png");
	if(cardClass=="♦") classImgSrc=classImgSrc.concat("Trader.png");
	if(cardClass=="♣") classImgSrc=classImgSrc.concat("Civilian.png");
	d3.select("#"+name).append("image")
		.attr({
		    'x': x*1,
		    'y': y*1+textSpacing*0.5,
		    'width': 40,
		    'height': 40,
		    'href':classImgSrc,
		    });

	d3.select("#"+name).append("text")
		.text(name)
		.attr({
		    'x': x*1+textSpacing*2,
		    'y': y*1+textSpacing*2,
		    'fill':'white',
		    'style':'font-size:20;'
		    });
	/*d3.select("#"+name).append("text")
		.text(want)
		.attr({
		    'x': x*1+textSpacing*2,
		    'y': y*1+textSpacing*4,
		    'fill':'#008B8B',
		    'style':'font-size:40;'
		    });*/
	for(var i=0;i<want.length;i++)
	{
		var wantImgSrc = "./src/pattern/Want";
		if(want[i]=="Ψ") wantImgSrc=wantImgSrc.concat("King.png");
		if(want[i]=="♠") wantImgSrc=wantImgSrc.concat("Royal.png");
		if(want[i]=="♥") wantImgSrc=wantImgSrc.concat("Warrior.png");
		if(want[i]=="♦") wantImgSrc=wantImgSrc.concat("Trader.png");
		if(want[i]=="♣") wantImgSrc=wantImgSrc.concat("Civilian.png");
		d3.select("#"+name).append("image")
		.attr({
		    'x': x*1+textSpacing*(Number(i)*2),
		    'y': y*1+textSpacing*4,
		    'width': 40,
		    'height': 40,
		    'href':wantImgSrc,
		    });
	}

	d3.select("#"+name).append("text")
		.text("Θ + "+reward)
		.attr({
		    'x': x*1+textSpacing*2,
		    'y': y*1+ cardHeight*1 - textSpacing*1,
		    'fill': "#FFD700",
		    'style':'font-size:30;'
		    });
}

function drawACard()//drawACardFromDeckToPile
{
	if(mode=="stageMode")
	{
		if(cardInDeck.length>0)
		{
			cardInPile.push(cardInDeck.shift());
		}
		else if(cardInPile.length<=0&&stageSet["stage"+nowStage]["stageTarget"]>coinCount[turnTo-1])
		{
			d3.select("#basicSVG").append("image")
			.attr({
			    'x': 0,
			    'y': 250,
			    'width': 800,
			    'id':"firedPNG",
			    'href':"./src/pattern/firedImg.png",
			    'onclick':"restartStage()",
			    });
		}
	}
	else
	{
		if(cardInDeck.length>0)
		{
			var randomNum = parseInt(Math.random()*Number(cardInDeck.length));
			cardInPile.push(cardInDeck[randomNum]);
			cardInDeck.splice(randomNum,1);
		}
	}		
}

function updatePileShow()
{
	$("#pileSVG").empty();
	var centerOfCol = d3.select("#pileSVG").attr("width")/2-cardWidth/2;
	for(var i=0;i<cardInPile.length;i++)
	{
		madeACard(centerOfCol,
				  spacing*(i*1+1)+cardHeight*i,
				  cardInPile[i][0],
				  cardInPile[i][1],
				  cardInPile[i][2],
				  cardInPile[i][3],
				  "pileSVG");
	}
}

setUp();