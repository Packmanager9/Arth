
window.addEventListener('DOMContentLoaded', (event) =>{


    
    let keysPressed = {}

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
     });
     
     document.addEventListener('keyup', (event) => {
         delete keysPressed[event.key];
      });

    let tutorial_canvas = document.getElementById("tutorial");
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');

    tutorial_canvas.style.background = "#000000"


    let flex = tutorial_canvas.getBoundingClientRect();

    // Add the event listeners for mousedown, mousemove, and mouseup
    let tip = {}
    let xs
    let ys
   
   
    
    window.addEventListener('mousedown', e => {

          flex = tutorial_canvas.getBoundingClientRect();
          xs = e.clientX - flex.left;
          ys = e.clientY - flex.top;
          tip.x = xs
          tip.y = ys
    
          tip.body = tip

          console.log(plants,herbis,preds)

     });
    
    

    class Triangle{
        constructor(x, y, color, length){
            this.x = x
            this.y = y
            this.color= color
            this.length = length
            this.x1 = this.x + this.length
            this.x2 = this.x - this.length
            this.tip = this.y - this.length*2
            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
            this.accept2 = (this.y-this.tip)/(this.x2-this.x)

        }

        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.stokeWidth = 3
            tutorial_canvas_context.moveTo(this.x, this.y)
            tutorial_canvas_context.lineTo(this.x1, this.y)
            tutorial_canvas_context.lineTo(this.x, this.tip)
            tutorial_canvas_context.lineTo(this.x2, this.y)
            tutorial_canvas_context.lineTo(this.x, this.y)
            tutorial_canvas_context.stroke()
        }

        isPointInside(point){
            if(point.x <= this.x1){
                if(point.y >= this.tip){
                    if(point.y <= this.y){
                        if(point.x >= this.x2){
                            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
                            this.accept2 = (this.y-this.tip)/(this.x2-this.x)
                            this.basey = point.y-this.tip
                            this.basex = point.x - this.x
                            if(this.basex == 0){
                                return true
                            }
                            this.slope = this.basey/this.basex
                            if(this.slope >= this.accept1){
                                return true
                            }else if(this.slope <= this.accept2){
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }


    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
        isPointInside(point){
            if(point.x >= this.x){
                if(point.y >= this.y){
                    if(point.x <= this.x+this.width){
                        if(point.y <= this.y+this.height){
                        return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){

            this.height = 0
            this.width = 0
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.xrepel = 0
            this.yrepel = 0
            this.lens = 0
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
        //    tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point){
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius*this.radius)){
                return true
            }
            return false
        }

        repelCheck(point){
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius+point.radius)*(point.radius+this.radius)){
                return true
            }
            return false
        }
    }

    class Line{
        constructor(x,y, x2, y2, color, width){
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        hypotenuse(){
            let xdif = this.x1-this.x2
            let ydif = this.y1-this.y2
            let hypotenuse = (xdif*xdif)+(ydif*ydif)
            return Math.sqrt(hypotenuse)
        }
        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.lineWidth = this.width
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.x1, this.y1)         
            tutorial_canvas_context.lineTo(this.x2, this.y2)
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.lineWidth = 1
        }
    }

    class Spring{
        constructor(body = 0){
            if(body == 0){
                this.body = new Circle(350, 350, 5, "red",10,10)
                this.anchor = new Circle(this.body.x, this.body.y+5, 3, "red")
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
                this.length = 1
            }else{
                this.body = body
                this.length = .1
                this.anchor = new Circle(this.body.x-((Math.random()-.5)*10), this.body.y-((Math.random()-.5)*10), 3, "red")
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
            }

        }
        balance(){
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)

                if(this.beam.hypotenuse() !=0){
            if(this.beam.hypotenuse() < this.length){
                    this.body.xmom += (this.body.x-this.anchor.x)/(this.length)/300
                    this.body.ymom += (this.body.y-this.anchor.y)/(this.length)/300
                    this.anchor.xmom -= (this.body.x-this.anchor.x)/(this.length)/300
                    this.anchor.ymom -= (this.body.y-this.anchor.y)/(this.length)/300
            }else if(this.beam.hypotenuse() > this.length){
                    this.body.xmom -= (this.body.x-this.anchor.x)/(this.length)/300
                    this.body.ymom -= (this.body.y-this.anchor.y)/(this.length)/300
                    this.anchor.xmom += (this.body.x-this.anchor.x)/(this.length)/300
                    this.anchor.ymom += (this.body.y-this.anchor.y)/(this.length)/300
            }

        }

        let xmomentumaverage 
        let ymomentumaverage
        xmomentumaverage = ((this.body.xmom)+this.anchor.xmom)/2
        ymomentumaverage = ((this.body.ymom)+this.anchor.ymom)/2

                this.body.xmom = ((this.body.xmom)+xmomentumaverage)/2
                this.body.ymom = ((this.body.ymom)+ymomentumaverage)/2
                this.anchor.xmom = ((this.anchor.xmom)+xmomentumaverage)/2
                this.anchor.ymom = ((this.anchor.ymom)+ymomentumaverage)/2
        }
        draw(){
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
            this.beam.draw()
            this.body.draw()
            this.anchor.draw()
        }
        move(){
                    this.body.move()
                    this.anchor.move()
        }

    }


    class Observer{
        constructor(){
            this.body = new Circle( 500, 500, 5, "white")
            this.ray = []
            this.rayrange = 220
            this.globalangle = Math.PI
            this.gapangle = Math.PI/8
            this.currentangle = 0
            this.obstacles = []
            this.raymake = 40
        }

        beam(){
            this.currentangle  = this.gapangle/2
            for(let k = 0; k<this.raymake; k++){
                this.currentangle+=(this.gapangle/Math.ceil(this.raymake/2))
                let ray = new Circle(this.body.x, this.body.y, 1, "white",((this.rayrange * (Math.cos(this.globalangle+this.currentangle))))/this.rayrange*2, ((this.rayrange * (Math.sin(this.globalangle+this.currentangle))))/this.rayrange*2 )
                ray.collided = 0
                ray.lifespan = this.rayrange-1
                this.ray.push(ray)
            }
            for(let f = 3; f<this.rayrange/2; f++){
                for(let t = 0; t<this.ray.length; t++){
                    if(this.ray[t].collided < 1){
                        this.ray[t].move()
                    for(let q = 0; q<this.obstacles.length; q++){
                        if(this.obstacles[q].isPointInside(this.ray[t])){
                            this.ray[t].collided = 1
                        }
                      }
                    }
                }
            }
        }

        draw(){
            this.beam()
            this.body.draw()
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.fillStyle = "red"
            tutorial_canvas_context.strokeStyle = "red"
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.body.x, this.body.y)
            for(let y = 0; y<this.ray.length; y++){
                    tutorial_canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
                        tutorial_canvas_context.lineTo(this.body.x, this.body.y)
                }
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.fill()
            this.ray =[]
        }

        control(){
            if(keysPressed['t']){
                this.globalangle += .05
            }
            if(keysPressed['r']){
                this.globalangle -= .05
            }
            if(keysPressed['w']){
                this.body.y-=2
            }
            if(keysPressed['d']){
                this.body.x+=2
            }
            if(keysPressed['s']){
                this.body.y+=2
            }
            if(keysPressed['a']){
                this.body.x-=2
            }
        }
    }

    class Shape{
        constructor(shapes){
            this.shapes = shapes
        }
        isPointInside(point){
            for(let t = 0; t<this.shapes.length;t++){
                if(this.shapes[t].isPointInside(point)){
                    return true
                }
            }
        
            return false
        }

    }

let plants = []
    class Plant{
        constructor(){
            this.dead = 0
            this.calories = 1000
            this.repcost = 1000
            this.repcap = 11000
            this.r = 0
            this.g = 205 + Math.floor(Math.random()*50)
            this.b = 0
            this.body = new Rectangle(Math.random()*700, Math.random()*700,1,1,`rgb(${this.r},${this.g},${this.b})`)
            plants.push(this)
        }
        draw(){
            this.grow()
            this.body.draw()
        }
        grow(){
            this.calories+=1
            if(this.calories > this.repcap){
                this.calories-=this.repcost
                let plant = new Plant()
            }
        }
    }
    let herbis = []
    class Herbi{
        constructor(){
            this.dead = 0
            this.dir = 0
            this.calories = 100000
            this.repcost = 200000
            this.repcap = 1200000
            this.r = 205+ Math.floor(Math.random()*50)
            this.g = 205 + Math.floor(Math.random()*50)
            this.b = 205+ Math.floor(Math.random()*50)
            this.body = new Rectangle(Math.random()*700, Math.random()*700,2,2,`rgb(${this.r},${this.g},${this.b})`)
            herbis.push(this)
        }
        draw(){
            this.breathe()
            this.grow()
            this.move()
            this.body.draw()
        }
        move(){
            if(Math.random()<.1){
                this.dir = Math.floor(Math.random()*9)
            }
            switch (this.dir) {
                case 0:
                    
                break;
                case 1:
                    this.body.x+=.25
                break;
                case 2:
                    this.body.x-=.25
                break;
                case 3:
                    this.body.y+=.25
                break;
                case 4:
                    this.body.y-=.25
                break;
                case 5:
                    this.body.x+=.25
                    this.body.y-=.25
                break;
                case 6:
                    this.body.x+=.25
                    this.body.y+=.25
                break;
                case 7:
                    this.body.x-=.25
                    this.body.y+=.25
                break;
                case 8:
                    this.body.x-=.25
                    this.body.y-=.25
                break;
            }
            if(this.body.x > 700){
                this.body.x = 700
            }
            if(this.body.y > 700){
                this.body.y = 700
            }
            if(this.body.x < 0){
                this.body.x = 0
            }
            if(this.body.y < 0){
                this.body.y = 0
            }
        }
        breathe(){
            this.calories-=10
            if(this.calories < 0){
                this.dead = 1
            }
        }
        grow(){
            
        for(let t = 0;t<plants.length;t++){
            if(this.body.isPointInside(plants[t].body)){
                plants[t].dead = 1
                this.calories+=plants[t].calories
            }
        }
        if(this.calories>this.repcap){
            this.calories-=this.repcost
             let herbi = new Herbi() 
             herbi.body.x=this.body.x
             herbi.body.y=this.body.y
        }
            
        }
    }

    let preds = []
    class Pred{
        constructor(){
            this.dead = 0
            this.dir = 0
            this.calories = 10000000
            this.repcost = 2000000
            this.repcap = 12000000
            this.r = 255 
            this.g = 0 + Math.floor(Math.random()*50)
            this.b = 128+ Math.floor(Math.random()*50)
            this.body = new Rectangle(Math.random()*700, Math.random()*700,2,2,`rgb(${this.r},${this.g},${this.b})`)
            preds.push(this)
        }
        draw(){
            this.breathe()
            this.grow()
            this.move()
            this.body.draw()
        }
        move(){
            if(Math.random()<.1){
                this.dir = Math.floor(Math.random()*9)
            }
            switch (this.dir) {
                case 0:
                    
                break;
                case 1:
                    this.body.x+=.25
                break;
                case 2:
                    this.body.x-=.25
                break;
                case 3:
                    this.body.y+=.25
                break;
                case 4:
                    this.body.y-=.25
                break;
                case 5:
                    this.body.x+=.25
                    this.body.y-=.25
                break;
                case 6:
                    this.body.x+=.25
                    this.body.y+=.25
                break;
                case 7:
                    this.body.x-=.25
                    this.body.y+=.25
                break;
                case 8:
                    this.body.x-=.25
                    this.body.y-=.25
                break;
            }
            if(this.body.x > 700){
                this.body.x = 700
            }
            if(this.body.y > 700){
                this.body.y = 700
            }
            if(this.body.x < 0){
                this.body.x = 0
            }
            if(this.body.y < 0){
                this.body.y = 0
            }
        }
        breathe(){
            this.calories-=200
            if(this.calories < 0){
                this.dead = 1
            }
        }
        grow(){
            
        for(let t = 0;t<herbis.length;t++){
            if(this.body.isPointInside(herbis[t].body)){
                herbis[t].dead = 1
                this.calories+=herbis[t].calories
            }
        }
        if(this.calories>this.repcap){
            this.calories-=this.repcost
             let pred = new Pred() 
             pred.body.x=this.body.x
             pred.body.y=this.body.y
        }
            
        }
    }

for(let t = 0;t<2000;t++){
    let plant = new Plant()
}

for(let t = 0;t<50;t++){
    let herbi = new Herbi()
}

for(let t = 0;t<2;t++){
    let pred = new Pred()
}



   
    window.setInterval(function(){ 
        tutorial_canvas_context.clearRect(0,0,tutorial_canvas.width, tutorial_canvas.height)

        for(let t = 0;t<plants.length;t++){
            if(plants[t].dead ==1){

            plants.splice(t,1)

            }
        }
        for(let t = 0;t<herbis.length;t++){
            if(herbis[t].dead ==1){

            herbis.splice(t,1)

            }
        }
        for(let t = 0;t<preds.length;t++){
            if(preds[t].dead ==1){

            preds.splice(t,1)

            }
        }
        for(let t = 0;t<plants.length;t++){
            plants[t].draw()
        }
        for(let t = 0;t<herbis.length;t++){
            herbis[t].draw()
        }
        for(let t = 0;t<preds.length;t++){
            preds[t].draw()
        }
    }, 14) 



        
})