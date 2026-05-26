document.addEventListener("DOMContentLoaded", function () {

  console.log("JS STARTED");

/* ══ EQUIPMENT DATA ══ */
const EQUIPMENT = [
  { id:'chairs',      icon:'bi-people-fill',        name:'Chairs' },
  { id:'tables',      icon:'bi-grid-3x3-gap-fill',  name:'Tables' },
  { id:'canopies',    icon:'bi-house-fill',          name:'Canopies' },
  { id:'speakers',    icon:'bi-speaker-fill',        name:'Speakers' },
  { id:'microphones', icon:'bi-mic-fill',            name:'Microphones' },
  { id:'projectors',  icon:'bi-projector-fill',      name:'Projectors' },
  { id:'lighting',    icon:'bi-lightbulb-fill',      name:'Lighting' },
  { id:'decorations', icon:'bi-stars',               name:'Decorations' },
  { id:'Backdrop',   icon:'bi-back-fill',            name:'backdrop' },
  { id:'stage',       icon:'bi-display-fill',        name:'Stage / Platform' },
  // { id:'fans',        icon:'bi-tornado',             name:'Standing Fans' },
  { id:'other',       icon:'bi-plus-circle-fill',    name:'Other (specify in notes)' },
];

/* ── Build Equipment Grid ── */
const grid = document.getElementById('equipmentGrid');

if (grid) {
  EQUIPMENT.forEach(eq => {
    const div = document.createElement('div');
    div.className = 'equip-item';
    div.id = 'ei-' + eq.id;

    div.innerHTML = `
      <input class="form-check-input" type="checkbox"
        id="chk-${eq.id}"
        onchange="toggleEquip('${eq.id}')"/>

      <i class="bi ${eq.icon} equip-icon"></i>

      <div class="equip-info">
        <div class="equip-name">${eq.name}</div>
      </div>

      <div class="equip-qty">
        <input type="number"
          class="form-control"
          id="qty-${eq.id}"
          min="1"
          value="1"
          placeholder="Qty"/>
      </div>`;

    div.addEventListener('click', e => {
      if (!e.target.matches('input')) {
        const cb = div.querySelector('input[type=checkbox]');
        cb.checked = !cb.checked;
        toggleEquip(eq.id);
      }
    });

    grid.appendChild(div);
  });
}
window.toggleEquip = function(id) {
  const item = document.getElementById('ei-' + id);
  const cb   = document.getElementById('chk-' + id);
  item.classList.toggle('active', cb.checked);
  if (cb.checked) document.getElementById('qty-' + id).focus();
}

// /* ══ MULTI-STEP LOGIC ══ */
let currentStep = 1;
const TOTAL_STEPS = 4;

function updateIndicator(step) {
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const ind = document.getElementById('step-ind-' + i);
    ind.classList.remove('active','done');
    if (i < step)  ind.classList.add('done');
    if (i === step) ind.classList.add('active');
  }
  // lines
  for (let i = 1; i < TOTAL_STEPS; i++) {
    const line = document.getElementById(`line-${i}-${i+1}`);
    if (line) line.classList.toggle('done', i < step);
  }
}

function showStep(step) {
  document.querySelectorAll('.booking-step').forEach(p => p.classList.remove('active'));
  document.getElementById('stepPanel' + step).classList.add('active');
  updateIndicator(step);

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
  cancelBtn.style.display = step === 1 ? 'inline-flex' : 'none';

  if (step === TOTAL_STEPS) {
    nextBtn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Submit Booking';
  } else {
    nextBtn.innerHTML = 'Next <i class="bi bi-arrow-right"></i>';
  }
}

/* ── Validation per step ── */
function validateStep(step) {
  if (step === 1) {
    const name  = document.getElementById('fullName');
    const email = document.getElementById('emailAddress');
    const phone = document.getElementById('phoneNumber');
    let ok = true;
    [name, email, phone].forEach(f => {
      if (!f.value.trim() || (f.type === 'email' && !f.validity.valid)) {
        f.classList.add('is-invalid'); ok = false;
      } else { f.classList.remove('is-invalid'); f.classList.add('is-valid'); }
    });
    return ok;
  }
  if (step === 2) {
    const type = document.getElementById('eventType');
    const date = document.getElementById('eventDate');
    const loc  = document.getElementById('eventLocation');
    let ok = true;
    [type, date, loc].forEach(f => {
      if (!f.value.trim()) { f.classList.add('is-invalid'); ok = false; }
      else { f.classList.remove('is-invalid'); f.classList.add('is-valid'); }
    });
    return ok;
  }
  return true; // Steps 3 & 4 have no hard requirements
}

window.nextStep = function() {
  if (currentStep < TOTAL_STEPS) {
    if (!validateStep(currentStep)) return;
    currentStep++;
    showStep(currentStep);
  } else {
    submitBooking();
  }
}

window.prevStep = function() {
  if (currentStep > 1) { currentStep--; showStep(currentStep); }
}

/* ── Submit ── */
window.submitBooking = function() {
  // Collect data (frontend only)
  const payload = {
    customer: {
      name:  document.getElementById('fullName').value,
      email: document.getElementById('emailAddress').value,
      phone: document.getElementById('phoneNumber').value,
    },
    event: {
      type:     document.getElementById('eventType').value,
      date:     document.getElementById('eventDate').value,
      location: document.getElementById('eventLocation').value,
      notes:    document.getElementById('eventNotes').value,
    },
    equipment: EQUIPMENT
      .filter(eq => document.getElementById('chk-' + eq.id)?.checked)
      .map(eq => ({
        item: eq.name,
        qty:  document.getElementById('qty-' + eq.id)?.value || 1,
      })),
    payment: document.querySelector('input[name="paymentMethod"]:checked')?.value,
  };

  console.log('📦 Booking Payload:', payload); // Hook your backend here

  // Show success
  document.getElementById('bookingForm').style.display = 'none';
  document.getElementById('stepIndicator').style.display = 'none';
  document.getElementById('bookingSuccess').style.display = 'block';
  document.getElementById('successEmail').textContent = payload.customer.email;
  document.getElementById('modalFooter').innerHTML = `
    <button type="button" class="btn-submit mx-auto" data-bs-dismiss="modal">
      <i class="bi bi-check-circle me-1"></i> Done
    </button>`;
}

/* ── Reset on close ── */
document.getElementById('bookingModal').addEventListener('hidden.bs.modal', () => {
  currentStep = 1;
  document.getElementById('bookingForm').style.display = 'block';
  document.getElementById('stepIndicator').style.display = 'flex';
  document.getElementById('bookingSuccess').style.display = 'none';
  document.getElementById('bookingForm').reset();
  document.querySelectorAll('.is-valid,.is-invalid').forEach(el => el.classList.remove('is-valid','is-invalid'));
  document.querySelectorAll('.equip-item').forEach(el => el.classList.remove('active'));
  // Restore footer
  document.getElementById('modalFooter').innerHTML = `
    <button type="button" class="btn-cancel" id="prevBtn" onclick="prevStep()" style="display:none"><i class="bi bi-arrow-left me-1"></i> Back</button>
    <button type="button" class="btn-cancel ms-auto" data-bs-dismiss="modal" id="cancelBtn">Cancel</button>
    <button type="button" class="btn-submit ms-2" id="nextBtn" onclick="nextStep()">Next <i class="bi bi-arrow-right"></i></button>`;
  showStep(1);
});

/* ── Payment radio styling ── */
document.addEventListener('change', e => {
  if (e.target.name === 'paymentMethod') {
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    e.target.closest('.payment-option').classList.add('selected');
  }
});

/* Set min date to today */
 document.getElementById('eventDate').min = new Date().toISOString().split('T')[0];

// Init
showStep(1);

console.log("JS FINISHED");  
});

