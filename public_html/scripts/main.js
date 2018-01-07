var Application = PIXI.Application,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        Sprite = PIXI.Sprite,
        Container = PIXI.Container;

var w = window.innerWidth;
var h = window.innerHeight;
var app = new PIXI.Application({width: w, height: h, antialias: false});
document.body.appendChild(app.view);

var state;
var tiles = new Array(20).fill(new PIXI.particles.ParticleContainer());
var demons = new PIXI.particles.ParticleContainer();
var combatScreen = new Container();
var player;
var combatController = {
    state : 1,
    playerHP: 20,
    playerMP: 20,
    demonHP: 20,
    playerRoll: 0,
    demonRoll: 0,
    playerAttack: function(){
        combatController.playerRoll = Math.floor(Math.random() * 6)+1;
        combatController.demonHP -= combatController.playerRoll;
        combatController.state = 4;
        combatController.update();
    },
    demonAttack: function(){
        combatController.demonRoll = Math.floor(Math.random() * 6)+1;
        combatController.playerHP -= combatController.demonRoll;
        combatController.state = 2;
    },
    fireball: function(){
        if(combatController.playerMP>=8){
            combatController.playerRoll = Math.floor(Math.random() * 12)+6;
            combatController.demonHP -= combatController.playerRoll;
            combatController.playerMP -=8;
            combatController.state = 5;
        }else{
            combatController.state = 9;
        }
        combatController.update();
        
    },
    heal: function(){
        if(combatController.playerMP>=8){
            combatController.playerRoll = Math.floor(Math.random() * 12)+6;
            combatController.playerHP += combatController.playerRoll;
            combatController.playerMP -=8;
            combatController.state = 6;
        }else{
            combatController.state = 9;
        }
        combatController.update();
    },
    continuePress: function(){
        switch(combatController.state){
            case 1:
                if(Math.floor(Math.random()*2)){
                    combatController.state = 2;
                }else{
                    combatController.state = 3;
                }
                break;
            case 2:
                if (combatController.playerHP>0){
                    combatController.playerMP+=3;
                }
                combatController.state = 3;
                break;
            case 9:
                combatController.state = 3;
                break;
            case 4:
                combatController.state = 2;
                break;
            case 5:
                combatController.state = 2;
                break;
            case 6:
                combatController.state = 2;
                break;
            case 7:
                state = map;
                combatController.demonHP = 20;
                combatScreen.visible = false;
                break;
        }
        if (combatController.demonHP<=0){
            combatController.state = 7;
        }
        if (combatController.playerHP<=0){
            combatController.state = 8;
        }
        combatController.update();
    },
    update: function(){
        switch(combatController.state){
            case 1:
            combatScreen.updateStatus("You encounter a Demon!");
            combatScreen.toggleOptions(false);
                break;
            case 2:
            combatController.demonAttack();
            combatScreen.updateStatus("The Demon Attacks! You take "+combatController.demonRoll+" damage!");
            combatScreen.toggleOptions(false);
                break;
            case 3:
            combatScreen.updateStatus("What do you do?");
            combatScreen.toggleOptions(true);
                break;
            case 4:
            combatScreen.updateStatus("You Attack! The demon takes "+combatController.playerRoll+" damage!");
            combatScreen.toggleOptions(false);
                break;
            case 5:
            combatScreen.updateStatus("You cast Fireball! The Demon takes "+combatController.playerRoll+" damage!");
            combatScreen.toggleOptions(false);
                break;
            case 6:
            combatScreen.updateStatus("You cast Heal! You gain "+combatController.playerRoll+" health!");
            combatScreen.toggleOptions(false);
                break;
            case 7:
            combatScreen.updateStatus("You defeated the demon!");
            combatScreen.toggleOptions(false);
                break;
            case 8:
            combatScreen.updateStatus("The demon has defeated you!");
                break;
            case 9:
            combatScreen.updateStatus("You don't have enough mana!");
            combatScreen.toggleOptions(false);
                break;
        }
        if (combatController.demonHP<=0){
            combatController.demonHP =0;
        }
        if (combatController.playerHP<=0){
            combatController.playerHP =0;
        }
        if (combatController.playerMP<=0){
            combatController.playerMP =0;
        }
        
        if (combatController.playerHP>=20){
            combatController.playerHP =20;
        }
        
        if (combatController.playerMP>=20){
            combatController.playerMP =20;
        }
        
        combatScreen.monsterHpText.text = "Demon HP: "+combatController.demonHP+"/20";
        combatScreen.monsterHp.width = combatController.demonHP/20 * w *.4;
        
        combatScreen.playerHpText.text = "Player HP: "+combatController.playerHP+"/20";
        combatScreen.playerHp.width = combatController.playerHP/20 * w *.4;
        
        combatScreen.playerMpText.text = "Player MP: "+combatController.playerMP+"/20";
        combatScreen.playerMp.width = combatController.playerMP/20 * w *.4;
    }
};
PIXI.loader
        .add("images/brickTile.png")
        .add("images/grassTile.png")
        .add("images/player.png")
        .add("images/demon.png")
        .load(onTexturesLoaded);

