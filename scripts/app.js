document.addEventListener('DOMContentLoaded', initializeApp);

// let overallPhaseOrder = [];
let overallPhaseIndex = 0;

let hatsQuestionIndex = 0;
let brightnessQuestionIndex = 0;
let finalQuestionIndex = 0;

let currentQuestionText = "";

// Question arrays for 2–trial hats and 2–trial brightness
const hatQuestions = [
  "Now the elf boss wants you to make a big hat (like circled). Where would you put the hat?",
  "Now the elf boss wants you to make a small hat (like circled). Where would you put the hat?"
];

const brightnessQuestions = [
  "Now the elf boss wants you to make a bright lightbulb (like circled). Where would you put it?",
  "Now the elf boss wants you to make a dark lightbulb (like circled). Where would you put it?"
];

const finalQuestions = [
  "Now the elf boss wants you to make things bigger. Which machine would you keep?",
  "Now the elf boss wants to make things brighter. Which machine would you keep?"
];

// --- NEW GLOBAL VARIABLES FOR DEMO STAR DISTRIBUTION PER MACHINE ---
let sizeMachineShadePool = [];
let shadeMachineSizePool = [];
// -----------------------------------------------------------------

/**
 * Main initialization function
 */
function initializeApp() {
  setupScreenNavigationAndListeners();
  // Initialize demo star distribution pools
  initializeDemoStars();
}

/**
 * Initializes the arrays for demo star sizes and shades per machine.
 * This ensures an equal distribution of the randomized dimension over 9 stars per machine.
 */
function initializeDemoStars() {
  const sizes = ['small', 'medium', 'large'];
  const shades = ['darker', 'medium', 'lighter'];

  // Each size/shade will appear 9 / 3 = 3 times for the randomized dimension
  for (let i = 0; i < 3; i++) {
    sizeMachineShadePool.push(...shades); // For Size Machine, shades are random
    shadeMachineSizePool.push(...sizes);  // For Shade Machine, sizes are random
  }

  // Shuffle them to randomize the order of output
  shuffleArray(sizeMachineShadePool);
  shuffleArray(shadeMachineSizePool);
}


/**
 * Sets up screen navigation and event listeners
 */
function setupScreenNavigationAndListeners() {
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-screen]');
    if (!trigger) return;
    const nextScreen = trigger.dataset.screen;
    if (nextScreen === 'experiment') {
      if (!validateParticipantInfo()) return;
      document.getElementById("participant-info").hidden = true;
      // Start the pre-demo phase.
      phase = "preDemo";
      preDemoIndex = 0;
      showPreDemoPage();
    } else {
      showScreen(nextScreen);
    }
  });
}

function showPreDemoPage() {
  // Use the preDemo container from your HTML.
  let container = document.getElementById("preDemo");
  container.hidden = false;
  container.innerHTML = "";

  // If there are pre-demo pages left, display the current one.
  if (preDemoIndex < preDemoPages.length) {
      const currentPage = preDemoPages[preDemoIndex];
      if (currentPage === "preDemoColor") {
          displayPreDemoColor(container);
      } else if (currentPage === "preDemoSize") {
          displayPreDemoSize(container);
      }
  } else {
      // No more pre-demo pages: transition to the demo phase.
      container.hidden = true;
      phase = "demo";
      showScreen("experiment"); // Show your experiment screen.
      renderMachines();         // Render machines now that we're in demo.
      disableUserInteraction();
      setTimeout(() => {
          verbalNarration('introduction').then(() => enableUserInteraction());
      }, 1000);
  }
}

function displayPreDemoColor(container) {
  const title = document.createElement("h2");
  title.innerText = "Look at these stars!\nWhich one is the darkest? Second darkest?\nWhich one is the brightest? Second brightest?";

  // Create a row with three stars (all medium size) in three different colors.
  const starRow = document.createElement("div");
  starRow.style.display = "flex";
  starRow.style.justifyContent = "center";
  starRow.style.alignItems = "center";
  starRow.classList.add("preDemo-star-row");

  const starDark = document.createElement("span");
  starDark.classList.add(
    "star",
    "star-size-medium",
    "star-brightness-darker"
  );
  starDark.innerText = "★";

  const starMed = document.createElement("span");
  starMed.classList.add(
    "star",
    "star-size-medium",
    "star-brightness-medium"
  );
  starMed.innerText = "★";

  const starBright = document.createElement("span");
  starBright.classList.add(
    "star",
    "star-size-medium",
    "star-brightness-lighter"
  );
  starBright.innerText = "★";

  const starExtraBright = document.createElement("span");
  starExtraBright.classList.add(
    "star",
    "star-size-medium",
    "star-brightness-brightest"
  );
  starExtraBright.innerText = "★";

  starRow.appendChild(starDark);
  starRow.appendChild(starMed);
  starRow.appendChild(starBright);
  starRow.appendChild(starExtraBright);

  // Continue button:
  const continueBtn = document.createElement("button");
  continueBtn.innerText = "Continue";
  continueBtn.className = "continue-button";
  continueBtn.style.display = "block";  // ensure it's visible for pre-demo
  continueBtn.addEventListener("click", () => {
    preDemoIndex++;
    showPreDemoPage();
  });

  container.appendChild(title);
  container.appendChild(starRow);
  container.appendChild(document.createElement("br"));
  container.appendChild(continueBtn);
}

