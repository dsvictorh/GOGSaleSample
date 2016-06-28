var siteViewModel = function(){
	var self = this;

	var lowestPrice = 0.99;
	var averagePrice = 7.67;
	var highPrice =  18.31;
	var highestPrice =  49.99;

	self.gamesSold = ko.observable(0);
	self.timeLeft = ko.observable('00:00:00');
	self.payment = ko.observable(0);
	self.paymentInput = ko.observable(0);
	self.customField = ko.observable(null);
	self.slider = ko.observable(null);
	self.unlockCarousel = ko.observable(null);
	self.unlockableItem = ko.observable(null);
	self.checkpoints = [
		{ text: 'Average', price: averagePrice },
		{ text: 'Top 10%', price: highPrice },
	];
	self.unlocks = [
		{ text: 'to unlock video detailing new features and fixes in Developer\'s Cut of Divinity 2.', unlockPoint: 10000, slideImage: 'assets/img/goods/video.jpg' },
		{ text: 'to unlock exclusive, never before seen, trailer from Divinity: Original Sin.', unlockPoint: 25000, slideImage: 'assets/img/goods/video.jpg' },
		{ text: 'to unlock exclusive, never before seen, trailer from Divinity: Original Sin.', unlockPoint: 50000, slideImage: 'assets/img/goods/video.jpg' },
		{ text: 'to unlock exclusive, never before seen, trailer from Divinity: Original Sin.', unlockPoint: 80000, slideImage: 'assets/img/goods/video.jpg' },
		{ text: 'to unlock exclusive, never before seen, trailer from Divinity: Original Sin.', unlockPoint: 120000, slideImage: 'assets/img/goods/video.jpg' }
	];

	self.unlockCarousel();

	function init(){
		var today = new Date();
		var endDate = getDummyDateHoursMissing(); //USE TIME MISSING DUMMIES HERE FOR TESTING

		if(today < endDate){
			if(today.addDays(1) > endDate){
				var timer = instantInterval(function(){
					today = today.addSeconds(1);
					self.timeLeft(getMissingTime(today, endDate));

					if(self.timeLeft() == '00:00:00')
					{
						self.timeLeft(null);
						clearInterval(timer);
					}
				}, 1000);
			}else{
				self.timeLeft(getMissingTime(today, endDate, true) + ' days');
			}
		}

		self.payment(highPrice);
		self.paymentInput(highPrice);
		self.gamesSold(getDummyGamesSoldTenThousand());  //USE GAMES SOLD DUMMIES HERE FOR TESTING

		self.slider(slider({
			element: '.slider',
			min: lowestPrice,
			max: highestPrice,
			step: 0.01,
			startingValue: highPrice,
			onSlide: function(e, ui){
				self.payment(ui.value.toFixed(2));
			}
		}));

		self.unlockableItem(self.unlocks[0]);
		$(document).ready(function(){
			self.unlockCarousel(unlockCarousel({
		        element: '.carousel-slider',
		        pages: '.unlock-buttons li',
		        afterMove: function(){
		        	self.unlockableItem(self.unlocks[this.currentItem]);
		        }
		    }));
		});
	};

	self.gamesSoldDigits = ko.computed(function(){
		return self.gamesSold().toString().split('');
	});

	self.sliderVal = ko.computed(function(){
		if(self.slider()){
			if(self.payment() > highestPrice){
				self.slider().element.slider('value', highestPrice);
			}else{
				self.slider().element.slider('value', self.payment());
			}

			self.paymentInput(self.payment());
		}
	});

	self.calculatePercentage = function(el, total){
		if(self.gamesSold() > total){
			return percentageCircle($(el).parent(), 1, 1);
		}

		return percentageCircle($(el).parent(), self.gamesSold(), total);
	}

	self.onPaymentChange = function(){
		if(isNaN(self.paymentInput()))
		{
			var number = parseFloat(self.paymentInput());
			self.paymentInput(number || lowestPrice);
		}
		else if(self.paymentInput() < lowestPrice)
		{
			self.paymentInput(lowestPrice);
		}

		self.payment(self.paymentInput());
	};

	self.checkout = function(){
		if(self.payment() < lowestPrice){
			alert('Please select a valid price');
		}

		if(self.timeLeft()){
			//Assuming the user checked out and payn this example just increases the sold value by 1
			self.gamesSold(self.gamesSold() + 1);
		}

		return false;
	}

	self.setActive = function(price){
		switch(price)
		{
			case 'lowest':
				return self.payment() >= lowestPrice;
			case 'average':
				return self.payment() >= averagePrice;
			case 'high':
				return self.payment() >= highPrice;
			case 'highest':
				return self.payment() >= highestPrice;
		}
		
		return false;
	}

	self.getLowestPrice = function(){
		return lowestPrice;
	}

	self.getAveragePrice = function(){
		return averagePrice;
	}

	self.getHighPrice = function(){
		return highPrice;
	}

	self.getHighestPrice = function(){
		return highestPrice;
	}

	self.setImage = function(img, price){
		return 'assets/img/games/' + img + (self.setActive(price) ? '-active' : '') + '.png';
	}

	init();
}

/*Dummy functions to simulate getting a value from a DB. Change between similar functions
 to see the different functionalities working*/

/* TIME MISSING */ 
function getDummyDateHoursMissing()
{
	return new Date().addHours(23).addMinutes(59).addSeconds(59);
}

function getDummyDateDaysMissing()
{
	return new Date().addDays(9);
}

function getDummyDateSecondsMissing()
{
	return new Date().addSeconds(5);
}

function getDummyDateDone()
{
	return new Date().addDays(-1);
}

/* GAMES SOLD */
function getDummyGamesSoldFiveThousand(){
	return 5000;
}

function getDummyGamesSoldTenThousand(){
	return 10000;
}

function getDummyGamesSoldTwentyFiveThousand(){
	return 25000;
}


function getDummyGamesSoldFiftyThousand(){
	return 50000;
}


function getDummyGamesSoldHundredThousand(){
	return 100000;
}


function getDummyGamesSoldMillion(){
	return 1000000;
}