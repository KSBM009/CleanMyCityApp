
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
    import { getDatabase, ref, get, update, remove } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyClhhuFS3moOoAsQZvMoasKi1icQ65M_rQ",
      authDomain: "cleanmycityapp.firebaseapp.com",
      projectId: "cleanmycityapp",
      storageBucket: "cleanmycityapp.appspot.com",
      messagingSenderId: "1002744065608",
      appId: "1:1002744065608:web:f1cad15f0c4236a635327d",
      measurementId: "G-W7FZYG79C8",
      databaseURL: "https://cleanmycityapp-default-rtdb.asia-southeast1.firebasedatabase.app"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const eventsRef = ref(db, 'events');

    // Function to fetch and display events
    function fetchEvents(sortBy = 'date') {
      get(eventsRef).then(snapshot => {
        const newEventsRow = document.getElementById("newEventsRow");
        const approvedEventsRow = document.getElementById("approvedEventsRow");
        newEventsRow.innerHTML = ""; // Clear the row before adding new events
        approvedEventsRow.innerHTML = ""; // Clear the row before adding approved events

        const events = [];
        snapshot.forEach(childSnapshot => {
          events.push({ id: childSnapshot.key, data: childSnapshot.val() });
        });

        if (sortBy === 'date') {
          events.sort((a, b) => new Date(a.data.hostDateTime) - new Date(b.data.hostDateTime));
        } else if (sortBy === 'volunteersRequired') {
          events.sort((a, b) => a.data.volunteersRequired - b.data.volunteersRequired);
        }

        const currentTime = new Date();

        events.forEach(event => {
          const eventData = event.data;
          const eventTime = new Date(eventData.hostDateTime);

          if (eventData.adminApproval === "no" && eventTime < currentTime) {
            dismissEvent(event.id, false); // Automatically dismiss past events without confirmation
            return;
          }

          const eventCard = `
            <div class="row mb-3">
              <div class="col">
                <div class="card h-100">
                  <div class="card-body">
                    <h5 class="card-title">${eventData.title}</h5>
                    <p class="card-text">${eventData.description}</p>
                    <ul class="list-unstyled">
                      <li><strong>Category:</strong> ${eventData.category}</li>
                      <li><strong>Date:</strong> ${eventData.hostDateTime}</li>
                      <li><strong>Location:</strong> ${eventData.location}</li>
                      <li><strong>Volunteers Required:</strong> ${eventData.volunteersRequired}</li>
                    </ul>
                    ${eventData.adminApproval === "no" ? `
                    <button class="btn btn-success" onclick="authorizeEvent('${event.id}')">Authorize</button>
                    <button class="btn btn-danger" onclick="dismissEvent('${event.id}', true)">Dismiss Event</button>
                    ` : `
                    <p class="text-success">Event Approved</p>
                    `}
                  </div>
                </div>
              </div>
            </div>
          `;
          if (eventData.adminApproval === "no") {
            newEventsRow.innerHTML += eventCard;
          } else {
            approvedEventsRow.innerHTML += eventCard;
          }
        });
      });
    }

    // Function to authorize event
    window.authorizeEvent = function (eventId) {
      const eventRef = ref(db, `events/${eventId}`);
      update(eventRef, { adminApproval: "yes" })
        .then(() => {
          alert("Event Authorized!");
          fetchEvents(document.getElementById("sortEvents").value);
        })
        .catch(error => console.error("Error:", error));
    }

    // Function to dismiss event
    window.dismissEvent = function (eventId, showAlert = true) {
      const eventRef = ref(db, `events/${eventId}`);
      if (!showAlert || confirm("Are you sure you want to dismiss this event?")) {
        remove(eventRef)
          .then(() => {
            if (showAlert) {
              alert("Event Dismissed!");
            }
            fetchEvents(document.getElementById("sortEvents").value);
          })
          .catch(error => console.error("Error:", error));
      }
    }

    // Fetch events when the page loads
    fetchEvents();

    // Handle sort change
    document.getElementById("sortEvents").addEventListener('change', (event) => {
      fetchEvents(event.target.value);
    });