function onTexturesLoaded() {
    var tW = w / 16;
    var tH = h / 9;
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 9; j++) {
            if(i===0 || j===0 || i===15 || j===8){
                tiles[i][j] = new Sprite(resources["images/brickTile.png"].texture);
            } else{
                tiles[i][j] = new Sprite(resources["images/grassTile.png"].texture);
                tiles[i][j].on('pointerdown', function(){
                player.setGoal(this.tileX,this.tileY);
            });
            }
            tiles[i][j].position.set(i * tW, j * tH);
            tiles[i][j].height = tH;
            tiles[i][j].width = tW;
            tiles[i][j].buttonMode = true;
            tiles[i][j].interactive = true;
            tiles[i][j].tileX = i;
            tiles[i][j].tileY = j;
            
            app.stage.addChild(tiles[i][j]);
        }
    }

    player = new Sprite(resources["images/player.png"].texture);
    player.position.set(tW, tH);
    player.height = tH;
    player.width = tW;
    app.stage.addChild(player);
    player.moving = false;
    player.xGoal = 1;
    player.yGoal = 1;
    player.setGoal = function(x,y){
        player.xGoal = x;
        player.yGoal = y;
        player.moving = true;
    };
    player.moveTo = function(){
        var x = Math.floor(player.xGoal * tW),
            y = Math.floor(player.yGoal * tH);
        if (x > player.x){
            player.x ++;
        }
        if (x < player.x){
            player.x --;
        }
        if (y > player.y){
            player.y ++;
        }
        if (y < player.y){
        player.y --;
        }
        if(player.y === y && player.x === x){
            player.moving = false;
        }
        player.y = Math.floor(player.y);
        player.x = Math.floor(player.x);
    };
    
    for(var i=0;i<5;i++){
        
        var newDemon = new Sprite(resources["images/demon.png"].texture);
        newDemon.position.set(tW * Math.floor(Math.random() *14+1), tH * Math.floor(Math.random() *7+1));
        newDemon.height = tH;
        newDemon.width = tW;
        newDemon.moving = false;
        newDemon.xGoal = Math.floor(Math.random() *14+1);
        newDemon.yGoal = Math.floor(Math.random() *7+1);
        newDemon.setGoal = function(){
            this.xGoal = Math.floor(Math.random() *14)+1;
            this.yGoal = Math.floor(Math.random() *7)+1;
            this.moving = true;
        };
        newDemon.moveTo = function(){
            var x = Math.floor(this.xGoal * tW),
                y = Math.floor(this.yGoal * tH);
            if (x > this.x){
                this.x ++;
            }
            if (x < this.x){
                this.x --;
            }
            if (y > this.y){
                this.y ++;
            }
            if (y < this.y){
            this.y --;
            }
            if(this.y === y && this.x === x){
                this.moving = false;
            }
            this.y = Math.floor(this.y);
            this.x = Math.floor(this.x);
        };
        newDemon.update = function(){
          if(this.moving === false){
              this.setGoal();
          } else{
              this.moveTo();
          }
        };
        demons.addChild(newDemon);
    }
    app.stage.addChild(demons);
    
    buildCombatScreen();
    
    app.stage.addChild(combatScreen);
    combatScreen.visible = false;
    //Set the game state
    state = map;

    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
}

