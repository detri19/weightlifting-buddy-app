// Data: beginner-friendly exercise library with cues and substitutions
const EXERCISES = {
	upper: [
		{ name: 'Dumbbell Bench Press', cues: 'Elbows 45°, shoulder blades back and down.', alt: 'Push-ups on knees' },
		{ name: 'Seated Row (Cable/Band)', cues: 'Chest tall, pull to ribs, control return.', alt: 'Band row' },
		{ name: 'Dumbbell Shoulder Press', cues: 'Brace core, press up, avoid shrugging.', alt: 'Arnold press light' },
		{ name: 'Lat Pulldown/Assisted Pull-up', cues: 'Pull elbows to back pockets.', alt: 'Band pulldown' },
		{ name: 'Dumbbell Curl', cues: 'Elbows stay by sides, slow down.', alt: 'Band curl' },
		{ name: 'Triceps Rope Pushdown', cues: 'Elbows pinned, finish with straight arms.', alt: 'Overhead DB extension' }
	],
	lower: [
		{ name: 'Goblet Squat', cues: 'Feet shoulder-width, sit between hips.', alt: 'Box squat' },
		{ name: 'Romanian Deadlift (DB/BB)', cues: 'Hinge at hips, soft knees, flat back.', alt: 'Hip hinge with dowel' },
		{ name: 'Glute Bridge/Hip Thrust', cues: 'Ribs down, squeeze glutes at top.', alt: 'Bodyweight bridge' },
		{ name: 'Lunge or Split Squat', cues: 'Long stride, front knee tracks toes.', alt: 'Assisted split squat' },
		{ name: 'Leg Press', cues: 'Full foot on plate, control depth.', alt: 'Wall sit' },
		{ name: 'Calf Raises', cues: 'Slow up/down, pause at top.', alt: 'Seated calf raise' }
	],
	full: [
		{ name: 'Dead Bug', cues: 'Low back gently pressed to floor.', alt: 'Tabletop march' },
		{ name: 'Plank', cues: 'Ribs down, squeeze glutes.', alt: 'Knees-down plank' },
		{ name: 'Farmer Carry', cues: 'Tall posture, smooth steps.', alt: 'Single-arm carry' },
		{ name: 'Bird Dog', cues: 'Reach long, keep hips level.', alt: 'Hands-and-knees holds' }
	]
};

// UI section toggles
function showWelcome() {
	document.getElementById('welcomeSection').style.display = '';
	document.getElementById('goalFormSection').style.display = 'none';
	document.getElementById('workoutSection').style.display = 'none';
	document.getElementById('timerSection').style.display = 'none';
}

function showGoalForm() {
	document.getElementById('welcomeSection').style.display = 'none';
	document.getElementById('goalFormSection').style.display = '';
	document.getElementById('workoutSection').style.display = 'none';
	document.getElementById('timerSection').style.display = 'none';
}

function showWorkout() {
	document.getElementById('welcomeSection').style.display = 'none';
	document.getElementById('goalFormSection').style.display = 'none';
	document.getElementById('workoutSection').style.display = '';
	document.getElementById('timerSection').style.display = 'none';
}

function showTimer() {
	document.getElementById('welcomeSection').style.display = 'none';
	document.getElementById('goalFormSection').style.display = 'none';
	document.getElementById('workoutSection').style.display = 'none';
	document.getElementById('timerSection').style.display = '';
}

// Helpers
function getCheckedValues(name) {
	return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
}

function getRadioValue(name) {
	const el = document.querySelector(`input[name="${name}"]:checked`);
	return el ? el.value : null;
}

// Routine generation
function generateRoutine({ experience, goals, frequency, sessionLength, equipment, intensity }) {
	const daysPerWeek = Number(frequency);
	const isShort = Number(sessionLength) <= 30;
	const isGentle = intensity === 'gentle';

	// Choose split: 2d = full body A/B, 3-4d = upper/lower, 5d = UL + accessories
	let plan = [];
	if (daysPerWeek <= 2) {
		plan = ['Full A', 'Full B'].slice(0, daysPerWeek);
	} else if (daysPerWeek <= 4) {
		plan = Array.from({ length: daysPerWeek }, (_, i) => (i % 2 === 0 ? 'Upper' : 'Lower'));
	} else {
		plan = ['Upper', 'Lower', 'Upper', 'Lower', 'Full Core'];
	}

	// Base sets/reps
	const baseReps = isGentle ? 8 : (isShort ? 10 : 12);
	const baseSets = isGentle ? 2 : (isShort ? 2 : 3);

	// Exercise counts per session
	const mainCount = isShort ? 3 : 4;
	const accessoryCount = isShort ? 1 : 2;

	function pick(list, n) {
		const copy = [...list];
		const out = [];
		while (copy.length && out.length < n) {
			const idx = Math.floor(Math.random() * copy.length);
			out.push(copy.splice(idx, 1)[0]);
		}
		return out;
	}

	function buildDay(type, index) {
		let blocks = [];
		if (type.startsWith('Upper')) {
			blocks = [
				...pick(EXERCISES.upper, mainCount),
				...pick(EXERCISES.full, accessoryCount)
			];
		} else if (type.startsWith('Lower')) {
			blocks = [
				...pick(EXERCISES.lower, mainCount),
				...pick(EXERCISES.full, accessoryCount)
			];
		} else {
			blocks = [
				...pick([...EXERCISES.upper, ...EXERCISES.lower], mainCount),
				...pick(EXERCISES.full, accessoryCount)
			];
		}

		return {
			title: `${type} Day ${index + 1}`,
			items: blocks.map(b => ({
				name: b.name,
				reps: baseReps,
				sets: baseSets,
				restSec: isGentle ? 90 : 60,
				cues: b.cues,
				alt: b.alt
			}))
		};
	}

	const program = plan.map((type, i) => buildDay(type, i));
	return program;
}

