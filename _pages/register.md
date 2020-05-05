---
title: "Ashwa Cup 1.0"
excerpt: "Register for Cup"
permalink: /register.html

---


## Here is the Registration Form.
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>

  <div class="container">
          <p>
            <label>Team Name</label>
            <input type="text" name="team_name" id="team_name" required>
          </p>
          <p>
            <label>Leader Name</label>
            <input type="text" name="leader_name" id="leader_name" required>
          </p>
          <p>
            <label>Leader IGN (In-Game-Name)</label>
            <input type="text" name="leader_ign" id="leader_ign" required>
          </p>
          <p>
            <label>Leader Discord Tag (eg: AshwAメKali#2002 )</label>
            <input type="text" name="leader_dtag" id="leader_dtag" required>
          </p>
          <p>
            <label>Leader Email address</label>
            <input type="text" name="leader_email" id="leader_email" required>
          </p>
          <p>
            <label>Leader WhatsApp Number</label>
            <input type="text" name="leader_phone" id="leader_phone" required>
          </p>
          <p>
            <label>Player 2 IGN</label>
            <input type="text" name="p2_ign" id="p2_ign" required>
          </p>
          <p>
            <label>Player 3 IGN</label>
            <input type="text" name="p3_ign" id="p3_ign" required>
          </p>
          <p>
            <label>Player 4 IGN</label>
            <input type="text" name="p4_ign" id="p4_ign" required>
          </p>
          <p>
            <label>Player 5 IGN (Optional) </label>
            <input type="text" name="p5_ign" id="p5_ign">
          </p>
          <p>
            <label>Player 6 IGN (Optional)</label>
            <input type="text" name="p6_ign" id="p6_ign">
          </p>
          <p class="full">
            <button type="submit" id="button" onclick="paymentprocess()">Proceed to Pay</button>
          </p>
        <h6>Entry Fees INR 97.64 + 2.36 (Gateway Charges) total INR 100 to be charged.</h6>
        <p>Payments are secured via Razorpay</p>
        
  </div>



<script src="https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.14.2/firebase-analytics.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.14.2/firebase-database.js"></script>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>


<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBlkapvTc5K85a0CCMX054oHdviowHb3GM",
    authDomain: "ashwa-cup.firebaseapp.com",
    databaseURL: "https://ashwa-cup.firebaseio.com",
    projectId: "ashwa-cup",
    storageBucket: "ashwa-cup.appspot.com",
    messagingSenderId: "181871716226",
    appId: "1:181871716226:web:ce671917fe72aff6e7519b",
    measurementId: "G-7H8K0KCH34"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  var database = firebase.database();
</script>

<script>

function paymentprocess(){
var options = {
    "key": "rzp_live_VMH3swrMj6hdJW", // Enter the Key ID generated from the Dashboard
    "amount": "10000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "AGN Esports",
    "description": "Ashwa Cup 1.0 Entry Fee",
    "image": "/assets/images/ashwa.jpeg",
    "handler": function (response){
    savetoDB(response);
    jQuery.noConflict();
    $('#myModal').modal('show');
    },
    "theme": {
        "color": "#ffd971"
    }
}
var rzp1 = new Razorpay(options);
document.getElementById('button').onclick = function(e){
    rzp1.open();
    e.preventDefault();
}


function savetoDB(response){
console.log(response)
var uniqueID = document.getElementById('leader_phone').value;
 var payRef = firebase.database().ref(uniqueID);
 payRef.child('Details').set({
   team_name : document.getElementById('team_name').value,
   leader_name : document.getElementById('leader_name').value,
   leader_ign : document.getElementById('leader_ign').value,
   leader_dtag : document.getElementById('leader_dtag').value,
   leader_email : document.getElementById('leader_email').value,
   leader_whatsapp : document.getElementById('leader_phone').value,
   player2_ign : document.getElementById('p2_ign').value,
   player3_ign : document.getElementById('p3_ign').value,
   player4_ign : document.getElementById('p4_ign').value,
   player5_ign : document.getElementById('p5_ign').value,
   player6_ign : document.getElementById('p6_ign').value,
   payment_id : response.razorpay_payment_id
 })
}
}
</script>

  <!-- Modal HTML -->
  <div id="myModal" class="modal fade">
    <div class="modal-dialog modal-confirm">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" align="center">Awesome!</h4>
        </div>
        <div class="modal-body">
          <p class="text-center">Your Registration has been confirmed. Check your email for detials.</p>
          <p class="text-center">Didn't Receive Mail no issue. Join our <a href="https://bit.ly/2VFEchg">Discord Server</a> for more informations.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success btn-block" data-dismiss="modal" align="center">OK</button>
        </div>
      </div>
    </div>
  </div>
