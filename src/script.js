let fieldSize = 4;
let newBlocksPossibleValues = [2, 4];
let points = 0;
let bestScore = 0;
let pointsEarnedInTheLatestMove = 0;
let pointsCount = document.getElementById("pointsCount");
let bestScoreCount = document.getElementById("bestScoreCount");
let startGameMenu = document.getElementById("startGameMenu");
let playButton = document.getElementById("playButton");
let gameField = document.getElementById("gameField");
let selectFieldSizeMenu = document.getElementById("selectFieldSizeMenu");
let fieldSizeOptions = selectFieldSizeMenu.querySelector("#fieldSizeOptions").querySelectorAll("div");
let selectFieldSizeButton = document.getElementById("selectFieldSizeButton");
let shop = selectFieldSizeMenu.querySelector("#shop");
let openShop = selectFieldSizeMenu.querySelector("#openShop");
let closeShop = shop.querySelector("#closeShop");
let themeShop = shop.querySelector("#themeShop");
let currencyDialog = shop.querySelector("#currencyDialog");
let currencySpentAnimation = shop.querySelector("#currencySpentAnimation");
//let themesDivs = shop.querySelectorAll("div[themeName]");

let continueGameInterval;
let playerContinuesTheGame = false;
let continueGameWindow = document.getElementById("continueGameWindow");
let continueGameButton = continueGameWindow.querySelector("#continueGameButton");
let rejectContinuingGameButton = continueGameWindow.querySelector("#rejectContinuingGameButton");
let endGameWindow = document.getElementById("endGameWindow");
let earnedStars = endGameWindow.querySelector("#earnedStars");
let goToMainMenuButton = endGameWindow.querySelector("#goToMainMenuButton");
let navigation = document.getElementById("navigation");
let newGameButton = navigation.querySelector("#newGameButton");
let blockField = document.getElementById("blockField");

let musicPlayer = document.getElementById("musicPlayer");

let playerMoney = 1000;
let blocks = [];
let theme = themes[0];
let deltaX;
let deltaY;
let anyBlockWasMoved = true;

let animationTime = 200;//100;
let blocksMoveSideways = false;
let addPointsAnimation = navigation.querySelector("#addPointsAnimation");
addPointsAnimation.style.setProperty("--animationDuration", `${animationTime}ms`)



if(localStorage.getItem("playerMoney")){
	playerMoney = parseInt(localStorage.getItem("playerMoney"));
	currencyDialog.innerHTML = `${playerMoney}<span style="color: gold; font-size: 1rem; font-weight: 900">*</span>`;
	if(localStorage.getItem("themes")){
		themes = JSON.parse(localStorage.getItem("themes"));
	}
}

//if(localStorage.getItem())

for(let i = 0; i < themes.length; i++){
	let newTheme = document.createElement("div");
	newTheme.theme = themes[i];
	newTheme.textContent = newTheme.theme.name;
	newTheme.style.color = newTheme.theme.textColor;
	newTheme.style.background = newTheme.theme.backgroundColor;

	if(!newTheme.theme.bought){
		let notBoughtWindow = document.createElement("div");
		notBoughtWindow.innerHTML = `${newTheme.theme.price}<span style="color: gold; font-size: 1rem; font-weight: 900">*</span>`;
		//notBoughtWindow.style.color = newTheme.theme.textColor;
		newTheme.appendChild(notBoughtWindow);
	}
	
	newTheme.onclick = function(){
		if(!this.theme.bought){
			if(playerMoney >= this.theme.price){
				let notBoughtWindow = this.querySelector("div");
				playerMoney -= this.theme.price;
				currencyDialog.innerHTML = `${playerMoney}<span style="color: gold; font-size: 1rem; font-weight: 900">*</span>`;
				currencySpentAnimation.innerHTML = `-${this.theme.price}<span style="color: gold; font-size: 1rem; font-weight: 900">*</span>`;
				currencySpentAnimation.style.animationName = "spendingCurrency";
				this.theme.bought = true;
				notBoughtWindow.style.opacity = "0";

				setTimeout(function(){
					this.removeChild(notBoughtWindow);
					currencySpentAnimation.style.animationName = "none";
				}.bind(this), 1200)

				saveThemeChanges();
			}
			else{
				console.log("Not enought money")
			}
		}
		else{
			theme = this.theme;
			changeGameThreme();
		}
	}

	themeShop.appendChild(newTheme);
}

