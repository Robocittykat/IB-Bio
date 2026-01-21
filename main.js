let features = {
    a:false, //large population
    b:true, //accurate genetics
    c:false, //random reproduction
    d:false, //age mechanic
    e:false, //complexified predators
    trees:0,
}

class genotype{
    constructor(...gene){
	this.genes = gene
	if(gene.length == 1){
	    this.color = gene[0]
	}else{
	    this.color = this.calcPheno()
	}
    }
	
    calcPheno(){
	return Math.max(...this.genes)
    }
}let g = (...gene)=>new genotype(...gene)


class moth{
    constructor(geno){
	this.geno = geno
    }		
}




let moths = []
for(let i = 0; i<(10*100**features.a); i++){
    if(!features.b){
        moths = moths.concat(new moth(g(Math.floor(Math.random()*2))))
    }else{
	moths = moths.concat(new moth(g(Math.floor(Math.random()*2),Math.floor(Math.random()*2))))
    }
}



function simulationTick(){
    let killedMoths = []
    for(let org of moths){
	if(org.geno.color == features.trees){
	    if(Math.random() < 0.01){
		killedMoths = killedMoths.concat(org)
	    }
	}else{
	    if(Math.random() < 0.2){
		killedMoths = killedMoths.concat(org)
	    }
	}
    }
    for(let org of killedMoths){
	moths.splice(moths.indexOf(org),1)
    }
    let newMoths = []
    for(let org of killedMoths){
	let genes
	if(!features.b){
	    genes = moths[Math.floor(Math.random()*moths.length)].geno.color
	    if(Math.random() < 0.1){
	        genes = Number(!genes)
	    }
	}else{
	    let p1 = moths[Math.floor(Math.random()*moths.length)]
            let p2 = moths[Math.floor(Math.random()*moths.length)]

	    let g1 = p1.geno.genes[Math.floor(Math.random()*2)]
	    let g2 = p2.geno.genes[Math.floor(Math.random()*2)]
	    genes = [g1,g2]
        }
	newMoths = newMoths.concat(new moth(g(genes)))
    }moths = moths.concat(newMoths)

    mothInfo()
}



function mothInfo(){
    let dark = 0
    let light = 0
    let carriers = 0
    for(let org of moths){
	if(org.geno.color == 0){
	    light++
	}else{
	    dark++
	}

	if(features.b){
	    if(org.geno.genes[0] != org.geno.genes[1]){
		carriers++
	    }
	}
    }
    console.log("dark:" + dark)
    console.log("light:" + light)
    if(features.b){
	console.log("carriers:" + carriers)
    }
    display.max = moths.length
    display.value=light
}

mothInfo()

//setInterval(simulationTick,100)