function displayPreDemoSize(container) {
  const title = document.createElement("h2");
  title.innerText = "Look at these stars!\nCan you show me which one is the biggest? Second biggest?\nWhich one is the smallest? Second smallest?";

  // Create a row with three stars (all the same color, here medium) but different sizes.
  const starRow = document.createElement("div");
  starRow.style.display = "flex";
  starRow.style.justifyContent = "center";
  starRow.style.alignItems = "center";
  starRow.classList.add("preDemo-star-row");

  const starSmall = document.createElement("span");
starSmall.classList.add(
  "star",
  "star-size-small",
  "star-brightness-medium"
);
starSmall.innerText = "★";

const starMed = document.createElement("span");
starMed.classList.add(
  "star",
  "star-size-medium",
  "star-brightness-medium"
);
starMed.innerText = "★";

const starLarge = document.createElement("span");
starLarge.classList.add(
  "star",
  "star-size-large",
  "star-brightness-medium"
);
starLarge.innerText = "★";

const starExtraLarge = document.createElement("span");
starExtraLarge.classList.add(
  "star",
  "star-size-extralarge",
  "star-brightness-medium"
);
starExtraLarge.innerText = "★";
  starRow.appendChild(starSmall);
  starRow.appendChild(starMed);
  starRow.appendChild(starLarge);
  starRow.appendChild(starExtraLarge);

  // Continue button:
  const continueBtn = document.createElement("button");
  continueBtn.innerText = "Continue";
  continueBtn.className = "continue-button";
  continueBtn.style.display = "block";
  continueBtn.addEventListener("click", () => {
    preDemoIndex++;
    showPreDemoPage();
  });

  container.appendChild(title);
  container.appendChild(starRow);
  container.appendChild(document.createElement("br"));
  container.appendChild(continueBtn);
}

  document.getElementById('whySubmit').addEventListener('click', function () {
    childExplanation = document.getElementById('whyText').value;
    document.getElementById('why-section').style.display = 'none';
    document.getElementById('whyText').value = '';
    if (childExplanation.trim() === "") { return false; }
    logExplanation(childExplanation);
  });

  document.getElementById("continue-button").addEventListener("click", function () {
    function resetContinueClick() {
      document.getElementById('why-section').style.display = 'none';
      document.getElementById('whyText').value = '';
      document.getElementById("continue-button").style.display = "none";
      lastClickTime = Date.now();
    }

    if (phase === "demo") {  // demo phase now is free exploration
      resetContinueClick();
      prepareComprehension();
    }
    else if (phase === "comprehension") {
      resetContinueClick();
      // Make machines clickable again for comprehension
      document.querySelector(".machines-container").classList.add("is-question-phase");
      document.querySelectorAll('.machine').forEach(machine => {
        machine.onclick = () => {
          handleMachineClick(machine.getAttribute('data-machine'), comprehensiveQuestionIndex);
        };
      });
      showNextOutcomeContainer();
    }
    // Extra phases: single-trial phases (extralarge, brightest)
    else if (phase === "extralarge" || phase === "brightest") {
      resetContinueClick();
      // Clear the draggable item from previous phase
      document.getElementById("star").innerHTML = "";
      overallPhaseIndex++;
      if (overallPhaseOrder[overallPhaseIndex] !== "final") {
        phase = overallPhaseOrder[overallPhaseIndex];
        if (phase === "extralarge") startLargeExperiment();
        else if (phase === "brightest") startBrightExperiment();
        else if (phase === "hats") startHatsExperiment();
        else if (phase === "brightness") startBrightnessExperiment();
      } else {
        phase = "final";
        finalQuestionIndex = 0;
        displayNextFinalQuestion();
      }
    }
    // For the Hats phase:
    else if (phase === "hats") {
      resetContinueClick();
      // Remove hat outputs (preserve demo stars)
      document.querySelectorAll('.slot .outcome .star').forEach(el => {
        if (el.innerHTML.includes("🎩")) { el.remove(); }
      });
      if (hatsQuestionIndex === -1) {
        // Exploration trial completed – now start challenge trials:
        hatsQuestionIndex = 0;
        displayNextHatsQuestion();
      } else {
        hatsQuestionIndex++;
        if (hatsQuestionIndex < hatQuestions.length) {
          displayNextHatsQuestion();
        } else {
          overallPhaseIndex++;
          if (overallPhaseOrder[overallPhaseIndex] !== "final") {
            phase = overallPhaseOrder[overallPhaseIndex];
            if (phase === "extralarge") {
              startLargeExperiment();
            } else if (phase === "hats") {
              startHatsExperiment();
            } else if (phase === "brightest") {
              startBrightExperiment();
            } else if (phase === "brightness") {
              startBrightnessExperiment();
            }
          } else {
            phase = "final";
            finalQuestionIndex = 0;
            displayNextFinalQuestion();
          }
        }
      }
    }
    // For the Brightness phase:
    else if (phase === "brightness") {
      resetContinueClick();
      // Remove lightbulb outputs (preserve demo stars)
      document.querySelectorAll('.slot .outcome img').forEach(img => {
        if (img.src.includes("lightbulb")) { img.remove(); }
      });
      if (brightnessQuestionIndex === -1) {
        // Exploration trial completed – now start challenge trials:
        brightnessQuestionIndex = 0;
        displayNextBrightnessQuestion();
      } else {
        brightnessQuestionIndex++;
        if (brightnessQuestionIndex < brightnessQuestions.length) {
          displayNextBrightnessQuestion();
        } else {
          overallPhaseIndex++;
          if (overallPhaseOrder[overallPhaseIndex] !== "final") {
            phase = overallPhaseOrder[overallPhaseIndex];
            if (phase === "extralarge") {
              startLargeExperiment();
            } else if (phase === "hats") {
              startHatsExperiment();
            } else if (phase === "brightest") {
              startBrightExperiment();
            } else if (phase === "brightness") {
              startBrightnessExperiment();
            }
          } else {
            phase = "final";
            finalQuestionIndex = 0;
            displayNextFinalQuestion();
          }
        }
      }
    }
    else if (phase === "final") {
      // In final phase, children click a machine to answer final questions.
      resetContinueClick();
      finalQuestionIndex++;
      if (finalQuestionIndex < finalQuestions.length) {
        displayNextFinalQuestion();
      } else {
        saveCSV();
        showScreen("thank-you");
        return;
      }
    }
    document.getElementById("exit-button").addEventListener("click", function () {
      saveCSV();
      showScreen("thank-you");
    });
  });

/**
 * Shows a screen by ID and hides all other screens.
 */
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => { screen.hidden = true; });
  if (screenId === 'decline') {
    const consentScreen = document.getElementById('consent');
    consentScreen.innerHTML = `
      <h2>Thank you for your time.</h2>
      <p>You have declined to participate in the study.</p>
    `;
    consentScreen.hidden = false;
    return;
  }
  const screen = document.getElementById(screenId);
  if (screen) { screen.hidden = false; }
}

/**
 * Validates the participant information form.
 */
function validateParticipantInfo() {
  prolificId = document.querySelector('input[name="prolificId"]').value.trim();
  age = document.querySelector('input[name="age"]').value.trim();
  sex = document.querySelector('input[name="sex"]').value.trim().toUpperCase();
  if (!prolificId || !age || !sex) {
    alert('Please fill out all fields.');
    return false;
  }
  if (isNaN(age) || age < 1 || age > 120) {
    alert('Please enter a valid age.');
    return false;
  }
  if (sex !== 'F' && sex !== 'M') {
    alert('Please enter F or M for sex.');
    return false;
  }
  return true;
}

/**
 * Utility function to randomly shuffle elements in an array.
 */
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * Maps numeric order values to slot size class names.
 */
function getSlotClass(order) {
  switch(order) {
    case 0: return 'extralarge';
    case 1: return 'small';
    case 2: return 'medium';
    case 3: return 'large';
    default: return 'medium';
  }
}

/* Global variables for tracking machine configuration */
let prolificId = '';
let age = '';
let sex = '';

// Rename machines here:
const MACHINES = ['Size Machine', 'Shade Machine'];

// For the Shade Machine
const entropyFirstRound = { "Shade Machine": [true, true, true] };
const entropySlotOutputs = { 0: [], 1: [], 2: [] };
const slotSizeMap = {};

const comprehensionQuestion = "Remember the stars you made from the machines? Which machine made these stars?";
const smallExperimentQuestion = "Now there is a new slot on the right. The elf boss wants an extra big star for his baby. Which slot will you use?";

let machineLayout = '';
let slotLayout = '';

