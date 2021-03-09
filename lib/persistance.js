class STORE {}

STORE.save = (key,value) => {
    if (STORE.siteVersion) {
        window.parent.storeSet(key,value)
    }
    else {
        localStorage.setItem(key,value)
    }
    if (STORE.debug) console.log("saved: ", key, value)
}
STORE.load = (key) => {
    let ret = null
    if (STORE.siteVersion) {
        ret = window.parent.storeGet(key)
    }
    else {
        ret = localStorage.getItem(key)
    }
    if (STORE.debug) console.log("loaded: ", key, ret)
    return ret
}
STORE.remove = (key) => {
    if (STORE.siteVersion) {
        window.parent.StoreRemove(key)
    }
    else {
        localStorage.removeItem(key)
    }
    if (STORE.debug) console.log("removed: ", key)
}

/*
STORE.aSave = (key, value) => {
    return new Promise((res, rej)=> {
        setTimeout( ()=> {
            res(localStorage.setItem(key, value))
            if (STORE.debug) console.log("saved: ", key, value)
        }, 1500)
    })
}
STORE.aLoad = (key) => {
    return new Promise((res, rej)=> {
        setTimeout( ()=> {
            res(localStorage.getItem(key))
            if (STORE.debug) console.log("loaded: ", key, ret)
        }, 1500)
    })
}
STORE.aRemove = (key) => {
    return new Promise((res, rej)=> {
        setTimeout( ()=> {
            res(localStorage.removeItem(key))
            if (STORE.debug) console.log("removed: ", key)
        }, 1500)
    })
}
*/
STORE.loadSiteProgress = () => {
    Object.values(DATA.levelData).forEach((level, i) => {
        let index = i+1
        let bonus1 = STORE.load("level_" + index + "_" + level.bonuses[0].type)
        if (bonus1 == null) {
            bonus1 = 0
            STORE.save("level_" + index + "_" + level.bonuses[0].type, bonus1)
        }
        let bonus2 = STORE.load("level_" + index + "_" + level.bonuses[1].type)
        if (bonus2 == null) {
            bonus2 = 0
            STORE.save("level_" + index + "_" + level.bonuses[1].type, bonus1)
        }

        DATA.siteProgress["level-" + index + "_" + level.bonuses[0].type] = bonus1
        DATA.siteProgress["level-" + index + "_" + level.bonuses[1].type] = bonus2
    })
}

STORE.loadGameProgress = () =>{
    let progressVariables = [
        "available", "stars", "fruits", "score", "characters"
    ]
    for (let i=1; i<=10; i++) {
        DATA.progress["level-"+i] = {}
        progressVariables.forEach(v => {
            let value = STORE.load("level_"+i+"_"+v)
            if (value == null) {
                value = (i == 1 && v == "available" ) ? 1 : 0
                STORE.save("level_"+i+"_"+v, value)
            }
            DATA.progress["level-"+i][v] = value
        })
    }
}

STORE.loadBonusDistribution = () => {
    DATA.bonusNames.forEach(b => {
        DATA.bonusDistribution[b] = []
    })
    
    for (let i = 1; i<=10; i++) {
        DATA.levelData["level-"+i].bonuses.forEach(b => {
            for (let a = 1; a<=b.amount; a++) {
                DATA.bonusDistribution[b.type].push("level-"+i)
            }
        })
    }
}

STORE.executeCodes = (level, bonusName, bonusAmount) => {
    let from = 1
    let list = DATA.bonusDistribution[bonusName]

    for (let i=0; i<list.length; i++) {
        if (list[i] < "level-"+level) {
            from++
        }
    }

    for (let i=from; i<(from + bonusAmount); i++) {
        let code = "unlook" + bonusName + "_" + i
        STORE.sendCode(code)
    }

    // check if all
    allAreTrue = STORE.countBonus(bonusName) == DATA.bonusDistribution[bonusName].length
    if (allAreTrue) {
        STORE.sendCode("unlook" + bonusName)
        trackEvent("gift", DATA.bonusTracking[bonusName])
    }
}

STORE.sendCode = (code)=> {
    let cryptText = ""
    cryptText = CryptoJS.SHA256(code)
    if (STORE.siteVersion) {
        window.parent.sendCode(cryptText.toString(CryptoJS.enc.Base64))
    }
    else {
        console.log("Not site version, so code not working")
    }
    console.log(code)
    STORE.save(code, 1)
}

STORE.countBonus = (bonus)=> {
    let count = 0
    let list = DATA.bonusDistribution[bonus]
    for (let i=1; i<=list.length; i++) {
        if (STORE.load("unlook" + bonus + "_" + i) != null) {
            count++
        }
    }
    return count
}


// ----------------------------------------------
// ------------------- CONFIG -------------------
// ----------------------------------------------

STORE.debug = false

STORE.siteVersion = false // change to true in the site