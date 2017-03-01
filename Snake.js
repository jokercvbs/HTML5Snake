
    var ccPos;
    var preCode, cw = 1000, ch = 600, code, t;

    var Food=
        {
            foodPos:[],
            init:function ()
            {
                var pos = this.foodPos;
                pos[0] = random(cw/25);
                pos[1] = random(ch/25);
                this.initCheck(pos, Sneak.sneakArray);
                var length = Sneak.sneakArray;
                console.info("Init Food Successed!");
            },

            initCheck:function(arr, arr2)
            {
                if (arr2 == undefined) return;
                for (let el of arr2)
                {
                    if (arr[0] == el[0] && arr[1] == el[1])
                    {
                        Food.init();
                        console.info("Prevent success!");
                    }
                }
            },
            collideCheck:function(arrFood, arrSnake)
            {
                var _head = arrSnake[arrSnake.length - 1];
                if (_head[0] == arrFood[0] && _head[1] == arrFood[1])
                {
                    //下面这两句话不能颠倒
                    Food.init();
                	//向数组头部添加对象
                    arrSnake.unshift(arrFood);
                }
            }
        };

    var Sneak =
        {
            sneakArray:[],
            initLength:4,
            init:function ()
            {
                var pos = [];
                var initLength = this.initLength;
                pos[0] = [];
                pos[0][0] = random(cw/25 - initLength);
                pos[0][1] = random(ch/25 - initLength);
                for(var i = pos.length; i < initLength; i++)
                {
                    pos[i] = [];
                    pos[i][0] = pos[i-1][0]+1;
                    pos[i][1] = pos[i-1][1];
                }
                preCode = 39;
                this.sneakArray = pos;
            },
            move:function (code)
            {
                var pos = this.sneakArray,
                    _head = pos[pos.length - 1], _x, _y;
                switch (code)
                {
                    case 37:
                        _x = _head[0] - 1;
                        pos.push([_x, _head[1]]);
                        break;
                    case 38:
                        _y = _head[1] - 1;
                        pos.push([_head[0], _y]);
                        break;
                    case 39:
                        _x = _head[0] + 1;
                        pos.push([_x, _head[1]]);
                        break;
                    case 40:
                        _y = _head[1] + 1;
                        pos.push([_head[0], _y]);
                        break;
                }
                pos.shift();
                preCode = code;
                return pos;
            },
            collideCheck:function (head, arr)
            {
                var limit = head[0] < 0 || head[0] >= cw/25 || head[1] < 0 || head[1] >= ch/25;
                if (limit)
                {
                    over();
                    return;
                }
                for (let body of arr)
                {
                    if (arr.indexOf(body) != arr.length - 1)
                    {
                        if (body[0] == head[0] && body[1] == head[1])
                        {
                            over();
                            return;
                        }
                    }
                }
            }
        };

    function random(range)
    {
        var m = Math.floor(Math.random() * range);
        return m;
    }

    function drawCircle(x, y, d, fillColor)
    {
        ctx.beginPath();
        ctx.arc(x*d + 0.5*d, y*d + 0.5*d, 0.5*d, 0, 2*Math.PI);
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    function init()
    {
        var canvas = document.getElementById("myCanvas");
        ctx = canvas.getContext('2d');
        canvas.width = cw;
        canvas.height = ch;
        document.addEventListener("keyup", ready);
        welcome();
        // document.addEventListener("keyup", keyboardpress);
        // gameInit();
    }

    function welcome()
    {
        ctx.clearRect(0, 0, cw, ch);
        ctx.fillStyle = "white";
        ctx.font = ch*2/15 + "px Lucida Console";
        ctx.fillText("Snaker", cw/3, ch/2, cw*2/3);
        ctx.font = ch*1/25 + "px Lucida Console";
        ctx.fillText("Press \"Enter\" to Start", cw*3/10, 11*ch/15, cw*2/5);
    }

    function keyboardpress(e)
    {
        e.preventDefault();
        var tempCode = e.keyCode || e.which,
            deter = tempCode == 37 || tempCode == 38 || tempCode == 39 || tempCode == 40;
        if (!deter) return;
        code = tempCode;
        if (Math.abs(preCode - code) == 2)
        {
            code = preCode;
        };
    }

     function update()
     {
         ccPos = setTimeout(function func()
         {
             var f = Food.foodPos,
                 s = Sneak.sneakArray;
             t = setTimeout(func, 100);
             ctx.clearRect(0, 0, cw, ch);
             // 先绘制后检测，顺序不能颠倒，不然碰撞结束之后还是会进行绘制
             foodRender(f);
             sneakBodyRender(Sneak.move(code));
             Food.collideCheck(f, s);
             Sneak.collideCheck(s[s.length-1], s);
         },50);
     }

    function sneakBodyRender(arr)
    {
        arr.forEach(function (pos)
        {
            var _x = pos[0], _y = pos[1];
            drawCircle(_x, _y, 25, "red");
        });
    }

    function over()
    {
        wel = false;
        document.removeEventListener("keyup", keyboardpress);
        document.addEventListener("keyup", ready);
        clearTimeout(t);
        clearTimeout(ccPos);
        dead();
        console.info("Game Over");
    }

    function ready(e)
    {
        if (e.keyCode == 13)
        {
            document.removeEventListener("keyup", ready);
            document.addEventListener("keyup", keyboardpress);
            code = 39;
            start();
        }
    }

    function dead()
    {
        ctx.clearRect(0, 0, cw, ch);
        ctx.fillStyle = "white";
        ctx.font = ch*2/15 + "px Lucida Console";
        ctx.fillText("You are Dead!", cw/6, ch/2, cw*2/3);
        ctx.font = ch*1/25 + "px Lucida Console";
        ctx.fillStyle = "#ccc";
        ctx.fillText("Press \"Enter\" to Restart", cw*3/10, 11*ch/15, cw*2/5);
    }

    function foodRender()
    {
        drawCircle(Food.foodPos[0], Food.foodPos[1], 25, "blue");
    }

    function start()
    {
        Sneak.init();
        Food.init();
        update();
    }
