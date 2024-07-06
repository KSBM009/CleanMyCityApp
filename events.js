        
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
        import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
        import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
        const auth = getAuth(app);

        const eventsContainer = document.getElementById("eventsContainer");
        const closedEventsContainer = document.getElementById("closedEventsContainer");
        const completedEventsContainer = document.getElementById("completedEventsContainer");
        const sortEvents = document.getElementById("sortEvents");

        const eventsRef = ref(db, 'events');

        function renderEvents(events, container, includeAttendButton) {
            let eventsHtml = '<div class="row">';
            events.forEach((eventData, index) => {
                const progress = (eventData.volunteersReg / eventData.volunteersRequired) * 100;
                const isEventClosed = eventData.volunteersReg >= eventData.volunteersRequired;
                eventsHtml += `
                    <div class="col-md-4 mb-3">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">${eventData.title}</h5>
                                <p class="card-text">${eventData.description}</p>
                                <ul class="list-unstyled">
                                    <li><strong>Category:</strong> ${eventData.category}</li>
                                    <li><strong>Date:</strong> ${eventData.hostDateTime}</li>
                                    <li><strong>Location:</strong> ${eventData.location}</li>
                                    <li><strong>Participation Progress:</strong></li>
                                </ul>
                                <div class="progress mb-2">
                                    <div class="progress-bar bg-success" role="progressbar" style="width: ${progress}%;" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">${progress.toFixed(2)}%</div>
                                </div>
                                ${includeAttendButton && !isEventClosed ? `<button class="btn btn-success" onclick="attendEvent('${eventData.eventId}', ${eventData.volunteersReg}, ${eventData.volunteersRequired})">Attend</button>` : isEventClosed ? '<p class="text-danger">Event is Full!</p>' : ''}
                            </div>
                        </div>
                    </div>
                `;
                if ((index + 1) % 3 === 0) {
                    eventsHtml += '</div><div class="row">';
                }
            });
            eventsHtml += '</div>';
            container.innerHTML = eventsHtml;
        }

        function fetchAndRenderEvents(sortBy) {
            get(eventsRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const liveEvents = [];
                    const closedEvents = [];
                    const completedEvents = [];
                    const currentDate = new Date();

                    snapshot.forEach((childSnapshot) => {
                        const eventData = childSnapshot.val();
                        if (eventData.adminApproval === 'yes') {
                            const eventDate = new Date(eventData.hostDateTime);
                            if (eventData.volunteersReg >= eventData.volunteersRequired && eventDate < currentDate) {
                                completedEvents.push(eventData);
                            } else if (eventDate < currentDate) {
                                closedEvents.push(eventData);
                            } else {
                                liveEvents.push(eventData);
                            }
                        }
                    });

                    if (sortBy === 'progress') {
                        liveEvents.sort((a, b) => (a.volunteersReg / a.volunteersRequired) - (b.volunteersReg / b.volunteersRequired));
                        closedEvents.sort((a, b) => (a.volunteersReg / a.volunteersRequired) - (b.volunteersReg / b.volunteersRequired));
                        completedEvents.sort((a, b) => (a.volunteersReg / a.volunteersRequired) - (b.volunteersReg / b.volunteersRequired));
                    } else {
                        liveEvents.sort((a, b) => new Date(a.hostDateTime) - new Date(b.hostDateTime));
                        closedEvents.sort((a, b) => new Date(a.hostDateTime) - new Date(b.hostDateTime));
                        completedEvents.sort((a, b) => new Date(a.hostDateTime) - new Date(b.hostDateTime));
                    }

                    renderEvents(liveEvents, eventsContainer, true);
                    renderEvents(closedEvents, closedEventsContainer, false);
                    renderEvents(completedEvents, completedEventsContainer, false);
                } else {
                    eventsContainer.innerHTML = "<p>No active events right now.</p>";
                    closedEventsContainer.innerHTML = "<p>No closed events right now.</p>";
                    completedEventsContainer.innerHTML = "<p>No completed events right now.</p>";
                }
            }).catch((error) => {
                console.error("Error fetching events:", error);
                eventsContainer.innerHTML = "<p>Error fetching events. Please try again later.</p>";
                closedEventsContainer.innerHTML = "<p>Error fetching events. Please try again later.</p>";
                completedEventsContainer.innerHTML = "<p>Error fetching events. Please try again later.</p>";
            });
        }

        // Initial fetch and render sorted by date
        fetchAndRenderEvents('date');

        // Handle sort change
        sortEvents.addEventListener('change', (event) => {
            fetchAndRenderEvents(event.target.value);
        });

        // Function to handle Attend button click
        window.attendEvent = (eventId, currentVolunteers, requiredVolunteers) => {
            if (currentVolunteers < requiredVolunteers) {
                const newVolunteersReg = currentVolunteers + 1;
                const eventRef = ref(db, `events/${eventId}`);
                update(eventRef, { volunteersReg: newVolunteersReg })
                    .then(() => {
                        alert("Thank you for joining the event!");
                        fetchAndRenderEvents(sortEvents.value); // Fetch and render events again after attendance
                    })
                    .catch((error) => console.error("Error updating event:", error));
            } else {
                alert("This event has already reached the required number of volunteers.");
            }
        };

        // Check authentication state
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                // User is not logged in, redirect to login page
                window.location.href = 'login.html';
            }
        });