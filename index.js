var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
const WIDTH = 1000;
const HEIGHT = 700;

var wrappage = true;
var gamepage = false;
var restpage = false;

function wrapper() {
    start = {
        width: 550-137.5,
        height: 300,
        visible: true,
    }
    start.img = new Image();
    start.img.src = "img/start.png";
    start.img.onload = draw;
    var func = function(e) {
        x = e.clientX;
        y = e.clientY;
        if ((x >= 659 && x <= 1018) && (y >=  500 && y <=  550))
        {
            window.removeEventListener('mousedown', func, false);
            wrappage = false;
            game();
        }
    }
    window.addEventListener('mousedown', func);

    
    function draw() {
        ctx.drawImage(start.img, WIDTH/2- start.width + 210, HEIGHT/2 - start.height + 100, start.width, start.height);
        if (wrappage)
        requestAnimationFrame(draw);
    }
}

function restart(score) {
    restpage = true;
    ctx.fillStyle = "#cddac8";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#F00";
    ctx.font = "bold 28pt Courier New";
    var str = "Your score: " + score.toString()
    ;
    ctx.fillText(str, 340, 250);

    var func = function(e) {
        x = e.clientX;
        y = e.clientY;
        console.log(x, " ", y);
        if ((x >= 654 && x <= 1042) && (y >=  467 && y <=  506))
        {
            window.removeEventListener('mousedown', func, false);
            restpage = false;
            game();
        }
    }
    window.addEventListener('mousedown', func);

    var rest = new Image();
    rest.src = "img/restart.png";
    rest.onload = draw;
    function draw() {
        if (restpage) {
            ctx.drawImage(rest, 300, 300);
            requestAnimationFrame(draw);
        }
    } 
    
}

function game() {
    gamepage = true;

    var bg = new Image(); bg.src = "img/bg.png";
    var grass = new Image(); grass.src = "img/grass.png";

    var player_right = { 
        visible: 0, 
        height: 75, 
        width: 50 
    };
    player_right.img = new Image(); player_right.img.src = "img/player_right.png";
    var player_left = { visible: 1 };
    player_left.img = new Image(); player_left.img.src = "img/player_left.png";

    var xPos = WIDTH / 2 - 75;
    var yPos = 575;
    var player_speed = 8;
    var A_Pressed = false;
    var D_Pressed = false;
    var jumpPressed = false;
    var jumpCount = 0;
    var jumpLength = 50;
    var jumpHeight = 0;

    var helths_count = 7;
    var helths = [];
    var helth = {
        xPos: 10,
        yPos: 50,
        width: 50,
        height: 50
    }
    helth.img = new Image();
    helth.img.src = "img/helth.png";
    for (var i = 1; i <= helths_count; i++)
    {
        helths[i] = Object.assign({}, helth);
    }
    function spawn_helths() {
        for (var i = 1; i <= helths_count; i++)
        {
            helths[i].yPos = 10 + (helth.height + 5) * i ;
            ctx.drawImage(helths[i].img, helths[i].xPos, helths[i].yPos, helth.width, helth.height);
        }
    }

    var score = 0;
    var moneys_count = 7;
    var moneys_visible = true;
    var moneys = [];
    var money = { 
        xPos: 100,
        yPos: -30, 
        width: 50, 
        height: 50,
        speed: 1,
    };
    moneys_change_speed = 0;
    money.img = new Image();
    money.img.src = "img/money.png";
    let timer = setInterval(() => moneys_change_speed += 0.1, 5000 );
    function write_score(score) {
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "#F00";
        ctx.font = "bold 27pt Courier New";
        var str = "Score: " + score.toString();
        ctx.fillText(str, 10, 35);
    }
    function spawnMoneys() {
        for (var i = 0; i <= moneys_count; i++)
        {
            moneys[i] = Object.assign({}, money);
            moneys[i].xPos = Math.floor(Math.random() * (WIDTH - 100 + 1)) + 50;
            moneys[i].yPos = - Math.floor(Math.random() * (1000 - 30)) + 30;
            moneys[i].speed = Math.random() + 0.1;
        }
    }

    var keyDown = function(e) {
        switch(e.keyCode) {
            case 65:
                A_Pressed = true;
                player_left.visible = 1;
                player_right.visible = 0;        
            break;
            case 68:
                D_Pressed = true;
                player_left.visible = 0;
                player_right.visible = 1;  
            break;
            case 32:
                jumpPressed = true;
            break;
        }
    }
    window.addEventListener('keydown', keyDown);
    var keyUp = function(e) {
        switch(e.keyCode) {
            case 65:
                A_Pressed = false;
            break;
            case 68:
                D_Pressed = false;
            break;
        }
    }
    window.addEventListener('keyup', keyUp);
    function draw()
    {
        if (moneys_count) {
            ctx.drawImage(bg, 0, -100); 
            ctx.drawImage(grass, 0, 650);
            spawn_helths();
            yPos = canvas.height-125-jumpHeight;
            if (player_left.visible == 1) {
                ctx.drawImage(player_left.img, xPos, yPos, player_right.width, player_right.height);
                if ((A_Pressed == 1) && (xPos > 75)){
                    xPos -= player_speed;
                } 
            }
            if (player_right.visible == 1) {
                ctx.drawImage(player_right.img, xPos, yPos, player_right.width, player_right.height);
                if ((D_Pressed == 1) && (xPos < WIDTH - 60)){
                    xPos += player_speed;
                } 
            }
        
            if(jumpPressed) {
                jumpCount++;
                jumpHeight = 3*jumpLength*Math.sin(Math.PI*jumpCount/jumpLength);
            }
            if(jumpCount>jumpLength) {
                jumpCount=0;
                jumpPressed=false;
                jumpHeight=0;
            }
        
            for (var i = 0; i < moneys_count; i++)
            {
                moneys[i].yPos += moneys[i].speed + moneys_change_speed;
                if (moneys_visible) {ctx.drawImage(moneys[i].img, moneys[i].xPos, moneys[i].yPos, 30, 30);}
                if (moneys[i].yPos > 624)
                {
                    moneys[i].yPos = - Math.floor(Math.random() * (400 - 30)) + 30;
                    moneys[i].xPos = Math.floor(Math.random() * (WIDTH - 100 + 1)) + 70;
                    helths_count -= 1;
                    if (helths_count == 0) {
                        removeEventListener('keydown', keyDown, false);
                        removeEventListener('keyup', keyUp, false);
                        player_left.visible = 0;
                        player_right.visible = 0;
                        delete timer;
                        moneys_visible = false;
                        gamepage = false;
                        restart(score);
                    }
                }
                else 
                    if (((xPos + player_right.width >= moneys[i].xPos) && (xPos <= moneys[i].xPos + moneys[i].width-25)) && (yPos + player_right.height>= moneys[i].yPos) && (yPos <= moneys[i].yPos + moneys[i].height-25))
                    {
                        moneys[i].yPos = - Math.floor(Math.random() * (400 - 30)) + 30;;
                        moneys[i].xPos = Math.floor(Math.random() * (WIDTH - 100 + 1)) + 70;
                        score += 1;
                    }
            }
        if (gamepage){
            requestAnimationFrame(draw);
            write_score(score);
        }
        
        }
        
    }
    spawnMoneys();
    moneys[moneys_count].img.onload = draw;
}

wrapper();