function buildCombatScreen(){
        combatScreen.addChild(buildRect(0x66CCFF,w,h,0,0));
        var demonSprite = new Sprite(resources["images/demon.png"].texture);
        demonSprite.x = w*.6;
        demonSprite.y = 0;
        demonSprite.width = w*.4;
        demonSprite.height = h*.4;
        combatScreen.addChild(demonSprite);
        var playerSprite = new Sprite(resources["images/player.png"].texture);
        playerSprite.x = 0;
        playerSprite.y = h*.15;
        playerSprite.width = w*.62;
        playerSprite.height = h*.62;
        combatScreen.addChild(playerSprite);
        combatScreen.addChild(buildRect(0x885500,w,h*.35,0,h*.65));
        combatScreen.addChild(buildRect(0x000000,w*.4,h*.04,w*.05,h*.05));
        combatScreen.addChild(buildRect(0x000000,w*.4,h*.04,w*.05,h*.11));
        combatScreen.addChild(buildRect(0x000000,w*.4,h*.04,w*.57, h*.43));
        
        combatScreen.playerHp = buildRect(0xFF0000,w*.4,h*.04,w*.05,h*.05);
        combatScreen.playerHpText = new PIXI.Text("Player HP: 20/20");
        combatScreen.playerHpText.x = w*.05;
        combatScreen.playerHpText.y = h*.05;
        combatScreen.playerHpText.width = w*.4;
        combatScreen.playerHpText.height = h*.04;
        combatScreen.playerHpText.style = {fill: "white"};
        combatScreen.playerMp = buildRect(0x0000FF,w*.4,h*.04,w*.05,h*.11);
        combatScreen.playerMpText = new PIXI.Text("Player MP: 20/20");
        combatScreen.playerMpText.x = w*.05;
        combatScreen.playerMpText.y = h*.11;
        combatScreen.playerMpText.width = w*.4;
        combatScreen.playerMpText.height = h*.04;
        combatScreen.playerMpText.style = {fill: "white"};
        combatScreen.monsterHp = buildRect(0xFF0000,w*.4,h*.04,w*.57,h*.43);
        combatScreen.monsterHpText = new PIXI.Text("Demon HP: 20/20");
        combatScreen.monsterHpText.x = w*.57;
        combatScreen.monsterHpText.y = h*.43;
        combatScreen.monsterHpText.width = w*.4;
        combatScreen.monsterHpText.height = h*.04;
        combatScreen.monsterHpText.style = {fill: "white"};
        
        combatScreen.statusText = new PIXI.Text("");
        combatScreen.statusText.x = w*.05;
        combatScreen.statusText.y = h*.7;
        combatScreen.statusText.style = {fill: "white"};
        
        combatScreen.addChild(combatScreen.playerHp);
        combatScreen.addChild(combatScreen.playerHpText);
        combatScreen.addChild(combatScreen.playerMp);
        combatScreen.addChild(combatScreen.playerMpText);
        combatScreen.addChild(combatScreen.monsterHp);
        combatScreen.addChild(combatScreen.monsterHpText);
        combatScreen.addChild(combatScreen.statusText);
        
        buildButton("attack","Attack", 0.1);
        buildButton("fire","Cast Fireball", 0.4);
        buildButton("heal","Cast Heal", 0.7);
        
        buildButton("ok","Continue", 0.4);
        
        function buildButton(name,text, x){
            combatScreen[name+"Button"] = buildRect(0x000000,w*.2,h*.08,w*x,h*.8);
            combatScreen[name+"Button"].buttonMode = true;
            combatScreen[name+"Button"].interactive = true;
            combatScreen[name+"ButtonText"] = new PIXI.Text(text);
            combatScreen[name+"ButtonText"].x = w*x;
            combatScreen[name+"ButtonText"].y = h*.8;
            combatScreen[name+"ButtonText"].width = w*.2;
            combatScreen[name+"ButtonText"].height = h*.08;
            combatScreen[name+"ButtonText"].style = {fill: "white"};
            combatScreen.addChild(combatScreen[name+"Button"]);
            combatScreen.addChild(combatScreen[name+"ButtonText"]);
        }
        
        combatScreen.okButton.on('pointerdown',combatController.continuePress);
        
        combatScreen.attackButton.on('pointerdown',combatController.playerAttack);
        combatScreen.fireButton.on('pointerdown',combatController.fireball);
        combatScreen.healButton.on('pointerdown',combatController.heal);
        
        combatScreen.toggleOptions = function(playerTurn){
            if (!playerTurn){
                combatScreen.attackButton.visible = false;
                combatScreen.attackButtonText.visible = false;
                combatScreen.healButton.visible = false;
                combatScreen.healButtonText.visible = false;
                combatScreen.fireButton.visible = false;
                combatScreen.fireButtonText.visible = false;
                
                combatScreen.okButton.visible = true;
                combatScreen.okButtonText.visible = true;
                
            }else{
                combatScreen.attackButton.visible = true;
                combatScreen.attackButtonText.visible = true;
                combatScreen.healButton.visible = true;
                combatScreen.healButtonText.visible = true;
                combatScreen.fireButton.visible = true;
                combatScreen.fireButtonText.visible = true;
                
                combatScreen.okButton.visible = false;
                combatScreen.okButtonText.visible = false;
            }
        }
        
        combatScreen.updateStatus = function(status){
            this.statusText.text = status;
        };
        
}
function buildRect(color,w,h,x,y){
    var rect = new PIXI.Graphics();
    rect.beginFill(color);
    rect.drawRect(0,0,w,h);
    rect.endFill();
    rect.x = x;
    rect.y = y;
    return rect;
}
function gameLoop(delta) {

    //Update the current game state:
    state(delta);
}

function map(delta) {
//    for (var i = 0; i < 15; i++) {
//        for (var j = 0; j < 8; j++) {
//            tiles[i][j].position.set(Math.random() * w, Math.random() * h);
//        }
//    }
        for(var i=0;i<demons.children.length; i++){
            demons.children[i].update();
            if(hitTestRectangle(player, demons.children[i])){
                demons.children.splice(i,1);
                state = combat;
                combatController.state = 1;
                combatController.update();
                combatScreen.visible = true;
            }
        }
        player.moveTo();
          
}

function combat(delta){
    
}

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};