const express = require('express');
const router = express.Router();
const Scraper = require('images-scraper');
const google = new Scraper.Google();
const Jimp = require("jimp");
const wget = require('node-wget');
const path = require('path');
const url = require('url');
const save_images = require('../js/connection.js'); // for saving data


const DEST = __dirname + '/../../data_images/';

var images_url_arr = [];
var save_status = 0;

function imageEditing(file_url) {

    Jimp.read(file_url).then(function(image) {
        image.resize(256, 256) // resize 
            .quality(60) // set JPEG quality 
            .greyscale() // set greyscale 
    }).catch(function(err) {
        console.error(err);
    });
}



var download_file_wget = function(file_url, index, keyword, res, len) {
    var file_name = url.parse(file_url).pathname.split('/').pop();
    console.log(file_name);
    wget({
            url: file_url,
            dest: DEST, // destination path or path with filenname, default is ./ 
        },
        function(error, response, body) {
            if (error) {
                console.log('--- error:');
                console.log(error); // error encountered 
            } else {

                images_url_arr.push(file_name);
                console.log(images_url_arr);
                //imageEditing(DEST+file_name);

                if (store_data(keyword, images_url_arr, len))
                    res.send({ "message": "Images Saved...", "success": true });
            }
        }
    );
};

var store_data = function(kw, images_arr, len) {

    if (images_arr.length === len && save_status < 1) {

        var data = new save_images({
            "keyword": kw.trim(),
            "image_url": images_arr,
            "new_url": "-"
        });
        data.save().then(function() {
            console.log("Saved keyword : " + kw.trim());
        });

        save_status++;

        return true;
    }
}


router.post('/saveImages', function(req, res) {
    console.log('Saving...');
    if (!req.body) {
        return res.sendStatus(400);
    } else {
        var is_keyword_present = false;
        save_images.count({ "keyword": req.body.keyword }, function(err, count) {
            if (count > 0) {
                is_keyword_present = true;
            }
            if (is_keyword_present) {
                return res.send({ "success": false, "message": "Keyword already Exist.." });
            }

            google.list({
                    keyword: req.body.keyword,
                    num: 15,
                    detail: true,
                    nightmare: {
                        show: false
                    }
                })
                .then(function(result) {

                    result.forEach(function(value, index) {
                        //imageEditing(value.url, index, req.body.keyword);

                        if (save_status < 1)
                            download_file_wget(value.url, index, req.body.keyword, res, result.length);
                    });

                }).catch(function(err) {
                    console.log('err', err);
                    res.send(err);
                });
        });
    }
});

router.get('/getKeywords', function(req, res) {

    var data = save_images.find({}, function(err, data) {
        save_images.count({}, function(err, count) {
            res.send({ "success": true, "message": "Data recieved", "data": data, "count": count });
        });

    });

});
router.post('/getImages', function(req, res) {
    var data = save_images.find({ "keyword": req.body.keyword }, function(err, data) {
        res.send({ "success": true, "message": "Images recieved", "data": data });
    });
});
router.post('/deleteKeyword', function(req, res) {
    save_images.findOneAndRemove({ "_id": req.body.id }).then(function() {
            save_images.findOne({ "_id": req.body.id }).then(function(result) {
                    if (result === null) {
                        var data = save_images.find({}, function(err, data) {
                            save_images.count({}, function(err, count) {
                                res.send({ "success": true, "message": "Keyword deleted..", "data": data, "count": count });
                            });

                        });
                    } else {

                        var data = save_images.find({}, function(err, data) {
                            save_images.count({}, function(err, count) {
                                res.send({ "success": false, "message": "Keyword couln't be deleted..", "data": data, "count": count });
                            });
                        });
                    }
            });
        });
});


module.exports = router;