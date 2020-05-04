---
title: "Register"
excerpt: "Register for Cup"
permalink: /register.html

---


## Here is the Registration Form.


  <div class="container">
          <!-- <p>
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
            <label>Player 5 IGN</label>
            <input type="text" name="p5_ign" id="p5_ign">
          </p>
          <p>
            <label>Player 6 IGN</label>
            <input type="text" name="p6_ign" id="p6_ign">
          </p> -->
          <p class="full">
            <button type="submit" id="button" onclick="paymentprocess()">Proceed to Pay</button>
          </p>
        <h4>Entry Fees INR 100 to be charged</h4>
        
  </div>
<script src="https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/7.14.2/firebase-analytics.js"></script>

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
</script>

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>

function paymentprocess(){
var options = {
    "key": "rzp_test_kQTkSUau71lJoW	", // Enter the Key ID generated from the Dashboard
    "amount": "10000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "agnesports",
    "description": "Ashwa Cup 1.0 Entry Fee",
    "image": "/assets/images/ashwa.jpeg",
    "handler": function (response){
      savetoDB(response);
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature)
    },
    "prefill": {
        "name": "Ashtam Singh",
        "email": "ashtam.singh@example.com",
        "contact": "9998231231"
    },
    "notes": {
        "address": "AGNEsports Corporate Office"
    },
    "theme": {
        "color": "#F37254"
    }
}
var rzp1 = new Razorpay(options);
document.getElementById('button').onclick = function(e){
    rzp1.open();
    e.preventDefault();
}
}

function savetoDB(response){
console.log(response)
}

</script>