// Render routine
function renderRoutine(program) {
	const container = document.getElementById('workoutContainer');
	container.innerHTML = '';

	program.forEach((day, di) => {
		const dayEl = document.createElement('div');
		dayEl.className = 'workout-day';
		dayEl.innerHTML = `
			<h3>${day.title}</h3>
		`;

		day.items.forEach((ex, ei) => {
			const row = document.createElement('div');
			row.className = 'exercise';
			row.innerHTML = `
				<div class="exercise-info">
					<h4>${ex.name}</h4>
					<p>${ex.cues} <em>(Alt: ${ex.alt})</em></p>
				</div>
				<div class="exercise-details">${ex.sets} x ${ex.reps} • Rest ${ex.restSec}s</div>
			`;
			dayEl.appendChild(row);
		});

		container.appendChild(dayEl);
	});
}

// Timer logic
let timerInterval = null;
let remaining = 0;
let total = 0;
let currentExerciseIndex = 0;
let flatExercises = [];

function startWorkout() {
	// Flatten exercises for the timer sequence
	const programEls = document.querySelectorAll('.workout-day');
	flatExercises = [];
	programEls.forEach(day => {
		const rows = day.querySelectorAll('.exercise');
		rows.forEach(r => {
			const title = r.querySelector('h4').textContent;
			const details = r.querySelector('.exercise-details').textContent;
			const restSec = Number((details.match(/Rest (\d+)/) || [0, 60])[1]);
			flatExercises.push({ title, duration: restSec });
		});
	});

	currentExerciseIndex = 0;
	showTimer();
	loadExercise(currentExerciseIndex);
}

function loadExercise(i) {
	const exercise = flatExercises[i];
	if (!exercise) {
		// Finished
		document.getElementById('currentExercise').textContent = 'Workout Complete! 🎉';
		document.getElementById('exerciseInstructions').textContent = 'Great job! Walk, stretch, hydrate.';
		document.getElementById('progressText').textContent = `All done`;
		updateProgress(1);
		clearInterval(timerInterval);
		return;
	}

	document.getElementById('currentExercise').textContent = exercise.title;
	document.getElementById('exerciseInstructions').textContent = 'Perform set with good form, then rest.';
	document.getElementById('progressText').textContent = `Exercise ${i + 1} of ${flatExercises.length}`;

	total = exercise.duration;
	remaining = total;
	updateTimerDisplay();
	updateProgress(0);

	const startBtn = document.getElementById('startTimer');
	const pauseBtn = document.getElementById('pauseTimer');
	startBtn.disabled = false;
	pauseBtn.disabled = true;

	startBtn.onclick = () => startTimer();
	pauseBtn.onclick = () => pauseTimer();
	document.getElementById('resetTimer').onclick = () => resetTimer();
}

function startTimer() {
	if (timerInterval) return;
	const startBtn = document.getElementById('startTimer');
	const pauseBtn = document.getElementById('pauseTimer');
	startBtn.disabled = true;
	pauseBtn.disabled = false;

	timerInterval = setInterval(() => {
		remaining -= 1;
		if (remaining <= 0) {
			clearInterval(timerInterval);
			timerInterval = null;
			nextExercise();
			return;
		}
		updateTimerDisplay();
		updateProgress(1 - remaining / total);
	}, 1000);
}

function pauseTimer() {
	if (!timerInterval) return;
	clearInterval(timerInterval);
	timerInterval = null;
	document.getElementById('startTimer').disabled = false;
	document.getElementById('pauseTimer').disabled = true;
}

function resetTimer() {
	pauseTimer();
	remaining = total;
	updateTimerDisplay();
	updateProgress(0);
}

function nextExercise() {
	currentExerciseIndex += 1;
	loadExercise(currentExerciseIndex);
}

function updateTimerDisplay() {
	const m = String(Math.floor(remaining / 60)).padStart(2, '0');
	const s = String(remaining % 60).padStart(2, '0');
	document.getElementById('timerDisplay').textContent = `${m}:${s}`;
}

function updateProgress(pct) {
	document.getElementById('progressFill').style.width = `${Math.max(0, Math.min(100, pct * 100))}%`;
}

// Handle form submission
window.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('goalForm');
	if (!form) return;

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const experience = document.getElementById('experience').value;
		const frequency = document.getElementById('frequency').value;
		const sessionLength = document.getElementById('sessionLength').value;
		const goals = getCheckedValues('goals');
		const equipment = getCheckedValues('equipment');
		const intensity = getRadioValue('intensity') || 'gentle';

		const program = generateRoutine({ experience, goals, frequency, sessionLength, equipment, intensity });
		renderRoutine(program);
		showWorkout();
	});

	// Initial screen: welcome
	showWelcome();
});

