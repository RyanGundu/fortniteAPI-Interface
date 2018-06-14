$(function(){

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
			console.log(ps4);
			return console.log('No platform selected');
		}

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
			},
			fail: function(error) {
            	console.log(error); 
        	}
		});
		
	});



});