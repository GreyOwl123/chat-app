passport.use(
    new LocalStrategy( async(username, password, done) => {
     try {
       const user = await User.findOne({ username: username });
       if (!user) {
         return done(null, false, { message: "Incorrect username" });
       };
       bcryptjs.compare(password, user.password, (err, res) => {
        if (res) {
         user.password === password
       return done(null, user);
       }
        else {
         user.password !== password
       return done(null, false, { message: "Incorrect password" })
     } 
        })
     } catch(err) {
     return done(err);
    };
    })
   );
  

 passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
     } catch(err) {
       done(err, user);
     };
   });