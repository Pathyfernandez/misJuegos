var worldDict={
    0:'blank',
    1:'wall',
    2:'sushi',
    3:'onigiri',
    blank:0,
    wall:1,
    sushi:2,
    onigiri:3,
    sushiPnts:10,
    onigiriPnts:5
}

function copy2DArray(arr){
    var NewArr=[[]];
    //console.log('copy2d: '+arr.length+' x '+arr[0].length);
    for (var row=0;row<arr.length;row++){
        //console.log('row '+arr[row]);
        NewArr[row]=[];
        for (var col=0;col<arr[row].length;col++){
            NewArr[row][col]=arr[row][col];
        }
    }
    return NewArr;		
}

function check2dArrIsAllNum(arr,num){
    for (var row=0;row<arr.length;row++){
        for (var col=0;col<arr[row].length;col++){		
            if (arr[row][col]!=num){
                return false;
            }
        }
    }
    return true;
}

function floodfill(Amap,row,col,newVal){

    if (Amap[row][col]==newVal){
        return;
    }else{
        Amap[row][col]=newVal;
        if (row<Amap.length-1){
            floodfill(Amap,row+1,col,newVal);
        }
        if (row>0){
            floodfill(Amap,row-1,col,newVal);
        }
        if (col<Amap.length-1){
            floodfill(Amap,row,col+1,newVal);
        }
        if (col>0){
            floodfill(Amap,row,col-1,newVal);
        }
    }
}

var world={
    Level:1,
    MaxScore:0,
    size:7,
    map:[[]],
    generate: function(){
        this.MaxScore=0;
        //console.log(this.map);
        this.map.length=this.size;
        
        for (var row=0;row<this.size;row++){
            this.map[row]=[];
            for (var col=0;col<this.size;col++){
                this.map[row][col]=(worldDict.wall);
                //console.log(this.map[row][col]);
            } 
        }
        //console.log(this.map);
        ghosts.setStartPositions();
        
        for (var row=1;row<this.size-1;row++){
            for (var col=1;col<this.size-1;col++){
                if (col==1&&row==1){
                    
                    this.map[1][1]=worldDict.blank;
                    continue;
                }else {
                    var doContinue=false;
                    for (var idx=0;idx<ghosts.ghostList.length;idx++){
                        if(col==(ghosts.ghostList[idx].startX) && row==(ghosts.ghostList[idx].startY)){
                            
                            console.log("ghost start:" +ghosts.ghostList[idx].name+', '+ ghosts.ghostList[idx].startX+','+ ghosts.ghostList[idx].startY);
                            this.map[row][col]=worldDict.blank;
                            doContinue=true;
                        }
                    }
                    if (doContinue){
                        continue;
                    }
                }					
                this.map[row][col]=Math.floor(Math.random()*4);
                //console.log(this.map[row][col]);
                
                if (this.map[row][col]==worldDict.sushi){
                    this.MaxScore+=worldDict.sushiPnts;
                }
                if (this.map[row][col]==worldDict.onigiri){
                    this.MaxScore+=worldDict.onigiriPnts;
                }
            }
        }
        
        var lockedblock=true;
        for (var row=1;row<this.size-1;row++){
            for (var col=1;col<this.size-1;col++){
                if (this.map[row][col]!=worldDict.wall){
                    lockedblock=true;
                    if (this.map[row+1][col]!=worldDict.wall){
                        lockedblock=false;
                    }
                    if (this.map[row-1][col]!=worldDict.wall){
                        lockedblock=false;
                    }
                    if (this.map[row][col+1]!=worldDict.wall){
                        lockedblock=false;
                    }
                    if (this.map[row][col-1]!=worldDict.wall){
                        lockedblock=false;
                    }
                    if (lockedblock){
                        if (Math.floor(Math.random()*2)==0){
                            if (col>this.size/2){
                                this.map[row][col-1]=worldDict.blank;
                            }else{
                                this.map[row][col+1]=worldDict.blank;
                            }
                        } else{
                            if (row>this.size/2){
                                this.map[row-1][col]=worldDict.blank;
                            }else{
                                this.map[row+1][col]=worldDict.blank;
                            }								
                        }
                    }
                }
            }
        }
        
    
        var checkmap=copy2DArray(this.map);
        //console.log('checkmap after floodfill');

        
        floodfill(checkmap,1,1,worldDict.wall);
        
        if (check2dArrIsAllNum(checkmap,worldDict.wall)){
            console.log('world Check ok.');
        }else{
            
            console.log('world Check failed.  Regenerating.');
            this.generate();
        }	
        this.draw();
        var snd=document.getElementById('gameStartSnd');
        snd.play();
    },

    draw: function(){
        var output='';
        for (var row=0;row<this.map.length;row++){
            output+= "<div id='row"+row+"' class='row'>";
            for(var col=0;col<this.map[row].length;col++){
                output+="<div id='col"+col+"' class='"+worldDict[this.map[row][col]] +"'></div>";
            }
            output+="</div>";
        }
        document.getElementById('world').innerHTML=output;			
    },
    
}