newGameButton.onclick = function(){
	restartGame();
	endGameWindow.style.display = "none";
}

blockField.ontouchstart = function(event){
	deltaX = event.touches[0].pageX;
	deltaY = event.touches[0].pageY;
}

blockField.ontouchend = swipeMove;

playButton.onclick = function(){
	startGameMenu.style.opacity = "0";
	setTimeout(function(){
		startGameMenu.style.display = "none";
		selectFieldSizeMenu.style.display = "flex";
	}, 1000)
	//gameField.style.display = "none";

	//musicPlayer.play()
	//.then(function(value){
	//	console.log("Audio playing")
	//})
	//.catch(function(error){
	//	console.log("Figa tobi")
	//})


	if(localStorage.getItem("bestScore")){
		bestScore = parseInt(localStorage.getItem("bestScore"));
	}
	else{
		bestScore = 0;
	}
	bestScoreCount.textContent = bestScore;
}

fieldSizeOptions.forEach(function(sizeOption){
	sizeOption.onclick = function(){
		fieldSize = parseInt(this.getAttribute("fieldSize"));
		this.style.background = "#222222"
		fieldSizeOptions.forEach(function(option){
			if(option != this){
				option.style.background = "gray";
			}
		}.bind(this))
	}
})


selectFieldSizeButton.onclick = function(){
	document.onkeydown = moveBlocks;
	gameField.style.display = "block";
	selectFieldSizeMenu.style.display = "none";
	clearTheField();
	startGame();
}

openShop.onclick = function(){
	shop.style.display = "flex";
	setTimeout(function(){
		shop.style.opacity = "1";
		shop.style.width = getComputedStyle(shop).getPropertyValue("--width");
		shop.style.height = "100%";
	}, 100)
}

closeShop.onclick = function(){
	shop.style.opacity = "0";
	shop.style.width = "100%";
		shop.style.height = "100%";
	setTimeout(function(){
		shop.style.display = "none";
	}, 400)
}


continueGameButton.onclick = function(){
	if(playerMoney >= 100){
		clearInterval(continueGameInterval);
		continueGameInterval = null;
		playerMoney -= 100;
		saveMoneyChanges();
		playerContinuesTheGame = true;
		continueGameWindow.style.display = "none";
		endGameWindow.style.display = "none";
		clearTheField();
		startGame();
	}
}

rejectContinuingGameButton.onclick = function(){
	document.onkeydown = null;
	clearInterval(continueGameInterval);
	continueGameWindow.style.display = "none";
	endGameWindow.style.display = "flex";
	endGameWindow.style.opacity = "1";
	playerMoney += parseInt(points / 12);
	earnedStars.innerHTML = `+${parseInt(points / 12)}<span style="color: gold; /*font-size: 1rem;*/ font-weight: 900">*</span>`;
	currencyDialog.innerHTML = `${playerMoney}<span style="color: gold; font-size: 1rem; font-weight: 900">*</span>`;
	saveMoneyChanges();
}


goToMainMenuButton.onclick = function(){
	continueGameInterval = null;
	endGameWindow.style.display = "none";
	gameField.style.display = "none";
	selectFieldSizeMenu.style.display = "flex";
}



function startGame(){
	if(!playerContinuesTheGame){
		points = 0;
		pointsCount.textContent = "0";
	}
	gameIsGoing = true;
	playerContinuesTheGame = false;
	anyBlockWasMoved = true;
	blockField.style.cssText = `background: ${theme.blockFieldBackground}; grid-template-columns: repeat(${fieldSize}, 1fr); grid-template-rows: repeat(${fieldSize}, 1fr)`;

	for(let i = 0; i < fieldSize; i++){
		for(let j = 0; j < fieldSize; j++){
			let newBlock = document.createElement("div");
			let newBlockContainer = document.createElement("div");
			newBlock.value = 0;
			newBlock.id = "block";
			newBlock.recentlyCombined = "false";
			newBlock.setAttribute("cellNumber", `${i}-${j}`);
			newBlock.setAttribute("value", 0);
			newBlock.setAttribute("occupied", "false");
			newBlockContainer.id = "blockContainer";
			newBlockContainer.appendChild(newBlock);
			blockField.appendChild(newBlockContainer);
		}
	}
	document.onkeydown = moveBlocks;
	blocks = blockField.querySelectorAll("div");
	addBlocks();
}



function restartGame(){
	blockField.innerHTML = "";
	startGame();
}



