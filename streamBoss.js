(function() {
    // Setup the default values
    var baseBossHp = $.getSetIniDbNumber('streamBoss', 'baseBossHp',1400000),
        baseChatHp = $.getSetIniDbNumber('streamBoss', 'baseChatHp', 100000),
        maxDamage = $.getSetIniDbNumber('streamBoss', 'maxDamage', 10000),
        minDamage = $.getSetIniDbNumber('streamBoss', 'minDamage', 100),
        bossHp = $.getSetIniDbNumber('streamBoss', 'bossHp', baseBossHp),
        chatHp = $.getSetIniDbNumber('streamBoss', 'chatHp', baseChatHp),
        missChance = $.getSetIniDbNumber('streamBoss', 'missChance', 10),
        critChance = $.getSetIniDbNumber('streamBoss', 'critChance', 10),
        critMultiplier = $.getSetIniDbNumber('streamBoss', 'critMultiplier', 2),
        baseFileOutputPath = $.getSetIniDbString('streamBoss', 'baseFileOutputPath', './addons/'),
        slowAttack = $.getSetIniDbNumber('streamBoss', 'slowAttack', 5),
        fastAttack = $.getSetIniDbNumber('streamBoss', 'fastAttack', 1),
        autoAttack = $.getSetIniDbBoolean('streamBoss', 'autoAttack', false),
        attackInterval,
        lastAttack = 0,
        progress = 0;
    
    function writeFiles() {
        $.inidb.set('streamBoss', 'bossHp', bossHp);
        $.writeToFile('' + bossHp, baseFileOutputPath + 'bosshp.txt', false);
        $.inidb.set('streamBoss', 'chatHp', chatHp);
        $.writeToFile('' + chatHp, baseFileOutputPath + 'chathp.txt', false);
    }

    function attack(sender) {
    	var attacker = $.resolveRank(sender),
        	output,
        	damage = 0,
        	outcome = ($.randRange(1, 100)),
       		hitType = 0; // 1 is miss, 2 is crit, 3 is normal, 4 is absorb, 5 is perfect strike
            
        if (outcome <= missChance ) { //Chat missed attack
            hitType = 1;
        } else if (outcome >= (100 - critChance)) { // Critcal critChance
            var damage = $.randRange(maxDamage, (maxDamage * critMultiplier));
            hitType = 2;
        } else if (outcome == 1) { // Boss abosorbs
            damage = $.randRange(minDamage, maxDamage);
            hitType = 4;
        } else if (outcome == 100) { // Max damage crit
            damage = maxDamage * critMultiplier;
            hitType = 5;
        } else { // Normal Hit
            damage = $.randRange(minDamage, maxDamage);
            hitType = 3;
        }
        bossHp = ((hitType == 4) ? (bossHp + damage) : (bossHp - damage)); 
        switch (hitType) {
        	case 1:
        	    output = 'MISS!! ' + attacker + ' missed the attack!!';
                break;
        	case 2:
                output = 'CRITICAL STRIKE!! ' + attacker + ' hits for ' + damage + ' HP!!';
                break;
            case 3:
                output = 'HIT!! ' + attacker + ' hits for ' + damage + ' HP!!';
                break;
            case 4:
                output = 'ABSORBED!!  The boss abosorbs ' + damage + ' HP from ' + attacker + '\'s hit!!';
                break;
            case 5:
                output = 'PERFECT STRIKE!!! ' + attacker + ' hits for ' + damage + ' HP!!';
                break;
        }
        if (bossHp < 0) {
            bossHp = 0;
            output = output + ' The boss has been defeated!!!!';
        } else if (bossHp > baseBossHp + (baseBossHp * 0.15)) {
            bossHp = baseBossHp + (baseBossHp * 0.15);
            output = output + ' Boss HP maxed! Boss Health Remaining: ' + bossHp + ' HP!';
        } else {
            output = output + ' Boss Health Remaining: ' + bossHp + ' HP!';
        }
        $.say($.whisperPrefix(sender) + output);
        writeFiles();
    }

    function heal(sender) {
    	var healAmount = ($.randRange(1, (baseChatHp * 0.2))),
    		healer = $.resolveRank(sender),
    		output;

    	chatHp = chatHp + healAmount;
    	if (chatHp > baseChatHp + (baseChatHp * 0.15)) {
            chatHp = baseChatHp + (baseChatHp * 0.15);
            output = 'HEAL!! ' + healer + ' just healed for ' + healAmount + ' HP!! Chat HP maxed! Chat Health Remaining: ' + chatHp + ' HP!';
        } else {
	    	output = 'HEAL!! ' + healer + ' just healed for ' + healAmount + ' HP!! Chat health remaining: ' + chatHp + ' HP';
	    }
	    $.say($.whisperPrefix(sender) + output);
	    writeFiles();
    }
    
    function attackCheck() {
    	var now = $.systemTime();

    	if (!$.bot.isModuleEnabled('./games/streamBoss.js')) {
            return;
        }

        if (!autoAttack) {
        	return;
        }

        if (lastAttack + attackInterval <= now) {
        	counterAttack();
        	attackInterval = $.randRange((fastAttack * 6e4), (slowAttack * 6e4));
        	lastAttack = now;
        	return;
        }
    }

    function counterAttack() {
    	var output,
        	damage = 0,
        	outcome = ($.randRange(1, 100)),
       		hitType = 0; // 1 is miss, 2 is crit, 3 is normal, 4 is absorb, 5 is perfect strike
            
        if (outcome <= missChance ) { //Chat missed attack
            hitType = 1;
        } else if (outcome >= (100 - critChance)) { // Critcal critChance
            var damage = $.randRange(maxDamage, (maxDamage * critMultiplier));
            hitType = 2;
        } else if (outcome == 1) { // Boss abosorbs
            damage = $.randRange(minDamage, maxDamage);
            hitType = 4;
        } else if (outcome == 100) { // Max damage crit
            damage = maxDamage * critMultiplier;
            hitType = 5;
        } else { // Normal Hit
            damage = $.randRange(minDamage, maxDamage);
            hitType = 3;
        }
        chatHp = ((hitType == 4) ? (chatHp + damage) : (chatHp - damage)); 
        switch (hitType) {
        	case 1:
        	    output = 'MISS!! The boss missed the attack!!';
                break;
        	case 2:
                output = 'CRITICAL STRIKE!! The boss hits the chat for ' + damage + ' HP!!';
                break;
            case 3:
                output = 'HIT!! The boss hits the chat for ' + damage + ' HP!!';
                break;
            case 4:
                output = 'ABSORBED!!  Chat abosorbs ' + damage + ' HP from the boss\'s hit!!';
                break;
            case 5:
                output = 'PERFECT STRIKE!!! The boss hits the chat for ' + damage + ' HP!!';
                break;
        }
        if (chatHp < 0) {
            chatHp = 0;
            output = output + ' The boss has been defeated!!!!';
        } else if (chatHp > baseChatHp + (baseChatHp * 0.15)) {
            chatHp = baseChatHp + (baseChatHp * 0.15);
            output = output + ' Chat HP maxed! Chat Health Remaining: ' + chatHp + ' HP!';
        } else {
            output = output + ' Chat Health Remaining: ' + chatHp + ' HP!';
        }
        $.say(output);
        writeFiles();

    }
    /**
    * @event command
    */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            actionArg1;
            
        if (command.equalsIgnoreCase('attack')) {
            if (chatHp == 0) {
                $.say($.whisperPrefix(sender) + 'You cannot attack because chat has been defeated.');
                return;
            }
            if (bossHp == 0) {
                $.say($.whisperPrefix(sender) + 'You cannot attack because the boss has been defeated.');
                return;
            }
            attack(sender);
            return;
        }

        if (command.equalsIgnoreCase('streamboss')) {
            actionArg1 = parseInt(args[1]);
            if (!action) {
                $.say($.whisperPrefix(sender) + 'Usage: !streamboss [ basebosshp | basechathp | maxdamage | mindamage | misschance | critchance | critmultiplier | reset | autoattack | fastattack | slowattack ] (value)');
                return;
            } else {
                if (action.equalsIgnoreCase('basebosshp')) {
                    if (isNaN(actionArg1) || !actionArg1 || actionArg1 < 100) {
                        $.say($.whisperPrefix(sender) + 'Usage: !streamboss basebosshp [value].  HP count the boss starts at! Minimum: 100 Current value: ' + baseBossHp);
                        return;
                    }
                    baseBossHp = actionArg1;
                    $.say($.whisperPrefix(sender) + 'Base Boss HP set to ' + baseBossHp +'.');
                    $.inidb.set('streamBoss', 'baseBossHp', baseBossHp);
                    return;
                }
                
                if (action.equalsIgnoreCase('basechathp')) {
                    if (isNaN(actionArg1) || !actionArg1 || actionArg1 < 100) {
                        $.say($.whisperPrefix(sender) + 'Usage: !streamboss basechathp [value].  HP count the chat starts at! Minmum: 100 Current value: ' + baseChatHp);
                        return;
                    }
                    baseChatHp = actionArg1;
                    $.say($.whisperPrefix(sender) + 'Base Chat HP set to ' + baseChatHp +'.');
                    $.inidb.set('streamBoss', 'baseChatHp', baseChatHp);
                    return;
                }
                
                if (action.equalsIgnoreCase('maxdamage')) {
                    if (isNaN(actionArg1) || !actionArg1 || actionArg1 < 10) {
                        $.say($.whisperPrefix(sender) + 'Usage: !streamboss maxdamage [value].  Maximum damage a normal hit can do! Minimum: 10 Current value: ' + maxDamage);
                        return;
                    }
                    if (actionArg1 < minDamage) {
                    	$.say($.whisperPrefix(sender) + 'ERROR: maxDamage value cannot greater than minDamage value. Current minDamage value: ' + minDamage);
                    	return;
                    }
                    maxDamage = actionArg1;
                    $.say($.whisperPrefix(sender) + 'Maximum damage set to ' + maxDamage +'.');
                    $.inidb.set('streamBoss', 'maxDamage', maxDamage);
                    return;
                }

                if (action.equalsIgnoreCase('mindamage')) {
                    if (isNaN(actionArg1) || !actionArg1 || actionArg1 < 1) {
                        $.say($.whisperPrefix(sender) + 'Usage: !streamboss mindamage [value].  Minimum damage a normal hit can do! Minimum: 1 Current value: ' + minDamage);
                        return;
                    }
                    if (actionArg1 > maxDamage) {
                    	$.say($.whisperPrefix(sender) + 'ERROR: minDamage value cannot greater than maxDamage value. Current maxDamage value: ' + maxDamage);
                    	return;
                    }
                    minDamage = actionArg1;
                    $.say($.whisperPrefix(sender) + 'Minimum damage set to ' + minDamage +'.');
                    $.inidb.set('streamBoss', 'minDamage', minDamage);
                    return;
                }
                
                if (action.equalsIgnoreCase('misschance')) {
                    if (isNaN(actionArg1) || !actionArg1 || actionArg1 > 25) {
                        $.say($.whisperPrefix(sender) + 'Usage: !streamboss misschance [value].  Percentage chance of an attack missing! Maximum: 25 Current value: ' + missChance + '%');
                        return;
                    }
                    missChance = actionArg1;
                    $.say($.whisperPrefix(sender) + 'Miss percentage set to ' + missChance +'%.');
                    $.inidb.set('streamBoss', 'missChance', missChance);
                    return;
                }
                
                if (action.equalsIgnoreCase('critchance')) {
                    if (isNaN(actionArg1) || !actionArg1 || actionArg1 > 25) {
                        $.say($.whisperPrefix(sender) + 'Usage: !streamboss critchance [value].  Percentage chance of an attack being a critical strike! Maximum: 25 Current value: ' + critChance +'%');
                        return;
                    }
                    critChance = actionArg1;
                    $.say($.whisperPrefix(sender) + 'Critical hit percentage set to ' + critChance +'%.');
                    $.inidb.set('streamBoss', 'critChance', critChance);
                    return;
                }
                
                if (action.equalsIgnoreCase('critmultiplier')) {
                    if (isNaN(actionArg1) || !actionArg1 || actionArg1 < 2 || actionArg1 > 10) {
                        $.say($.whisperPrefix(sender) + 'Usage: !streamboss critmultiplier [value].  Multiplys max damage in the event of a critical hit! Range: 2-10 Current value: ' + critMultiplier);
                        return;
                    }
                    critMultiplier = actionArg1;
                    $.say($.whisperPrefix(sender) + 'Critical Hit multiplier set to ' + critMultiplier +'.');
                    $.inidb.set('streamBoss', 'critMultiplier', critMultiplier);
                    return;
                }

                if (action.equalsIgnoreCase('fastattack')) {
                	if (isNaN(actionArg1) || !actionArg1 || actionArg1 < 1) {
                        $.say($.whisperPrefix(sender) + 'Usage: !streamboss fastattack [value].  The shortest time possible, in minutes, between boss attacks. Minimum: 1 Current value: ' + fastAttack + ' minutes.');
                        return;
                    }
                    fastAttack= actionArg1;
                    $.say($.whisperPrefix(sender) + 'Shortest attack interval set to ' + fastAttack + ' minutes.');
                    attackInterval = $.randRange((fastAttack * 6e4), (slowAttack * 6e4));
                    $.inidb.set('streamBoss', 'fastAttack', fastAttack);
                    return;
                }

                if (action.equalsIgnoreCase('slowattack')) {
                	if (isNaN(actionArg1) || !actionArg1 || actionArg1 > 10 ) {
                        $.say($.whisperPrefix(sender) + 'Usage: !streamboss slowattack [value].  The longest time possible, in minutes, between boss attacks. Minimum: 10 Current value: ' + slowAttack + ' minutes.');
                        return;
                    }
                    slowAttack= actionArg1;
                    $.say($.whisperPrefix(sender) + 'Longest attack interval set to ' + slowAttack + ' minutes.');
                    attackInterval = $.randRange((fastAttack * 6e4), (slowAttack * 6e4));
                    $.inidb.set('streamBoss', 'slowAttack', slowAttack);
                    return;
                }                
                
                if (action.equalsIgnoreCase('autoattack')) {
                	if (!autoAttack) {
                		autoAttack = true;
                		$.say($.whisperPrefix(sender) + 'The bot will now auto-attack.');
                	} else {
                		autoAttack = false;
                		$.say($.whisperPrefix(sender) + 'The bot will no longer auto-attack.');
                	}
                	$.inidb.set('streamBoss', 'autoAttack', autoAttack);
                	return;
                }
                if (action.equalsIgnoreCase('reset')) {
                    bossHp = baseBossHp;
                    chatHp = baseChatHp;
                    writeFiles();
                    $.say($.whisperPrefix(sender) + 'The HP of both chat and boss hass been restored!!!');
                    return;
                }
            }
        }
        
        if (command.equalsIgnoreCase('heal')) {
            if (chatHp == 0) {
                $.say($.whisperPrefix(sender) + 'You cannot heal because chat has been defeated.');
                return;
            }
            if (bossHp == 0) {
                $.say($.whisperPrefix(sender) + 'You cannot heal because the boss has been defeated.');
                return;
            }
            heal(sender);
        }

        if (command.equalsIgnoreCase('stats')) {
        	$.say($.whisperPrefix(sender) + 'Chat: ' + chatHp + ' HP   |   Boss: ' + bossHp + ' HP');
        }
    });
    
    var interval = setInterval(function() {
    	attackCheck();
    }, 15e3);
   
    $.bind('initReady', function() {
            $.registerChatCommand('./custom/streamBoss.js', 'attack', 7);
            $.registerChatCommand('./custom/streamBoss.js', 'streamboss', 1);
            $.registerChatCommand('./custom/streamBoss.js', 'heal', 7);
            $.registerChatCommand('./custom/streamBoss.js', 'stats', 7);
            
            $.registerChatSubcommand('streamboss', 'basebosshp', 1);
            $.registerChatSubcommand('streamboss', 'basechathp', 1);
            $.registerChatSubcommand('streamboss', 'maxdamage', 1);
            $.registerChatSubcommand('streamboss', 'mindamage', 1);
            $.registerChatSubcommand('streamboss', 'misschance', 1);
            $.registerChatSubcommand('streamboss', 'critchance', 1);
            $.registerChatSubcommand('streamboss', 'critmultiplier', 1);
            $.registerChatSubcommand('streamboss', 'reset', 1);
            $.registerChatSubcommand('streamboss', 'autoattack', 1);
            $.registerChatSubcommand('streamboss', 'slowattack', 1);
            $.registerChatSubcommand('streamboss', 'fastattack', 1);

            attackInterval = $.randRange((fastAttack * 6e4), (slowAttack * 6e4));
            lastAttack = $.systemTime();
    });
})();
