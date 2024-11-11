const jwt = require('jsonwebtoken');

exports.setAuthCookie = (res, UserId) => {
    const token = jwt.sign({ userId: UserId }, process.env.JWT_SECRET,  {expiresIn: '2h'});
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 2 * 60 * 60 * 1000
    });
}