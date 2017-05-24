



var provider = new firebase.auth.GoogleAuthProvider();

var user;

var selectedFile;


$( document ).ready(function() {
	$("#welcome").hide();
	$("#uploadDiv").hide();
	queryDatabase();
	
});


function signIn() {
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  
	  
	 
	  showWelcomeContainer();
	
	}).catch(function(error) {
	  
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  var email = error.email;
	  var credential = error.credential;
	
	});

};


function showWelcomeContainer() {
	
	
	$("#welcomeText").html("Hello, you have already signed in" );
	$("#login").hide();
	$("#uploadDiv").show();
};


$("#file").on("change",function(event){
	selectedFile = event.target.files[0];
	$("#uploadButton").show();	
});


function uploadFile() {
	var filename = selectedFile.name;
	var storageRef = firebase.storage().ref('/commentImages/' + filename);
	var uploadTask = storageRef.put(selectedFile);
	
	uploadTask.on('state_changed', function(snapshot){
  
 
  
}, function(error) {

}, function() {
  
  var postKey = firebase.database().ref('Posts/').push().key;
  var downloadURL = uploadTask.snapshot.downloadURL;
  var updates = {};
  var postData = {
  	url: downloadURL,
  	caption : $("#imageCaption").val(),

  }
  updates['/Posts/' +postKey] = postData;
  firebase.database().ref().update(updates);
  console.log(downloadURL);
       $("#uploadtext").html("upload success ");
  	$(".upload-group").hide();
  	window.location ="index.html"
  
  
});
	

}






function queryDatabase(){

firebase.database().ref('/Posts/').once('value').then(function(snapshot) {
    var PostObject = snapshot.val();
    
    var keys = Object.keys(PostObject);
    var currentRow;
    for (var i = 0; i< keys.length; i++){
        var currentObject = PostObject[keys[i]];
	 currentRow = document.createElement("div");
        // $(currentRow).addClass("row");
         $("#contentshower").append(currentRow);
       
        
        var column = document.createElement("div");
    
        var image = document.createElement("img");
        image.src = currentObject.url;
        //$(image).addClass("contentImage");
        var p = document.createElement("p");
        $(p).html(currentObject.caption);
        //$(p).addClass("contentCaption");
        
        $(column).append("<p><h4>comment:</h4></p>");
        $(column).append(p);
        $(column).append(image);
        $(currentRow).append(column);
        
    }
    
    
    
});



}

/*Here are the code reference:
https://www.youtube.com/watch?v=6Q55NlRwNnw
https://www.youtube.com/watch?v=4ZCy1AK7x4I */
