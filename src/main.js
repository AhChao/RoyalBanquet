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
var pileCardSelected = false;
var nowSelectedCard = [];
var nowSelectedCardNo = -1;

function init()
{
	cardInDeck = JSON.parse(JSON.stringify(deck));
	shiftDeck();
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
	for(var i=0;i<25;i++)
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
		    'onclick':"selectCard(this.id)",
		    });
	}	
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
		updatePileShow();
	}
}

function madeACard(x,y,name,cardClass,want,reward,targetSVGID)
{
	//Sample Text Ψ ♠ ♥ ♦ ♣ Θ
	//madeACard(20,20,"Royal","♦","♥","3","pileSVG")

	d3.select("#"+targetSVGID).append("g")
		.attr({
		    'id':name,		    	    
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
		    'onclick':"selectCard(this.id)",   
		    });
	d3.select("#"+name).append("text")
		.text(cardClass)
		.attr({
		    'x': x*1+textSpacing*1,
		    'y': y*1+textSpacing*2,
		    'fill':'white',
		    'style':'font-size:20;'
		    });
	d3.select("#"+name).append("text")
		.text(name)
		.attr({
		    'x': x*1+textSpacing*2,
		    'y': y*1+textSpacing*2,
		    'fill':'white',
		    'style':'font-size:20;'
		    });
	d3.select("#"+name).append("text")
		.text(want)
		.attr({
		    'x': x*1+textSpacing*2,
		    'y': y*1+textSpacing*4,
		    'fill':'#008B8B',
		    'style':'font-size:40;'
		    });
	d3.select("#"+name).append("text")
		.text("Θ + "+reward)
		.attr({
		    'x': x*1+textSpacing*2,
		    'y': y*1+textSpacing*7,
		    'fill': "#FFD700",
		    'style':'font-size:30;'
		    });
}

function shiftDeck()
{
	for(var i=0;i<5;i++)
	{
		var randomNum = parseInt(Math.random()*Number(cardInDeck.length));
		cardInPile.push(cardInDeck[randomNum]);
		cardInDeck.splice(randomNum,1);
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

init();