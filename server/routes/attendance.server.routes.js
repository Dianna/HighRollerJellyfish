var attendance = require('../controllers/attendance.server.controller.js');
var jwt = require('jwt-simple');

module.exports = function(app) {
  app.get('/attendance', function(req, res, next) {
      console.log("Authenticating...");
      var student = req.param('student');
      // We are sending our JWT token in the header of every request.
      // The header looks like this: {Authorization: 'Bearer TOKEN_STRING'}
      // So to access it, we split it on spaces and take the 1st index.
      var token = req.headers.authorization.split(' ')[1];
      if (token) {
        console.log("Token: ", token);
        // We are hardcoding our secret token in for now but in
        // production it should be an env variable.
        var decoded = jwt.decode(token, 'abc');
        console.log(decoded);
        if (student) {
          attendance.listForUser(student, req, res, next);
        } else {
          attendance.listAll(req, res, next);
        }
      } else {
        res.send("No token...\n");
      }
    },
    attendance.listForUser
  );
  app.post('/attendance', function(req, res, next) {
    var token = req.headers.authorization.split(' ')[1];
    var decoded = jwt.decode(token, 'abc');
    //check if user is a teacher
    if(decoded.role === 'teacher'){
      attendance.create(req, res);
    } else {
      res.send("You do not have permission to edit attendance.");
    }
  },
  attendance.create);
};