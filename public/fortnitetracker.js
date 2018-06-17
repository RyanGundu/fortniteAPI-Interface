$(function(){

	$('.compare').hide(); //hide the compare panels
	var singleBtn = $('#option1'); //single button
	var compareBtn = $('#option2'); //compare button
	

	var loader = $('.loader'); //loading symbol
	var submitBtn = $('#submit'); //submit button
	var username = $('#username'); //username field
	var platform = '';

	
	var ps4 = $('#ps4');
	var xbox = $('#xbox');
	var pc = $('#pc');

	singleBtn.click(function(){
		singleBtn.prop('disabled', true);
		compareBtn.prop('disabled', false);
		$('.compare').hide();
		$('.single').show();

	});

	compareBtn.click(function(){
		compareBtn.prop('disabled', true);
		singleBtn.prop('disabled', false);
		$('.single').hide();
		$('.compare').show();		
	});
	
	submitBtn.click(function(){

		if (ps4.prop('checked')) {
			platform = 'psn';
		} else if (xbox.prop('checked')) {
			platform = 'xbl';
		} else if (pc.prop('checked')) {
			platform = 'pc';
		} else {
			$('.platforms').effect("shake");
			return console.log('No platform selected');
		}

		if (username.val().length <= 0) {
			return console.log('No name given');
		}

		loader.css('visibility', 'visible');

		var data = {};
		data.username = username.val().toLowerCase();
		data.platform = platform;

		$.ajax({
			type: "POST",
			url: '/',
			datatype: 'json',
			data: data,
			success: function (data) {
				if (data.error) {
					$('.error').click();
					console.log('Sorry player not found');
				} else {
									
					try {
						data = jQuery.parseJSON(data);
						displayStats(data);
						// console.log(data);
					} catch (err) {
						$('.error').click();
						// console.log('player not found');
					}
					
				}
				loader.css('visibility', 'hidden');
			},
			fail: function(error) {
				console.log(error);
				loader.css('visibility', 'hidden'); 
			}
		});
		
	});

	function displayStats(data) {
		$('#soloWin').html(data.stats.p2.top1.value);
		$('#duoWin').html(data.stats.p10.top1.value);
		$('#squadWin').html(data.stats.p9.top1.value);

		$('#soloElim').html(data.stats.p2.kills.value);
		$('#duoElim').html(data.stats.p10.kills.value);
		$('#squadElim').html(data.stats.p9.kills.value);

		$('#soloCount').html(data.stats.p2.matches.value);
		$('#duoCount').html(data.stats.p10.matches.value);
		$('#squadCount').html(data.stats.p9.matches.value);

		$('#soloWR').html(data.stats.p2.winRatio.value + "%");
		$('#duoWR').html(data.stats.p10.winRatio.value + "%");
		$('#squadWR').html(data.stats.p9.winRatio.value + "%");

		$('#solokd').html(data.stats.p2.kd.value);
		$('#duokd').html(data.stats.p10.kd.value);
		$('#squadkd').html(data.stats.p9.kd.value);

		$('#solokpg').html(data.stats.p2.kpg.value);
		$('#duokpg').html(data.stats.p10.kpg.value);
		$('#squadkpg').html(data.stats.p9.kpg.value);
	}



});