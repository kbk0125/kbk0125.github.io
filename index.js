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

		blockspring.runParsed("universalpostgetk", { 
	    	'type': 'GET',
	    	"query": "SELECT A, B WHERE B ="+finNum,
	    	'name': 'getTitles'}, 
    		function(res){
	  		
	  		var name=res.params.data[0]['name'];
	  		var num=res.params.data[0]['stage'];

	  		blockspring.runParsed("universalpostgetk", { 
		    	'type': 'GET',
		    	"query": "SELECT A, C WHERE B ="+num,
		    	'name': 'getDetails'}, 
	    	function(res){

	    		var skill=res.params.data[0]['skill'];
		  		var key=res.params.data[0]['key'];

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
		var formVals= $('form :input').filter(function(index, element) {
	        if(index < $('form :input').length-1){
	        	oneData.push($(element).val());
	    	}
	    });
	    allData.push(oneData)
	    var orig = "[[\"name\",\"random number\"],[\"Jason\",\"150\"],[\"Don\",\"250\"],[\"Paul\",\"50\"]]"

	    blockspring.runParsed("universalpostgetk", { 
	    	'type': 'POST',
	    	'name': 'postEntry',
	    	"values": allData}, 
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
