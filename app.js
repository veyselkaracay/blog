var bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    express             = require("express"),
    app                 = express(),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    Blog                = require("./models/blog"),
    Comment             = require("./models/comment"),
    User                = require("./models/user");

    
//Require Route Root alanım
var authRoutes = require("./routes/auth");
var blogRoutes = require("./routes/blogs");
var commentRoutes = require("./routes/comments");
    


//mongo atlas bağlantım
mongoose.connect(`mongodb+srv://webDeveloper:aE4yC88dzAxNCJxT@sandbox.dm0ir.mongodb.net/blog?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });



mongoose.Promise = global.Promise;
app.set("view engine", "ejs");5
app.use(express.static("public"));
app.use(expressSanitizer()); //this code MUST BE BEFORE bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());


//şifre ayar
app.use(require("express-session")({
    secret: "Bu blog Veysel Karaçay Tarafından Yapılmıştır.",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //without next(), it stops and doesn't move to next middleware/route handler
});



//require routes alanım
app.use(authRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);



app.get("/", function(req, res){
    res.redirect("blogs");
});




 app.listen(3000, function(){
    console.log("SERVER BAŞLADI");
 }); 