let remainingStars = 18; // Total stars for the demo phase
let phase = "preDemo";
let preDemoPages = ["preDemoColor", "preDemoSize"];
preDemoPages = shuffleArray(preDemoPages);  // randomize order
let preDemoIndex = 0;

let outcomesContainers = [];

let comprehensiveQuestionIndex = 0;
let questionIndex = 0;

let lightbulbIndex = 0;
let maxLightbulbRounds = 3;

let extralargeTrial = 0;
let questionTrial = 0;
let lightnessTrial = 0;

let itemsCollected = [];
let hatsCollected = [];
let lightbulbsCollected = [];
let interactionLogs = [];
let reactionTimes = [];
let lastClickTime = Date.now();
let childExplanation = '';

/**
 * Capitalizes the first letter of a string.
 */
function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Only play audio during demo/free exploration and comprehension phases.
 */
function verbalNarration(sizeChange = null, brightnessChange = null) {
  // Only play audio during demo/free exploration or comprehension phases
  if (phase !== 'demo' && phase !== 'comprehension') {
    console.log('verbalNarration skipped because phase is:', phase);
    return Promise.resolve();
  }
  let audioFile = '';

  if (phase === 'demo') {
    if (sizeChange === 'introduction') {
      audioFile = 'audio/demo-instructions.mp3';
    } else if (sizeChange === 'finish') {
      audioFile = 'audio/demo-finish.mp3';
    } else {
      const audioMapping = {
        bigger: {
          darker: 'audio/demo-bigger-darker.mp3',
          brighter: 'audio/demo-bigger-brighter.mp3',
          same: 'audio/demo-bigger.mp3'
        },
        smaller: {
          darker: 'audio/demo-smaller-darker.mp3',
          brighter: 'audio/demo-smaller-brighter.mp3',
          same: 'audio/demo-smaller.mp3'
        },
        same: {
          darker: 'audio/demo-darker.mp3',
          brighter: 'audio/demo-brighter.mp3',
          same: 'audio/demo-same.mp3'
        }
      };
      // Ensure brightnessChange is not null for mapping lookup
      const actualBrightnessChange = brightnessChange !== null ? brightnessChange : 'same';
      if (audioMapping[sizeChange] && audioMapping[sizeChange][actualBrightnessChange]) {
        audioFile = audioMapping[sizeChange][actualBrightnessChange];
      } else {
        audioFile = 'audio/demo-same.mp3';
      }
    }
  } else if (phase === 'comprehension') {
    audioFile = 'audio/comprehension.mp3';
  }

  return playLocalAudio(audioFile)
    .then(() => {
      if (sizeChange === 'introduction') {
      }
    })
    .catch((error) => {
      console.error('Error during narration:', error);
    });
}

function playLocalAudio(audioPath) {
  return new Promise((resolve, reject) => {
    const audioElement = document.getElementById('ttsAudio');
    if (!audioElement) { return reject(new Error(`Audio element with ID "ttsAudio" not found.`)); }
    audioElement.src = audioPath;
    audioElement.onended = () => { resolve(); };
    audioElement.onerror = (error) => { reject(error); };
    audioElement.play();
  });
}

/**
 * Keep track of random star sizes so we don't produce the same size 3 times in a row (for Shade Machine).
 * This function is now only a fallback and not used for demo phase.
 */
let lastSizes = [];
function getRandomStarSize() {
  const sizes = ['small', 'medium', 'large'];
  let pick = sizes[Math.floor(Math.random() * sizes.length)];
  if (lastSizes.length >= 2) {
    const [prev1, prev2] = lastSizes.slice(-2);
    while (pick === prev1 && pick === prev2) { pick = sizes[Math.floor(Math.random() * sizes.length)]; }
  }
  lastSizes.push(pick);
  if (lastSizes.length > 2) { lastSizes.shift(); }
  return pick;
}

/**
 * Return a random star size that doesn't match the given slot size.
 * This function is now only a fallback and not used for demo phase.
 */
function getRandomSizeNotMatchingSlot(slotSize) {
  const sizes = ['small', 'medium', 'large'];
  const idx = sizes.indexOf(slotSize);
  if (idx !== -1) sizes.splice(idx, 1);
  return sizes[Math.floor(Math.random() * sizes.length)];
}

/**
 * Keep track of random shades so we don't produce the same shade 3 times in a row.
 * This function is now only a fallback and not used for demo phase.
 */
let lastShades = [];
function getRandomShade() {
  const shades = ['darker', 'medium', 'lighter'];
  let pick = shades[Math.floor(Math.random() * shades.length)];
  if (lastShades.length >= 2) {
    const [prev1, prev2] = lastShades.slice(-2);
    while (pick === prev1 && pick === prev2) { pick = shades[Math.floor(Math.random() * shades.length)]; }
  }
  lastShades.push(pick);
  if (lastShades.length > 2) { lastShades.shift(); }
  return pick;
}

/**
 * Renders the machines with randomized slot sizes.
 * For trial phases (extralarge, hats, brightest, brightness, final), we preserve previous star outcomes.
 * For extralarge/brightest, add a 4th slot.
 * Also, reapply texture classes from the demo/free exploration phase so the machine textures are preserved.
 */
let shuffledMachines;
let randomSlotOrder;
function renderMachines() {
  const machineContainer = document.getElementById('machines-container');
  const existingOutcomes = {};

  if (phase === "demo") {
    shuffledMachines = [...MACHINES].sort(() => Math.random() - 0.5);
    const textureClasses = ['polka-dots', 'stripes', 'grid'].sort(() => Math.random() - 0.5);
    window.machineTextures = textureClasses;
    randomSlotOrder = [1, 2, 3]; // small, medium, large
  } else if (
    phase === "extralarge" ||
    phase === "hats" ||
    phase === "brightest" ||
    phase === "brightness" ||
    phase === "final"
  ) {
    shuffledMachines.forEach(machine => {
      existingOutcomes[machine] = {
        0: document.getElementById(`outcome-slot-0-${machine}`)?.innerHTML,
        1: document.getElementById(`outcome-slot-1-${machine}`)?.innerHTML,
        2: document.getElementById(`outcome-slot-2-${machine}`)?.innerHTML,
        3: document.getElementById(`outcome-slot-3-${machine}`)?.innerHTML
      };
    });
  }

  machineContainer.innerHTML = '';

  shuffledMachines.forEach((machine, index) => {
    const textureClass = window.machineTextures
      ? window.machineTextures[index % window.machineTextures.length]
      : '';
    const machineHTML = `
      <div class="machine-container" data-machine="${machine}">
        <div class="machine brightness-machine ${textureClass}" data-machine="${machine}"
             ${(phase === "extralarge" || phase === "brightest") ? 'style="width:600px;"' : ''}>
          <div class="slots">
            ${[0,1,2].map(i => `
              <div class="slot ${getSlotClass(randomSlotOrder[i])} ${i===0 ? 'darker' : i===1 ? 'medium' : 'lighter'}"
                   data-slot="${i}"
                   data-size="${getSlotClass(randomSlotOrder[i])}"
                   data-shade="${i===0 ? 'darker' : i===1 ? 'medium' : 'lighter'}"
                   ondrop="handleDrop(event, '${machine}', ${i})"
                   ondragover="handleAllowDrop(event, ${randomSlotOrder[i]})">
                <button></button>
                <div class="outcome" id="outcome-slot-${i}-${machine}">
                  ${
                    (phase === "extralarge" || phase === "hats" || phase === "brightest" || phase === "brightness" || phase === "final")
                    ? (existingOutcomes[machine]?.[i] || '')
                    : ''
                  }
                </div>
              </div>
            `).join('')}
            ${
              (phase === "extralarge" || phase === "brightest")
              ? `
                <div class="slot extralarge brightest"
                     data-slot="3"
                     data-size="extralarge"
                     data-shade="brightest"
                     ondrop="handleDrop(event, '${machine}', 3)"
                     ondragover="handleAllowDrop(event, 0)">
                  <button></button>
                  <div class="outcome" id="outcome-slot-3-${machine}">
                    ${existingOutcomes[machine]?.[3] || ''}
                  </div>
                </div>
              ` : ''
            }
          </div>
        </div>
      </div>
    `;
    machineContainer.insertAdjacentHTML('beforeend', machineHTML);
  });

  machineLayout = shuffledMachines.join(', ');
  slotLayout = randomSlotOrder.map(order => getSlotClass(order)[0].toUpperCase()).join('');

  shuffledMachines.forEach(machine => {
    slotSizeMap[machine] = {
      0: getSlotClass(randomSlotOrder[0]),
      1: getSlotClass(randomSlotOrder[1]),
      2: getSlotClass(randomSlotOrder[2]),
    };
    if (phase === "extralarge" || phase === "brightest") {
      slotSizeMap[machine][3] = getSlotClass(0);
    }
  });

  document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('dragleave', handleDragLeave);
  });
}

