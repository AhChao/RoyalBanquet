var basicDeck=
[
	// Θ
	/*name,cardClass,want,reward*/
	["King","Ψ","♠♥","7"],
	["Royal","♠","♣","5"],	
	["Warrior","♥","♣","4"],
	["Trader","♦","♣","3"],

	["CivilianA","♣","♠♥","1"],
	["CivilianB","♣","♥","1"],
	["CivilianC","♣","♣","1"],
	["CivilianD","♣","♦","1"],
	["CivilianE","♣","♠","1"],
];

function generateRandomDeck()
{
	var randomDeck=[];
	var numOfKings=1;
	var numOfRoyals=3;
	var numOfWarriors=5;
	var numOfTraders=6;
	var numOfCivilians=10; 
	var totalDeckCards=numOfKings+numOfRoyals+numOfWarriors+numOfTraders+numOfCivilians;
	var classNumLayer=[numOfCivilians,
					numOfCivilians+numOfTraders,
					numOfCivilians+numOfTraders+numOfWarriors,
					numOfCivilians+numOfTraders+numOfWarriors+numOfRoyals,
					numOfCivilians+numOfTraders+numOfWarriors+numOfRoyals+numOfKings];
	var classLayerCount =0;
	var nameLayer=["Civilian","Trader","Warrior","Royal","King"];
	var classIconLayer=["♣","♦","♥","♠","Ψ"];
	var wantLayer=[3,3,2,2,2];
	var rewardLayer=[1,3,4,5,7];
	
	for(var i=0;i<totalDeckCards;i++)
	{
		if(i>=classNumLayer[classLayerCount]) classLayerCount++;
		if(i<classNumLayer[classLayerCount])
		{
			var wantList=[];
			for(var j=0;j<wantLayer[classLayerCount];j++)
			{				
				var willPutElement = classIconLayer[parseInt(Math.random()*Number(classIconLayer.length))];
				for(var k=0; k<wantList.length;k++)
				{
					if(willPutElement==wantList[k])//sameElement Already In
					{
						willPutElement = classIconLayer[parseInt(Math.random()*Number(classIconLayer.length))];
						k=-1;
					} 
				}
				wantList.push(willPutElement);
			}
			var charCode = 65 + i-classNumLayer[classLayerCount-1];
			if(classLayerCount==0) charCode = 65+i;
			randomDeck.push([nameLayer[classLayerCount]+String.fromCharCode(charCode),
							classIconLayer[classLayerCount],
							wantList,
							rewardLayer[classLayerCount]]);
		}
	}
	return randomDeck;
}