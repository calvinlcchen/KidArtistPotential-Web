/*
===
Fast Style Transfer Simple Demo
===
*/
let nets, nets1;
let inputImg, inputImg1, styleImg, inputImage;
let input_source=0;  // 0: for example, 1: for upload image
let outputImgContainer;
let model_num = 0;
let currentModel = 'YuNong_Paint_01'; 
let currentInitModel = 'YuNong_Paint_01';  
let uploader;
let webcam = false;
let modelReady = false;
let video;
let isLoading = true;
let isSafa = false;

function setup() {
    inputImg = select('#input-img');
    inputImg1 = select('#input-img1');
    styleImg = select('#style-img').elt;

    // Image uploader
    uploader = select('#uploader').elt;
    uploader.addEventListener('change', gotNewInputImg);


    // output img container
    outputImgContainer = createImg('images/loading.gif', 'image');
    outputImgContainer.parent('output-img-container');

    console.log('after load models-3');
    transferImg();
}

// A function to be called when the model has been loaded
function modelLoaded() {
    modelReady = true;
    outputImgContainer.removeClass('reverse-img');
    console.log("input source:"+input_source);
    if (input_source==1) inputImg = select('#input-img1');
    else inputImg = select('#input-img');
    inputImg.elt.style.width = '540px';
    inputImg.elt.style.height = '540px';
    console.log("image source:"+inputImg.elt.src + " ; model_num :" +model_num);
    
    var d = new Date();
    var t1 = d.getTime();
    nets.transfer(inputImg, function (err, result) {
        console.log('result:'+result + 'err:'+err);
        outputImgContainer.elt.src = result.src;
        var d2 = new Date();
        var t2 = d2.getTime();
        console.log("inference time = " + (t2 - t1) + "ms");
    });
    inputImg.elt.style.width = '360px';
    inputImg.elt.style.height = '250px';
}

function transferImg() {
    if (webcam) deactiveWebcam();
    console.log("transferImg");
     
    nets = new ml5.styleTransfer('models/' + currentModel + '/', modelLoaded);
    
}

function modelLoaded1() {
    outputImgContainer.addClass('reverse-img');
  //      modelReady = true;
    nets1.transfer(gotResult);
}

function gotResult(err, img) {
    if (webcam) {
        var d = new Date();
        var t1 = d.getTime();
        console.log(" in gotResult");
        outputImgContainer.elt.src = img.src;
        nets1.transfer(gotResult);
        var d2 = new Date();
        var t2 = d2.getTime();
        console.log("webcam inference time = " + (t2 - t1) + "ms");
    }
}

    // webcam transfer process
function transferVideo() {
        nets1 = new ml5.styleTransfer('models/' + currentModel + '/', video, modelLoaded1);
}

function draw() {
}


function updateStyleImg(ele) {
  if (ele.src) {
    styleImg.src = ele.src;
    currentInitModel = ele.id;
    if (model_num>0) currentModel = currentInitModel+'-'+String(model_num);
    else currentModel=currentInitModel;
  }
    if (currentModel) {
        if (webcam) {
            transferVideo();
        } else {
            transferImg();
        }
    }
}

function updateInputImg(ele) {
  if (webcam) deactiveWebcam();
  if (ele.src) {
    inputImg.elt.src = ele.src;
  }
  if (currentModel) {
    input_source=0;
    transferImg();
  }
}

function uploadImg() {
    uploader.click();
    if (webcam) deactiveWebcam();
}

function gotNewInputImg() {
  if (uploader.files && uploader.files[0]) {
     var newImgUrl = window.URL.createObjectURL(uploader.files[0]);
     inputImg1.elt.src = newImgUrl;
     input_source=1;
     setTimeout(() => {
       if (currentModel) transferImg();
     }, 1e3);
     console.log("inputImg1 size:"+inputImg1.elt.width+"x"+inputImg1.elt.height);
  }
}

function useWebcam() {
  if (!video) {
    // webcam video
    video = createCapture(VIDEO);
    video.size(360, 250);
    video.parent('input-source2');
  }
  webcam = true;
    select('#input-img2').hide();
    transferVideo();
  //outputImgContainer.addClass('reverse-img');
}

function deactiveWebcam() {
  outputImgContainer.removeClass('reverse-img');
 
  if (webcam) {
    video.hide();
    video = '';
    }
    webcam = false;
}
    