var ninjaman={
    X:1,
    Y:1,
    NewLifeScore:0,
    LevelScore:0,
    TotalScore:0,
    Lives:3,
    e:document.getElementById('ninjaman'),
    nomSound:document.getElementById('nomSnd'),
    gainLifeSnd:document.getElementById('gainLifeSnd'),
    
    LevelUp:function(){
        this.X=1;
        this.Y=1;
        this.LevelScore=0;
        
        this.draw();
    },
    reset:function(){
        this.e.style.visibility="visible";
        this.X=1;
        this.Y=1;
        this.LevelScore=0;
        this.TotalScore=0;
        this.NewLifeScore=0;
        this.Lives=3;
        this.draw();
    },
    draw:function(){
        this.e.style.top=this.Y*40+'px';
        this.e.style.left=this.X*40+'px';
        //console.log('drawNinjaman: '+this.X+', '+this.Y);
    },
    interact: function(x,y){
        if (x!=this.X){
            if (x>this.X){	//right
                ninjaman.e.style.webkitTransform= 'rotateY(0deg)'; 	
            } else{			//left
                ninjaman.e.style.webkitTransform= 'rotateY(-180deg)';	
            }
        }
        if (y!=this.Y){		
            if (y>this.Y){	//down
                ninjaman.e.style.webkitTransform= 'rotate(90deg)';
            }else{			//up
                ninjaman.e.style.webkitTransform= 'rotate(-90deg)';
            }
        }
        
        if (world.map[y][x]!=worldDict.wall){
            
            this.X=x;
            this.Y=y;
            this.draw();
            if (ghosts.checkCollision()){
                
                return;
            }
            if (world.map[y][x]==worldDict.sushi){
                
                this.nomSound.currentTime=0;
                this.nomSound.play();
                this.LevelScore+=worldDict.sushiPnts;
                this.TotalScore+=worldDict.sushiPnts;
                this.NewLifeScore+=worldDict.sushiPnts;
                
                document.getElementById('row'+y).children[x].className='blank';
                world.map[y][x]=0;
                
            }
            if (world.map[y][x]==worldDict.onigiri){
                
                this.nomSound.currentTime=0;
                this.nomSound.play();
                this.LevelScore+=worldDict.onigiriPnts;
                this.TotalScore+=worldDict.onigiriPnts;
                this.NewLifeScore+=worldDict.onigiriPnts;
                
                document.getElementById('row'+y).children[x].className='blank';
                world.map[y][x]=0;
            }
            
            if (this.NewLifeScore>=100){
                gainLifeSnd.play();
                this.NewLifeScore=0;
                this.Lives++;
            }
            
            if (this.LevelScore==world.MaxScore){
                var snd=document.getElementById('levelCompleteSnd');
                snd.play();
                document.getElementById('board').innerText='Level: '+world.Level+'	Lives: '+this.Lives+' Score: '+this.TotalScore+' | '+this.LevelScore+'	\n!!!! LEVEL COMPLETE !!!\nPress SPACE to continue.';	
            } else{
                document.getElementById('board').innerText='Level: '+world.Level+'	Lives: '+this.Lives+' Score: '+this.TotalScore+' | '+this.LevelScore;
            }
        } else {
            //console.log('wall');
        }			
    }
}

