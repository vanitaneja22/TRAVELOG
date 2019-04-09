var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//index.js is already required, present in node_modules inside express by default
var middleware = require("../middleware");

//index-show all campgrounds
router.get("/", function(req, res){
	//get all the campgrounds from database
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds: allcampgrounds})
		}
	});
});

//create-add new campground to db
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author};
	//create a new campground and save it to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to campgrounds page
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});	
});

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});
//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			//render show template with that campground
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//update campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else{
			req.flash("success", "Campground Updated!")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground Deleted!")
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;