function moveBlocks(event){
	document.onkeydown = null;

	setTimeout(function(){
		document.onkeydown = moveBlocks;
	}, animationTime + 150);

	if(event.repeat){
		return;
	}

	switch(event.key){
		case "ArrowUp":{
			blocksMoveSideways = false;
			moveToTop();
		}
		break;

		case "ArrowDown":{
			blocksMoveSideways = false;
			moveToBottom();
		}
		break;

		case "ArrowLeft":{
			blocksMoveSideways = true;
			moveToLeft();		
		}
		break;

		case "ArrowRight":{
			blocksMoveSideways = true;
			moveToRight();
		}
		break;
	}

	if(pointsEarnedInTheLatestMove > 0){
		points += pointsEarnedInTheLatestMove;
		pointsCount.textContent = points;
		addPointsAnimation.textContent = `+${pointsEarnedInTheLatestMove}`;
		addPointsAnimation.style.animationName = "addingPoints";

		setTimeout(function(){
			addPointsAnimation.style.animationName = "none";
			pointsEarnedInTheLatestMove = 0;
		}, animationTime);

		if(points > bestScore){
			bestScore = points;
			bestScoreCount.textContent = bestScore;
			localStorage.setItem("bestScore", bestScore);
		}
	}
	setTimeout(addBlocks, animationTime + 40);
	setTimeout(renderBlockValuesAndColors, animationTime + 80);
}



function swipeMove(event){
	document.ontouchend = null;

	setTimeout(function(){
		document.ontouchend = swipeMove;
	}, animationTime + 150);

	deltaX -= event.changedTouches[0].pageX;
	deltaY -= event.changedTouches[0].pageY;

	if(Math.abs(deltaX) > Math.abs(deltaY)){
		if(deltaX > 10){
			moveToLeft();
		}
		else if(deltaX < -10){
			moveToRight();
		}
	}
	else{
		if(deltaY > 10){
			moveToTop();
		}
		else if(deltaY < -10){
			moveToBottom();
		}
	}
	setTimeout(addBlocks, animationTime + 50);
}



function moveToTop(event){
	for(let column = 0; column < fieldSize; column++){
		for(let row = 1; row < fieldSize; row++){
			if(queryBlockByNumber(row - 1, column).recentlyCombined == "false" && queryBlockByNumber(row, column).value != 0 && queryBlockByNumber(row - 1, column).value != 0 && queryBlockByNumber(row, column).value == queryBlockByNumber(row - 1, column).value){
				combineBlocks(queryBlockByNumber(row, column), queryBlockByNumber(row - 1, column));
			}
			else if(queryBlockByNumber(row, column).value != 0 && queryBlockByNumber(row - 1, column).value == 0){
				let nearestBlock;

				for(let g = row - 1; g >= 0; g--){
					if(queryBlockByNumber(g, column).value != 0){
						nearestBlock = queryBlockByNumber(g, column);
						if(nearestBlock.recentlyCombined == "false" && nearestBlock.value == queryBlockByNumber(row, column).value){
							combineBlocks(queryBlockByNumber(row, column), nearestBlock);
							break;
						}
						else if(queryBlockByNumber(g + 1, column)){
							combineBlocks(queryBlockByNumber(row, column), queryBlockByNumber(g + 1, column));
							break;
						}
					}
				}
				if(!nearestBlock){
					combineBlocks(queryBlockByNumber(row, column), queryBlockByNumber(0, column));
				}
			}
		}
	}
}

function moveToBottom(){
	for(let column = 0; column < fieldSize; column++){
		for(let row = fieldSize - 2; row >= 0; row--){
			if(queryBlockByNumber(row + 1, column).recentlyCombined == "false" && queryBlockByNumber(row, column).value != 0 && queryBlockByNumber(row + 1, column).value != 0 && queryBlockByNumber(row, column).value == queryBlockByNumber(row + 1, column).value){
				combineBlocks(queryBlockByNumber(row, column), queryBlockByNumber(row + 1, column));
			}
			else if(queryBlockByNumber(row, column).value != 0 && queryBlockByNumber(row + 1, column).value == 0){
				let nearestBlock;

				for(let g = row + 1; g < fieldSize; g++){
					if(queryBlockByNumber(g, column).value != 0){
						nearestBlock = queryBlockByNumber(g, column);
						if(nearestBlock.recentlyCombined == "false" && nearestBlock.value == queryBlockByNumber(row, column).value){
							combineBlocks(queryBlockByNumber(row, column), nearestBlock);
							break;
						}
						else{
							combineBlocks(queryBlockByNumber(row, column), queryBlockByNumber(g - 1, column))
						}
					}
				}
				if(!nearestBlock){
					combineBlocks(queryBlockByNumber(row, column), queryBlockByNumber(fieldSize - 1, column));
				}
			}
		}
	}
}

