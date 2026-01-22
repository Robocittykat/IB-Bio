let features = {
    a:true, //large population
    b:true, //accurate genetics
    c:false, //random reproduction
    d:false, //age mechanic
    e:false, //complexified predators
    trees:1,
}

const MutationRate = 0.000001
const ShownPredRate = 0.122
const CamoPredRate = 0.111
const StartRatio = 0.000005 //chance of dom gene
 
//expectation: (from https://sites.lsa.umich.edu/globalchange/labs/natural-selection-and-mutation-the-case-of-the-peppered-moth/)
//1750 - 0.00001 (not sampled because starting dist)
//1850 - 0.01
//1950 - 0.9


//Shown moths die 1.1x as often (Majerus)
//Moths live 9 months, doing the math we get that there's about 1/9 chance of dying
//      per month
//Thus camo death rate is 0.111, shown is 0.122


let year = 1750
let month = 0



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


function getRandomGene(){
    if(Math.random() < StartRatio){
	return 1
    }else{
	return 0
    }
}

let moths = []
for(let i = 0; i<(10*1000**features.a); i++){
    if(!features.b){
        moths = moths.concat(new moth(g(getRandomGene())))
    }else{
	moths = moths.concat(new moth(g(getRandomGene(),getRandomGene())))
    }
}



function simulationTick(){
    let killedMoths = []
    for(let org of moths){
	if(org.geno.color == features.trees){
	    if(Math.random() < CamoPredRate){
		killedMoths = killedMoths.concat(org)
	    }
	}else{
	    if(Math.random() < ShownPredRate){
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
	    if(Math.random() < MutationRate){
	        genes = Number(!genes)
	    }
	}else{
	    let p1 = moths[Math.floor(Math.random()*moths.length)]
            let p2 = moths[Math.floor(Math.random()*moths.length)]

	    let g1 = p1.geno.genes[Math.floor(Math.random()*2)]
	    let g2 = p2.geno.genes[Math.floor(Math.random()*2)]

	    if(Math.random() < MutationRate){
		g1 = Number(!g1)
	    }if(Math.random() < MutationRate){
		g2 = Number(!g2)
	    }
	    genes = [g1,g2]
        }
	newMoths = newMoths.concat(new moth(g(...genes)))
    }moths = moths.concat(newMoths)

    month ++
    if(month >= 12){
	year ++
	month = 0
    }

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
    time.innerHTML = month+"/"+year
}

mothInfo()

//let ticker = setInterval(simulationTick,100)
function stop(){
    clearInterval(ticker)
}
