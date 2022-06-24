var Comment = require("../models/comment");
var Blog    = require("../models/blog");

var middlewareObj = {};
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Bunu Yapmak için Giriş Yapmalısın!");
    res.redirect("/login");
};

middlewareObj.checkOwnershipComment = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                req.flash("error", "Comment is not found!");
                res.redirect("back");
            } else{
                if(req.user._id.equals(foundComment.author.id) || req.user.admin){
                    return next();
                } else{
                    res.redirect("back");
                }
            }
        })
    } else{
        req.flash("error", "Bunu Yapmak için Giriş Yapmalısın!");
        res.redirect("back");
    }
};




middlewareObj.checkOwnershipPost = function(req, res, next){
    if(req.isAuthenticated()){
        if(Blog.findById(req.params.id, function(err, foundBlog) {
            if(err){
                req.flash("error", "The blog is not found!");
                res.redirect("/blogs");
            } else{
                if(req.user._id.equals(foundBlog.author.id) || req.user.admin){
                    next();
                } else{
                    res.redirect("back");
                }
            }
        }));
    } else {
        req.flash("error", "Bunu Yapmak için Giriş Yapmalısın!");
        res.redirect("back");
    }
};


module.exports = middlewareObj;