function moveToLeft(){
	for(let column = 0; column < fieldSize; column++){
		for(let row = 1; row < fieldSize; row++){
			if(queryBlockByNumber(column, row - 1).recentlyCombined != "true" && queryBlockByNumber(column, row).value != 0 && queryBlockByNumber(column, row - 1).value != 0 && queryBlockByNumber(column, row).value == queryBlockByNumber(column, row - 1).value){
				combineBlocks(queryBlockByNumber(column, row), queryBlockByNumber(column, row - 1));
			}
			else if(queryBlockByNumber(column, row).value != 0 && queryBlockByNumber(column, row - 1).value == 0){
				let nearestBlock;

				for(let g = row - 1; g >= 0; g--){
					if(queryBlockByNumber(column, g).value != 0){
						nearestBlock = queryBlockByNumber(column, g);
						if(nearestBlock.recentlyCombined == "false" && nearestBlock.value == queryBlockByNumber(column, row).value){
							combineBlocks(queryBlockByNumber(column, row), nearestBlock);
							break;
						}
						else{
							combineBlocks(queryBlockByNumber(column, row), queryBlockByNumber(column, g + 1));
						}
					}
				}
				if(!nearestBlock){
					combineBlocks(queryBlockByNumber(column, row), queryBlockByNumber(column, 0));
				}
			}
		}
	}
}

function moveToRight(){
	for(let column = 0; column < fieldSize; column++){
		for(let row = fieldSize - 2; row >= 0; row--){
			if(queryBlockByNumber(column, row + 1).recentlyCombined == "false" && queryBlockByNumber(column, row).value != 0 && queryBlockByNumber(column, row + 1).value != 0 && queryBlockByNumber(column, row).value == queryBlockByNumber(column, row + 1).value){
				combineBlocks(queryBlockByNumber(column, row), queryBlockByNumber(column, row + 1));
			}
		else if(queryBlockByNumber(column, row).value != 0 && queryBlockByNumber(column, row + 1).value == 0){
				let nearestBlock;

				for(let g = row + 1; g < fieldSize; g++){
					if(queryBlockByNumber(column, g).value != 0){
						nearestBlock = queryBlockByNumber(column, g);
						if(nearestBlock.recentlyCombined == "false" && queryBlockByNumber(column, row).value == nearestBlock.value){
							combineBlocks(queryBlockByNumber(column, row), nearestBlock);
							break;
						}
						else{
							combineBlocks(queryBlockByNumber(column, row), queryBlockByNumber(column, g - 1));
						}
					}
				}

				if(!nearestBlock){
					combineBlocks(queryBlockByNumber(column, row), queryBlockByNumber(column, fieldSize - 1));
				}
			}
		}
	}
}

function combineBlocks(block1, block2){
	if(block1.value == 0){
		return
	}

	let block1Offsets = block1.getBoundingClientRect();
	let block2Offsets = block2.parentNode.getBoundingClientRect();
	let speed = gameField.offsetWidth / animationTime;
	anyBlockWasMoved = true;

	if(block2.value != 0){
		pointsEarnedInTheLatestMove += block1.value;
		block2.recentlyCombined = "true";
		//points += pointsEarnedInTheLatestMove;
		//pointsCount.textContent = points;
		//block2.recentlyCombined = "true";
		//addPointsAnimation.textContent = block1.value;
		//addPointsAnimation.style.animationName = "addingPoints";
		//setTimeout(function(){
		//	addPointsAnimation.style.animationName = "none";
		//}, animationTime);

		//if(points > bestScore){
		//	bestScore = points;
		//	bestScoreCount.textContent = bestScore;
		//	localStorage.setItem("bestScore", bestScore);
		//}
	}

	block2.value = block1.value + block2.value;
	block2.setAttribute("value", block2.value);
	block2.setAttribute("occupied", "true");


	if(blocksMoveSideways){
		block1.style.transition = `${Math.abs(block2Offsets.left - block1Offsets.left) / speed}ms`;
		block1.style.transform = `translateX(${block2Offsets.left - (block1Offsets.left)}px`;
	}
	else{
		block1.style.transition = `${Math.abs(block2Offsets.top - block1Offsets.top) / speed}ms`;
		block1.style.transform = `translateY(${block2Offsets.top - (block1Offsets.top - 10)}px`;
	}

	block1.value = 0;
	block1.setAttribute("occupied", "false");

	setTimeout(function(){
		block2.recentlyCombined = "false";
	}, 20)

	setTimeout(function(){
		block2.textContent = block2.value;
		block1.textContent = "";
		block1.style.transition = "0s";
		block1.style.cssText = "top: initial; left: initial;";

		if(theme.blockColors[`${block2.value}`]){
			block2.style.background = `${theme.blockColors[block2.value]}`;
		}
		else{
			block2.style.background = Object.values(theme.blockColors)[Object.values(theme.blockColors).length - 1];
		}

	}, animationTime + 20)
}

