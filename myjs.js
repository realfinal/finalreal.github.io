var provider = new firebase.auth.GoogleAuthProvider();

var user;

var selectedFile;


$( document ).ready(function() {
	$("#welcome").hide();
	$("#uploadDiv").hide();
	
	firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var token = firebase.auth().currentUser.uid;
    queryDatabase(token);
    
  } else {
    // User is signed out.
    // ...
    //window.location ="index.html"
  }
});



});


function signIn() {
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  user = result.user;
	  console.log(user.displayName);
	  
	  showWelcomeContainer();
	  // ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});

};


function showWelcomeContainer() {
	
	
	$("#welcomeText").html("Hello, you have already signed in" );
//	$("#welcomeText").html("Hello, " + user.displayName);	
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
  // Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
 
  
}, function(error) {
  // Handle unsuccessful uploads
}, function() {
  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  var postKey = firebase.database().ref('Posts/').push().key;
  var downloadURL = uploadTask.snapshot.downloadURL;
  var updates = {};
  var postData = {
  	url: downloadURL,
  	caption : $("#imageCaption").val(),
  //	user: user.uid
  }
  updates['/Posts/' +postKey] = postData;
  firebase.database().ref().update(updates);
  console.log(downloadURL);
  
    // $(".upload-group")[0].before("Success!");
     $("#uploadtext").html("upload success ");
  	$(".upload-group").hide();
  	window.location ="index.html"
  
  
});
	

}






function queryDatabase(token){

firebase.database().ref('/Posts/').once('value').then(function(snapshot) {
    var PostObject = snapshot.val();
    console.log(PostObject);
    var keys = Object.keys(PostObject);
    var currentRow;
    for (var i = 0; i< keys.length; i++){
        var currentObject = PostObject[keys[i]];
        
        if(i % 3 == 0){
            currentRow = document.createElement("div");
            $(currentRow).addClass("row");
            $("#contentHolder").append(currentRow);
        } 
        //create new row on every third entry
        // col-lg-4
        var col = document.createElement("div");
       // $(col).addClass("clo-lg-4");
        var image = document.createElement("img");
        image.src = currentObject.url;
        $(image).addClass("contentImage");
        var p = document.createElement("p");
        $(p).html(currentObject.caption);
        $(p).addClass("contentCaption");
        
        $(col).append("<p><b>comment:</b></p>");
        $(col).append(p);
        $(col).append(image);
        $(currentRow).append(col);
        
    }
    
    
    
});



}