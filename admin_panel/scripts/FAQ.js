import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';


// BACK BUTTON =====================================================================================
// Add an event listener to the back button
const backButton = document.getElementById("backButton");

backButton.addEventListener("click", () => {
    // Navigate to the previous page
    window.history.back();
});




function getAllFAQ() {
    const inquiriesCollection = collection(firestoreDB, "FAQ");

    getDocs(query(inquiriesCollection, orderBy("question")))
        .then((querySnapshot) => {
            const faqList = document.getElementById("faqList");
            faqList.innerHTML = ""; // Clear existing content
            let questionNumber = 1;

            querySnapshot.forEach((doc) => {
                const faqData  = doc.data();
                const question = faqData.question;
                const answer = faqData.answer;

                const faqItem = document.createElement("div");
                faqItem.classList.add("faq-item");

                const faqDetails = document.createElement("div");
                faqItem.classList.add("faq-details");

                const questionElement = document.createElement("div");
                questionElement.classList.add("faq-question");
                questionElement.innerHTML = `${questionNumber}. ${question}`;

                const answerElement = document.createElement("div");
                answerElement.classList.add("faq-answer");
                answerElement.innerHTML = `${answer}`;

                const inquiryActions = document.createElement("div");
                inquiryActions.classList.add("faq-actions");

                const editButton = document.createElement("button");
                editButton.classList.add("btn", "btn-success");
                editButton.textContent = "Edit";

                editButton.addEventListener("click", () => {
                    openEditModal(question, answer, doc.id);
                });

                const deleteButton = document.createElement("button");
                deleteButton.classList.add("btn", "btn-danger");
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", () => {
                    if (confirm("Are you sure you want to delete this FAQ?")) {
                        const docID = doc.id;
                        deleteFAQ(docID);
                        faqItem.remove();
                    }
                });

                inquiryActions.appendChild(editButton);
                inquiryActions.appendChild(deleteButton);

                faqDetails.appendChild(questionElement);
                faqDetails.appendChild(answerElement);

                faqItem.appendChild(faqDetails);
                faqItem.appendChild(inquiryActions);

                faqList.appendChild(faqItem);
                 questionNumber++;
            });
        })
        .catch((error) => {
            console.error("Error getting inquiries:", error);
        });
}

//========================= ADD PRODUCT =============================
document.getElementById("addFAQButton").addEventListener("click", () => {
    openModal();
});

// Open the modal
function openModal() {
    const modal = document.getElementById("addModal");
    modal.style.display = "block";
}

// Close the modal
document.getElementById("close-modal").addEventListener("click", function() {
    const modal = document.getElementById("addModal");
    modal.style.display = "none";
});

// Form submission
document.getElementById("faq-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const question = document.getElementById("faq-question").value;
    const answer = document.getElementById("faq-answer").value;

    const applicationData = {
        question: question,
        answer: answer,
    };

    addToFirestore(applicationData);

    const modal = document.getElementById("addModal");
    modal.style.display = "none";
});

// Function to add a new product to Firestore
function addToFirestore(applicationData, collectionName) {
    const docRef = collection(firestoreDB, 'FAQ');
    addDoc(docRef, applicationData)
        .then(() => {
            getAllFAQ();
        })
        .catch((error) => {
            console.error("Error adding:", error);
        });
}

// ============= DELETE =======================================================
function deleteFAQ(docId) {
    const inquiryRef = doc(firestoreDB, "FAQ", docId);
    deleteDoc(inquiryRef)
    .then(() => {
        console.log("FAQ deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting FAQ: ", error);
    });
}  

// ======== EDIT ==============================================================
function openEditModal(question, answer, docId) {
    const modal = document.getElementById("editModal");
    modal.style.display = "block";

    // Set the existing data in the modal form
    document.getElementById("edit-question").value = question;
    document.getElementById("edit-answer").value = answer;
    document.getElementById("edit-doc-id").value = docId;

}

// Close the Update modal
document.getElementById("close-edit-modal").addEventListener("click", function() {
    const modal = document.getElementById("editModal");
    modal.style.display = "none";
});

// Form submission for editing
document.getElementById("edit-faq-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const question = document.getElementById("edit-question").value;
    const answer = document.getElementById("edit-answer").value;
    const docId = document.getElementById("edit-doc-id").value;

    updateFAQInFirestore(question, answer, docId);

    const modal = document.getElementById("editModal");
    modal.style.display = "none";
});

// Function to update a catalogue item in Firestore
function updateFAQInFirestore(question, answer, docId) {
    const docRef = doc(firestoreDB, "FAQ", docId);
    
    updateDoc(docRef, {
        answer: answer,
        question: question,
    })
        .then(() => {
            alert(`FAQ updated`);
            getAllFAQ();
        })
        .catch((error) => {
            console.error("Error updating FAQ:", error);
        });
}




window.onload = function () {
    getAllFAQ();
};
