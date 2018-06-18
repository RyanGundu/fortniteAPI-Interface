$(function(){

    var compareBtn = $('.compare-btn');
    var player1Data = {};
    var player2Data = {};

    var players = [];

	compareBtn.click(function(){
        if (getData()) {
            players = [];
            compareBtn.prop('disabled', true);
            $('.compLoad').css('visibility', 'visible');
            requestData(player1Data);
            setTimeout(function(){ //wait 2 seconds before the next request
                requestData(player2Data);
                setTimeout(function() {
                    try {
                        comparePlayers();
                    } catch (err) {
                        compareBtn.prop('disabled', false);
                        $('.compLoad').css('visibility', 'hidden');
                        $('.error').click();
                        // console.log('Something went wrong');
                    }
                },2000);
            
            },2000);
        }
    });

    function getData () {
        var username1 = $('#player1'); //player1 field
        var username2 = $('#player2'); //player2 field
	    var platform1 = '';
        var platform2 = '';
        //player1 platform
        var ps4 = $('#ps41');
        var xbox = $('#xbox1');
        var pc = $('#pc1');
        platform1 = checkPlatform(ps4, xbox, pc);
        //player 2 platform
        var ps42 = $('#ps42');
        var xbox2 = $('#xbox2');
        var pc2 = $('#pc2');
        platform2 = checkPlatform(ps42, xbox2, pc2);

        if (platform1 == '' || platform2 == '' || username1.val().length <= 0 || username2.val().length <= 0) {return false}

        player1Data.username = username1.val().toLowerCase();
        // if (platform1 == 'psn' || platform1 == 'xbl') {
		// 	player1Data.username = platform1 + '(' + player1Data.username + ')';
		// }
        player1Data.platform = platform1;

        player2Data.username = username2.val().toLowerCase();
        // if (platform2 == 'psn' || platform2 == 'xbl') {
		// 	player2Data.username = platform2 + '(' + player2Data.username + ')';
		// }
        player2Data.platform = platform2;

        return true;

    }
    
    function checkPlatform(ps4, xbox, pc) {
        if (ps4.prop('checked')) {
			return 'psn';
		} else if (xbox.prop('checked')) {
			return 'xbl';
		} else if (pc.prop('checked')) {
			return 'pc';
		} else {
			$('.console-select').effect("shake");
			return '';
		}
    }


    function requestData(data) {
        $.ajax({
			type: "POST",
			url: '/',
			datatype: 'json',
			data: data,
			success: function (data) {
				if (data.indexOf('"error": "Player Not Found"') != -1) {
					$('.error').click();
					console.log('Sorry player not found');
				} else {
									
					try {
                        data = jQuery.parseJSON(data);
                        players.push(data);
						console.log(data);
					} catch (err) {
						$('.error').click();
						// console.log('player not found');
					}
					
				}
			},
			fail: function(error) {
				console.log(error);
				$('.compLoad').css('visibility', 'hidden'); 
			}
		});
    }

    function comparePlayers () {
        if (players.length != 2) {
            $('.compLoad').css('visibility', 'hidden');
            compareBtn.prop('disabled', false);
            return false;
        }

        $('#p1Name').html(players[0].epicUserHandle);
        $('#p2Name').html(players[1].epicUserHandle);
        
        //player1
        $('.p1-s-kd').html(players[0].stats.p2.kd.value);
        $('.p1-s-win').html(players[0].stats.p2.winRatio.value + "%");
        $('.p1-s-kpg').html(players[0].stats.p2.kpg.value);
        $('.p1-d-kd').html(players[0].stats.p10.kd.value);
        $('.p1-d-win').html(players[0].stats.p10.winRatio.value + "%");
        $('.p1-d-kpg').html(players[0].stats.p10.kpg.value);
        $('.p1-sq-kd').html(players[0].stats.p9.kd.value);
        $('.p1-sq-win').html(players[0].stats.p9.winRatio.value + "%");
        $('.p1-sq-kpg').html(players[0].stats.p9.kpg.value);

        //player2
        $('.p2-s-kd').html(players[1].stats.p2.kd.value);
        $('.p2-s-win').html(players[1].stats.p2.winRatio.value + "%");
        $('.p2-s-kpg').html(players[1].stats.p2.kpg.value);
        $('.p2-d-kd').html(players[1].stats.p10.kd.value);
        $('.p2-d-win').html(players[1].stats.p10.winRatio.value + "%");
        $('.p2-d-kpg').html(players[1].stats.p10.kpg.value);
        $('.p2-sq-kd').html(players[1].stats.p9.kd.value);
        $('.p2-sq-win').html(players[1].stats.p9.winRatio.value + "%");
        $('.p2-sq-kpg').html(players[1].stats.p9.kpg.value);

        tallyScore();
        $('.compare-results').show();
        $('.compare-results').css('display', 'block');
        $('.compLoad').css('visibility', 'hidden');
        setTimeout(function(){compareBtn.prop('disabled', false)},2000);
        
    }

    function tallyScore() {
        var p1Score = 0;
        var p2Score = 0;
        console.log(players[0]);

        //SOLO COUNT
        if (players[0].stats.p2.kd.valueDec > players[1].stats.p2.kd.valueDec) {
            p1Score += 0.75;
            $(".p1-sc-kd").css("border-color", "green");
            $(".p2-sc-kd").css("border-color", "red");
        } else if (players[0].stats.p2.kd.valueDec < players[1].stats.p2.kd.valueDec) {
            p2Score += 0.75;
            $(".p2-sc-kd").css("border-color", "green");
            $(".p1-sc-kd").css("border-color", "red");
        } else {
            $(".p1-sc-kd, .p2-sc-kd").css("border-color", "yellow");
        }

        if (players[0].stats.p2.winRatio.valueDec > players[1].stats.p2.winRatio.valueDec) {
            p1Score += 0.75;
            $(".p1-sc-win").css("border-color", "green");
            $(".p2-sc-win").css("border-color", "red");
        } else if (players[0].stats.p2.winRatio.valueDec < players[1].stats.p2.winRatio.valueDec) {
            p2Score += 0.75;
            $(".p2-sc-win").css("border-color", "green");
            $(".p1-sc-win").css("border-color", "red");
        } else {
            $(".p1-sc-win, .p2-sc-win").css("border-color", "yellow");
        }

        if (players[0].stats.p2.kpg.valueDec > players[1].stats.p2.kpg.valueDec) {
            p1Score += 0.75;
            $(".p1-sc-kpg").css("border-color", "green");
            $(".p2-sc-kpg").css("border-color", "red");
        } else if (players[0].stats.p2.kpg.valueDec < players[1].stats.p2.kpg.valueDec) {
            p2Score += 0.75;
            $(".p2-sc-kpg").css("border-color", "green");
            $(".p1-sc-kpg").css("border-color", "red");
        } else {
            $(".p1-sc-kpg, .p2-sc-kpg").css("border-color", "yellow");
        }

        //DUO COUNT
        if (players[0].stats.p10.kd.valueDec > players[1].stats.p10.kd.valueDec) {
            p1Score += 0.5;
            $(".p1-dc-kd").css("border-color", "green");
            $(".p2-dc-kd").css("border-color", "red");
        } else if (players[0].stats.p10.kd.valueDec < players[1].stats.p10.kd.valueDec) {
            p2Score += 0.5;
            $(".p2-dc-kd").css("border-color", "green");
            $(".p1-dc-kd").css("border-color", "red");
        } else {
            $(".p1-dc-kd, .p2-dc-kd").css("border-color", "yellow");
        }

        if (players[0].stats.p10.winRatio.valueDec > players[1].stats.p10.winRatio.valueDec) {
            p1Score += 0.5;
            $(".p1-dc-win").css("border-color", "green");
            $(".p2-dc-win").css("border-color", "red");
        } else if (players[0].stats.p10.winRatio.valueDec < players[1].stats.p10.winRatio.valueDec) {
            p2Score += 0.5;
            $(".p2-dc-win").css("border-color", "green");
            $(".p1-dc-win").css("border-color", "red");
        } else {
            $(".p1-dc-win, .p2-dc-win").css("border-color", "yellow");
        }

        if (players[0].stats.p10.kpg.valueDec > players[1].stats.p10.kpg.valueDec) {
            p1Score += 0.5;
            $(".p1-dc-kpg").css("border-color", "green");
            $(".p2-dc-kpg").css("border-color", "red");
        } else if (players[0].stats.p10.kpg.valueDec < players[1].stats.p10.kpg.valueDec) {
            p2Score += 0.5;
            $(".p2-dc-kpg").css("border-color", "green");
            $(".p1-dc-kpg").css("border-color", "red");
        } else {
            $(".p1-dc-kpg, .p2-dc-kpg").css("border-color", "yellow");
        }

        //SQUAD COUNT
        if (players[0].stats.p9.kd.valueDec > players[1].stats.p9.kd.valueDec) {
            p1Score += 0.35;
            $(".p1-sqc-kd").css("border-color", "green");
            $(".p2-sqc-kd").css("border-color", "red");
        } else if (players[0].stats.p9.kd.valueDec < players[1].stats.p9.kd.valueDec) {
            p2Score += 0.35;
            $(".p2-sqc-kd").css("border-color", "green");
            $(".p1-sqc-kd").css("border-color", "red");
        } else {
            $(".p1-sqc-kd, .p2-sqc-kd").css("border-color", "yellow");
        }

        if (players[0].stats.p9.winRatio.valueDec > players[1].stats.p9.winRatio.valueDec) {
            p1Score += 0.35;
            $(".p1-sqc-win").css("border-color", "green");
            $(".p2-sqc-win").css("border-color", "red");
        } else if (players[0].stats.p9.winRatio.valueDec < players[1].stats.p9.winRatio.valueDec) {
            p2Score += 0.35;
            $(".p2-sqc-win").css("border-color", "green");
            $(".p1-sqc-win").css("border-color", "red");
        } else {
            $(".p1-sqc-win, .p2-sqc-win").css("border-color", "yellow");
        }

        if (players[0].stats.p9.kpg.valueDec > players[1].stats.p9.kpg.valueDec) {
            p1Score += 0.35;
            $(".p1-sqc-kpg").css("border-color", "green");
            $(".p2-sqc-kpg").css("border-color", "red");
        } else if (players[0].stats.p9.kpg.valueDec < players[1].stats.p9.kpg.valueDec) {
            p2Score += 0.35;
            $(".p2-sqc-kpg").css("border-color", "green");
            $(".p1-sqc-kpg").css("border-color", "red");
        } else {
            $(".p1-sqc-kpg, .p2-sqc-kpg").css("border-color", "yellow");
        }

    }


});