/**
 * Handles dragover and dragleave events.
 */
function handleAllowDrop(event) {
  event.preventDefault();
  const slot = event.target.closest('.slot');
  if (slot) { slot.classList.add('hover-enlarge'); }
}

function handleDragLeave(event) {
  const slot = event.target.closest('.slot');
  if (slot) { slot.classList.remove('hover-enlarge'); }
}

/**
 * Called when an item is dropped into a slot.
 * In brightness phase, calls adjustStarBrightness.
 */
function handleDrop(event, machine, slotIndex, demoSlot) {
  if (remainingStars <= 0) { return; } // Ensure we don't drop if no stars left
  let slot;
  if (event !== '') {
    event.preventDefault();
    slot = event.target.closest('.slot');
  } else { slot = demoSlot; }
  if (phase === "brightness") {
    adjustStarBrightness(machine, slotIndex);
    return;
  }
  const starContainer = document.querySelector('.draggable-star');
  const originalStar = starContainer?.querySelector('.star');
  if (!slot || !originalStar) { return; }
  slot.classList.remove('hover-enlarge');
  const tempStar = originalStar.cloneNode(true);
  tempStar.classList.add('fade-out');
  const slotRect = slot.getBoundingClientRect();
  tempStar.style.position = 'absolute';
  tempStar.style.left = `${slotRect.left + slotRect.width/2 - tempStar.offsetWidth/2 - 20}px`;
  tempStar.style.top = `${slotRect.top + slotRect.height/2 - tempStar.offsetHeight/2}px`;
  document.body.appendChild(tempStar);
  starContainer.style.visibility = 'hidden';
  originalStar.style.visibility = 'hidden';
  tempStar.addEventListener('animationend', () => {
    tempStar.remove();
    if (remainingStars > 0) {
      setTimeout(() => {
        originalStar.style.visibility = 'visible';
        starContainer.style.visibility = 'visible';
      }, 100);
    }
  });
  dropStars(event, machine, slotIndex);
}

/**
 * Places the item in the outcome area and logs the interaction.
 * --- MODIFIED FOR FREE EXPLORATION ---
 * In free exploration (phase "demo"), we now allow up to 3 stars per slot.
 * The size and shade of output stars in demo are now based on specific machine logic.
 */
