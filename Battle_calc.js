

let boss = {name: "Boss", health: 20, strength:10, dexterity: 5, intelligence: 5, wisdom: 2, speed:10}
let hero = {name: "Hero", health: 15, strength:20, dexterity: 3, intelligence: 10, wisdom: 3, speed:4}

function battle(boss, hero){ //Calculation to determine winner
    bossHP = 5*boss.health;
    heroHP = 5*hero.health;
    heroAction = 0;
    bossAction = 0;
    const aliveHeroes = new Set();
    aliveHeroes.add(hero);

    for (let turn = 0; turn < 500; turn++) {

        heroAction = heroAction + Math.log2(hero.speed+1);
        bossAction = bossAction + Math.log2(boss.speed+1);
        if (bossAction >=100){
            bossAction= bossAction - 100;
            heroHP = attack(heroHP, boss, hero)
        }
        if (heroHP <=0){
            aliveHeroes.remove(hero);
        } 
        if (heroAction >= 100){
            heroAction = heroAction - 100;
            bossHP = attack(bossHP, hero, boss);
        }
        if (bossHP<= 0){
            console.log("hero won")
            return(Array.from(aliveHeroes))
        }
        if (aliveHeroes.size == 0){
            console.log("bosss won")
            return(boss)
        }
    }
    console.log("bosss won")
    return(boss)
}

function checkHit(dodge){
    if (Math.random() <= Math.pow(1-0.02,dodge)){
        return true;
    }
    else{
        return false;
    }
}

function attack(p2HP, p1, p2){
    p1Dmg = p1.strength+(Math.random()*0.2*p1.strength);
    if (checkHit(p2.dexterity)){
        p2HP = p2HP - p1Dmg;
        console.log(p2HP);
    }
    p2HP = p2HP - (boss.intelligence)/(hero.wisdom);
    return p2HP;
}

console.log(battle(boss,hero).name);
