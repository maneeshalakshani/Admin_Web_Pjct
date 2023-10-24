import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

function getAllFAQ() {
    const inquiriesCollection = collection(firestoreDB, "FAQ");

    getDocs(inquiriesCollection)
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

// Event listener to show the "Add FAQ" form
const addFAQButton = document.getElementById("addFAQButton");
const addFAQForm = document.getElementById("addFAQForm");

addFAQButton.addEventListener("click", () => {
    addFAQForm.style.display = "block";
    addFAQButton.style.display = "none";
});

// Event listener to submit a new FAQ
const submitFAQButton = document.getElementById("submitFAQButton");

submitFAQButton.addEventListener("click", () => {
    const questionInput = document.getElementById("questionInput");
    const answerInput = document.getElementById("answerInput");
    const errorMessage = document.getElementById("errorMessage");

    // Clear previous error message
    errorMessage.textContent = "";

    // Get the question and answer values from input fields
    const question = questionInput.value;
    const answer = answerInput.value;

    // Check if question and answer fields are empty
    if (!question || !answer) {
        errorMessage.textContent = "Both question and answer are required!";
    } else {
        // Add the new FAQ to Firestore
        addFAQToFirestore(question, answer);

        // Clear input fields
        questionInput.value = "";
        answerInput.value = "";

        // Hide the "Add FAQ" form
        addFAQForm.style.display = "none";
        addFAQButton.style.display = "block";
    }
});

// Function to add a new FAQ to Firestore
function addFAQToFirestore(question, answer) {
    const faqCollection = collection(firestoreDB, "FAQ");

    // Add the new FAQ to Firestore
    addDoc(faqCollection, {
        question: question,
        answer: answer
    })
        .then(() => {
            // Refresh the FAQ list
            getAllFAQ();
        })
        .catch((error) => {
            console.error("Error adding FAQ:", error);
        });
}

// Function to delete an inquiry document by ID
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