function dropStars(event, machine, slotIndex) {
  if (event) { event.preventDefault(); }

  // Prevent dropping if there are no stars remaining.
  if (remainingStars <= 0) {
    return;
  }

  const outcomeDiv = document.getElementById(`outcome-slot-${slotIndex}-${machine}`);
  if (!outcomeDiv) {
    console.error(`No outcome container found for machine ${machine}, slot ${slotIndex}`);
    return;
  }
  // Allow a maximum of 3 stars per slot:
  if (phase === "demo" && outcomeDiv.querySelectorAll('.star').length >= 3) {
    // Slot is full—ignore this drop.
    return;
  }

  remainingStars--;
  const remainingStarsElement = document.getElementById("remainingStars");
  if (remainingStarsElement) { remainingStarsElement.innerText = remainingStars; }

  let size = '';
  let starColorClass = '';
  const slotElement = outcomeDiv.closest('.slot'); // Get the slot element

  if (phase === "demo") {
    if (machine === 'Size Machine') {
      // Size Machine: Slot size corresponds to output size, shade is random from pool
      size = slotElement.dataset.size; // Get size directly from slot's data-size
      if (sizeMachineShadePool.length > 0) {
        starColorClass = sizeMachineShadePool.pop();
      } else {
        // Fallback in case pool is empty (shouldn't happen with correct remainingStars)
        starColorClass = getRandomShade();
      }
    } else if (machine === 'Shade Machine') {
      // Shade Machine: Slot shade corresponds to output shade, size is random from pool
      starColorClass = slotElement.dataset.shade; // Get shade directly from slot's data-shade
      if (shadeMachineSizePool.length > 0) {
        size = shadeMachineSizePool.pop();
      } else {
        // Fallback in case pool is empty
        size = getRandomStarSize();
      }
    }
  } else {
    // Original logic for other phases
    switch (machine) {
      case 'Size Machine':
        size = slotSizeMap[machine][slotIndex];
        break;
      case 'Shade Machine':
        size = entropyFirstRound["Shade Machine"][slotIndex]
              ? getRandomSizeNotMatchingSlot(slotSizeMap[machine][slotIndex])
              : getRandomStarSize();
        if (entropyFirstRound["Shade Machine"][slotIndex]) {
          entropyFirstRound["Shade Machine"][slotIndex] = false;
        }
        if (slotIndex !== 3) {
          const slotHistory = entropySlotOutputs[slotIndex];
          if (slotHistory.length === 2) {
            while (size === slotHistory[0] && size === slotHistory[1]) {
              size = getRandomStarSize();
            }
            slotHistory.push(size);
          } else {
            slotHistory.push(size);
          }
        }
        break;
    }

    if (machine === 'Size Machine') {
      starColorClass = getRandomShade();
    } else if (machine === 'Shade Machine') {
      if (slotIndex === 3) {
        starColorClass = 'brightest';
      } else {
        // Use existing class logic for other phases
        if (slotElement.classList.contains('darker')) {
          starColorClass = 'darker';
        } else if (slotElement.classList.contains('medium')) {
          starColorClass = 'medium';
        } else if (slotElement.classList.contains('lighter')) {
          starColorClass = 'lighter';
        } else if (slotElement.classList.contains('brightest')) {
          starColorClass = 'brightest';
        }
      }
    }
  }

  let slotShade = "";
  if (slotElement.classList.contains("darker")) {
    slotShade = "D";
  } else if (slotElement.classList.contains("medium")) {
    slotShade = "M";
  } else if (slotElement.classList.contains("brighter")) { // Note: There is no 'brighter' class, should be 'lighter'
    slotShade = "B";
  } else if (slotElement.classList.contains("brightest")) {
    slotShade = "L";
  }
  let objectSize = size;
  // Object Shade is computed from starColorClass.
  let objectShade = "";
  if (starColorClass === "darker") {
    objectShade = "D";
  } else if (starColorClass === "medium") {
    objectShade = "M";
  } else if (starColorClass === "lighter") { // Corrected from 'brighter' to 'lighter'
    objectShade = "B";
  } else if (starColorClass === "brightest") {
    objectShade = "L";
  }

  // Adjust for special phases:
  // In hats trials, we want no object shade saved.
  if (phase === "hats") {
    objectShade = "";
  }
  // In brightness trials (if dropStars were ever used), we’d set objectSize to empty.
  if (phase === "brightness") {
    objectSize = "";
  }

  const starElement = document.createElement('span');
  starElement.textContent = phase === 'hats' ? '🎩' : '★';
  starElement.classList.add(
    'star',
    `star-size-${size}`,             // → star-size-small, etc.
    `star-brightness-${starColorClass}`  // → star-brightness-darker, etc.
  );
  setTimeout(() => {
    outcomeDiv.appendChild(starElement);

    if (phase === 'demo') {
      // In free exploration, provide feedback based on the star’s size and brightness.
      // Compare the actual star size to the default "medium"
      const sizeOrder = { small: 0, medium: 1, large: 2, extralarge: 3 };
      const expectedSize = 'medium'; // Reference for comparison
      let sizeChange = 'same';
      if (sizeOrder[size] > sizeOrder[expectedSize]) {
        sizeChange = 'bigger';
      } else if (sizeOrder[size] < sizeOrder[expectedSize]) {
        sizeChange = 'smaller';
      }

      // Compare the actual star brightness to the default "medium"
      const brightnessOrder = { 'darker': 0, 'medium': 1, 'lighter': 2, 'brightest': 3 };
      const expectedBrightness = 'medium'; // Reference for comparison
      let brightnessChange = 'same';
      if (brightnessOrder[starColorClass] > brightnessOrder[expectedBrightness]) {
        brightnessChange = 'brighter';
      } else if (brightnessOrder[starColorClass] < brightnessOrder[expectedBrightness]) {
        brightnessChange = 'darker';
      }

      verbalNarration(sizeChange, brightnessChange);
    }

  }, 700);

  // Always record reaction time in free exploration.
  reactionTimes.push(Date.now() - lastClickTime);
  lastClickTime = Date.now();

  // Pass the computed values to logInteraction.
  logInteraction(machine, slotSizeMap[machine][slotIndex], size, slotShade, objectShade, objectSize);

  if (remainingStars === 0) {
    document.getElementById('why-section').style.display = 'block';
    document.getElementById("continue-button").style.display = "block";
  }
}

function adjustStarBrightness(machine, slotIndex) {
  const outcomeDiv = document.getElementById(`outcome-slot-${slotIndex}-${machine}`);
  reactionTimes.push(Date.now() - lastClickTime);
  lastClickTime = Date.now();

  // 1) Compute brightnessLevel
  let brightnessLevel = 0;
  if (machine === "Size Machine") {
    brightnessLevel = Math.floor(Math.random() * 3) + 1;
  } else if (machine === "Shade Machine") {
    const slotSize = slotSizeMap[machine][slotIndex];
    if (slotSize === "small") {
      brightnessLevel = 3; // bright
    } else if (slotSize === "medium") {
      brightnessLevel = 2; // sort-of-dark
    } else if (slotSize === "large") {
      brightnessLevel = 1; // dark
    } else {
      brightnessLevel = 2; // fallback
    }
  }

  // 2) Determine slotShade
  const slotEl = outcomeDiv ? outcomeDiv.closest('.slot') : null;
  let slotShade = "";
  if (slotEl?.classList.contains("darker")) {
    slotShade = "D";
  } else if (slotEl?.classList.contains("medium")) {
    slotShade = "M";
  } else if (slotEl?.classList.contains("brighter")) {
    slotShade = "B";
  } else if (slotEl?.classList.contains("brightest")) {
    slotShade = "L";
  }

  // 3) Determine objectShade from brightnessLevel
  let objectShade = "";
  if (brightnessLevel === 1) {
    objectShade = "D";
  } else if (brightnessLevel === 2) {
    objectShade = "M";
  } else if (brightnessLevel === 3) {
    objectShade = "B";
  } else if (brightnessLevel === 4) {
    objectShade = "L";
  }

  // 4) For brightness, objectSize is empty
  let objectSize = "";

  // 5) Actually place the lightbulb in the slot
  const lightbulbImg = document.createElement("img");
  lightbulbImg.style.width = "60px";
  lightbulbImg.style.height = "auto";
  if (brightnessLevel === 1) { lightbulbImg.src = "imgs/lightbulb1.png"; }
  else if (brightnessLevel === 2) { lightbulbImg.src = "imgs/lightbulb2.png"; }
  else { lightbulbImg.src = "imgs/lightbulb3.png"; }
  setTimeout(() => { outcomeDiv.appendChild(lightbulbImg); }, 700);

  // 6) Log the interaction with new params
  logInteraction(
    machine,
    slotSizeMap[machine][slotIndex],    // slotSize
    brightnessLevel.toString(),         // starSize param is brightness
    slotShade,                          // new param
    objectShade,                        // new param
    objectSize                          // new param
  );

  remainingStars--;
  if (remainingStars === 0) {
    document.getElementById("star").style.display = "none";
    document.getElementById('why-section').style.display = 'block';
    document.getElementById("continue-button").style.display = "block";
  }
}

/**
 * Prepares the comprehension phase.
 */
function gatherAllOutcomesFromMachine(machineName) {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.margin = '10px';

  for (let slotId = 0; slotId < 4; slotId++) {
    const outcomeDiv = document.getElementById(`outcome-slot-${slotId}-${machineName}`);
    if (!outcomeDiv) continue;
    const clone = outcomeDiv.cloneNode(true);
    clone.style.margin = '5px';
    container.appendChild(clone);
  }
  return container;
}

