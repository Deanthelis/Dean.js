var a40KHitHelper = a40KHitHelper || (function() {
          'use strict';
		
      	var handleInput = function(msg) {
      		var args, who;
      
      		if (msg.type !== "api") {
      			return;
      		}
              who=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
      
      		args = msg.content.split(" ");
      		switch(args[0]) {
      			case '!hitlocation':
      			    var toReturn;
      				if(args.length > 3) {
      					return;
      				}
      				var hitLocation = args[1] || -1;
      				if(hitLocation<1 || hitLocation > 100)
					{
						toReturn = "Invalid Location!";
					}
					if(hitLocation>1 && hitLocation <= 10)
      		        {
      		            toReturn = "Head"
      		        }
					if(hitLocation>11 && hitLocation <= 20)
					{
						toReturn = "Right Arm";
					}
					if(hitLocation>21 && hitLocation <= 30)
					{
						toReturn = "Left Arm";
					}
					if(hitLocation>31 && hitLocation <= 70)
					{
						toReturn = "Body";
					}
					if(hitLocation>71 && hitLocation <= 85)
					{
						toReturn = "Right Leg";
					}
					if((hitLocation>86 && hitLocation <= 100) || hitLocation == 0)
					{
						toReturn = "Left Leg";
					}
					
      				sendChat(who, "/me scored a hit: "+toReturn);
					
					var additionalHits = args[2] || 0;
					if(additionalHits>0)
					{
						switch(toReturn)
						{
							case `Right Arm`:
								toReturn = "Second Hit: Right Arm\nThird Hit: Body\nFourth Hit: Head\nFifth Hit: Body\nAdditional Hits: Right Arm";
							break;
							case `Left Arm`:
								toReturn = "Second Hit: Left Arm\nThird Hit: Body\nFourth Hit: Head\nFifth Hit: Body\nAdditional Hits: Left Arm";
							break;
							case `Body`:
								toReturn = "Second Hit: Body\nThird Hit: Left Arm\nFourth Hit: Head\nFifth Hit: Right Arm\nAdditional Hits: Body";
							break;
							case `Head`:
								toReturn = "Second Hit: Head\nThird Hit: Left Arm\nFourth Hit: Body\nFifth Hit: Right Arm\nAdditional Hits: Body";
							break;
							case `Right Leg`:
								toReturn = "Second Hit: Right Leg\nThird Hit: Body\nFourth Hit: Right Arm\nFifth Hit: Head\nAdditional Hits: Body";
							break;
							case `Left Leg`:
								toReturn = "Second Hit: Left Leg\nThird Hit: Body\nFourth Hit: Left Arm\nFifth Hit: Head\nAdditional Hits: Body";
							break;
						}
						sendChat(who, "/me scored additional hits:\n"+toReturn);
					}
					
      			break;
					
				case '!critical':
					if(args.length > 4) {
      					return;
      				}
					var 
					damageType = args[1] || "invalid",
					damageLocation = args[2] || -1,
					damageAmount = args[3] || -1,
					energyArm = 	["The attack grazes the target’s arm, causing it to spasm uncontrollably. All tests involving that arm suffer a –30 penalty for [[1d5]] Rounds.",
									"The attack smashes into the arm, sending currents of energy crackling down to the fi ngers and up to the shoulder. The arm is useless for [[1d5]] Rounds and the target takes 1 level of Fatigue.",
									"The attack causes energy to course through the target’s arm leaving him Stunned for 1 Round, and the arm is useless until the target receives medical treatment.",
									"The shock of the attack causes the character to temporarily lose control of his autonomous functions. He is Stunned for 1 Round and is knocked Prone. The arm is useless for [[1d10]] Rounds.",
									"The arm suffers superficial burns infl icting no small amount of pain on the target. The target may only take a Half Action in his next round, and he suffers [[1d5]] levels of Fatigue.",
									"The attack wreathes the arm in flame, scorching clothing and armour, and temporarily fusing together the target’s fingers. The target suffers [[1d5]] Weapon Skill and Ballistic Skill Damage, suffers [[1d5]] levels of Fatigue, and must make a Challenging (+0) Toughness Test or lose the use of the hand permanently.",
									"With a terrible snapping sound, the heat of the attack boils the marrow in the target’s arm, causing it to crack or even shatter. The target’s arm is broken and until it is repaired the target counts as only having one arm. The target is Stunned for 1 Round, and suffers [[1d5]] levels of Fatigue.",
									"Energy sears through the arm at the shoulder, causing the shoulder joint to explode and the arm is severed from the body. The target must take a Challenging (+0) Toughness Test or become Stunned for [[1d5]] Rounds. In addition the target suffers [[1d10]] levels of Fatigue. The target now only has one arm.",
									"Fire consumes the target’s arm, burning the flesh to a crisp right down to the bone. The target must make an immediate Challenging (+0) Toughness Test or die from shock. If he survives, however, the target suffers [[1d10]] levels of Fatigue and is Stunned for 1 Round. The target now only has one arm.",
									"The attack reduces the arm to a cloud of ash and sends the target crumbling to the ground where he immediately dies from shock, clutching his smoking stump."],
					energyBody = 	["A blow to the target’s body steals the air from his lungs. The target can take only a Half Action on his next Turn.",
									"The blast punches the air from the target’s body. The target must make a Challenging (+0) Toughness Test or be knocked Prone. ",
									"The attack cooks the flesh on the chest and abdomen, infl icting 2 levels of Fatigue and [[1d5]] Toughness Damage.",
									"The energy ripples all over the character, scorching his body with horrid third-degree burns and inflicting [[1d10]] levels of Fatigue. The target may only take a Half Action on his next Round.",
									"The fury of the attack forces the target to the ground, helplessly covering his face and keening in agony. The target is knocked to the ground and must make an Agility Test or catch fire (see Special Damage). The Target must make a Challenging (+0) Toughness Test or be Stunned for 1 Round.",
									"Struck by the full force of the attack, the target is sent reeling to the ground, smoke spiralling out of the wound. The target is knocked to the ground, Stunned for [[1d10]] Rounds, and suffers [[1d5]] levels of Fatigue. In addition, he must make a Challenging (+0) Agility Test or catch fire (see Special Damage on page 247).",
									"The intense power of the energy attack cooks the target’s organs, burning his lungs and heart with intense heat. The target is Stunned for [[2d10]]  Rounds and suffers [[1d10]] permanent Toughness Damage.",
									"As the attack washes over the target, his skin turns black and peels off while melted fat seeps from his clothing and armour. The target is Stunned for [[2d10]]  Rounds and the attack halves his Strength, Toughness and Agility until he receives medical treatment. The extensive scarring deals [[2d5]] permanent Fellowship Damage.",
									"The target is completely encased in fire, melting his skin and popping his eyes like superheated eggs. He falls to the ground a blackened corpse.",
									"The target is completely encased in fire, melting his skin and popping his eyes like superheated eggs. He falls to the ground a blackened corpse. In addition, if the target is carrying any ammunition, there is a 50% chance it explodes. Unless they can make a successful Evasion Test, all creatures within [[1d5]] metres take [[1d10+5]] Explosive Damage. If the target carried any grenades or missiles, one round after the Damage was dealt they detonate where the target’s body lies with the normal effects."],
					energyHead = 	["A grazing blow to the head frazzles the target’s senses, imposing a –10 penalty to all Tests (except Toughness) for 1 Round.",
									"The blast of energy dazzles the target, leaving him Blinded for 1 Round.",
									"The attack cooks off the target’s ear, leaving him with a partially burned stump of cartilage and deafened until he receives first aid or waits for [[1d5]] hours.",
									"The energy attack burns away all of the hairs on the target’s head as well as leaving him reeling from the injury. The attack deals 2 levels of Fatigue and the target is blinded for [[1d5]] Rounds.",
									"A blast of energy envelopes the target’s head, burning his face and hair, crisping his skin, and causing him to scream like a stuck Grox. In addition to losing his hair, he is blinded for [[1d10]] Rounds, Stunned for 1 Round, and takes 1 permanent Fellowship Damage.",
									"The attack cooks the target’s face, melting his features and damaging his eyes. The target is blinded for the next [[1d10]] hours and suffers [[1d5]] permanent Fellowship Damage and 1 permanent Perception Damage. The target also suffers [[1d5]] levels of Fatigue.",
									"In a gruesome display, the flesh is burned from the target’s head, exposing charred bone and muscle underneath. The target is blinded permanently and suffers [[1d10]] levels of Fatigue. Also, roll [[1d10]]. This is the target’s new Fellowship, unless their Fellowship is already 10 or less, in which case don’t bother rolling, as nobody really notices the difference.",
									"The target’s head is destroyed in a convocation of fiery death. He does not survive.",
									"Superheated by the attack, the target’s brain explodes, tearing apart his skull and sending flaming chunks of meat flying at those nearby.",
									"Superheated by the attack, the target’s brain explodes, tearing apart his skull and sending flaming chunks of meat flying at those nearby. The target’s entire body catches fire and runs off headless [[2d10]] metres in a random direction (use the scatter diagram on page 244). Anything flammable it passes, including characters, must make a Challenging (+0) Agility Test or catch fi re (see Special Damage, page 247)."],
					energyLeg = 	["The blast of energy sears the flesh and bone of the target’s leg, leaving a nasty burn scar. The target may not Run or Charge for 2 Rounds.",
									"The attack flash-fries the target’s leg, cooking chunks of flesh into char. The target must pass a Challenging (+0) Toughness Test or suffer 1 level of Fatigue.",
									"The blast causes a nasty compound fracture in the target’s leg. The target reduces his Movement by half (rounding up), and the target may not run or charge. The effects to the target’s Movement persist until the target receives medical attention.",
									"A solid blow to the leg sends currents of agony coursing through the target. The target suffers 1 level of Fatigue and reduces his Movement by half (rounding up) for [[1d10]] Rounds. The Target is knocked Prone.",
									"The target’s leg endures horrific burn Damage, fusing clothing and armour with flesh and bone. The target suffers 1 level of Fatigue and reduces his movement by half (rounding up) for [[2d10]] Rounds. The target is knocked Prone.",
									"The attack burns the target’s foot, charring the flesh and emitting a foul aroma. The target must make a Challenging (+0) Toughness Test or lose the foot. On a success, the targetreduces his movement by 1/2 (rounding up) until he receives medical attention. In addition, the target suffers 2 levels of Fatigue.",
									"The energy attack fries the leg, leaving it a mess of blackened flesh. The leg is broken and until repaired, the target counts as having lost the leg. The target must take a Challenging (+0) Toughness Test or become Stunned for 1 Round. In addition the target suffers [[1d5]] levels of Fatigue. The target now only has one leg.",
									"Energy sears through the bone, causing the leg to be severed. The target must take a Challenging (+0) Toughness Test or become Stunned for 1 Round. In addition the target suffers [[1d10]] levels of Fatigue and is suffering from Blood Loss. The target now only has one leg.",
									"The force of the attack reduces the leg to little more than a chunk of sizzling gristle. The target make a Challenging (+0) Toughness Test or die from shock. The leg is utterly lost.",
									"In a terrifying display of power, the leg immolates and fire consumes the target completely. The target dies in a matter of agonising seconds."],
					explosiveArm = ["The attack throws the limb backwards, painfully jerking it away from the body, inflicting 1 level of Fatigue.",
									"The force of the blast snaps the bones of the arm in half. The target drops anything held in the hand and must pass a Challenging (+0) Toughness Test or be Stunned for 1 Round.",
									"The explosion removes 1 finger (and the tips from up to [[1d5]] others) from the target’s hand. The target suffers [[1d10]] WS and BS damage, and anything carried in the hand is destroyed. If this is an explosive such as a hand grenade, it goes off. Messy (use result 9 instead).",
									"The blast rips the sinew of the arm straight from the bone. He is Stunned for 1 Round, and the limb is useless until medical attention is received. The target must make a Challenging (+0) Toughness Test or suffer Blood Loss.",
									"Fragments from the explosion tear into the target’s hand, ripping away flesh and muscle alike. He must immediately make an Ordinary (+10) Toughness Test or lose his hand. If he succeeds, he suffers 1 permanent Weapon Skill and Ballistic Skill Damage from the damaged nerves.",
									"The explosive attack shatters the bone and mangles the flesh turning the target’s arm into a red ruin, inflicting [[1d5]] levels of Fatigue. The target’s arm is broken and, until repaired, the target counts as having only one arm. In addition, the horrendous nature of the wound means that he now suffers from Blood Loss.",
									"In a violent hail of flesh, the arm is blown apart. The target must immediately make a Challenging (+0) Toughness Test or die from shock. On a success, the target is Stunned for [[1d10]] rounds, suffers [[1d10]] levels of Fatigue, and suffers Blood Loss. He now only has one arm.",
									"The arm disintegrates under the force of the explosion taking a good portion of the shoulder and chest with it. The target is sent screaming to the ground, where he dies in a pool of his own blood and organs.",
									"With a mighty bang the arm is blasted from the target’s body, killing the target instantly in a rain of blood droplets. In addition, if the target was carrying a weapon with a power source in his hand (such as a power sword or chainsword) then it explodes, dealing [[1d10+5]] Impact Damage to anyone within two metres.",
									"With a mighty bang the arm is blasted from the target’s body, killing the target instantly in a rain of blood droplets. In addition, if the target was carrying a weapon with a power source in his hand (such as a power sword or chainsword) then it explodes, dealing [[1d10+5]] Impact Damage to anyone within two metres. If the target is carrying any ammunition it explodes dealing [[1d10+5]] Impact Damage to anyone within [[1d10]] metres (this is in addition to Damage caused by exploding power weapons noted above). If the target is carrying any grenades or missiles, these too detonate on his person."],
					explosiveBody = ["The explosion flings the target backwards [[1d5]] metres. The target is knocked Prone.",
									"The target is blown backwards [[1d5]] metres by a terrific explosion, taking 1 level of Fatigue per metre travelled. The target is knocked Prone.",
									"The power of the explosion rends flesh and bone with horrific results. The target must make a Challenging (+0) Toughness Test or suffer from Blood Loss and be Stunned for 1 Round.",
									"The force of the blast sends the target sprawling to the ground. The target is knocked backwards [[1d5]] metres, Stunned for 1 Round, and is knocked Prone.",
									"Concussion from the explosion knocks the target to the ground and turns his innards into so much ground meat. The target must immediately make a Challenging (+0) Toughness Test or suffer Blood Loss and 1 permanent Toughness damage. The target then suffers [[1d5]] levels of Fatigue and is knocked prone.",
									"Chunks of the target’s flesh are ripped free by the force of the attack leaving large, weeping wounds. The target is Stunned for 1 Round, may only take a Half Action in his next Round, and is now suffering Blood Loss.",
									"The explosive force of the attack ruptures the target’s flesh and scrambles his nervous system, knocking him to the ground. The target suffers Blood Loss, is knocked Prone, is Stunned for [[1d10]] Rounds, and must make a Challenging (+0) Toughness Test or fall unconscious.",
									"The target’s chest explodes outward, disgorging a river of partially cooked organs onto the ground, killing him instantly.",
									"Pieces of the target’s body fly in all directions as he is torn into bloody gobbets by the attack. In addition, if the target is carrying any ammunition, it explodes dealing [[1d10+5]] Impact Damage to anyone within [[1d10]] metres. If the target is carrying any grenades or missiles, these too detonate on the target’s person.",
									"Pieces of the target’s body fly in all directions as he is torn into bloody gobbets by the attack. In addition, if the target is carrying any ammunition, it explodes dealing [[1d10+5]] Impact Damage to anyone within [[1d10]] metres. If the target is carrying any grenades or missiles, these too detonate on the target’s person. Anyone within [[1d10]] metres of the target is drenched in gore and must make a Challenging (+0) Agility Test or suffer a –10 penalty to Weapon Skill and Ballistic Skill Tests for 1 Round as blood fouls their sight."],

					explosiveHead = ["The explosion leaves the target confused. He can take only a Half Action on his next Turn. ",
									"The flash and noise leaves the target Blinded and Deafened for 1 Round.",
									"The detonation leaves the target’s face a bloody ruin from scores of small cuts. Permanent scarring is very likely. The target suffers 2 levels of Fatigue and must make a Challenging (+0) Toughness Test or suffer [[1d10]] points of Perception and Fellowship damage.",
									"The force of the blast knocks the target to the ground and senseless. The target suffers [[1d10]] Intelligence Damage and is knocked Prone. He must also pass a Challenging (+0) Toughness Test or suffer 1 permanent Intelligence Damage and be stunned for 2 Rounds.",
									"The explosion flays the flesh from the target’s face and bursts his eardrums with its force. The target is Stunned for [[1d10]] Rounds and is permanently deafened. Finally, the target gains hideous scars—he suffers 1 point of permanent Fellowship Damage.",
									"The target’s head explodes under the force of the attack, leaving his headless corpse to spurt blood from the neck for the next few minutes. Needless to say this is instantly fatal.",
									"Both head and body are blown into a mangled mess, instantly killing the target. In addition, if the target is carrying any ammunition it explodes dealing [[1d10+5]] Impact Damage to any creatures within [[1d5]] metres. If the target was carrying grenades or missiles, these too explode on the target’s person.",
									"In a series of unpleasant explosions the target’s head and torso peel apart, leaving a gory mess on the ground. For the rest of the fight, anyone moving over this spot must make a Challenging (+0) Agility Test or fall Prone.",
									"The target ceases to exist in any tangible way, entirely turning into a kind of crimson mist. You don’t get much deader than this.",
									"The target ceases to exist in any tangible way, entirely turning into a kind of crimson mist Such is the unspeakably appalling manner in which the target was killed, that any of the target’s allies who are within two metres of where the target stood, must make an immediate Challenging (+0) Willpower Test or spend their next Turn fleeing from the attacker."],
					explosiveLeg = ["A glancing blast sends the character backwards one metre. The target must make a Challenging (+0) Toughness Test or be knocked Prone.",
									"The force of the explosion takes the target’s feet out from under him. He is knocked Prone and may only take Half Move movement Actions for [[1d5]] Rounds.",
									"The concussion causes the target’s leg to fracture, inflicting [[2d10]] Agility damage.",
									"The explosion sends the target spinning through the air. The target is flung [[1d5]] metr es away from the explosion. It takes the target a Full Action to r egain his feet, and his Movement is reduced by half (rounding up) for [[1d10]] Rounds.",
									"Explosive force removes part of the target’s foot and scatters the ragged remnants over a wide area. The target suffers 1 permanent Agility damage. The target must make a Difficult (–10) Toughness Test or suffer [[1d5]] levels of Fatigue.",
									"The concussive force of the blast shatters the target’s leg bones and splits apart his flesh, inflicting [[1d10]] levels of Fatigue. The leg is broken and, until repaired, the target counts as having only one leg. The target must also make an immediate Challenging (+0) Toughness Test or permanently lose his foot.",
									"The explosion reduces the target’s leg into a hunk of smoking meat. The target must immediately make a Challenging (+0) Toughness Test or die from shock. On a successful Test, the target is still Stunned for [[1d10]] Rounds, suffers [[1d10]] levels of Fatigue and suffers Blood Loss. He now has only one leg.",
									"The blast tears the leg from the body in a geyser of gore, sending him crashing to the ground, blood pumping from the ragged stump: instantly fatal.",
									"The leg explodes in an eruption of blood, killing the target immediately and sending tiny fragments of bone, clothing, and armour hurtling off in all directions. Anyone within two metres suffers [[1d10]]+2 Impact Damage.",
									"The leg explodes in an eruption of blood, killing the target immediately and sending tiny fragments of bone, clothing, and armour hurtling off in all directions. Anyone within two metres suffers [[1d10]]+2 Impact Damage. In addition, if the target is carrying any ammunition, it explodes dealing [[1d10+5]] Impact Damage to anyone within [[1d10]] metres. If the target is carrying any grenades or missiles, these too detonate on the target’s person."],
					impactArm = 	["The attack strikes the target’s limb, with a powerful blow, causing him to drop anything held in that hand.",
									"The strike leaves a deep bruise, possibly causing minor fractures in the arm. The target suffers 1 level of Fatigue.",
									"The impact crushes flesh and bone. The target drops whatever was held in that hand, and must make a Challenging (+0) Toughness Test or suffer [[1d10]] WS and BS damage.",
									"The impact smashes into the arm or whatever the target is holding, ripping it away and leaving the target reeling from pain. The target is Stunned for 1 Round and drops whatever he was holding in his arm. There is a 10 percent chance that anything the target was holding in that hand is damaged and unusable until repaired.",
									"Muscle and bone take a pounding as the attack rips into the arm. The limb is useless until the target receives medical attention.",
									"The attack pulverises the target’s hand, crushing and breaking [[1d5]] fingers. The target suffers 1 level of Fatigue and must immediately make a Challenging (+0) Toughness Test or suffer 2 permanent WS and BS damage.",
									"With a loud snap, the arm bone is shattered and left hanging limply at the target’s side, dribbling blood onto the ground. The arm is broken and, until repaired, the target counts as having only one arm. The target suffers from Blood Loss.",
									"The force of the attack takes the arm off just below the shoulder, showering blood and gore across the ground. The target must immediately make a Challenging (+0) Toughness Test or die from shock. If he passes the Test, he is still Stunned for [[1d10]] rounds, suffers [[1d5]] levels of Fatigue and is suffers from Blood Loss. He now only has one arm.",
									"In a rain of blood, gore and meat, the target’s arm is removed from his body. Screaming incoherently, he twists about in agony for a few seconds before collapsing to the ground and dying.",
									"In a rain of blood, gore and meat, the target’s arm is removed from his body. Screaming incoherently, he twists about in agony for a few seconds before collapsing to the ground and dying. As the arm is removed it is smashed apart by the force of the attack, and bone, clothing and armour fragments fly about like shrapnel. Anyone within 2 metres of the target suffers [[1d5]]–3 Impact Damage to a random location (see Table 7–2: Hit Locations)."],
					impactBody =	["A blow to the target’s body steals the breath from his lungs. The target can take only a Half Action on his next Turn.",
									"The impact punches the air from the target’s body, inflicting 1 level of Fatigue and knocking the target Prone.",
									"The attack breaks a rib and the target is knocked Prone. The target is also Stunned for 1 Round.",
									"The blow batters the target, shattering a rib. The target suffers [[1d10]] Toughness Damage and must make a Challenging (+0) Agility Test or be knocked Prone.",
									"A solid blow to the chest pulverises the target’s innards, and he momentary doubles over in pain, clutching himself and crying in agony. The target is Stunned for 2 Rounds and must make an Ordinary (+10) Toughness Test.",
									"The attack knocks the target sprawling on the ground. The target is flung [[1d5]] metres away from the attacker and falls Prone (if the target strikes a wall or other solid object, he stops). The target suffers [[1d5]] levels of Fatigue and is Stunned for 2 Rounds.",
									"With an audible crack, [[1d5]] of the target’s ribs break. The target can either lay down and stay still awaiting medical attention (a successful Medicae Test sets the ribs) or continue to take Actions, though each Round there is a 20% chance that a jagged rib pierces a vital organ and kills the character instantly. The target suffers [[1d5]] permanent Toughness Damage.",
									"The force of the attack ruptures several of the target’s organs and knocks him down, gasping in wretched pain. The target suffers Blood Loss and suffers [[1d10]] permanent Toughness Damage.",
									"The target jerks back from the force of the attack, throwing back his head and spewing out a jet of blood before crumpling to the ground dead.",
									"The target jerks back from the force of the attack, throwing back his head and spewing out a jet of blood before crumpling to the ground dead. The target is thrown [[1d10]] metres away from the attack. Anyone in the target’s path must make a Challenging (+0) Agility Test or be knocked Prone."],
					impactHead = 	["The impact fills the target’s head with a terrible ringing noise. The target must make a Challenging (+0) Toughness Test or suffer 1 level of Fatigue.",
									"The attack causes the target to see stars. The target suffers a ––10 penalty to any Perception or Intelligence Tests for [[1d5]] Rounds.",
									"The target’s nose breaks in a torrent of blood, blinding him for 1 Round. The target must make a Challenging (+0) Toughness Test or be Stunned for 1 Round.",
									"The concussive strike staggers the target. The target must make a Challenging (+0) Toughness Test or be Stunned for 1 Round and knocked Prone.",
									"The force of the blow sends the target reeling in pain. The target is Stunned for 1 Round and staggers backwards [[1d5]] metres. He suffers 1 permanent Intelligence damage.",
									"The target’s head is snapped back by the attack leaving him staggering around trying to control mindnumbing pain. The target is Stunned for [[1d5]] Rounds, knocked backwards [[1d5]] metres, must make a Challenging (+0) Agility Test or be knocked Prone.",
									"The attack slams into the target’s head, fracturing his skull and opening a long tear in his scalp. The target is Stunned for [[1d10]] Rounds and halves all movement for [[1d10]] hours.",
									"Blood pours from the target’s noise, mouth, ears and eyes as the attack pulverises his brain. He does not survive the experience.",
									"The target’s head bursts like an overripe fruit and sprays blood, bone and brains in all directions. Anyone within 4 metres of the target must make an Agility Test or suffer a –10 penalty to their WS and BS on their next Turn as gore gets in their eyes or on their visors.",
									"The target’s head bursts like an overripe fruit and sprays blood, bone and brains in all directions. Anyone within 4 metres of the target must make an Agility Test or suffer a –10 penalty to their WS and BS on their next Turn as gore gets in their eyes or on their visors. The attack was so powerful that it passes through the target and may hit another target nearby. If the hit was from a melee weapon, the attacker may immediately make another attack (with the same weapon) against any other target they can reach without moving. If the hit was from a ranged weapon they may immediately make another attack (with the same weapon) against any target standing directly behind the original target and still within range of their weapon."],
					impactLeg = 	["A blow to the leg results in deep bruises and teeth-clenching pain. The target suffers 1 level of Fatigue.",
									"A grazing strike against the leg slows the target. The target’s Movement is reduced by half (rounding up) for 1 Round, and he must make a Challenging (+0) Toughness Test or be Stunned for 1 Round and fall Prone.",
									"A powerful impact causes micro fractures in the target’s bones, inflicting considerable agony. The target suffers [[2d10]] Agility Damage, and is knocked Prone.",
									"A solid blow to the leg sends lightning agony coursing through the target. The target suffers [[1d10]] Agility Damage and is knocked Prone.",
									"The blow breaks the target’s leg, leaving him Stunned for 1 Round and reducing his movement by to 1 metre until he receives medical attention. The target is also knocked Prone.",
									"Several of the tiny bones in the target’s foot snap like twigs with cracking noises. The target must make an immediate Challenging (+0) Toughness Test or permanently lose the use of his foot. The target’s Movement is reduced by 1/2 (rounding up) until medical attention is received. The target suffers 2 levels of Fatigue.",
									"With a nasty crunch, the leg is br oken and the target is knocked Prone mewling in pain. The target falls to the ground with a broken leg and, until it is r epaired, he counts as only having one leg. The target is Stunned for 2 R ounds.",
									"The force of the attack rips the lower half of the leg away in a stream of blood. The target must immediately make a Challenging (+0) Toughness Test or die from shock. The target suffers from Blood Loss and suffers [[1d5]] permanent Agility Damage. He now only has one leg.",
									"The hit rips apart the flesh of the leg, causing blood to spray out in all directions. Even as the target tries futilely to stop the sudden flood of vital fluid, he falls to the ground and dies in a spreading pool of gore.",
									"The hit rips apart the flesh of the leg, causing blood to spray out in all directions. Even as the target tries futilely to stop the sudden flood of vital fluid, he falls to the ground and dies in a spreading pool of gore. Such is the agony of the target’s death that his piteous screams drowns out all conversation within [[2d10]] metres for the rest of the Round."],
					rendingArm = 	["The slashing attack tears anything free that was held in this arm.",
									"Deep cuts cause the target to drop whatever was held and inflicts 1 level of Fatigue.",
									"The atack shreds the target’s arm into ribbons, causing the target to scream in pain. The target drops whatever was held in that hand and must make a successful Challenging (+0) Toughness Test or suffer Blood Loss.",
									"The attack flays the skin from the limb, filling the air with blood and the sounds of his screaming. The target falls Prone from the agony and takes 2 levels of Fatigue. The limb is useless for [[1d10]] Rounds.",
									"A bloody and very painful looking furrow is opened up in the target’s arm. The target suffers from Blood Loss and vomits all over the place in agony. He drops anything held and the limb is useless without medical attention.",
									"The blow mangles flesh and muscle as it hacks into the target’s hand, liberating [[1d5]] fingers in the process (a roll of a 5 means that the thumb has been sheared off ). The target is Stunned for 1 Round and must immediately make a Challenging (+0) Toughness Test or lose the use of his hand.",
									"The attack rips apart skin, muscle, bone and sinew with ease, turning the target’s arm into a dangling ruin. The target suffers [[1d10]] Strength Damage. The arm is broken and, until repaired, the target counts as having only one arm. In addition, numerous veins have been severed and the target is now suffering from Blood Loss.",
									"With an assortment of unnatural, wet ripping sounds, the arm flies free of the body trailing blood behind it in a crimson arc. The target must immediately make a Challenging (+0) Toughness Test or die from shock. If he passes the Test, he is Stunned for [[1d10]] Rounds and suffers Blood Loss. He now has only one arm. ",
									"The attack slices clean through the arm and into the torso, drenching the ground in blood and gore and killing the target instantly.",
									"The attack slices clean through the arm and into the torso, drenching the ground in blood and gore and killing the target instantly. However, as the arm falls to the ground its fingers spasm uncontrollably, pumping the trigger of any held weapon. If the target was carrying a ranged weapon there is a 5% chance that a single randomly determined target within [[2d10]] metres is hit by these shots, in which case resolve a single hit from the target’s weapon."],
					rendingBody = 	["If the target is not wearing armour on this location, he takes 1 level of Fatigue from a painful laceration. If he is wearing armour, there is no effect. Phew!",
									"A powerful slash opens a painful rent in the target’s body. He suffers 1 level of Fatigue and must make a Challenging (+0) Toughness Test or be Stunned for 1 Round.",
									"The attack rips a large patch of skin from the target’s torso, leaving him gasping in pain. The target is Stunned for 1 Round and must make a Challenging (+0) Toughness Test or suffer from Blood Loss.",
									"The blow opens up a long wound in the target’s torso, causing him to double over in terrible pain. The target suffers from Blood Loss and is Stunned for 1 Round.",
									"A torrent of blood spills from the deep cuts, making the ground slick with gore. All characters attempting to move through this pool of blood must succeed on an Agility Test or fall Prone. The target suffers [[1d10]] Toughness Damage and also suffers Blood Loss.",
									"The mighty attack takes a sizeable chunk out of the target and knocks him to the gr ound as he clutches the oozing wound, shrieking in pain. The target is knocked Prone and suffers [[1d10]] Toughness Damage and Blood Loss.",
									"The attack cuts open the target’s abdomen. The target can either choose to use one arm to hold his guts in (until a medic can bind them in place with a successful Medicae Test), or fight on regardless and risk a 20% chance each turn that his middle splits open, spilling his intestines all over the ground, causing an additional [[2d10]] Damage. In either case, the target suffers [[1d5]] permanent Toughness Damage and is now suffering Blood Loss.",
									"With a vile tearing noise, the skin on the target’s chest comes away revealing a red ruin of muscle. The target must make a Challenging (+0) Toughness Test or die. If he passes, he suffers [[1d10]] permanent Toughness Damage, is stunned for 1 Round, and now suffers Blood Loss.",
									"The powerful blow cleaves the target from gullet to groin, revealing his internal organs and spilling them on to the ground before him. The target is now quite dead.",
									"The powerful blow cleaves the target from gullet to groin, revealing his internal organs and spilling them on to the ground before him. The target is now quite dead. The area and the target are awash with gore. For the rest of the fight, anyone moving within four metres of the target’s corpse must make make a Challenging (+0) Agility Test or fall Prone."],
					rendingHead = 	["The attack tears a painful the target’s face, meaning he suffers 1 level of Fatigue. If the target is wearing a helmet, there is no effect.",
									"The attack slices open the target’s scalp which immediately begins to bleed profusely. Due to blood pouring into the target’s eyes, he suffers a –10 penalty to both Weapon Skill and Ballistic Skill for the next [[1d10]] Turns. The target must pass a Challenging (+0) Toughness Test or suffer from Blood Loss.",
									"The attack rips open the target’s face, leaving him Stunned for [[1d5]] Rounds. If the target is wearing a helmet, the helmet is torn off. The target suffers Blood Loss.",
									"The attack slices across one of the target’s eye sockets, possibly scooping out the eye. He must make a Routine (+20) Toughness Test or lose the eye (augmetics can repair this). He also suffers [[1d10]] Perception Damage",
									"The attack tears the target’s helmet from his head. If wearing no helmet, the target loses an ear instead, becoming Deafened until he receives medical attention. If he loses an ear, he must also must pass a Challenging (+0) Toughness Test or suffer 1 point of permanent Fellowship Damage.",
									"As the blow rips violently across the target’s face—it takes with it an important feature. Roll [[1d10]] to see what the target has lost. 1–3: Eye (see Permanent Effects on page 247), 4–7: Nose (the target suffers [[1d10]] permanent Fellowship Damage), 8–10: Ear (the target suffers [[1d10]] permanent Fellowship Damage.) In addition, the target is now suffering Blood Loss and suffers [[1d5]] levels of Fatigue.",
									"In a splatter of skin and teeth, the attack removes most of the target’s face. He is permanently blinded and has his Fellowship permanently reduced to [[1d10]], and also now has trouble speaking without slurring his words. In addition, the target is suffering from Blood Loss and is Stunned for 1 Round.", 
									"The blow slices into the side of the target’s head causing his eyes to pop out and his brain to ooze down his cheek like spilled jelly. He’s dead before he hits the ground.",
									"With a sound not unlike a wet sponge being torn in half, the target’s head flies free of its body and sails through the air, landing harmlessly [[2d10]] metres away with a soggy thud. The target is instantly slain.",
									"With a sound not unlike a wet sponge being torn in half, the target’s head flies free of its body and sails through the air, landing harmlessly [[2d10]] metres away with a soggy thud. The target is instantly slain. In addition, the target’s neck spews blood in a torrent, drenching all those nearby and forcing them to make a Challenging (+0) Agility Test. Anyone who fails the Test, suffers a –10 penalty to his Weapon Skill and Ballistic Skill Tests for 1 Round as gore fills his eyes or fouls his visor."],
					rendingLeg = 	["The attack knocks the limb backwards, painfully twisting it awkwardly. The target suffers 1 level of Fatigue.",
									"The target’s kneecap splits open. He must make a Challenging (+0) Agility Test or fall Prone and suffer from Blood Loss as the already damaged extremity hits the ground.",
									"The attack rips a length of flesh from the leg, causing blood to gush from the wound. The target suffers [[1d5]] Agility Damage and suffers Blood Loss.",
									"The attack rips the kneecap free from the target’s leg, causing it to collapse out from under him. The target’s Movement is reduced by 1/2 (rounding up) until medical attention is received. In addition, he is knocked Prone and suffers [[1d10]] Agility Damage.",
									"In a spray of blood, the target’s leg is deeply slashed, exposing bone, sinew and muscle. The target suffers Blood Loss, and must make a Challenging (+0) Toughness Test or suffer 1 point of permanent Agility Damage.",
									"The blow slices a couple of centimetres off the end of the target’s foot. The target must make an immediate Challenging (+0) Toughness Test or permanently lose the use of his foot. On a success, the target’s Movement is reduced by half (rounding up). In either case, the target suffers Blood Loss.",
									"The force of the blow cuts deep into the leg, grinding against bone and tearing ligaments apart. The leg is broken and, until repaired, the target counts as having only one leg. In addition, the level of maiming is such that the target is now suffering from Blood Loss. He also is Stunned for 1 Round and is knocked Prone.",
									"In a single bloody hack the leg is lopped off the target, spurting its vital fluids across the ground. The target must immediately make a Challenging (+0) Toughness Test or die from shock. On a success, the target is Stunned for [[1d10]] Rounds, and suffers Blood Loss. He now has only one leg.",
									"With a meaty chop, the leg comes away at the hip. The target pitches to the ground howling in agony before dying.",
									"With a meaty chop, the leg comes away at the hip. The target pitches to the ground howling in agony before dying. The tide of blood is so intense that, for the remainder of the battle, anyone making a Run or Charge Action within six metres of the target this Turn must make a Challenging (+0) Agility Test or fall over."],
					energy = [energyArm, energyBody, energyHead, energyLeg],
					explosive = [explosiveArm, explosiveBody, explosiveHead, explosiveLeg],
					impact = [impactArm, impactBody, impactHead, impactLeg],
					rending = [rendingArm, rendingBody, rendingHead, rendingLeg],
					overall = [energy, explosive, impact, rending],
					types = ["energy","explosive","impact","rending"],
					locations = ["arm","body","head","leg"],					
					toReturn;
					
					log(overall);
					log(types);
					log(locations);
					
					if(damageType == "invalid" || damageAmount < 0)
					{
						sendChat("Robot","Invalid input. Please check API and try again.");
					}
					if(damageAmount > 10)
					{
						damageAmount = 10;
					}
					
					toReturn = overall[damageType][damageLocation][damageAmount-1];
					
					sendChat(who, damageAmount+" "+types[damageType]+" damage to the "+locations[damageLocation]+":");
					sendChat(who, ""+toReturn);
				
				
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
      
      	a40KHitHelper.RegisterEventHandlers();
      });
      