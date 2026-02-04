let features = {
    a:false, //large starting population
    b:false, //accurate genetics
    c:false, //random reproduction
    d:false, //age mechanic
    e:false, //gradual ashification over 50 years
}

const MutationRate = 0.0005
const BasePredRate = 0.111
const StartRatio = 0.000005 //chance of dom gene
const OffspringCount = 4 //only matters with C enabled
 
//expectation: (from https://sites.lsa.umich.edu/globalchange/labs/natural-selection-and-mutation-the-case-of-the-peppered-moth/)
//1750 - 0.00001 (not sampled because starting dist)
//1850 - 0.01
//1950 - 0.9


//Shown moths die 1.1x as often (Majerus)
//Moths live 9 months, doing the math we get that there's about 1/9 chance of dying
//      per month
//Thus camo death rate is 0.111, shown is 0.122


let year
let month

let shownPenalty
let trees




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
		this.age = 0
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


function ageToDeathRate(age){
	const b = 0.092
	if(age <= 9){
		return age*b/9
	}else{
		return (1-b)/3 * (age-12) + 1
	}
	//this was a formula found by my brother that keeps to the 9-month average lifespan, while preventing life over a year
}

function simulationTick(){
	let carryingCap = 500 * 10**features.a
	while(moths.length > carryingCap){moths.shift()}
	
    let killedMoths = []
	
	if(!features.d){
		for(let org of moths){
			if(org.geno.color == trees){
				if(Math.random() < BasePredRate){
					killedMoths = killedMoths.concat(org)
				}
			}else{
				if(Math.random() < BasePredRate*shownPenalty){
					killedMoths = killedMoths.concat(org)
				}
			}
		}
	}else{
		for(let org of moths){
			if(org.geno.color == trees){
				org.age ++
				if(Math.random() < ageToDeathRate(org.age)){
					killedMoths = killedMoths.concat(org)
				}
			}else{
				org.age ++
				if(Math.random() < ageToDeathRate(org.age)*shownPenalty){
					killedMoths = killedMoths.concat(org)
				}
			}
		}
	}

	for(let org of killedMoths){
		moths.splice(moths.indexOf(org),1)
	}
	
    let newMoths = []
	if(!features.c){
		for(let org of killedMoths){
			let genes
			if(!features.b){
				genes = moths[Math.floor(Math.random()*moths.length)].geno.color
				if(Math.random() < MutationRate){
					genes = Number(!genes)
				}
				newMoths = newMoths.concat(new moth(g(genes)))
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
				newMoths = newMoths.concat(new moth(g(...genes)))
			}
		}
	}else{
		let freakyMoths = []
		for(let org of moths){
			if(Math.random() < 0.083){
				freakyMoths = freakyMoths.concat(org)
			}
		}
		
		let genes = []
		while(freakyMoths.length > 1){
			if(!features.b){
				let p = freakyMoths.shift()
				for(let i = 0; i< OffspringCount; i++){
					genes = genes.concat(p.geno.color)
				
					if(Math.random() < MutationRate){
						genes[i] = Number(!genes[i])
					}
				}
				freakyMoths.shift() //there are twice as many moths trying to reproduce as there should be, this is an easy fix
				for(let i = 0; i< OffspringCount; i++){
					newMoths = newMoths.concat(new moth(g(genes[i])))
				}
				
			}else{
				let p1 = freakyMoths.shift()
				let p2 = freakyMoths.shift()
				for(let i = 0; i< OffspringCount; i++){	
					let g1 = p1.geno.genes[Math.floor(Math.random()*2)]
					let g2 = p2.geno.genes[Math.floor(Math.random()*2)]
					
					g
					
					if(Math.random() < MutationRate){
						g1 = Number(!g1)
					}if(Math.random() < MutationRate){
						g2 = Number(!g2)
					}
					
					genes = genes.concat([[g1,g2]])
				}
				for(let i = 0; i< OffspringCount; i++){
					newMoths = newMoths.concat(new moth(g(...genes[i])))
				}
			}
			
			
			
		}
	}
		
	moths = moths.concat(newMoths)

    month ++
    if(month >= 12){
		year ++
		month = 0
		if(features.e){
			if(year <= 1775){
				shownPenalty -= 0.004
			}else if(year <= 1800){
				trees = 1
				shownPenalty += 0.004
			}
		}
    }
	mothInfo()
    checkMoths()
}

function checkMoths(){
	if(moths.length == 0){
		data[trial].cp1 = 850
		data[trial].cp2 = 950
		upkeep()
		return
	}
	
	let dark = 0
    for(let org of moths){
		if(org.geno.color == 1){
			dark++
		}
    }
	
	let freq = dark/moths.length
	if(freq > 0.01){
		if(data[trial].cp1 == null){
			data[trial].cp1 = year
		}
	}
	if(freq > 0.9){
		if(data[trial].cp2 == null){
			data[trial].cp2 = year
			upkeep()
		}
	}
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
    
    display.max = moths.length
    display.value=light
    time.innerHTML = month+"/"+year
	
}


//const featureList = {"a":1,"b":2,"c":4,"d":8,"e":16}
let test = 0
let trial = 0

let intervalKey = -1

let startTime
let testTime

data = []
for(let i = 0; i<80; i++){
	data = data.concat({cp1:null , cp2:null , score:null})
}

function startSim(){
	startTime = new Date()
	testTime = new Date()
	upkeep()
}


function upkeep(){
	
	if(intervalKey != -1){
		
		clearInterval(intervalKey)
		
		data[trial].score = Math.abs(data[trial].cp1 - 1850) + Math.abs(data[trial].cp2 - 1950)
	
		
		
		trial ++
		if(trial >= 80){
			let average = 0
			let trials = []
			for(let i = 0; i<80; i++){
				average += data[i].score/80
				trials = trials.concat(data[i].score)
			}localStorage.setItem(test,{average:average,trials:trials})
			
			console.log(test + ": " + average)
			console.log(test + " completed in " + (new Date().getTime() - testTime.getTime())/1000)
			console.log(trials)
			
			trial = 0
			test ++
			
			let currentTest = test
			for(let i = 0; i < 5; i++){
				if(currentTest % 2 == 1){
					features[["a","b","c","d","e"][i]] = true
				}else{
					features[["a","b","c","d","e"][i]] = false
				}
				currentTest = Math.floor(currentTest/2)
			}
			
			
			data = []
			for(let i = 0; i<80; i++){
				data = data.concat({cp1:null , cp2:null , score:null})
			}
		}
	}
	
	
	
	year = 1750
	month = 0

	shownPenalty = 1.1
	trees = 1
	if(features.e){
		trees = 0
	}
	
	
	moths = []
	for(let i = 0; i<(100*10**features.a); i++){
		if(!features.b){
			moths = moths.concat(new moth(g(getRandomGene())))
		}else{
			moths = moths.concat(new moth(g(getRandomGene(),getRandomGene())))
		}
	}
	
	
	testTracker.innerHTML = "test " + test + ", trial " + trial
	intervalKey = setInterval(simulationTick,0)
	
}
