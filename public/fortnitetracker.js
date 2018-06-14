$(function(){

	var loader = $('.loader');
	var submitBtn = $('#submit');
	var username = $('#username');
	var platform = '';

	
	var ps4 = $('#ps4');
	var xbox = $('#xbox');
	var pc = $('#pc');

	
	submitBtn.click(function(){

		if (ps4.prop('checked')) {
			platform = 'psn';
		} else if (xbox.prop('checked')) {
			platform = 'xbl';
		} else if (pc.prop('checked')) {
			platform = 'pc';
		} else {
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
				data = JSON.parse(data);
				console.log(data);
				displayStats(data);
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
	}



});