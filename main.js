class tile{
	constructor(type){
		this.type = type
	}
}

class genotype{
	constructor(g1,g2){
		this.g1 = g1
		this.g2 = g2
	}
	
	calcPheno(){
		return Math.max(this.g1,this.g2)
	}
}

class moth{
	constructor(geno,pos){
		this.color = geno.calcPheno
		this.geno = geno
		this.pos = pos
	}
	
	move(){
		this.pos.x += Math.sign(Math.random()-0.5)
		this.pos.x = this.pos.x % 6
		
		this.pos.y += Math.sign(Math.random()-0.5)
		this.pos.y = this.pos.y % 6
	}
}

function t(type){
	return new tile(type)
}

let forest = [
	[t(0),t("-"),t(0),t("-"),t(0),t("-")],
	[t(0),t("-"),t(0),t("-"),t(0),t("-")],
	[t(0),t("-"),t(0),t("-"),t(0),t("-")],
	[t(0),t("-"),t(0),t("-"),t(0),t("-")],
	[t(0),t("-"),t(0),t("-"),t(0),t("-")],
	[t(0),t("-"),t(0),t("-"),t(0),t("-")],
]


let moths = []
for(let i = 0; i<18; i++){
	moths = moths.concat(new moth(new genotype(0,0),{x:Math.floor(Math.random()*6),y:Math.floor(Math.random()*6)}))
}



function simulationTick(){
	for(let org of moths){
		org.move()
	}
}


console.log(forest)

function showForest(){
    let toLog = ""
    for(let i=0; i<forest.length; i++){
	for(let j=0; j<forest[i].length; j++){
	    let noMoth = true
	    for(org of moths){
		if(org.pos.x == j && org.pos.y == i){
		    toLog += ["m","M"][org.geno.calcPheno()]
		    noMoth = false
		    break
		}
	    }if(noMoth){
		toLog += forest[i][j].type
	    }
	}
	toLog += "\n"
    }
    console.log(toLog)
}showForest()
