const FORMSPREE_URL = "https://formspree.io/f/mkovdwno";

let studentData = {};

function handleContinue() {
  const studentId = document.getElementById('studentId').value.trim();
  const email     = document.getElementById('email').value.trim();
  let valid = true;

  document.getElementById('studentIdError').textContent = '';
  document.getElementById('emailError').textContent = '';

  if (!studentId) {
    document.getElementById('studentIdError').textContent = 'Student ID is required.';
    valid = false;
  }
  if (!email) {
    document.getElementById('emailError').textContent = 'Email is required.';
    valid = false;
  } else if (!email.includes('@') || !email.includes('.')) {
    document.getElementById('emailError').textContent = 'Enter a valid email.';
    valid = false;
  }

  if (!valid) return;

  studentData = { studentId, email };
  document.getElementById('studentBadge').textContent =
    👤 ${studentId}   |   ✉️ ${email};
  document.getElementById('step1').classList.add('hidden');
  document.getElementById('step2').classList.remove('hidden');
}

function goBack() {
  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step1').classList.remove('hidden');
}

async function handleSubmit() {
  const category = document.getElementById('category').value;
  const message  = document.getElementById('message').value.trim();
  let valid = true;

  document.getElementById('categoryError').textContent = '';
  document.getElementById('messageError').textContent = '';

  if (!category) {
    document.getElementById('categoryError').textContent = 'Please select a category.';
    valid = false;
  }
  if (!message) {
    document.getElementById('messageError').textContent = 'Complaint details are required.';
    valid = false;
  } else if (message.length < 10) {
    document.getElementById('messageError').textContent = 'Minimum 10 characters.';
    valid = false;
  }

  if (!valid) return;

  const complaintId = 'RKV-' + Date.now();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        complaint_id: complaintId,
        student_id:   studentData.studentId,
        email:        studentData.email,
        category:     category,
        message:      message
      })
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('displayComplaintId').textContent = complaintId;
      document.getElementById('step2').classList.add('hidden');
      document.getElementById('step3').classList.remove('hidden');
    } else {
      alert('Error: ' + (result.error || 'Something went wrong.'));
    }
  } catch (err) {
    alert('Network error. Check your connection.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit Complaint';
  }
}

function submitAnother() {
  document.getElementById('studentId').value = '';
  document.getElementById('email').value = '';
  document.getElementById('category').value = '';
  document.getElementById('message').value = '';
  studentData = {};
  document.getElementById('step3').classList.add('hidden');
  document.getElementById('step1').classList.remove('hidden');
}
