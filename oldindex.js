$(document).ready(function(){
	
	var total = [0,0,0,0,0];

	$('.introBtn').click(function(){
		$('.counter').children('p').text('Step 1 of 5');
		$('.counter').children('.circle').first().css('background-color', '#334350');
		$(this).hide(function(){
			$('.question').first().show('slide');
		})
	})

	$('.next').click(function(){
		var parent = $(this).parent();
		var idx = $(parent).index()-2
		console.log($(this).siblings())
		
		if($(this).siblings().hasClass('rdio')){
			total[idx] = Number($(this).siblings('.choices').children('input:checked').val())
		}
		else if($(this).siblings('.choices').children('input[type="checkbox"]')){
			total[idx] = Number($(this).siblings('.choices').children('input:checkbox:checked').length)
		}

		

		$('.counter').children('.circle').eq(idx+1).css('background-color', '#334350');
		$('.counter').children('p').text('Step '+ Number(idx+2) + ' of 5');
		$(parent).hide(function(){
			$('.question').eq(idx).next().show();
		})
	})


	$('.finish').click(function(){
		var parent = $(this).parent();
		total[4] = Number($(this).siblings('.choices').children('input:radio:checked').val())
		var rawNum= total[0]-(total[1]/2) + ((total[2]+total[3]+total[4])/3);

		var finNum = Math.ceil(rawNum/2);

		$(parent).hide(function(){
			$('.load').show();
		})

		// This queries my sheet to find which of the listed stages you are at
		blockspring.runParsed("query-google-spreadsheet", { 
        	// from Google Query language https://developers.google.com/chart/interactive/docs/querylanguage
        	"query": "SELECT A, B WHERE B ="+finNum,
        	//URL for the Google Sheet with the table
        	"url": "YOURURLHERE" 
    	}, { cache: false, expiry: 7200}, function(res) {
    		// all results found in res.params.data
	  		var name=res.params.data[0]['name'];
	  		var num=res.params.data[0]['stage'];

	  		blockspring.runParsed("query-google-spreadsheet", { 
        	"query": "SELECT A, C WHERE B ="+num,
        	"url": "YOURURLHERE" 
	    	}, { cache: false, expiry: 7200}, function(res) {
		  		var skill=res.params.data[0]['skill'];
		  		var key=res.params.data[0]['key'];
		  		console.log(skill)
		  		console.log(key)
		  		$('.load').hide();
		  		$('.final').children('img').attr('src', 'img/'+key+'.png')
		  		$('.final').show(function(){
		  			$('.final').children('.headline').text(name)
		  			$('.final').children('p').text(skill)
		  		})
			});
		});
	})

	$('form').submit(function(e){
		e.preventDefault();
		var allData =[];
		var oneData = [];

		//Filtering the form to keep only values, not corresponding labels
		//Values must be pushed into spreadsheet in order, much like SQL insert into http://www.w3schools.com/sql/sql_insert.asp
		var formVals= $('form :input').filter(function(index, element) {
	        if(index < $('form :input').length-1){
	        	oneData.push($(element).val());
	    	}
	    });
	    allData.push(oneData)

	    //This is taken from the Blockspring site- it is the way that spreadsheets expose their data
	    //Would need a JSON.parse to prepare it
	    //So we need an array of the rows
	    //eachy array is full row
	    //[[row1val1, row1val2],[row2val1, row2val2]...]
	    var orig = "[[\"name\",\"random number\"],[\"Jason\",\"150\"],[\"Don\",\"250\"],[\"Paul\",\"50\"]]"

		blockspring.runParsed("append-to-google-spreadsheet", {
			//middle parameter from Google Spreadhseet URL 
			"file_id": 'YOURIDHERE', 
			// The first sheet in this particular doc will always be 0
			"worksheet_id": 0,
			//The array of arrays, as stated above 
			"values": allData},
			//Provided on the page at https://open.blockspring.com/pkpp1233/append-to-google-spreadsheet
			{ "api_key": "YOURAPIKEYHERE" }, 
			function(res){
				console.log(res);
		});
	})

	//If I did Instagram, tables would be:
	//Users
	//Photos
	//Likes
	//Comments
	//Photos, likes need to be have key for the user
	//Comments need to be linked to photos
})