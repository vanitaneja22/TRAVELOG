var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
	 name: "Cloud's Rest",
	 image: "https://pbs.twimg.com/media/DrSZFBPUcAAbsnl.jpg",
	 description: "blah blah"
	},
	{
	 name: "Desert Mesa",
	 image: "https://cdn.vox-cdn.com/thumbor/-JoPdcgAuLTUsWiDZ62CX4wb33k=/0x0:5225x3479/1200x800/filters:focal(2195x1322:3031x2158)/cdn.vox-cdn.com/uploads/chorus_image/image/54137643/camping_tents.0.jpg",
	 description: "blah blah"
	},
	{
	 name: "Canyon Floor",
	 image: "https://ari-cms.com/Content/Site/24929/images/Chips%20Marine.jpg",
	 description: "blah blah"
	}
]

function seedDB(){
	//remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		} 
		console.log("removed campgrounds");
		//add a few campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err, campgrounds){
				if(err){
					console.log(err)
				} else{
					console.log("added a campground");
					//create a comment
					Comment.create(
					{
						text: "This place is great, but i wish there was internet",
						author: "Homer"
					}, function(err, comment){
						if(err){
							console.log(err);
						} else{
							campgrounds.comments.push(comment);
							campgrounds.save();
							console.log("Created new comment")
						}
					});
				}
			});
		});
	});
	

	//add a few commeents
}

module.exports = seedDB;
