$(function(){

    var singleBtn = $('#option1'); //main single button

    var compareBtn = $('.compare-btn');

    var player1Data = {};
    var player2Data = {};

    var p1 = {};
    var p2 = {};
    p1.console = false;
    p2.console = false;

    var players = [];

	compareBtn.click(function(){
        if (getData()) {
            $('.compare-results, footer').hide();
            players = [];
            singleBtn.prop('disabled', true);
            compareBtn.prop('disabled', true);
            $('.compLoad').css('visibility', 'visible');

            requestData(player1Data, p1, '/');
            setTimeout(function(){ //wait 2 seconds before the next request
                requestData(player2Data, p2, '/2');
                setTimeout(function() {
                    try {
                        if(!comparePlayers()) { //if second player hasent been loaded yet
                            setTimeout(comparePlayers,1000); //wait 1 second and call again
                        } else {
                            $('.compLoad').css('visibility', 'hidden');
                            singleBtn.prop('disabled', false);
                            compareBtn.prop('disabled', false);
                        }
                    } catch (err) {
                        singleBtn.prop('disabled', false);
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
        if (platform1 == 'psn' || platform1 == 'xbl') {
            p1.username = platform1 + '(' + player1Data.username + ')';
            p1.platform = platform1;
            p1.console = true;
		}
        player1Data.platform = platform1;

        player2Data.username = username2.val().toLowerCase();
        if (platform2 == 'psn' || platform2 == 'xbl') {
            p2.username = platform2 + '(' + player2Data.username + ')';
            p2.platform = platform2;
            p2.console = true;
		}
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


    function requestData(data, backUp, url) {
        $.ajax({
			type: "POST",
			url: url,
			datatype: 'json',
            data: data,
			success: function (data) {
				if (data.indexOf('"error": "Player Not Found"') != -1) {
                    if (backUp.console) {
                        backUp.console = false;
                        setTimeout(function(){secondaryRequest(backUp, url)},2000);
                    } else {
                        $('.compLoad').css('visibility', 'hidden'); 
                        $('.error').click();
                        singleBtn.prop('disabled', false);
                        compareBtn.prop('disabled', false);
                    }
				} else {
									
					try {
                        data = jQuery.parseJSON(data);
                        players.push(data);
						//console.log(data);
					} catch (err) {
                        compareBtn.prop('disabled', false);
                        singleBtn.prop('disabled', false);
                        $('.compLoad').css('visibility', 'hidden'); 
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

    //used incase API fails on valid user
    function secondaryRequest(data, url) {
        $.ajax({
			type: "POST",
			url: url,
			datatype: 'json',
            data: data,
			success: function (data) {
				if (data.indexOf('"error": "Player Not Found"') != -1) {
                    $('.compLoad').css('visibility', 'hidden');
					$('.error').click();
					//console.log('Sorry player not found');
				} else {
									
					try {
                        data = jQuery.parseJSON(data);
                        players.push(data);
						//console.log(data);
					} catch (err) {
                        compareBtn.prop('disabled', false);
                        singleBtn.prop('disabled', false);
                        $('.compLoad').css('visibility', 'hidden');
						$('.error').click();
						// console.log('player not found');
					}
					
                }

			},
			fail: function(error) {
				console.log(error);
                $('.compLoad').css('visibility', 'hidden'); 
                $('.error').click();
			}
		});
    }

    function comparePlayers () {

        if (players.length != 2) {
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
        singleBtn.prop('disabled', false);
        $('footer').show();
        setTimeout(function(){compareBtn.prop('disabled', false)},2000);
        return true;
        
    }

    function tallyScore() {
        var p1Score = 0;
        var p2Score = 0;

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

        //score board
        $(".p1-score-name").html("SCORE: " + players[0].epicUserHandle);
        $(".p1-score").html(p1Score.toFixed(2));
        $(".p2-score-name").html("SCORE: " + players[1].epicUserHandle);
        $(".p2-score").html(p2Score.toFixed(2));

        if (p1Score > p2Score) {
            $(".winName").html("Winner: " + players[0].epicUserHandle);
            $(".p1-score-card").css("border-color", "green");
            $(".p2-score-card").css("border-color", "red");
        } else if (p1Score < p2Score) {
            $(".winName").html("Winner: " + players[1].epicUserHandle);
            $(".p2-score-card").css("border-color", "green");
            $(".p1-score-card").css("border-color", "red");
        } else {
            $(".winName").html("TIE");
            $(".p1-score-card, .p2-score-card").css("border-color", "yellow");
        }

    }


});