function prepareComprehension() {
  const elementsToHide = ["drag-instruction", "continue-button", "playing-text", "finish-text", "star"];
  elementsToHide.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
  document.querySelectorAll('.machine').forEach(machine => {
    machine.onclick = () => { handleMachineClick(machine.getAttribute('data-machine'), comprehensiveQuestionIndex); };
  });
  document.querySelector(".machines-container").classList.add("is-question-phase");
  startComprehensionQuestions();
}

/**
 * Starts comprehension questions.
 */
function startComprehensionQuestions() {
  phase = "comprehension";
  verbalNarration();
  document.getElementById('why-section').style.display = 'none';
  const leftMachine = shuffledMachines[0];
  const rightMachine = shuffledMachines[1];
  window.leftMachineOutcomes = gatherAllOutcomesFromMachine(leftMachine);
  window.rightMachineOutcomes = gatherAllOutcomesFromMachine(rightMachine);
  comprehensiveQuestionIndex = 0;
  showNextOutcomeContainer();
}

/**
 * Moves to next outcome in comprehension.
 */
function showNextOutcomeContainer() {
  const topOutcomesContainer = document.getElementById("top-outcomes-container");
  topOutcomesContainer.innerHTML = "";
  if (comprehensiveQuestionIndex === 0) {
    topOutcomesContainer.appendChild(window.leftMachineOutcomes);
    document.querySelector(".remaining-stars").innerHTML =
      "Remember the stars you made from the machines? Which machine made these stars?";
  }
  else if (comprehensiveQuestionIndex === 1) {
    topOutcomesContainer.appendChild(window.rightMachineOutcomes);
    document.querySelector(".remaining-stars").innerHTML =
      "Remember the stars you made from the machines? Which machine made these stars?";
  }
  else {
    endComprehensionQuestions();
    return;
  }
  document.getElementById("continue-button").style.display = "none";
  verbalNarration();
  document.querySelector(".machines-container").classList.add("is-question-phase");
  document.querySelectorAll('.machine').forEach(machineEl => {
    machineEl.onclick = () => {
      handleMachineClick(machineEl.getAttribute('data-machine'), comprehensiveQuestionIndex);
    };
  });
}

/**
 * Handles machine click events in comprehension or extra phases.
 */
function handleMachineClick(machine, machineType) {
  reactionTimes.push(Date.now() - lastClickTime);
  lastClickTime = Date.now();
  const correctMachine = shuffledMachines[machineType];
  let correctness = (machine === correctMachine) ? "Correct" : "Incorrect";
  document.getElementById('why-section').style.display = 'block';
  document.getElementById("continue-button").style.display = "block";
  logMachineChoice(machine, correctness);
  document.querySelector(".machines-container").classList.remove("is-question-phase");
  document.querySelectorAll('.machine').forEach(m => {
    m.onclick = null;
  });
  comprehensiveQuestionIndex++;
}

function endComprehensionQuestions() {
  document.getElementById("top-outcomes-container").innerHTML = "";
  if (Math.random() < 0.5) {
    // overallPhaseOrder = ["extralarge", "hats", "brightest", "brightness", "final"];
    overallPhaseOrder = ["hats", "extralarge","brightness", "brightest",  "final"];
  } else {
    // overallPhaseOrder = ["brightest", "brightness", "extralarge", "hats", "final"];
    overallPhaseOrder = ["brightness", "brightest", "hats", "extralarge", "final"];
  }
  console.log(overallPhaseOrder)
  overallPhaseIndex = 0;
  phase = overallPhaseOrder[overallPhaseIndex];
  // if (phase === "extralarge") {
  //   startLargeExperiment();
  // } else {
  //   startBrightExperiment();
  // }
  if (phase === "hats") {
    startHatsExperiment();
  } else {
    startBrightnessExperiment();
  }
}

/**
 * SIZE PHASES
 */
