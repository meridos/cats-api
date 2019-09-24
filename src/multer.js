const path = require('path')
var multer = require('multer')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/photos')
  },
  filename: (req, file, cb) => {
    var filetype = ''

    if (file.mimetype === 'image/png') {
      filetype = 'png'
      cb(null, 'image-' + Date.now() + '.' + filetype)
    }
    else if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg'
      cb(null, 'image-' + Date.now() + '.' + filetype)
    }
    else {
      cb("Error: File upload only supports jpeg/png filetypes");
    }
  },
})
var upload = multer({
  storage: storage,
    limits: {
    fileSize: 5 * 1024 * 1024,
  }
})

module.exports = {
  upload,
}