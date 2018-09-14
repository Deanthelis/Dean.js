var BubbleSetter = BubbleSetter || (function() {
    'use strict';
	
	var handleInput = function(msg) {
		var args, hp, ac, cmd, page, obj, objs=[],who;

		if (msg.type !== "api") {
			return;
		}
        who=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');

		args = msg.content.split(" ");
		switch(args[0]) {
			case '!bubbles':
			    
				if(args.length < 4 || args.length > 4) {
					return;
				}
                hp = parseInt(args[1],10)||0;
                cmd = parseInt(args[2],10)||0;
                ac = parseInt(args[3],10)||0;
				
                _.each(_.union(objs,_.map(msg.selected,function (o) {
                    return getObj(o._type,o._id);
                })), function(o){
                    o.set({
                        bar1_value: hp,
                        bar1_max: hp,
                        bar2_value: ac,
                        bar3_value: cmd
                    });
				});
				
				
				break;
			case '!pfsrd':
			    if(args.length < 2 || args.length > 2) {
					return;
				}
			    sendChat('Nuke Dukem','/w '+who+' <a href=\"https://cse.google.com/cse?q='+args[1]+'&cx=006680642033474972217%3A6zo0hx_wle8#gsc.tab=0&gsc.q='+args[1]+'&gsc.page=1\" target=\"_blank\">Search Result For: '+args[1]+'</a>');
			    break;
			    
			case '!tokenstamp':
			    if(args.length < 1 || args.length > 1) {
					return;
				}
			    sendChat('Nuke Dukem','/w '+who+' <a href=\"http://rolladvantage.com/tokenstamp/\" target=\"_blank\">Click to go to TokenStamp 2, a free token creation tool!</a>');
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

	BubbleSetter.RegisterEventHandlers();
});