function Ghost(name){
    this.name=name;
    this.startX=world.size-2;
    this.startY=world.size-2;
    this.X=this.startX;
    this.Y=this.startY;
    this.speed=5;
    this.moveX=0;
    this.moveY=0;
    this.IsChasing=false;
    document.getElementById('ghosts').innerHTML+="<div id='"+this.name+"' class='ghost'></div>";
    this.e=document.getElementById(this.name);
    this.reset=function(){
        console.log(name+"reset");
        this.X=this.startX;
        this.Y=this.startY;
        this.speed=5;
        this.moveX=0;
        this.moveY=0;
        this.IsChasing=false;
        this.draw();
    };
    this.draw=function(){
        this.e.style.top=this.Y*40+'px';
        this.e.style.left=this.X*40+'px';
        console.log(this.name+'ghost.draw: '+this.X+', '+this.Y);
    };
    this.interact=function(){
        
        if (this.checkCollision()){
            return;
        };
        //console.log('ghost view');
        var isChasing=false;

        
        if (this.Y==ninjaman.Y){
            //console.log('same Y level');
            
            for (var x=this.X+1;x<world.size;x++){
                if (world.map[this.Y][x]==worldDict.wall){
                    
                    break;
                }else{
                    if(x==ninjaman.X){
                        
                        isChasing=true;
                        this.moveX=1;
                        this.moveY=0;
                        break;
                    }
                }
            }
            
            for (var x=this.X-1;x>0;x--){
                if (world.map[this.Y][x]==worldDict.wall){
                    
                    break;
                }else{
                    if(x==ninjaman.X){
                        
                        isChasing=true;
                        this.moveX=-1;
                        this.moveY=0;
                        break;
                    }
                }
            }
        } else if (this.X==ninjaman.X){
            
            for (var y=this.Y+1;y<world.size;y++){
                if (world.map[y][this.X]==worldDict.wall){
                    
                    break;
                } else {
                    if(y==ninjaman.Y){
                        
                        isChasing=true;
                        this.moveX=0;
                        this.moveY=1;
                    }
                }
            }
            for (var y=this.Y-1;y>0;y--){
                if(world.map[y][this.X]==worldDict.wall){
                    
                    break;
                }else{
                    if(y==ninjaman.Y){
                    
                        isChasing=true;
                        this.moveX=0;
                        this.moveY=-1;
                    }
                }
            }
        }
        
        if (!isChasing){
            if (this.moveY!=0){
                if (world.map[this.Y+this.moveY][this.X]==worldDict.wall){
                    this.moveY=0;
                }
            }
            if (this.moveX!=0){
                if(world.map[this.Y][this.X+this.moveX]==worldDict.wall){
                    this.moveX=0;
                }
            }
        }
        
        this.X+=this.moveX;
        this.Y+=this.moveY;
        this.draw();
        
        this.checkCollision();
        if (this.IsChasing&&!isChasing){
            console.log("Ninja!");
        }
        this.IsChasing=isChasing;
    };
    this.checkCollision= function(){
        
        var result=false;
        if (this.X==ninjaman.X&&this.Y==ninjaman.Y){
            
            ninjaman.Lives--;
            result=true;
            if (ninjaman.Lives<=0){
                var snd=document.getElementById("gameOverSnd");
                snd.play();
                document.getElementById('board').innerText='Level: '+world.Level+'  Lives: '+ninjaman.Lives+' Score: '+ninjaman.TotalScore+' | '+ninjaman.LevelScore+'\n!!!!	G.A.M.E O.V.E.R	!!!\n Press SPACE to restart.';	
            } else{
                if (ninjaman.LevelScore==world.MaxScore){
                    
                    document.getElementById('board').innerText='Level: '+world.Level+'	Lives: '+ninjaman.Lives+' Score: '+ninjaman.TotalScore+' | '+ninjaman.LevelScore+'	\n!!!! LEVEL COMPLETE (by Kamakazee) !!!\nPress SPACE to continue.';					
                }else{
                    var snd=document.getElementById("looseLifeSnd");
                    snd.play();
                    document.getElementById('board').innerText='Level: '+world.Level+'	Lives: '+ninjaman.Lives+' Score: '+ninjaman.TotalScore+' | '+ninjaman.LevelScore;				
                    ninjaman.X=1;
                    ninjaman.Y=1;
                    ninjaman.draw();
                    
                    while (this.X<3&&this.Y<3||world.map[this.Y][this.X]==worldDict.wall){
                        this.X++;
                        this.Y++;
                    }
                }
            }
            
        }
        return result;
    }
}