function onPredictClick() {
  currentModel=currentInitModel;
  model_num=0;
  outputImgContainer.parent('output-img-container');
    if (webcam) {
        console.log('onpredictclick: video');
        transferVideo();
    } else {
        console.log('onpredictclick: img');
        transferImg();
        //console.log('onpredictclick: img');
    }
}

function onPredictClick1() {
  currentModel = currentInitModel + "-1";
  model_num=1;
  outputImgContainer.parent('output-img-container1');
  if (webcam) {
      console.log('onpredictclick1: video');
      transferVideo();
  } else {
      console.log('onpredictclick1: img');
      transferImg();
      //console.log('onpredictclick: img');
  }
}

function onPredictClick2() {
  currentModel = currentInitModel + "-2";
  model_num=2;
  outputImgContainer.parent('output-img-container2');
  if (webcam) {
      console.log('onpredictclick2: video');
      transferVideo();
  } else {
      console.log('onpredictclick2: img');
      transferImg();
      //console.log('onpredictclick: img');
  }
}

function saveimgas() {
  var download_link=document.createElement('a');  //create a download element<a> to download image
  download_link.href=outputImgContainer.elt.src;
  console.log(download_link.href);
  download_link.download='download.png';  //set the download image filename as download.png
  download_link.click();
}


// from: http://stackoverflow.com/a/5303242/945521
if ( XMLHttpRequest.prototype.sendAsBinary === undefined ) {
  XMLHttpRequest.prototype.sendAsBinary = function(string) {
      var bytes = Array.prototype.map.call(string, function(c) {
          return c.charCodeAt(0) & 0xff;
      });
      this.send(new Uint8Array(bytes).buffer);
  };
};

(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_US/all.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function() {
  FB.init({
    appId  : "946833049036743",
    status : true,
    cookie : true,
    xfbml  : true,  // parse XFBML
    version : "v5.0"
  });
};

function postImageToFacebook( authToken, filename, mimeType, imageData, message )
{
        // this is the multipart/form-data boundary we'll use
        var boundary = '----ThisIsTheBoundary1234567890';
        // let's encode our image file, which is contained in the var
        var formData = '--' + boundary + '\r\n'
        formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
        formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
        for (var i = 0; i < imageData.length; ++i) {
          formData += String.fromCharCode(imageData[i] & 0xff);
        }
        formData += '\r\n';
        formData += '--' + boundary + '\r\n';
        formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
        formData += message + '\r\n'
        formData += '--' + boundary + '--\r\n';

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true);
        xhr.onload = xhr.onerror = function () {
          console.log(xhr.responseText);
        };
        xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
        if(!xhr.sendAsBinary){
          xhr.sendAsBinary = function(datastr) {
            function byteValue(x) {
              return x.charCodeAt(0) & 0xff;
            }
            var ords = Array.prototype.map.call(datastr, byteValue);
            var ui8a = new Uint8Array(ords);
            this.send(ui8a.buffer);
          }
        }
        xhr.sendAsBinary(formData);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            alert('Your image has been successfully shared');
            console.log("completely sharing");
          }
        }

    //var xhr = new XMLHttpRequest();
    //xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true );
    //xhr.onload = xhr.onerror = function() {
    //    console.log( xhr.responseText );
    //};
    //xhr.send(imageData);
    //console.log("after send blob");
};



//===================new way ===============
function postCanvasToFacebook() {
  var decodedPng = outputImgContainer.elt.src;
  console.log("blob == : " +decodedPng);
	FB.getLoginStatus(function(response) {
	  if (response.status === "connected") {
      console.log("connected");
		postImageToFacebook(response.authResponse.accessToken, "result", "image/png", decodedPng, "KidArtistPotential-Web");
	  } else if (response.status === "not_authorized") {
      console.log("fail to authoritied");
		 FB.login(function(response) {
			postImageToFacebook(response.authResponse.accessToken, "result", "image/png", decodedPng, "KidArtistPotential-Web");
		 }, {scope: "user_posts"});
	  } else {

		 FB.login(function(response)  {
			postImageToFacebook(response.authResponse.accessToken, "result", "image/png", decodedPng, "KidArtistPotential-Web");
		 }, {scope: "user_posts"});
	  }
   });
  };