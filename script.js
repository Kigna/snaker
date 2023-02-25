window.onload = function(){

    var canvas;
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    // var xCoord = 0;
    // var yCoord = 0;
    var snakee;
    var apple;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score = 0;
    var timeout;

    init();

    function init(){

            //creation l'espace du serpent
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
         // dessiner dans l'espace
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        apple = new Apple([10,10]);
        score = 0;
        refreshCanavas();
    }
//la fonction qui permet rafraîchir 
    function refreshCanavas() {

        snakee.advance();
        if(snakee.checkCollision())
        {
            gameOver();//fin du jeu
        }
        else
        {   //manger la pomme(apple)
            if(snakee.isEatingApple(apple))
            {
                score++;
                snakee.ateApple = true;
                do
                {
                apple.setNewPosition();
                }
                while(apple.isOnSnake(snakee))//si la nouvelle position de la pomme est sur le serpent
            }
            ctx.clearRect(0, 0, canvas.width, canvasHeight);
            drawScore();
            snakee.draw();
            apple.draw();
            timeout = setTimeout(refreshCanavas,delay);

        }
        
    }
    function gameOver(){

        ctx.save();
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "white";
        ctx.linewidth = 5;
        ctx.fillText("Game Over", 400, 150);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", 400, 170);
        ctx.restart();
    }
    // la fonction qui permet de faire rejouer 
    function restart(){

        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        apple = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanavas();

    }
    //permet affiche le score à l'écran
    function drawScore(){

        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;
        ctx.fillText(score.toString(), centerX, centerY);
        

    }
    function drawBlock(ctx, position){

        var x = position[0]*blockSize;
        var y = position[1]*blockSize;
        ctx.fillRect(x, y, blockSize, blockSize );
    }
    function Snake(body, direction){

        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){

            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore(); 
        };
        // la fonction qui permet de faire avancer le serpent
        this.advance = function(){

          var nextPosition = this.body[0].slice();  
          switch(this.direction)
          {
            case "left":
                nextPosition[0] -= 1;
                break;
            case "right":
                nextPosition[0] += 1;
                break;
            case "down":
                nextPosition[1] += 1;
                break;
            case "up":
                nextPosition[1] -= 1;
                break;
            default:
                throw("Invalid Direction") ;   

          }
          this.body.unshift(nextPosition);
          if(!this.ateApple) //Augumenter la taille du serpent ou pas
            this.body.pop();
          else
            this.ateApple = false;    
        };
        this.setDirection = function(newDirection){

            var allowedDirection;
            switch(this.direction)
          {
            case "left":
            case "right":
                allowedDirection = ["up", "down"];
                break;
            case "down":
            case "up":
                allowedDirection = ["left", "right"];
                break;
            default:
                throw("Invalid Direction") ;     

          }
          // la fonction qui permet de vérifier la direction (indexOf)
          if(allowedDirection.indexOf(newDirection) > -1)
          {
            this.direction = newDirection;
          }


        };
        // la fonction over gamer(perdre)
        this.checkCollision = function(){

            var wallCollisoin = false; // quand il prend le mur
            var snakeeCollsion = false; // quand il repasse sur lui même
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            {
                wallCollisoin = true;
            }

            for(var i = 0; i < rest.length ; i++ )
            {
                if(snakeX === rest[i][0] && snakeY == rest[i][1])
                {
                    snakeeCollsion = true;
                }
            }
            return wallCollisoin || snakeeCollsion;
        };
        // la fonction qui permet de manger la pomme(apple)
        this.isEatingApple = function(appleToEat){

            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;    


        };


    }

    function Apple(position){

        this.position = position;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#33cc33"
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        // permet de redonner une nouvelle position à la pomme(apple)
        this.setNewPosition = function(){

            var newX =Math.round(Math.random()* (widthInBlocks - 1));
            var newY =Math.round(Math.random()* (heightInBlocks - 1));
            this.position = [newX, newY];

        };
        //verifier si la pomme est sur le serpent
        this.isOnSnake = function(snakeToCheck){

            var isOnSnake = false;
            for(var i = 0; i < snakeToCheck.body.length; i++)
            {
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
                {
                    isOnSnake = true;
                }
            }
            return isOnSnake;

        };


    }

// la fonction qui permet de controler le serpent
    document.onkeydown = function handlekeyDown(e){
        
        var key = e.keyCode ;
        var newDirection;
        switch(key)
        {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break; 
            case 32:
                restart();
                return;     
            default:
                return;               
        }
        snakee.setDirection(newDirection);
    }
   
}