var ghosts={
    ghostList:[],
    add:function(name){
        var Aghost=new Ghost(name);
        this.ghostList.push(Aghost);
        for (var idx=0;idx<this.ghostList.length;idx++){
            this.ghostList[idx].e=document.getElementById(this.ghostList[idx].name);
        }			
        return Aghost;
    },
    interact: function(){
        for (var idx=0;idx<this.ghostList.length;idx++){
            this.ghostList[idx].interact();
        }
    },
    draw: function(){
        for (var idx=0;idx<this.ghostList.length;idx++){
            this.ghostList[idx].draw();console.log("draw ghosts");
        }
    },
    checkCollision: function(){
        for (var idx=0;idx<this.ghostList.length;idx++){
            if (this.ghostList[idx].checkCollision()){return true};
        }
        return false;
    },
    reset:function(){
        for (var idx=0;idx<this.ghostList.length;idx++){
            this.ghostList[idx].reset();
        }
    },
    setStartPositions:function(){
        
        for (var idx=0;idx<this.ghostList.length;idx++){
            var num=Math.random()*(world.size-4)+3;
            this.ghostList[idx].startX=Math.floor(num);
            num=Math.random()*(world.size-4)+3;
            this.ghostList[idx].startY=Math.floor(num);
            console.log("setStartPositions: "+this.ghostList[idx].name+', '+this.ghostList[idx].startX+', '+this.ghostList[idx].startY);
        }
    },
    newGame:function(){
        document.getElementById("ghosts").innerHTML="";
        this.ghostList.length=0;
        this.add("pinky");
    }
}


function handlekey(key){
    //console.log('key: pressed '+key.keyCode);
    
    if (ninjaman.LevelScore==world.MaxScore||ninjaman.Lives<=0){
        
        if (key.keyCode!=32){
            return;
        }
        
        if (ninjaman.LevelScore==world.MaxScore){
            world.size++;
            world.Level++;
            ninjaman.LevelUp();
            if (world.Level==4){
                ghosts.add("red");
                ghosts.ghostList[1].e.style.backgroundImage="url('img/red.gif')";
                ghosts.draw();
            }
            if (world.Level==6){
                ghosts.add("pumpky");
                ghosts.ghostList[2].e.style.backgroundImage="url('img/pumpky.gif')";
                ghosts.draw();
            }				
            if (world.Level==9){
                ghosts.add("bluey");
                ghosts.ghostList[3].e.style.backgroundImage="url('img/bluey.gif')";
                ghosts.draw();
            }
            if (world.Level==11){
            
            }
        } else {
            
            document.getElementById("startscreen").innerHTML="";
            world.size=7;
            world.Level=1;
            ghosts.newGame();
            ninjaman.reset();
        }
        world.generate();
        ghosts.reset();
    }
    
    
    var newX=ninjaman.X;
    var newY=ninjaman.Y;
    switch (key.keyCode){
        case 37:  //left
            newX--;
            break;
        case 39://right
            newX++;
            break;
        case 38://up
            newY--;
            break;
        case 40://down
            newY++;
    }
    ninjaman.interact(newX,newY);
    ghosts.interact();
}

function key_pad(code){
    
    var key={keyCode:code}
    handlekey(key);
}


ninjaman.Lives=0;
world.MaxScore=1;

document.onkeyup=handlekey;