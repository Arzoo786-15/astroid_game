let startBtn=document.querySelector(".start");
let restartBtn=document.querySelector(".restart");
let box=document.querySelector(".box");
let canvas=document.querySelector(".board");
let tool=canvas.getContext("2d");
let scorElem=document.querySelector("span");
let powerLevelElement=document.querySelector(".meter span");

canvas.height=window.innerHeight;
canvas.width=window.innerWidth;
let score=0;
let fullPower=100;
let spaceImg=new  Image();
spaceImg.src="space.png";
let earthImg=new  Image();
let CoronaImg=new  Image();
CoronaImg.src="corona.jpg";
let eHeight=40;
let eWidth=40;
let ePosX=canvas.width/2-20;
let ePosY=canvas.height/2-20;
earthImg.src="earth.png";
class Bullet{
    constructor(x,y,width,height,velocity){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.velocity=velocity;
    }
    draw(){
        tool.fillStyle="white";
tool.fillRect(this.x,this.y,this.width,this.height)
    }
    update(){
        this.draw();
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
    }
}
class Corona{
    constructor(x,y,width,height,velocity){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.velocity=velocity;
    }
    draw(){
        // tool.fillStyle="white";
tool.drawImage(CoronaImg,this.x,this.y,this.width,this.height)
    }
    update(){
        this.draw();
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
    }
}
let bullets=[]
let coronas=[];
let particles=[];
class Planet{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }
    draw(){
        tool.drawImage(earthImg,this.x,this.y,this.width,this.height)
    }
}
class Particle{
    constructor(x,y,radius,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.velocity=velocity;
        this.alpha=1;
    }
    draw(){
        tool.save();
        tool.globalAlpha=this.alpha;
        tool.beginPath();
        tool.fillStyle="white"
        tool.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        tool.fill();
        tool.restore();
    }
    update(){
        this.draw()
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
        this.alpha-=0.01;
    }
}
let animId;
function animate(){
    tool.clearRect(0,0,canvas.width,canvas.height)
    tool.fillRect(0,0,canvas.width,canvas.height)
tool.drawImage(spaceImg,0,0,canvas.width,canvas.height)

let earth=new Planet(ePosX,ePosY,eWidth,eHeight);
earth.draw()
particles.forEach(function(particle,index){
    if(particle.alpha<=0){


        setInterval(function(){
particles.splice(index,1)
        },0)
    }
    else{
        particle.update()
    }

    
})
let bLength=bullets.length;
 for(let i=0;i<bullets.length;i++){
        bullets[i].update();
 if(bullets[i].x<0||bullets[i].y<0||bullets[i].x>canvas.width||bullets[i].y>canvas.height){
     setTimeout(function(){0
        bullets.splice(i,1)
     })
   
 }
    }

    coronas.forEach(function(corona,i){
        corona.update();
        let enemy=corona;
        if(colRect(earth,enemy)){
         fullPower-=20;
         powerLevelElement.style.width=`${fullPower}%`
        coronas.splice(i,1);
        if(fullPower==0){
            cancelAnimationFrame(animId);
            // alert("Game Over!!")
            restart();
        }
        
        }
        bullets.forEach(function(bullet,bulletIndex){
            if(colRect(enemy,bullet)){
                for(let i=0;i<bullet.width*4;i++){
                    particles.push(new Particle(bullet.x,bullet.y,Math.random()*2,
                    {x:(Math.random()-0.5)*(Math.random()*6),
                        y:(Math.random()-0.5)*(Math.random()*6)}))
                }
             setTimeout(()=>{
                    coronas.splice(i,1);
                    bullets.splice(bulletIndex,1);
                    score+=100;
                    scorElem.innerHTML=score;
                },0)
            }
        })
    })

   animId= requestAnimationFrame(animate);
}
function createCorona(){
    setInterval(function(){
        //corona logic
        let x=Math.random()*canvas.width;
        let y=Math.random()*canvas.height;
      let delta=Math.random();
      if(delta<0.5){
         x=Math.random()<0.5?0:canvas.width;
          y=Math.random()*canvas.height
       }
    else{
      y=Math.random()<0.5?0:canvas.height;
        x=Math.random()*canvas.width; 
       }
        let angle=Math.atan2(canvas.height/2-y,canvas.width/2-x);
        let velocity={
            x:Math.cos(angle)*1,
            y:Math.sin(angle)*1
        }
    let corona= new Corona(x,y,40,40,velocity);
    coronas.push(corona);
    },1000)
}
startBtn.addEventListener("click",function(e){
    e.stopPropagation();
box.style.display="none"

animate()
createCorona();
window.addEventListener("click",function(e){
    let angle=Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);
    let velocity={
        x:Math.cos(angle)*2,y:Math.sin(angle)*2
    }
   let bullet= new Bullet(canvas.width/2,canvas.height/2,7,7,velocity)
   bullet.draw();
   bullets.push(bullet);
})


})
function colRect(entity1,enetity2){
    let l1=entity1.x;
    let l2=enetity2.x;
    let r1=entity1.x+entity1.width;
    let r2=enetity2.x+enetity2.width;
    let t1=entity1.y+entity1.height;
    let t2=enetity2.y+enetity2.height;
    let b1=entity1.y;
    let b2=enetity2.y;
    if(l1<r2&&l2<r1&&t1>b2&&t2>b1){
return true;
    }
    return false;
}
window.addEventListener("resize",function(){
    this.window.location.reload();
})
function restart(){
    restartBtn.style.display="block";
    startBtn.style.display="none";
    box.style.display="flex";
    powerLevelElement.parentElement.style.display="none";
    document.body.style.backgroundColor="white";
    canvas.height="0px"
restartBtn.addEventListener("click",function(){
    window.location.reload();
})

}