function addBlocks(){
	let freeCells = blockField.querySelectorAll("[occupied = 'false']");

	if(freeCells.length > 0 && anyBlockWasMoved){
		let cellToOccupy = freeCells[Math.round(Math.random() * (freeCells.length - 1))];
		cellToOccupy.value = newBlocksPossibleValues[Math.round(Math.random() * 1)];
		cellToOccupy.textContent = cellToOccupy.value;
		cellToOccupy.style.backgroundColor = `${theme.blockColors[cellToOccupy.value]}`;
		cellToOccupy.setAttribute("occupied", "true");
		cellToOccupy.setAttribute("value", cellToOccupy.value);
		cellToOccupy.style.animationName = "blockAppear";

	}

	else if(freeCells.length == 0){
		let gameOver = true;

		for(let column = 0; column < fieldSize; column++){
			for(let row = 0; row < fieldSize; row++){
				if(queryBlockByNumber(column - 1, row) && queryBlockByNumber(column - 1, row).value == queryBlockByNumber(column, row).value){
					gameOver = false;
					break;
				}
				else if(queryBlockByNumber(column, row + 1) && queryBlockByNumber(column, row + 1).value == queryBlockByNumber(column, row).value){
					gameOver = false;
					break;
				}
				else if(queryBlockByNumber(column, row - 1) && queryBlockByNumber(column, row - 1).value == queryBlockByNumber(column, row).value){
					gameOver = false;
					break;
				}
				else if(queryBlockByNumber(column, row + 1) && queryBlockByNumber(column, row + 1).value == queryBlockByNumber(column, row).value){
					gameOver = false;
					break;
				}
			}
		}

		if(gameOver){
			if(!continueGameInterval){
				let count = 3;
				continueGameInterval = setInterval(function(){
					if(count == 0){
						rejectContinuingGameButton.onclick();
						clearInterval(continueGameInterval);
						document.onkeydown = null;
						console.log("End");
						return;
					}
					console.log(count);
					count -= 1;
				}, 1000);
			}
			continueGameWindow.style.display = "flex";
			//return;
		}
	}
	anyBlockWasMoved = false;
	//renderBlockValuesAndColors();
}

function queryBlockByNumber(column, row){
	return blockField.querySelector(`[cellNumber = '${column}-${row}']`);
}

function renderBlockValuesAndColors(){
	for(let i = 0; i < fieldSize; i++){
		for(let j = 0; j < fieldSize; j++){
			if(queryBlockByNumber(i, j).value != 0){
				queryBlockByNumber(i, j).textContent = queryBlockByNumber(i, j).value;
				if(theme.blockColors[queryBlockByNumber(i, j).value]){
					queryBlockByNumber(i, j).style.backgroundColor = theme.blockColors[queryBlockByNumber(i, j).value];
				}
				else{
					queryBlockByNumber(i, j).style.background = Object.values(theme.blockColors)[Object.values(theme.blockColors).length - 1];
				}
			}
		}
	}
}

function clearTheField(){
	blockField.innerHTML = "";
}

function changeGameThreme(){
	game.style.background = theme.backgroundColor;
	//musicPlayer.src = theme.themeSong;
	//musicPlayer.play();
}

function saveMoneyChanges(){
	localStorage.setItem("playerMoney", playerMoney);
}

function saveThemeChanges(){
	let themeDivs = shop.querySelectorAll("#themeShop > div")

	for(let i = 0; i < themeDivs.length; i++){
		themes[i] = themeDivs[i].theme;
	}

	localStorage.setItem("themes", JSON.stringify(themes));
	themes = JSON.parse(localStorage.getItem("themes"));
	saveMoneyChanges();
}