function startLargeExperiment() {
  phase = "extralarge";
  console.log("extralarge phase");
  // verbalNarration('largeExperiment');
  remainingStars = 1;
  renderMachines();
  document.getElementById("instruction-text").innerText = smallExperimentQuestion;
  const playingText = document.getElementById("playing-text");
  playingText.style.display = "block";
  playingText.innerHTML = `
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 5px;">
  <span class="star star-size-medium star-brightness-medium">★</span>
  <span class="arrow">→</span>
  <span class="star star-size-extralarge star-brightness-brightest">★</span>
  <span class="star star-size-extralarge star-brightness-lighter">★</span>
  <span class="star star-size-extralarge star-brightness-medium">★</span>
  <span class="star star-size-extralarge star-brightness-darker">★</span>
  </div>
  <div class="star-caption">Make the biggest star — it can be bright or dark or in-between!</div>
  `;
  const starElement = document.getElementById("star");
  starElement.style.display = "block";
  starElement.style.visibility = "visible";
  starElement.innerHTML = '<span class="star star-size-medium star-brightness-medium">★</span>';
  ["drag-instruction","finish-text"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

/**
 * HATS PHASE: 2 trials.
 */
function startHatsExperiment() {
  phase = "hats";
  console.log("hats phase");
  hatsQuestionIndex = 0;
  displayHatsExploration();
}

function displayHatsExploration() {
  // Exploration trial for hats.
  hatsQuestionIndex = -1;
  remainingStars = 2; // allow 2 hats to be dropped
  renderMachines();
  document.getElementById("instruction-text").innerText =
    "Now you are in a hat factory. This factory makes big hats and small hats. You have two hats to try out - drop them into any machine you like and see what they do! But... only one of the machines is really good at changing hat sizes. Can you figure out which one?";

  const playingText = document.getElementById("playing-text");
  playingText.style.display = "block";
  playingText.innerHTML = `<div class="star-caption">Drop the hats anywhere you want!</div>`;

  const starElement = document.getElementById("star");
  starElement.style.display = "block";
  starElement.style.visibility = "visible";

  starElement.setAttribute('draggable', 'true');
  starElement.classList.add('draggable-star');
  starElement.innerHTML = '<span class="star star-size-medium star-brightness-medium">🎩</span>';
}

function displayNextHatsQuestion() {
  // Remove hat/lightbulb outputs (preserve free exploration stars)
  document.querySelectorAll('.slot .outcome .star, .slot .outcome img').forEach(el => {
    if ((el instanceof HTMLSpanElement && el.innerHTML.includes("🎩")) ||
        (el instanceof HTMLImageElement && el.src.includes("lightbulb"))) {
      el.remove();
    }
  });

  if (hatsQuestionIndex < hatQuestions.length) {
    remainingStars = 1;
    renderMachines();
    document.getElementById("instruction-text").innerText = hatQuestions[hatsQuestionIndex];
    currentQuestionText = hatQuestions[hatsQuestionIndex];
    const playingText = document.getElementById("playing-text");
    playingText.style.display = "block";
    let circledHatHTML = "";
    if (hatsQuestionIndex === 0) {
      circledHatHTML = `
        <div style="border: 2px dashed black; border-radius: 50%; padding: 5px;">
          <span class="star large" style="font-size:90px;">🎩</span>
        </div>
      `;
    } else {
      circledHatHTML = `
        <div style="border: 2px dashed black; border-radius: 50%; padding: 5px;">
          <span class="star small" style="font-size:24px;">🎩</span>
        </div>
      `;
    }
    playingText.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 5px;">
        <span class="star star-size-medium star-brightness-medium" style="font-size:52px;">🎩</span>
        <span class="arrow">→</span>
        ${circledHatHTML}
      </div>
      <div class="star-caption">
        Place exactly 1 hat!
      </div>
    `;
    const starElement = document.getElementById("star");
    starElement.style.display = "block";
    starElement.style.visibility = "visible";
    starElement.innerHTML = '<span class="star star-size-medium star-brightness-medium">🎩</span>';
    ["drag-instruction", "finish-text"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
  }
  else {
    hatsQuestionIndex = 0;
    overallPhaseIndex++;
    if (overallPhaseOrder[overallPhaseIndex] !== "final") {
      phase = overallPhaseOrder[overallPhaseIndex];
      if (phase === "extralarge") { startLargeExperiment(); }
      else if (phase === "hats") { startHatsExperiment(); }
      else if (phase === "brightest") { startBrightExperiment(); }
      else if (phase === "brightness") { startBrightnessExperiment(); }
    } else {
      phase = "final";
      finalQuestionIndex = 0;
      displayNextFinalQuestion();
    }
  }
}

/**
 * BRIGHTEST PHASE (for lightbulb output in Shade Machine)
 */
function startBrightExperiment() {
  phase = "brightest";
  console.log("brightest phase");
  document.querySelectorAll('.slot.extralarge .outcome').forEach(outcome => { outcome.innerHTML = ""; });
  // verbalNarration('brightest');
  remainingStars = 1;
  renderMachines();
  document.getElementById("instruction-text").innerText =
    "Now there is a new slot on the right. The elf boss wants the brightest star for his baby. Which slot will you use?";
  const playingText = document.getElementById("playing-text");
  playingText.style.display = "block";
  playingText.innerHTML = `
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 5px;">
  <span class="star star-size-medium star-brightness-medium">★</span>
  <span class="arrow">→</span>
   <span class="star star-size-extralarge star-brightness-brightest">★</span>
   <span class="star star-size-medium    star-brightness-brightest">★</span>
   <span class="star star-size-large     star-brightness-brightest">★</span>
   <span class="star star-size-small     star-brightness-brightest">★</span>
  </div>
  <div class="star-caption">Make the brightest star – it can be big or small or in-between!</div>
  `;
  const starElement = document.getElementById("star");
  starElement.style.display = "block";
  starElement.style.visibility = "visible";
  starElement.innerHTML = '<span class="star star-size-medium star-brightness-medium">★</span>';
  ["drag-instruction", "finish-text"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

/**
 * BRIGHTNESS PHASE: 2 trials.
 */
function startBrightnessExperiment() {
  phase = "brightness";
  console.log("brightness phase");
  brightnessQuestionIndex = 0;
  displayBrightnessExploration();
}

function displayBrightnessExploration() {
  // Use brightnessQuestionIndex = -1 to indicate exploration trial.
  brightnessQuestionIndex = -1;
  remainingStars = 2; // allow 2 lightbulbs to be dropped
  renderMachines();
  document.getElementById("instruction-text").innerText =
    "Now you are in a lightbulb factory. This factory makes bright and dark lightbulbs. You have two lightbulbs to try out - drop them into any machine you like and see what they do! But... only one of the machines is really good at changing how bright the lightbulbs are. Can you figure out which one?";

  const playingText = document.getElementById("playing-text");
  playingText.style.display = "block";
  playingText.innerHTML = `<div class="star-caption">Drop the lightbulbs anywhere you want!</div>`;

  const starElement = document.getElementById("star");
  starElement.style.display = "block";
  starElement.style.visibility = "visible";
  starElement.innerHTML = `<img src="imgs/lightbulb2.png" style="width:60px;height:auto;" />`;
}

function displayNextBrightnessQuestion() {
  // Remove previous lightbulb outputs (only images) but preserve free exploration stars
  document.querySelectorAll('.slot .outcome img').forEach(img => {
    if (img.src.includes("lightbulb")) { img.remove(); }
  });
  if (brightnessQuestionIndex < brightnessQuestions.length) {
    remainingStars = 1;
    renderMachines();
    document.getElementById("instruction-text").innerText = brightnessQuestions[brightnessQuestionIndex];
    currentQuestionText = brightnessQuestions[brightnessQuestionIndex];
    const playingText = document.getElementById("playing-text");
    playingText.style.display = "block";
    let circledOutputHTML = "";
    if (brightnessQuestionIndex === 0) {
      circledOutputHTML = `
        <div style="border: 2px dashed black; border-radius: 50%; padding: 5px;">
          <img src="imgs/lightbulb1.png" style="width:60px;height:auto;" />
        </div>
      `;
    } else {
      circledOutputHTML = `
        <div style="border: 2px dashed black; border-radius: 50%; padding: 5px;">
          <img src="imgs/lightbulb3.png" style="width:60px;height:auto;" />
        </div>
      `;
    }
    playingText.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 5px;">
        <img src="imgs/lightbulb2.png" style="width:60px;height:auto;" />
        <span class="arrow">→</span>
        ${circledOutputHTML}
      </div>
      <div class="star-caption">Place exactly 1 lightbulb!</div>
    `;
    const starElement = document.getElementById("star");
    starElement.style.display = "block";
    starElement.style.visibility = "visible";
    starElement.innerHTML = `<img src="imgs/lightbulb2.png" style="width:60px;height:auto;" />`;
    ["drag-instruction", "finish-text"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
  }
  else {
    brightnessQuestionIndex = 0;
    overallPhaseIndex++;
    if (overallPhaseOrder[overallPhaseIndex] !== "final") {
      phase = overallPhaseOrder[overallPhaseIndex];
      if (phase === "extralarge") { startLargeExperiment(); }
      else if (phase === "hats") { startHatsExperiment(); }
      else if (phase === "brightest") { startBrightExperiment(); }
      else if (phase === "brightness") { startBrightnessExperiment(); }
    } else {
      phase = "final";
      finalQuestionIndex = 0;
      displayNextFinalQuestion();
    }
  }
}

/**
 * FINAL PHASE: Children choose a machine.
 */
function handleFinalChoice(machine) {
  reactionTimes.push(Date.now() - lastClickTime);
  lastClickTime = Date.now();
  logMachineChoice(machine, "");
  document.getElementById('why-section').style.display = 'block';
  document.getElementById("continue-button").style.display = "block";
}

function displayNextFinalQuestion() {
  if (finalQuestionIndex < finalQuestions.length) {
    remainingStars = 1;
    renderMachines();
    document.getElementById("instruction-text").innerText = finalQuestions[finalQuestionIndex];
    currentQuestionText = finalQuestions[finalQuestionIndex];
    const playingText = document.getElementById("playing-text");
    playingText.style.display = "block";
    playingText.innerHTML = `<div class="star-caption">Click on the machine you choose.</div>`;
    document.getElementById("star").style.display = "none";
    document.querySelectorAll('.machine').forEach(machine => {
      machine.onclick = () => { handleFinalChoice(machine.getAttribute('data-machine')); };
    });
  } else {
    saveCSV();
    showScreen("thank-you");
  }
}

/**
 * Disables user interaction.
 */
function disableUserInteraction() {
  const overlay = document.createElement('div');
  overlay.id = 'interaction-blocker';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.zIndex = 999999;
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  overlay.style.pointerEvents = 'auto';
  document.body.appendChild(overlay);
}

/**
 * Re‐enables user interaction.
 */
function enableUserInteraction() {
  const overlay = document.getElementById('interaction-blocker');
  if (overlay) { overlay.remove(); }
}

/**
 * Animates the cursor.
 */
function animateCursorPath(fakeCursor, fromX, fromY, toX, toY, steps) {
  return new Promise((resolve) => {
    let stepCount = 0;
    const stepX = (toX - fromX) / steps;
    const stepY = (toY - fromY) / steps;
    function step() {
      stepCount++;
      const cursorX = fromX + stepX * stepCount;
      const cursorY = fromY + stepY * stepCount;
      setPosition(fakeCursor, cursorX, cursorY);
      if (stepCount < steps) { requestAnimationFrame(step); }
      else { resolve(); }
    }
    requestAnimationFrame(step);
  });
}

/**
 * Returns a promise that resolves after a delay.
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sets absolute position.
 */
function setPosition(el, x, y) {
  el.style.left = x + 'px';
  el.style.top = y + 'px';
}

/**
 * (Optional) The original runDemo function is no longer needed
 * because the demo phase now supports free exploration.
 * You may remove or comment it out.
 */

// function runDemo() {
//   // Original automated demo code – no longer used in free exploration.
// }

function getCurrentQuestionText() {
  if (phase === "comprehension") {
    return comprehensionQuestion;
  } else if (phase === "extralarge") {
    return smallExperimentQuestion;
  } else if (phase === "hats") {
    return hatQuestions[hatsQuestionIndex] || "";
  } else if (phase === "brightest") {
    return "Make the brightest star – it can be big or small or in-between!";
  } else if (phase === "brightness") {
    return brightnessQuestions[brightnessQuestionIndex] || "";
  } else if (phase === "final") {
    return finalQuestions[finalQuestionIndex] || "";
  }
  return "";
}

/**
 * Logs interaction details.
 */
function logInteraction(machine, slotSize, starSize, slotShade, objectShade, objectSize) {
  let trialNumber;
  switch (phase) {
    case "extralarge":  trialNumber = ++extralargeTrial;  break;
    case "hats":        trialNumber = ++questionTrial;    break;
    case "brightness":  trialNumber = ++lightnessTrial;   break;
    case "final":       trialNumber = ++questionTrial;    break;
  }

  const currentQuestion = getCurrentQuestionText();

  interactionLogs.push({
    prolificId: prolificId,
    age: age,
    sex: sex,
    machineOrder: machineLayout,
    slotLayout: slotLayout,
    colorOrder: '',
    phase: phase.charAt(0).toUpperCase() + phase.slice(1),
    trial: currentQuestion,
    machine: machine,
    slotSize: slotSize,
    objectSize: objectSize,
    slotShade: slotShade,
    objectShade: objectShade,
    reactionTime: reactionTimes[reactionTimes.length - 1],
    correctMachine: '',
    explanation: ''
  });
}

/**
 * Logs machine choice interactions.
 */
function logMachineChoice(machine, correctness) {
  let currentQuestion = getCurrentQuestionText();
  interactionLogs.push({
    prolificId: prolificId,
    age: age,
    sex: sex,
    machineOrder: machineLayout,
    slotLayout: slotLayout,
    colorOrder: '',
    phase: phase.charAt(0).toUpperCase() + phase.slice(1),
    trial: currentQuestion,
    machine: machine,
    slotSize: '',
    starSize: '',
    reactionTime: reactionTimes[reactionTimes.length - 1],
    correctMachine: correctness,
    explanation: ''
  });
}

/**
 * Log child reasoning if provided.
 */
function logExplanation() {
  interactionLogs.push({
    prolificId: prolificId,
    age: age,
    sex: sex,
    machineOrder: machineLayout,
    slotLayout: slotLayout,
    colorOrder: '',
    phase: phase.charAt(0).toUpperCase() + phase.slice(1),
    trial: '',
    machine: '',
    slotSize: '',
    starSize: '',
    reactionTime: '',
    correctMachine: '',
    explanation: childExplanation
  });
}

/**
 * Saves the experiment data to a Google Sheets spreadsheet.
 */
function saveCSV() {
  const headers = [
    "Prolific ID",
    "Age",
    "Sex",
    "Machine Order (L->R)",
    "Slot Layout Order (L->R)",
    "Color Order (L->R)",
    "Phase",
    "Trial",
    "Machine",
    "Slot Size",
    "Object Size",
    "Slot Shade",
    "Object Shade",
    "Reaction Time (ms)",
    "Correct Machine",
    "Explanation"
  ];

  const processedLogs = interactionLogs.reduce((mergedLogs, currentLog) => {
    if (currentLog.explanation && currentLog.explanation.trim() !== "") {
      const previousLog = mergedLogs[mergedLogs.length - 1];
      if (previousLog) {
        previousLog.explanation = currentLog.explanation;
      }
    } else {
      mergedLogs.push(currentLog);
    }
    return mergedLogs;
  }, []);

  const rows = processedLogs.length
    ? processedLogs.map(log => [
        log.prolificId,
        log.age,
        log.sex,
        log.machineOrder,
        log.slotLayout,
        log.colorOrder || '',
        log.phase,
        log.trial,
        log.machine,
        log.slotSize,
        log.objectSize,
        log.slotShade,
        log.objectShade,
        log.reactionTime,
        log.correctMachine,
        log.explanation
      ])
    : [[prolificId, age, sex, ...Array(13).fill("")]]; // 16 cells in total

  const csvContent = [headers, ...rows];

  fetch('https://us-central1-goog24-02.cloudfunctions.net/saveToNewSheet', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ participantID: prolificId, data: csvContent })
  })
  .then(response => !response.ok ? response.text().then(text => { throw new Error(text) }) : response.json())
  .then(() => alert("Data saved successfully!"))
  .catch(error => {
    console.error('Error saving data:', error.message);
    alert("Error saving data: " + error.message);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const quitBtn = document.getElementById('quit-button');
  // hide initially
  quitBtn.style.display = 'none';

  // wire up click → save + jump to thank-you
  quitBtn.addEventListener('click', () => {
    saveCSV();
    showScreen('thank-you');
  });

  // wrap showScreen to toggle quitBtn only on the "experiment" screen
  const _origShow = window.showScreen;
  window.showScreen = function(screenId) {
    _origShow(screenId);
    quitBtn.style.display = (screenId === 'experiment') ? 'block' : 'none';
  };
});