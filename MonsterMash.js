var MonsterMash = MonsterMash || (function() {
          'use strict';
		
      	var variance = function(num)
      	{
      	    var variant = randomInteger(num+1)-1;
      	    if(randomInteger(2)-1)
      	    {
      	        return 0-variant;
      	    }
      	    return variant;
      	},
      	weightedRand = function(spec)
      	{
            var i, j, table=[];
            for (i in spec) 
            {
            // The constant 10 below should be computed based on the
            // weights in the spec for a correct and optimal table size.
            // E.g. the spec {0:0.999, 1:0.001} will break this impl.
                for (j=0; j<spec[i]*10; j++) 
                {
                    table.push(i);
                }
            }
            return function() {
                return table[Math.floor(Math.random() * table.length)];
            }
        },
      	
      	Generate = function(msg, name, cr, type, size, actype, meleepath, meleedam, rangedpath, rangeddam, meleeattacks, rangedattacks, bestial) {
            var playerid         = msg.playerid;
            var player           = msg.who;
            cr=parseInt(cr);
            type=parseInt(type);
            size=parseInt(size);
            actype=parseInt(actype);
            meleepath=parseInt(meleepath);
            meleedam=parseInt(meleedam);
			meleeattacks=parseInt(meleeattacks);
            rangedpath=parseInt(rangedpath);
            rangeddam=parseInt(rangeddam);
			rangedattacks=parseInt(rangedattacks);
			bestial=parseInt(bestial);
            log("init good");
            
            /**
             * Permissions
             *
             * Valid values are "all" or comma-delimited list of player IDs.
             */
            /* Who can view the sheet */
            var viewableBy   = playerid;
            /* Who can edit the sheet */
            var controlledby = playerid;
            
            //Basic CR-based tables
            var 
            hitPointsByCR = [10,15,20,30,40,55,70,85,100,115,130,145,160,180,200,220,240,270,300,330,370],
            armorClassByCR = [11,12,14,15,17,18,19,20,21,23,24,25,27,28,29,30,31,32,33,34,36],
            highAttackByCR = [1,2,4,6,8,10,12,13,15,17,18,19,21,22,23,24,26,27,28,29,30],
            lowAttackByCR = [0,1,3,4,6,7,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            highAverageDamageByCR = [4,7,10,13,16,20,25,30,35,40,45,50,55,60,65,70,80,90,100,110,120],
            lowAverageDamageByCR = [3,5,7,9,12,15,18,22,26,30,33,37,41,45,48,52,60,67,75,82,90],
            primaryAbilityDCByCR = [11,12,13,14,15,15,16,17,18,18,19,20,21,21,22,23,24,24,25,26,27],
            secondaryAbilityDCByCR = [8,9,9,10,10,11,11,12,12,13,13,14,15,15,16,16,17,18,18,19,20],
            goodSavesByCR = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,20,21,22],
            poorSavesByCR = [0,1,1,2,3,4,5,6,7,8,9,10,11,12,12,13,14,15,16,16,17];
			
			//Weapon tables.
			var
			weaponsaxes = 			["bardiche",
									"battleaxe",
									"boarding axe",
									"butchering axe",
									"dwarven waraxe",
									"gandasa",
									"greataxe",
									"handaxe",
									"heavy pick",
									"hooked axe",
									"knuckle axe",
									"kumade",
									"kumade",
									"collapsible",
									"light pick",
									"mattock",
									"orc double axe",
									"pata",
									"throwing axe",
									"tongi"],
			weaponsbladesheavy = 	["aldori dueling sword",
									"ankus",
									"bastard sword",
									"chakram",
									"cutlass",
									"double chicken saber",
									"double walking stick katana",
									"elven curve blade",
									"estoc",
									"falcata",
									"falchion",
									"flambard",
									"great terbutje",
									"greatsword",
									"katana",
									"khopesh",
									"klar",
									"longsword",
									"nine-ring broadsword",
									"nodachi",
									"rhoka sword",
									"sawtooth sabre",
									"scimitar",
									"scythe",
									"seven-branched sword",
									"shotel",
									"sickle-sword",
									"switchscythe",
									"temple sword",
									"terbutje",
									"two-bladed sword"],
			weaponsbladeslight = 	["bayonet",
									"butterfly knife",
									"butterfly sword",
									"chakram",
									"dagger",
									"deer horn knife",
									"dogslicer",
									"drow razor",
									"dueling dagger",
									"gladius",
									"hunga munga",
									"kama",
									"katar",
									"kerambit",
									"kukri",
									"machete",
									"manople",
									"pata",
									"quadrens",
									"rapier",
									"sanpkhang",
									"sawtooth sabre",
									"scizore",
									"short sword",
									"sica",
									"sickle",
									"spiral rapier",
									"starknife",
									"sword cane",
									"swordbreaker dagger",
									"wakizashi",
									"war razor"],
			weaponsbows = 			["composite longbow",
									"composite shortbow",
									"longbow",
									"orc hornbow",
									"shortbow"],
			weaponsclose = 			["bayonet",
									"brass knuckles",
									"cestus",
									"dan bong",
									"dwarven war-shield",
									"emei piercer",
									"fighting fan",
									"gauntlet",
									"heavy shield",
									"iron brush",
									"katar",
									"klar",
									"light shield",
									"madu (leather/steel)",
									"mere club",
									"punching dagger",
									"rope gauntlet",
									"sap",
									"scizore",
									"spiked armor",
									"spiked gauntlet",
									"spiked shield",
									"tekko-kagi",
									"tonfa",
									"tri-bladed katar",
									"unarmed strike",
									"waveblade",
									"wooden stake",
									"wushu dart"],
			weaponscrossbows = 		["double crossbow",
									"hand crossbow",
									"heavy crossbow",
									"launching crossbow",
									"light crossbow",
									"repeating hand crossbow",
									"repeating heavy crossbow",
									"repeating light crossbow",
									"tube arrow shooter",
									"underwater heavy crossbow",
									"underwater light crossbow"],
			weaponsdouble = 		["bo staff",
									"boarding gaff",
									"chain spear",
									"chain spear",
									"chain-hammer",
									"dire flail",
									"double walking stick katana",
									"double-chained kama",
									"dwarven urgrosh",
									"gnome battle ladder",
									"gnome hooked hammer",
									"kusarigama",
									"monk's spade",
									"orc double axe",
									"quarterstaff",
									"taiaha",
									"two-bladed sword",
									"weighted spear"],
			weaponsflails = 		["battle poi",
									"bladed scarf",
									"cat-o'-nine-tails",
									"chain spear",
									"dire flail",
									"double chained kama",
									"dwarven dorn-dergar",
									"flying blade",
									"flying talon",
									"gnome pincher",
									"halfling rope-shot",
									"heavy flail",
									"kusarigama",
									"kyoketsu shoge",
									"light flail",
									"meteor hammer",
									"morningstar",
									"nine-section whip",
									"nunchaku",
									"sansetsukon",
									"scorpion whip",
									"spiked chain",
									"urumi",
									"whip"],
			weaponshammers = 		["aklys",
									"battle aspergillum",
									"chain-hammer",
									"club",
									"earth breaker",
									"gnome piston maul",
									"greatclub",
									"heavy mace",
									"lantern staff",
									"light hammer",
									"light mace",
									"mere club",
									"planson",
									"taiaha",
									"tetsubo",
									"wahaika",
									"warhammer"],
			weaponsmonk = 			["bo staff",
									"brass knuckles",
									"butterfly sword",
									"cestus",
									"dan bong",
									"deer horn knife",
									"double chained kama",
									"double chicken saber",
									"emei piercer",
									"fighting fan",
									"hanbo",
									"jutte",
									"kama",
									"kusarigama",
									"kyoketsu shoge",
									"lungshuan tamo",
									"monk's spade",
									"nine-ring broadsword",
									"nine-section whip",
									"nunchaku",
									"quarterstaff",
									"rope dart",
									"sai",
									"sanpkhang",
									"sansetsukon",
									"seven-branced sword",
									"shang gou",
									"shuriken",
									"siangham",
									"temple sword",
									"tiger fork",
									"tonfa",
									"tri-point double-edged sword",
									"unarmed strike",
									"urumi",
									"wushu dart"],
			weaponspolearms = 		["bardiche",
									"bec de corbin",
									"bill",
									"boarding gaff",
									"crook",
									"fauchard",
									"glaive",
									"glaive-guisarme",
									"gnome ripsaw glaive",
									"guisarme",
									"halberd",
									"hooked lance",
									"horsechopper",
									"lucerne hammer",
									"mancatcher",
									"monk's spade",
									"naginata",
									"nodachi",
									"ogre hook",
									"ranseur",
									"tiger fork"],
			weaponsspears = 		["amentum",
									"boar spear",
									"chain spear",
									"elven branched spear",
									"harpoon",
									"javelin",
									"lance",
									"longspear",
									"orc skull ram",
									"pilum",
									"planson",
									"shortspear",
									"sibat",
									"spear",
									"stormshaft javelin",
									"tiger fork",
									"trident",
									"weighted spear"],
			weaponsthrown = 		["aklys",
									"amentum",
									"atlatl",
									"blowgun",
									"bolas",
									"boomerang",
									"chain-hammer",
									"chakram",
									"club",
									"dagger",
									"dart",
									"deer horn knife",
									"dueling dagger",
									"flask thrower",
									"halfling sling staff",
									"harpoon",
									"hunga munga",
									"javelin",
									"kestros",
									"lasso",
									"light hammer",
									"net",
									"pilum",
									"poisoned sand tube",
									"rope dart",
									"shoanti bolas",
									"shortspear",
									"shuriken",
									"sibat",
									"sling",
									"sling glove",
									"snag net",
									"spear",
									"starknife",
									"stormshaft javelin",
									"throwing axe",
									"throwing shield",
									"trident",
									"wushu dart"],
			weaponsnatural = 		["bite",
									"claw",
									"gore",
									"hoof",
									"tentacle",
									"wing",
									"pincers",
									"tail Slap",
									"slam",
									"sting",
									"talons"],
			weaponsnaturalranged = 	["spikes",
									"spines"],
			weaponsmelee = 			_.union(weaponsaxes,weaponsbladesheavy,weaponsbladeslight,weaponsclose,weaponsdouble,weaponsflails,weaponshammers,weaponsmonk,weaponspolearms,weaponsspears),
			weaponsranged = 		_.union(weaponsbows,weaponscrossbows,weaponsthrown),
			weaponsmatrix = 		[weaponsaxes,weaponsbladesheavy,weaponsbladeslight,weaponsbows,weaponsclose,weaponscrossbows,weaponsdouble,weaponsflails,weaponshammers,weaponsmonk,weaponspolearms,weaponsspears,weaponsthrown];
			
            //Other tables
            var monsterSizes = ["Fine","Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal"],
            creatureTypes = ["Aberration","Animal","Construct","Dragon","Fey","Humanoid","Magical beast","Monstrous humanoid","Ooze","Outsider","Plant","Undead","Vermin"],
            hitDiceByTypeThenCR = [[1,2,3,4,5,7,9,10,12,14,15,16,17,19,20,22,24,26,28,30,34],
                                [1,2,3,4,5,7,9,10,12,14,15,16,17,19,20,22,24,26,28,30,34],
                                [1,2,3,4,5,6,8,9,10,12,13,14,16,18,19,20,21,23,25,28,31],
                                [1,2,3,4,5,6,7,8,9,11,12,13,14,16,17,18,19,21,23,25,29],
                                [2,3,4,5,6,8,10,12,13,15,17,18,20,22,23,25,26,28,31,33,37],
                                [1,2,3,4,5,7,9,10,12,14,15,16,17,19,20,22,24,26,28,30,34],
                                [1,2,3,4,5,6,8,9,10,12,13,14,16,18,19,20,21,23,25,28,31],
                                [1,2,3,4,5,6,8,9,10,12,13,14,16,18,19,20,21,23,25,28,31],
                                [1,2,3,4,5,7,9,10,12,14,15,16,17,19,20,22,24,26,28,30,34],
                                [1,2,3,4,5,6,8,9,10,12,13,14,16,18,19,20,21,23,25,28,31],
                                [1,2,3,4,5,7,9,10,12,14,15,16,17,19,20,22,24,26,28,30,34],
                                [1,2,3,4,5,7,9,10,12,14,15,16,17,19,20,22,24,26,28,30,34],
                                [1,2,3,4,5,7,9,10,12,14,15,16,17,19,20,22,24,26,28,30,32]];
						
			//Basic
            
            //Initialize description string
            var monDesc="";
            //Size
            var monSize = size;
            
            while(monSize < 0 || monSize > 8)
            {
                monSize = randomInteger(9)-1;
                switch (monSize)
                {
                    case 0:
                        if (cr>2){monSize=-1;}
                        break;
                    case 1:
                        if (cr>4){monSize=-1;}
                        break;
                    case 2:
                        if (cr>6){monSize=-1;}
                        break;
                    case 5:
                        if (cr<2){monSize=-1;}
                        break;
                    case 6:
                        if (cr<4){monSize=-1;}
                        break;
                    case 7:
                        if (cr<6){monSize=-1;}
                        break;
                    case 8:
                        if (cr<8){monSize=-1;}
                        break;
                }
            }
            
            monSize=monsterSizes[monSize];
            log("size good");
            //Creature Type
            var monTypeNum = randomInteger(13)-1;
            if(type > -1) 
            {
                monTypeNum = type;
            }
            var monType=creatureTypes[monTypeNum];
            log("type good");
            
            //Defense
            
            //Hit Dice
            var monHD = hitDiceByTypeThenCR[monTypeNum][cr];
            log("hit dice good");
            //HP
            var monHP = hitPointsByCR[cr]+variance(Math.floor(hitPointsByCR[cr]/10));
            log("hp good");
            //AC
            var monAC = armorClassByCR[cr] + variance(2);
            var monACBase = monAC-10;
            var monFFAC=0, monTAC=0, monFFTAC=0, monArmorAC=0, monNatArmorAC=0, monDexAC=0, monDeflAC=0;
            var monACType = actype;
            if(monACType < 0 || monACType > 14)
            {
                monACType = randomInteger(14);
            }
            log("AC type good");
            switch (monACType)
            {
                case 1:
                    monArmorAC = monACBase;
                    break;
                case 2:
                    monNatArmorAC = monACBase;
                    break;
                case 3:
                    monDexAC = monACBase;
                    break;
                case 4:
                    monDeflAC = monACBase;
                    break;
                case 5:
                    monArmorAC = Math.floor(monACBase/2);
                    monNatArmorAC = monACBase - monArmorAC;
                    break;
                case 6:
                    monArmorAC = Math.floor(monACBase/2);
                    monDexAC = monACBase - monArmorAC;
                    break;
                case 7:
                    monArmorAC = Math.floor(monACBase/2);
                    monDeflAC = monACBase - monArmorAC;
                    break;
                case 8:
                    monNatArmorAC = Math.floor(monACBase/2);
                    monDexAC = monACBase - monNatArmorAC;
                    break;
                case 9:
                    monNatArmorAC = Math.floor(monACBase/2);
                    monDeflAC = monACBase - monNatArmorAC;
                    break;
                case 10:
                    monDexAC = Math.floor(monACBase/2);
                    monDeflAC = monACBase - monDexAC;
                    break;
                case 11:
                    monArmorAC = Math.floor(monACBase/3);
                    monNatArmorAC = Math.floor(monACBase/3);
                    monDexAC = monACBase - monArmorAC - monNatArmorAC;
                    break;
                case 12:
                    monArmorAC = Math.floor(monACBase/3);
                    monNatArmorAC = Math.floor(monACBase/3);
                    monDeflAC = monACBase - monArmorAC - monNatArmorAC;
                    break;
                case 13:
                    monNatArmorAC = Math.floor(monACBase/3);
                    monDexAC = Math.floor(monACBase/3);
                    monDeflAC = monACBase - monDexAC - monNatArmorAC;
                    break;
                 case 14:
                    monArmorAC = Math.floor(monACBase/4);
                    monNatArmorAC = Math.floor(monACBase/4);
                    monDexAC = Math.floor(monACBase/4);
                    monDeflAC = monACBase - monDexAC - monArmorAC - monNatArmorAC;
                    break;
                
            }
            monFFAC = 10 + monArmorAC + monNatArmorAC + monDeflAC;
            monTAC = 10 + monDexAC + monDeflAC;
            monFFTAC = 10 + monDeflAC;
            log("AC good");
            //CMD
            var monCMD = Math.floor(monAC*1.5);
            var monFFCMD = monCMD - monDexAC;
            log("CMD good");
            //Saves
            var fort=poorSavesByCR[cr]+variance(1),ref=poorSavesByCR[cr]+variance(1),will=poorSavesByCR[cr]+variance(1);
            log("saves init good");
            switch(monTypeNum)
            {
                case 0:
                    will = goodSavesByCR[cr]+variance(1);
                    break;
                case 1:
                    fort = goodSavesByCR[cr]+variance(1);
                    ref = goodSavesByCR[cr]+variance(1);
                    break;
                case 2:
                    break;
                case 3:
                    fort = goodSavesByCR[cr]+variance(1);
                    ref = goodSavesByCR[cr]+variance(1);
                    will = goodSavesByCR[cr]+variance(1);
                    break;
                case 4:
                    ref = goodSavesByCR[cr]+variance(1);
                    will = goodSavesByCR[cr]+variance(1);
                    break;
                case 5:
                    switch(randomInteger(3))
                    {
                        case 1:
                            fort = goodSavesByCR[cr]+variance(1);
                            break;
                        case 2:
                            ref = goodSavesByCR[cr]+variance(1);
                            break;
                        case 3:
                            will = goodSavesByCR[cr]+variance(1);
                            break;
                    }
                    break;
                case 6:
                    fort = goodSavesByCR[cr]+variance(1);
                    ref = goodSavesByCR[cr]+variance(1);
                    break;
                case 7:
                    ref = goodSavesByCR[cr]+variance(1);
                    will = goodSavesByCR[cr]+variance(1);
                    break;
                case 8:
                    break;
                case 9:
                    switch(randomInteger(3))
                    {
                        case 1:
                            fort = goodSavesByCR[cr]+variance(1);
                            ref = goodSavesByCR[cr]+variance(1);
                            break;
                        case 2:
                            ref = goodSavesByCR[cr]+variance(1);
                            will = goodSavesByCR[cr]+variance(1);
                            break;
                        case 3:
                            will = goodSavesByCR[cr]+variance(1);
                            fort = goodSavesByCR[cr]+variance(1);
                            break;
                    }
                    break;
                case 10:
                    fort = goodSavesByCR[cr]+variance(1);
                    break;
                case 11:
                    will = goodSavesByCR[cr]+variance(1);
                    break;
                case 12:
                    fort = goodSavesByCR[cr]+variance(1);
                    break;
            }
            log("saves by type good");
            
            
            //Offense
            
            //Initiative
            var monInit = Math.floor(cr/2);
            log("init good");
            
            //Special Abilities
            //TODO: Generate some
            var monHighDC = primaryAbilityDCByCR[cr]+variance(1);
            var monLowDC = secondaryAbilityDCByCR[cr]+variance(1);
            log("DCs good");
            
			//flag for manufactured or natural weapons
			var monstrous = bestial;
			if(monstrous < 0) 
			{
				monstrous = randomInteger(2)-1;
				switch(monTypeNum)
				{
					case 1:
					case 8:
					case 10:
					case 4:
					case 7:
					case 12: monstrous=1;break;
				}
			}
			
            //Melee attacks
            var monMeleeAttackBonusPath = meleepath, monMeleeAttackBonus;
            if(monMeleeAttackBonusPath < 0)
            {
               monMeleeAttackBonusPath = randomInteger(2)-1;
            }
            var monNumMeleeAttacks = meleeattacks, monMeleeAttacks = [];
			if(monNumMeleeAttacks < 0)
			{
				monNumMeleeAttacks = randomInteger(5)-1;
			}
			if(monNumMeleeAttacks > 0)
			{
				var toUse = weaponsmelee;
				if (monstrous) toUse = weaponsnatural;
				for(var i=0;i<monNumMeleeAttacks;i++)
				{
					monMeleeAttacks[i] = toUse[randomInteger(toUse.length)-1];
				}
				log(monMeleeAttacks);
			}
            if(monMeleeAttackBonusPath)
            {
                monMeleeAttackBonus = highAttackByCR[cr]+variance(1);
            }
            else
            {
                monMeleeAttackBonus = lowAttackByCR[cr]+variance(1);
            }
            log("melee attacks good");
            
            //Ranged attacks
            var monRangedAttackBonusPath = rangedpath, monRangedAttackBonus;
            if(monRangedAttackBonusPath < 0)
            {
                monRangedAttackBonusPath = randomInteger(2)-1;
            }
            var monNumRangedAttacks = rangedattacks, monRangedAttacks = [];
			if(monNumRangedAttacks < 0)
			{
				monNumRangedAttacks = randomInteger(5)-1;
			}
			if(monNumRangedAttacks > 0)
			{
				var toUse = weaponsranged;
				if (monstrous) toUse = weaponsnaturalranged;
				for(var i=0;i<monNumRangedAttacks;i++)
				{
					monRangedAttacks[i] = toUse[randomInteger(toUse.length)-1];
				}
				log(monRangedAttacks);
			}
            if(monRangedAttackBonusPath)
            {
                monRangedAttackBonus = highAttackByCR[cr]+variance(1);
            }
            else
            {
                monRangedAttackBonus = lowAttackByCR[cr]+variance(1);
            }
            log("ranged attacks good");
            
            //Melee damage
            var monMeleeDamagePath = meleedam, monMeleeDamage;
            if(monMeleeDamagePath < 0)
            {
                monMeleeDamagePath = randomInteger(2)-1;
            }
            if(monMeleeDamagePath)
            {
                monMeleeDamage = Math.max(highAverageDamageByCR[cr]+variance(Math.floor(highAverageDamageByCR[cr]/10)),4)
            }
            else
            {
                monMeleeDamage = Math.max(lowAverageDamageByCR[cr]+variance(Math.floor(lowAverageDamageByCR[cr]/10)),3)
            }
            
            if(monNumMeleeAttacks > 0)
            {
                monMeleeDamage = Math.floor(monMeleeDamage/monNumMeleeAttacks);
                monMeleeDamage = "1d"+Math.floor(monMeleeDamage/2)+"+"+Math.ceil(monMeleeDamage*0.75)+"";
            }
            else
            {
                monMeleeDamage = "0";
            }
            log("melee damage good");
            
            //Ranged damage
            var monRangedDamagePath = rangeddam, monRangedDamage;
            if(monRangedDamagePath < 0)
            {
                monRangedDamagePath = randomInteger(2)-1;
            }
            if(monRangedDamagePath)
            {
                monRangedDamage = Math.max(highAverageDamageByCR[cr]+variance(Math.floor(highAverageDamageByCR[cr]/10)),4)
            }
            else
            {
                monRangedDamage = Math.max(lowAverageDamageByCR[cr]+variance(Math.floor(lowAverageDamageByCR[cr]/10)),3)
            }
            
            if(monNumRangedAttacks > 0)
            {
                monRangedDamage = Math.floor(monRangedDamage/monNumRangedAttacks);
                monRangedDamage = "1d"+Math.floor(monRangedDamage/2)+"+"+Math.ceil(monRangedDamage*0.75)+"";
            }
            else
            {
                monRangedDamage = "0";
            }
            log("ranged damage good");
            
            //Knowledge block
			var monKnowledgeResult="", monKnowledgeDC = cr;
			
			//Meet DC = Attacks
			//DC+5 = Saves
			//>DC+10 = Special Abilities
			
			//Determine base DC
			switch(monTypeNum)
			{
				case 1:
				case 5:
				case 12: monKnowledgeDC+=5;break;
				case 0:
				case 2:
				case 6:
				case 7:
				case 8:
				case 10:
				case 11: monKnowledgeDC+=10;break;
				case 3:
				case 4:
				case 9: monKnowledgeDC+=15;break;
			}
            monKnowledgeDC += variance(3);
            monKnowledgeResult += "DC "+monKnowledgeDC+":";
			
			
			if(monNumMeleeAttacks > 0)
			{
				monKnowledgeResult += "<br/>The creature's melee attacks seem ";
				if(monMeleeAttackBonusPath)
				{
					monKnowledgeResult += "accurate"
					monKnowledgeResult += (monMeleeDamagePath ? " and powerful" : ", but weak.");
				}
				else
				{
					monKnowledgeResult += "somewhat clumsy"
					monKnowledgeResult += (monMeleeDamagePath ? ", but powerful" : " and weak.");
				}
				
				monKnowledgeResult += "<br/>The creature's melee "+(monstrous ? "natural ":"") +"weapons are: " + monMeleeAttacks.toString();
			}
			else
			{
				monKnowledgeResult += "<br/>The creature lacks melee attacks, "+(monMeleeAttackBonusPath && !monstrous ? "but may be effective if given a weapon." : "and likely lacks the skills to use a weapon.");
			}
			
			if(monNumRangedAttacks > 0)
			{
				monKnowledgeResult += "<br/>The creature's ranged attacks seem ";
				if(monRangedAttackBonusPath)
				{
					monKnowledgeResult += "accurate"
					monKnowledgeResult += (monRangedDamagePath ? " and powerful" : ", but weak.");
				}
				else
				{
					monKnowledgeResult += "somewhat clumsy"
					monKnowledgeResult += (monRangedDamagePath ? ", but powerful" : " and weak.");
				}
				
				monKnowledgeResult += "<br/>The creature's ranged "+(monstrous ? "natural ":"") +"weapons are: " + monRangedAttacks.toString();
			}
			else
			{
				monKnowledgeResult += "<br/>The creature lacks ranged attacks, "+(monRangedAttackBonusPath && !monstrous ? "but may be effective if given a weapon." : "and likely lacks the skills to use a weapon.");
			}
			
			monKnowledgeResult += "<br/>DC "+(monKnowledgeDC+5)+":";
			monKnowledgeResult += "<br/>The creature is ";
			switch (monACType)
            {
                case 1:
                    //monArmorAC = monACBase;
					monKnowledgeResult += "equipped with tough-looking armor, but doesn't seem exceptionally agile in it.";
                    break;
                case 2:
                    //monNatArmorAC = monACBase;
					monKnowledgeResult += "guarded by tough natural armor, but doesn't seem particularly agile.";
                    break;
                case 3:
                    //monDexAC = monACBase;
					monKnowledgeResult += "unarmored, its motions fluid and difficult to track.";
                    break;
                case 4:
                    //monDeflAC = monACBase;
					monKnowledgeResult += "warded by an unearthly force of some sort, but otherwise unguarded.";
                    break;
                case 5:
                    //monArmorAC = Math.floor(monACBase/2);
                    //monNatArmorAC = monACBase - monArmorAC;
					monKnowledgeResult += "wearing moderately-tough armor over its naturally resilient body, but doesn't seem especially agile.";
                    break;
                case 6:
                    //monArmorAC = Math.floor(monACBase/2);
                    //monDexAC = monACBase - monArmorAC;
					monKnowledgeResult += "equipped with reasonably thick armor, and its motions belie well-honed reflexes.";
                    break;
                case 7:
                    //monArmorAC = Math.floor(monACBase/2);
                    //monDeflAC = monACBase - monArmorAC;
					monKnowledgeResult += "wearing a set of sturdy-looking armor, and an unnatural energy shields it from harm. It seems to lack any significant agility.";
                    break;
                case 8:
                    //monNatArmorAC = Math.floor(monACBase/2);
                    //monDexAC = monACBase - monNatArmorAC;
					monKnowledgeResult += "guarded only by its durable body and its quickness of step, but it seems confident in them nonetheless.";
                    break;
                case 9:
                    //monNatArmorAC = Math.floor(monACBase/2);
                    //monDeflAC = monACBase - monNatArmorAC;
					monKnowledgeResult += "surrounded by a strange, guarding presence that reinforces its naturally-durable hide.";
                    break;
                case 10:
                    //monDexAC = Math.floor(monACBase/2);
                    //monDeflAC = monACBase - monDexAC;
					monKnowledgeResult += "unnaturally graceful as it moves amidst a supernatural guard of some sort.";
                    break;
                case 11:
                    //monArmorAC = Math.floor(monACBase/3);
                    //monNatArmorAC = Math.floor(monACBase/3);
                    //monDexAC = monACBase - monArmorAC - monNatArmorAC;
					monKnowledgeResult += "wearing armor capable of shielding it to a reasonable degree in combination with its natural armor and agility.";
                    break;
                case 12:
                    //monArmorAC = Math.floor(monACBase/3);
                    //monNatArmorAC = Math.floor(monACBase/3);
                    //monDeflAC = monACBase - monArmorAC - monNatArmorAC;
					monKnowledgeResult += "shielded by layers of thick hide, tough armor, and an unnatural guarding force.";
                    break;
                case 13:
                    //monNatArmorAC = Math.floor(monACBase/3);
                    //monDexAC = Math.floor(monACBase/3);
                    //monDeflAC = monACBase - monDexAC - monNatArmorAC;
					monKnowledgeResult += "devoid of armor, relying on its quick reflexes, thick skin, and a shimmering field of energy to protect itself.";
                    break;
                 case 14:
                    //monArmorAC = Math.floor(monACBase/4);
                    //monNatArmorAC = Math.floor(monACBase/4);
                    //monDexAC = Math.floor(monACBase/4);
                    //monDeflAC = monACBase - monDexAC - monArmorAC - monNatArmorAC;
					monKnowledgeResult += "guarded equally by steel, scales, slipperiness and sorcery.";
                    break;
            }
			
			
            /**
             * Templates
             */
            var template = {
              "gmnotes": "A",
              "charactername": name + " CR " + cr,
            };
        
            template.gmnotes = template.charactername;
            template.gmnotes += " <br/>"+monSize+" "+monType;
            template.gmnotes += " <hr>Defense";
            template.gmnotes += " <br/>Hit Dice: "+monHD+" HP: "+monHP;
            template.gmnotes += " <br/>AC: "+monAC + " (+"+monArmorAC+" armor, +"+monNatArmorAC+" natural, +"+monDexAC+" Dex, +"+monDeflAC+" deflection)";
            template.gmnotes += " <br/>FFAC: " + monFFAC + " TAC: "+monTAC;
            template.gmnotes += " <br/>FFTAC: " + monFFTAC;
            template.gmnotes += " <br/>CMD: "+monCMD+" FFCMD: "+monFFCMD;
            template.gmnotes += " <br/>Saves Fortitude +"+fort+" Reflex +"+ref+" Willpower +"+will;
            template.gmnotes += " <hr>Offense";
            template.gmnotes += " <br/>Init +"+monInit;
            template.gmnotes += " <br/>Melee";
            template.gmnotes += " <br/>"+monNumMeleeAttacks+" attacks "+ monMeleeAttacks.toString() +" +"+monMeleeAttackBonus+" ("+monMeleeDamage+")";
            template.gmnotes += " <br/>Ranged";
            template.gmnotes += " <br/>"+monNumRangedAttacks+" attacks "+ monRangedAttacks.toString() +" +"+monRangedAttackBonus+" ("+monRangedDamage+")";
            template.gmnotes += " <br/>Primary Ability DC: "+monHighDC;
            template.gmnotes += " <br/>Secondary Ability DC: "+monLowDC;
            template.gmnotes += " <hr>Knowledge Checks";
			template.gmnotes += " <br/>"+monKnowledgeResult;
            template.gmnotes += " <br/>";
            log("GM notes good");
            /**
             * Monster generation
             */
            /* Create the base character object */
            var character = createObj("character", {
                name:             template.charactername,
                archived:         false,
                inplayerjournals: viewableBy,
                controlledby:     controlledby
            });
            log("sheet good");
            
            /* Set GM Notes */
            character.set("gmnotes", template.gmnotes);
            /* Set Player's name */

            /* Set Character's name */
            createObj("attribute", {
                name:         "name",
                current:      template.charactername,
                _characterid: character.id
            });
            
            //Saves
            createObj("ability", {
                name:         "Fortitude Save",
                action: "/w GM Fortitude: [[1d20+"+fort+"+?{modifier|0}]]",
                istokenaction:true,
                _characterid: character.id
            });
            createObj("ability", {
                name:         "Reflex Save",
                action: "/w GM Reflex: [[1d20+"+ref+"+?{modifier|0}]]",
                istokenaction:true,
                _characterid: character.id
            });
            createObj("ability", {
                name:         "Willpower Save",
                action: "/w GM Willpower: [[1d20+"+will+"+?{modifier|0}]]",
                istokenaction:true,
                _characterid: character.id
            });
            
            log("save macros good");
            
            //Initiative
            createObj("ability", {
                name:         "Initiative",
                action: "[[1d20+"+monInit+"+(("+monInit*0.01+" &{tracker} )]]",
                istokenaction:true,
                _characterid: character.id
            });
            log("init macro good");
            
            //Melee Attacks
            var macroString="";
            
            for (var i=0;i<monNumMeleeAttacks;i++)
            {
                macroString+= "/w GM "+monMeleeAttacks[i]+" [[1d20+"+monMeleeAttackBonus+"+?{att_modifier|0}]] for [["+monMeleeDamage+"+?{dam_modifier|0}]]\n";
            }
            macroString=macroString.slice(0,-1);
            
            createObj("ability", {
                name:         "Melee Attacks",
                action: macroString,
                istokenaction:true,
                _characterid: character.id
            });
            
            log("melee attack macro good");
            
            macroString="";
            
            //Ranged Attacks
            for (var i=0;i<monNumRangedAttacks;i++)
            {
                macroString+= "/w GM "+monRangedAttacks[i]+" [[1d20+"+monRangedAttackBonus+"+?{att_modifier|0}]] for [["+monRangedDamage+"+?{dam_modifier|0}]]\n";
            }
            macroString=macroString.slice(0,-1);
            
            createObj("ability", {
                name:         "Ranged Attacks",
                action: macroString,
                istokenaction:true,
                _characterid: character.id
            });
            
            log("ranged attack macro good");
            
        },
      	
      	
      	
      	handleInput = function(msg) {
      		var args, who;
      
      		if (msg.type !== "api") {
      			return;
      		}
              who=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
      
      		args = msg.content.split("|");
      		switch(args[0]) {
      			case '!monster':
      			    
      				if(args.length > 20) {
      					return;
      				}
      				var name = args[1] || "Unnamed", cr = args[2] || randomInteger(21)-1, type = args[3] || -1, size = args[4] || -1, actype = args[5] || -1, meleepath = args[6] || -1, meleedam = args[7] || -1, rangedpath = args[8] || -1,rangeddam = args[9] || -1,meleeattacks = args[10] || -1, rangedattacks = args[11] || -1, bestial = args[12] || -1;
      				Generate(msg,name,cr,type,size,actype,meleepath,meleedam,rangedpath,rangeddam,meleeattacks,rangedattacks,bestial);
      				
      				
      				
      				break;
      		}
      	},
      	
        
      
      
      	registerEventHandlers = function() {
      		on('chat:message', handleInput);
      	};
      
      	return {
      		RegisterEventHandlers: registerEventHandlers
      	};
      }());
      
      on("ready",function(){
      	'use strict';
      
      	MonsterMash.RegisterEventHandlers();
      });
      