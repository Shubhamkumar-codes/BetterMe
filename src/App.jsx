import { useState, useEffect, useCallback } from "react";

const TODAY = new Date().toISOString().split("T")[0];
const STORAGE_KEY = "transform-tracker-v2";

// ── Storage Helper (localStorage instead of Claude's window.storage) ──
const storage = {
  get(key) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  },
};

// ── Data ──────────────────────────────────────────────────────────────
const WORKOUT_PLAN = {
  "Day 1 — Push + Core": {
    emoji: "🔥",
    focus: "Chest, Shoulders, Triceps + Core Stability",
    warmup: "5 min incline walk → Band pull-aparts × 15 → Cat-Cow × 10 → Pelvic tilts × 10",
    exercises: [
      { name: "Flat Barbell Bench Press", sets: "4×8-10", note: "Brace core tight, feet flat" },
      { name: "Incline Dumbbell Press", sets: "3×10-12", note: "30° incline, squeeze at top" },
      { name: "Overhead Press (Seated)", sets: "4×8-10", note: "Seated to protect lumbar" },
      { name: "Cable Lateral Raises", sets: "3×12-15", note: "Slow negatives" },
      { name: "Tricep Rope Pushdown", sets: "3×12-15", note: "Elbows pinned" },
      { name: "Overhead Tricep Extension", sets: "3×10-12", note: "Cable or dumbbell" },
      { name: "Dead Bug", sets: "3×10/side", note: "⭐ Key for lumbar — press lower back into floor" },
      { name: "Pallof Press", sets: "3×10/side", note: "⭐ Anti-rotation core stability" },
      { name: "Plank (Front)", sets: "3×30-45s", note: "Squeeze glutes, neutral spine" },
    ],
    cooldown: "Chest doorway stretch 30s/side → Shoulder cross-body 30s → Cat-Cow × 8",
  },
  "Day 2 — Pull + Core": {
    emoji: "💪",
    focus: "Back, Biceps, Rear Delts + Core Stability",
    warmup: "5 min rowing → Band dislocates × 12 → Cat-Cow × 10 → Bird Dog × 8/side",
    exercises: [
      { name: "Barbell Bent-Over Row", sets: "4×8-10", note: "Hinge at hips, brace core hard" },
      { name: "Lat Pulldown (Wide Grip)", sets: "3×10-12", note: "Drive elbows down" },
      { name: "Seated Cable Row", sets: "3×10-12", note: "Squeeze shoulder blades" },
      { name: "Face Pulls", sets: "3×15-20", note: "⭐ Posture correction essential" },
      { name: "Barbell Bicep Curl", sets: "3×10-12", note: "No swinging" },
      { name: "Hammer Curls", sets: "3×10-12", note: "Forearm + brachialis" },
      { name: "Bird Dog", sets: "3×10/side", note: "⭐ Lumbar stability — slow & controlled" },
      { name: "Dead Bug (Weighted)", sets: "3×8/side", note: "Hold light dumbbell" },
      { name: "Side Plank", sets: "3×20-30s/side", note: "Stack hips, don't sag" },
    ],
    cooldown: "Lat stretch 30s/side → Child's pose 45s → Thoracic rotation × 8/side",
  },
  "Day 3 — Legs + Flexibility": {
    emoji: "🦵",
    focus: "Quads, Hamstrings, Glutes + Flexibility",
    warmup: "5 min bike → Bodyweight squats × 15 → Hip circles × 10/side → Glute bridges × 12",
    exercises: [
      { name: "Barbell Back Squat", sets: "4×8-10", note: "Box squat if lumbar discomfort, brace core" },
      { name: "Romanian Deadlift", sets: "4×8-10", note: "⭐ Hamstrings + glutes, hinge pattern" },
      { name: "Leg Press", sets: "3×10-12", note: "Don't round lower back at bottom" },
      { name: "Walking Lunges", sets: "3×10/leg", note: "Upright torso" },
      { name: "Leg Curl Machine", sets: "3×12-15", note: "Slow eccentric" },
      { name: "Hip Thrust (Barbell)", sets: "4×10-12", note: "⭐ Top priority for lumbar support" },
      { name: "Calf Raises", sets: "4×15-20", note: "Full range of motion" },
    ],
    cooldown: "Hip flexor lunge stretch 45s/side → Pigeon pose 45s/side → Hamstring stretch 30s/side → Spine twist 30s/side → Forward fold 45s",
  },
  "Day 4 — Push + Core": {
    emoji: "🔥",
    focus: "Chest, Shoulders, Triceps + Core (Variation)",
    warmup: "5 min incline walk → Band pull-aparts × 15 → Pelvic tilts × 10",
    exercises: [
      { name: "Dumbbell Bench Press", sets: "4×10-12", note: "Greater ROM than barbell" },
      { name: "Cable Flyes", sets: "3×12-15", note: "Squeeze at center" },
      { name: "Arnold Press (Seated)", sets: "3×10-12", note: "Rotational shoulder press" },
      { name: "Front Raise (Cable)", sets: "3×12-15", note: "Controlled, no momentum" },
      { name: "Dips (Assisted if needed)", sets: "3×8-12", note: "Lean forward for chest focus" },
      { name: "Skull Crushers", sets: "3×10-12", note: "EZ bar, elbows steady" },
      { name: "Ab Wheel Rollout", sets: "3×8-10", note: "⭐ From knees, don't hyperextend" },
      { name: "Pallof Press (Rotational)", sets: "3×10/side", note: "Step further from cable" },
      { name: "Hollow Body Hold", sets: "3×20-30s", note: "Press lower back to floor" },
    ],
    cooldown: "Chest stretch 30s → Shoulder stretch 30s → Wrist circles × 10",
  },
  "Day 5 — Pull + Core": {
    emoji: "💪",
    focus: "Back, Biceps, Rear Delts + Core (Variation)",
    warmup: "5 min rowing → Band dislocates × 12 → Cat-Cow × 10",
    exercises: [
      { name: "Pull-Ups / Assisted Pull-Ups", sets: "4×6-10", note: "Full dead hang start" },
      { name: "T-Bar Row", sets: "3×8-10", note: "Brace core, neutral spine" },
      { name: "Single Arm Dumbbell Row", sets: "3×10-12/side", note: "Bench supported" },
      { name: "Reverse Pec Deck", sets: "3×15", note: "Rear delt isolation" },
      { name: "Incline Dumbbell Curl", sets: "3×10-12", note: "Long head stretch" },
      { name: "Cable Curl (Rope)", sets: "3×12-15", note: "Peak contraction" },
      { name: "Hanging Knee Raise", sets: "3×10-12", note: "⭐ Don't swing, controlled" },
      { name: "McGill Curl-Up", sets: "3×8/side", note: "⭐ Spine-safe ab work" },
      { name: "Farmer's Walk", sets: "3×30-40m", note: "⭐ Total core + grip" },
    ],
    cooldown: "Lat hang 30s → Thoracic extension on roller × 10 → Child's pose 45s",
  },
  "Day 6 — Legs + Mobility": {
    emoji: "🦵",
    focus: "Legs + Full Body Mobility & Flexibility",
    warmup: "5 min bike → World's Greatest Stretch × 5/side → Glute activation band walks × 15",
    exercises: [
      { name: "Front Squat / Goblet Squat", sets: "4×8-10", note: "More quad + core, less lumbar load" },
      { name: "Bulgarian Split Squat", sets: "3×10/leg", note: "Balance + unilateral strength" },
      { name: "Sumo Deadlift", sets: "3×8-10", note: "Wide stance, more glute/adductor" },
      { name: "Leg Extension", sets: "3×12-15", note: "Quad isolation, knee-friendly load" },
      { name: "Glute Bridge (Single Leg)", sets: "3×12/side", note: "⭐ Glute + pelvic stability" },
      { name: "Calf Raises (Seated)", sets: "3×15-20", note: "Soleus focus" },
    ],
    cooldown: "FULL 15-MIN FLEXIBILITY FLOW:\n• Hip flexor lunge 60s/side\n• Pigeon pose 60s/side\n• Seated forward fold 45s\n• Supine spinal twist 45s/side\n• Frog stretch 45s\n• Cat-Cow × 12 (slow, with breath)\n• Child's pose 60s",
  },
  "Day 7 — Active Recovery": {
    emoji: "🧘",
    focus: "Walk + Stretch + Breathe",
    warmup: "None needed",
    exercises: [
      { name: "Brisk Walk / Light Jog", sets: "30-40 min", note: "Heart rate 100-120 bpm zone" },
      { name: "Foam Rolling Full Body", sets: "10 min", note: "Quads, hamstrings, back, calves" },
      { name: "Full Yoga/Stretch Flow", sets: "20 min", note: "Sun salutations + deep stretches" },
      { name: "Diaphragmatic Breathing", sets: "5 min", note: "⭐ 4s in, 7s hold, 8s out — heals nervous system" },
    ],
    cooldown: "You've earned this rest. Enjoy!",
  },
};

const DIET_PLAN = {
  title: "Budget Fat-Loss + Muscle Gain Diet",
  stats: "~2100 kcal | 170g protein | 200g carbs | 60g fat",
  note: "Monthly budget ~₹6,000-7,000",
  meals: [
    {
      time: "7:00 AM", name: "🌅 Breakfast",
      items: "5 Egg Bhurji (1 whole + 4 whites) with onion-tomato-green chilli\n2 Wheat Roti\n1 glass Milk (250ml, toned)",
      protein: "35g", cost: "~₹40",
      tip: "Buy eggs in bulk tray (30 eggs ≈ ₹200). Cheapest protein per gram!",
    },
    {
      time: "10:00 AM", name: "🍌 Mid-Morning Snack",
      items: "2 Boiled Eggs\n1 Banana\nHandful of Roasted Peanuts (30g)",
      protein: "18g", cost: "~₹20",
      tip: "Peanuts = budget superfood. 1kg ≈ ₹120, lasts 2 weeks as snack",
    },
    {
      time: "1:00 PM", name: "🍛 Lunch",
      items: "Chicken Curry — 200g chicken breast/thigh\n1 cup cooked Rice (150g raw)\n1 katori Dal (moong/masoor)\n1 katori Seasonal Sabzi\nSalad (cucumber, onion, lemon)",
      protein: "50g", cost: "~₹80",
      tip: "Buy whole chicken (~₹180/kg) and get it cut. Thighs are cheaper & tasty. Batch cook for 2 days.",
    },
    {
      time: "4:30 PM", name: "⚡ Pre-Workout",
      items: "1 Banana + 1 tbsp Peanut Butter on 1 Roti\nOR 2 Boiled Eggs + 1 Banana",
      protein: "12g", cost: "~₹15",
      tip: "Eat 45-60 mins before gym for energy",
    },
    {
      time: "7:30 PM", name: "💪 Post-Workout",
      items: "Sattu Shake (50g sattu + banana + milk + pinch salt)\nOR 3 Egg White Omelette",
      protein: "22g", cost: "~₹20",
      tip: "Sattu is Bihar's whey protein! 1kg ≈ ₹80-100. Amazing protein source.",
    },
    {
      time: "9:00 PM", name: "🌙 Dinner",
      items: "Fish Curry (rohu/katla 150g) OR Egg Curry (3 eggs)\n2 Wheat Roti\n1 katori Dal\nSalad",
      protein: "35g", cost: "~₹60",
      tip: "Fish 2-3x/week (omega-3). Other days: egg curry or leftover chicken. Mutton on weekends.",
    },
  ],
  weekly_budget: [
    "Eggs (5/day × 7) = 35 eggs ≈ ₹250",
    "Chicken (1.5 kg/week) ≈ ₹270",
    "Fish (500g × 2) ≈ ₹240",
    "Milk (1.5L/day) ≈ ₹420",
    "Dal + Rice + Atta ≈ ₹200",
    "Veggies + Fruits ≈ ₹250",
    "Peanuts + Sattu + Oil/Spices ≈ ₹200",
    "TOTAL: ~₹1,830/week ≈ ₹7,300/month",
  ],
};

const MIND_PLAN = {
  title: "1 Hour Daily Mind Expansion",
  blocks: [
    {
      name: "📖 Read (20 min)", emoji: "📖",
      detail: "Rotate between 3 types of books on a weekly cycle",
      schedule: [
        { day: "Mon/Thu", type: "Knowledge", examples: "Sapiens, Atomic Habits, Deep Work, Thinking Fast & Slow" },
        { day: "Tue/Fri", type: "EQ & Wisdom", examples: "Man's Search for Meaning, The Alchemist, Meditations" },
        { day: "Wed/Sat", type: "IQ & Logic", examples: "Gödel Escher Bach, Freakonomics, Art of Thinking Clearly" },
        { day: "Sun", type: "Free Choice", examples: "Anything that excites you — fiction, biography, science" },
      ],
      tip: "Use Z-Library or Kindle free samples. Target: 1 book every 2 weeks.",
    },
    {
      name: "🧩 Brain Training (15 min)", emoji: "🧩",
      detail: "Sharpen pattern recognition, logic, and processing speed",
      schedule: [
        { day: "Mon/Wed/Fri", type: "Chess", examples: "Lichess.org (free) — play 1 game + 1 puzzle set" },
        { day: "Tue/Thu", type: "Logic Puzzles", examples: "Sudoku, Kakuro, or Brilliant.org problems" },
        { day: "Sat/Sun", type: "New Skill Practice", examples: "Mental math, memory palace technique, speed reading drill" },
      ],
      tip: "Chess alone can raise IQ by 4-7 points over 6 months (research-backed).",
    },
    {
      name: "📝 Reflective Journaling (15 min)", emoji: "📝",
      detail: "Build emotional intelligence through self-awareness",
      schedule: [
        { day: "Daily", type: "3 Prompts", examples: "1) What went well today?\n2) What emotion did I struggle with?\n3) What would I do differently?" },
        { day: "Weekly (Sun)", type: "Deep Reflection", examples: "Review the week: patterns, growth, gratitude list (10 things)" },
      ],
      tip: "Journaling is the #1 EQ builder. Even 5 sentences count.",
    },
    {
      name: "🧘 Meditation (10 min)", emoji: "🧘",
      detail: "Calm the nervous system + improve focus",
      schedule: [
        { day: "Daily", type: "Guided or Silent", examples: "Start with Medito app (free) → graduate to silent sitting" },
        { day: "Breathwork", type: "Box Breathing", examples: "4-4-4-4 pattern × 5 rounds before meditation" },
      ],
      tip: "8 weeks of daily meditation physically grows your prefrontal cortex.",
    },
  ],
  curated_dose: {
    title: "🧠 Daily Knowledge Dose (Bonus)",
    sources: [
      "Kurzgesagt (YouTube) — 1 video = months of knowledge in 10 min",
      "Lex Fridman Clips — Deep conversations with world's smartest people",
      "Huberman Lab Clips — Neuroscience-backed health & performance",
      "3Blue1Brown — Math & logic made visual and beautiful",
      "Podcast: The Knowledge Project by Shane Parrish",
    ],
  },
};

const DAILY_TASKS = {
  workout: ["Completed warmup routine", "Finished all main exercises", "Did core/stability work", "Completed cooldown stretches"],
  diet: ["Hit protein target (~170g)", "Ate all planned meals", "Drank 3+ liters water", "No junk/processed food"],
  mind: ["Read for 20 minutes", "Brain training (chess/puzzle) 15 min", "Wrote in journal", "Meditated 10 minutes"],
};

const COLORS = {
  workout: { primary: "#FF6B35", bg: "rgba(255,107,53,0.08)", glow: "rgba(255,107,53,0.3)" },
  diet: { primary: "#2EC4B6", bg: "rgba(46,196,182,0.08)", glow: "rgba(46,196,182,0.3)" },
  mind: { primary: "#A78BFA", bg: "rgba(167,139,250,0.08)", glow: "rgba(167,139,250,0.3)" },
};

const getDayNumber = () => new Date().getDay() || 7;
const getDayLabel = () => ["","Mon","Tue","Wed","Thu","Fri","Sat","Sun"][getDayNumber()];
const getWorkoutDay = () => Object.keys(WORKOUT_PLAN)[getDayNumber() - 1];

// ── Initial Data ──────────────────────────────────────────────────────
const makeInitial = () => ({
  today: { workout: [false,false,false,false], diet: [false,false,false,false], mind: [false,false,false,false] },
  streaks: { workout: 0, diet: 0, mind: 0 },
  bestStreaks: { workout: 0, diet: 0, mind: 0 },
  completed: { workout: false, diet: false, mind: false },
  totalDays: 0,
  lastDate: TODAY,
  history: {},
});

// ── App ───────────────────────────────────────────────────────────────
function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("dashboard");
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedDay, setSelectedDay] = useState(getWorkoutDay());
  const [showConfetti, setShowConfetti] = useState(false);

  const loadData = useCallback(() => {
    let saved = storage.get(STORAGE_KEY);
    if (saved) {
      if (saved.lastDate !== TODAY) {
        const y = new Date(); y.setDate(y.getDate() - 1);
        const wasYesterday = y.toISOString().split("T")[0] === saved.lastDate;
        saved = {
          ...saved,
          today: { workout: [false,false,false,false], diet: [false,false,false,false], mind: [false,false,false,false] },
          lastDate: TODAY,
          streaks: {
            workout: wasYesterday && saved.completed?.workout ? saved.streaks.workout : 0,
            diet: wasYesterday && saved.completed?.diet ? saved.streaks.diet : 0,
            mind: wasYesterday && saved.completed?.mind ? saved.streaks.mind : 0,
          },
          completed: { workout: false, diet: false, mind: false },
        };
        storage.set(STORAGE_KEY, saved);
      }
      setData(saved);
    } else {
      const initial = makeInitial();
      storage.set(STORAGE_KEY, initial);
      setData(initial);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const save = (newData) => {
    setData(newData);
    storage.set(STORAGE_KEY, newData);
  };

  const toggleTask = (cat, idx) => {
    const nd = JSON.parse(JSON.stringify(data));
    nd.today[cat][idx] = !nd.today[cat][idx];
    const allDone = nd.today[cat].every(Boolean);
    if (allDone && !nd.completed[cat]) {
      nd.streaks[cat] += 1;
      nd.completed[cat] = true;
      nd.bestStreaks[cat] = Math.max(nd.bestStreaks[cat], nd.streaks[cat]);
      const completedCount = [nd.completed.workout, nd.completed.diet, nd.completed.mind].filter(Boolean).length;
      if (completedCount === 3) {
        nd.totalDays += 1;
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else if (!allDone && nd.completed[cat]) {
      nd.streaks[cat] = Math.max(0, nd.streaks[cat] - 1);
      nd.completed[cat] = false;
    }
    nd.history[TODAY] = { ...nd.today };
    save(nd);
  };

  const resetAll = () => {
    if (window.confirm("Reset ALL data including streaks? This cannot be undone.")) {
      save(makeInitial());
    }
  };

  if (loading || !data) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0a0f",color:"#fff",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16,animation:"pulse 1.5s infinite"}}>🔥</div>
        <div style={{fontSize:18,opacity:0.7}}>Loading your transformation...</div>
      </div>
    </div>
  );

  const todayWorkout = getWorkoutDay();

  // ── Streak Card ─────────────────────────────────────────────────────
  const StreakCard = ({ cat, label, icon }) => {
    const streak = data.streaks[cat];
    const best = data.bestStreaks[cat];
    const done = data.completed[cat];
    const progress = data.today[cat].filter(Boolean).length;
    const c = COLORS[cat];
    return (
      <div style={{
        background: done ? c.bg : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${done ? c.primary : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16, padding: "18px 16px", flex: 1, minWidth: 95,
        transition: "all 0.3s", position: "relative", overflow: "hidden",
        boxShadow: done ? `0 0 20px ${c.glow}` : "none",
      }}>
        {done && <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${c.primary},transparent)`}}/>}
        <div style={{fontSize:28,marginBottom:6}}>{icon}</div>
        <div style={{fontSize:32,fontWeight:800,color:done?c.primary:"#fff",fontFamily:"'Space Mono',monospace"}}>{streak}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{label}</div>
        <div style={{display:"flex",gap:4,marginBottom:4}}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{flex:1,height:4,borderRadius:2,background:data.today[cat][i]?c.primary:"rgba(255,255,255,0.1)",transition:"all 0.3s"}}/>
          ))}
        </div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{progress}/4 • Best: {best}</div>
      </div>
    );
  };

  // ── Task Checklist ──────────────────────────────────────────────────
  const TaskChecklist = ({ cat, label, tasks, icon }) => {
    const c = COLORS[cat];
    const done = data.completed[cat];
    return (
      <div style={{
        background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 20,
        border: `1px solid ${done ? c.primary : "rgba(255,255,255,0.06)"}`,
        marginBottom: 16, transition: "all 0.3s",
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>{icon}</span>
            <span style={{fontSize:16,fontWeight:700,color:"#fff"}}>{label}</span>
          </div>
          {done && <span style={{background:c.primary,color:"#000",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20}}>DONE ✓</span>}
        </div>
        {tasks.map((task, i) => (
          <div key={i} onClick={() => toggleTask(cat, i)} style={{
            display:"flex", alignItems:"center", gap:12, padding:"10px 12px", marginBottom:6,
            borderRadius:10, cursor:"pointer", transition:"all 0.2s", userSelect:"none",
            WebkitTapHighlightColor:"transparent",
            background: data.today[cat][i] ? c.bg : "transparent",
            border: `1px solid ${data.today[cat][i] ? c.primary+"40" : "transparent"}`,
          }}>
            <div style={{
              width:22, height:22, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center",
              border: `2px solid ${data.today[cat][i] ? c.primary : "rgba(255,255,255,0.2)"}`,
              background: data.today[cat][i] ? c.primary : "transparent", transition:"all 0.2s", flexShrink:0,
            }}>
              {data.today[cat][i] && <span style={{color:"#000",fontSize:13,fontWeight:900}}>✓</span>}
            </div>
            <span style={{
              fontSize:14, color: data.today[cat][i] ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)",
              textDecoration: data.today[cat][i] ? "line-through" : "none", transition:"all 0.2s",
            }}>{task}</span>
          </div>
        ))}
      </div>
    );
  };

  // ── Confetti ────────────────────────────────────────────────────────
  const Confetti = () => (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      {Array.from({length:40}).map((_,i) => (
        <div key={i} style={{
          position:"absolute",
          left: `${Math.random()*100}%`,
          top: -20,
          width: 8+Math.random()*8,
          height: 8+Math.random()*8,
          borderRadius: Math.random()>0.5 ? "50%" : "2px",
          background: ["#FF6B35","#2EC4B6","#A78BFA","#FFD700","#FF4081","#00E5FF"][Math.floor(Math.random()*6)],
          animation: `confettiFall ${2+Math.random()*2}s ease-in forwards`,
          animationDelay: `${Math.random()*0.5}s`,
        }}/>
      ))}
    </div>
  );

  // ── Dashboard ───────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div>
      {showConfetti && <Confetti />}
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:52,marginBottom:4,filter:data.totalDays>0?"none":"grayscale(0.5)",transition:"all 0.5s"}}>
          {data.totalDays >= 30 ? "👑" : data.totalDays >= 7 ? "🔥" : "🌱"}
        </div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:2}}>
          {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
        </div>
        <div style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:4}}>
          {data.totalDays === 0 ? "Day 1 — Let's Begin" : `${data.totalDays} Perfect Day${data.totalDays>1?"s":""}`}
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>Complete all 3 categories to earn a Perfect Day</div>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:24}}>
        <StreakCard cat="workout" label="Workout" icon="🏋️" />
        <StreakCard cat="diet" label="Diet" icon="🥗" />
        <StreakCard cat="mind" label="Mind" icon="🧠" />
      </div>

      <div style={{marginBottom:12}}>
        <div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
          <span>📋</span> Today's Missions
          <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontWeight:400}}>— {todayWorkout}</span>
        </div>
        <TaskChecklist cat="workout" label="Workout" tasks={DAILY_TASKS.workout} icon="🏋️" />
        <TaskChecklist cat="diet" label="Nutrition" tasks={DAILY_TASKS.diet} icon="🥗" />
        <TaskChecklist cat="mind" label="Mind" tasks={DAILY_TASKS.mind} icon="🧠" />
      </div>

      <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:8}}>
        {[1,2,3,4,5,6,7].map(d => {
          const dateObj = new Date(); dateObj.setDate(dateObj.getDate() - (getDayNumber() - d));
          const dateStr = dateObj.toISOString().split("T")[0];
          const hist = data.history[dateStr];
          const allDone = hist && hist.workout?.every?.(Boolean) && hist.diet?.every?.(Boolean) && hist.mind?.every?.(Boolean);
          const someDone = hist && (hist.workout?.some?.(Boolean) || hist.diet?.some?.(Boolean) || hist.mind?.some?.(Boolean));
          const isToday = d === getDayNumber();
          return (
            <div key={d} style={{
              width:38, height:48, borderRadius:10, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:2,
              background: isToday ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.03)",
              border: `1.5px solid ${isToday ? "#FF6B35" : allDone ? "#2EC4B6" : "rgba(255,255,255,0.06)"}`,
            }}>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:600}}>{["","M","T","W","T","F","S","S"][d]}</div>
              <div style={{fontSize:16}}>{allDone ? "🔥" : someDone ? "🌤️" : "⚪"}</div>
            </div>
          );
        })}
      </div>
      <div style={{textAlign:"center",marginTop:24}}>
        <button onClick={resetAll} style={{fontSize:11,color:"rgba(255,255,255,0.2)",background:"none",border:"1px solid rgba(255,255,255,0.08)",padding:"6px 16px",borderRadius:8,cursor:"pointer"}}>Reset All Data</button>
      </div>
    </div>
  );

  // ── Workout ─────────────────────────────────────────────────────────
  const renderWorkout = () => {
    const workout = WORKOUT_PLAN[selectedDay];
    return (
      <div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
          {Object.keys(WORKOUT_PLAN).map((day,i) => (
            <button key={day} onClick={() => setSelectedDay(day)} style={{
              padding:"6px 12px", borderRadius:10, border:"none", cursor:"pointer", fontSize:11, fontWeight:600,
              background: selectedDay===day ? "#FF6B35" : "rgba(255,255,255,0.06)",
              color: selectedDay===day ? "#000" : "rgba(255,255,255,0.5)",
              transition:"all 0.2s",
            }}>
              {day === todayWorkout && "📍 "}D{i+1}
            </button>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:4}}>{workout.emoji} {selectedDay}</div>
          <div style={{fontSize:13,color:COLORS.workout.primary,fontWeight:600}}>{workout.focus}</div>
        </div>
        <div style={{background:"rgba(255,107,53,0.06)",border:"1px solid rgba(255,107,53,0.15)",borderRadius:12,padding:14,marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"#FF6B35",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Warm-Up</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",lineHeight:1.5}}>{workout.warmup}</div>
        </div>
        {workout.exercises.map((ex,i) => (
          <div key={i} style={{
            display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", marginBottom:6,
            borderRadius:12, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{
              width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",
              background:"rgba(255,107,53,0.1)",color:"#FF6B35",fontSize:12,fontWeight:800,flexShrink:0,marginTop:2,
            }}>{i+1}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>
                {ex.name} <span style={{fontWeight:400,color:"rgba(255,255,255,0.4)",fontSize:12}}>— {ex.sets}</span>
              </div>
              <div style={{fontSize:12,color:ex.note.startsWith("⭐")?"#FFD700":"rgba(255,255,255,0.4)",lineHeight:1.4}}>{ex.note}</div>
            </div>
          </div>
        ))}
        <div style={{background:"rgba(46,196,182,0.06)",border:"1px solid rgba(46,196,182,0.15)",borderRadius:12,padding:14,marginTop:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"#2EC4B6",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Cool-Down</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",lineHeight:1.6,whiteSpace:"pre-line"}}>{workout.cooldown}</div>
        </div>
      </div>
    );
  };

  // ── Diet ────────────────────────────────────────────────────────────
  const renderDiet = () => (
    <div>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:4}}>{DIET_PLAN.title}</div>
        <div style={{display:"inline-block",background:"rgba(46,196,182,0.1)",border:"1px solid rgba(46,196,182,0.2)",borderRadius:10,padding:"6px 14px",fontSize:13,color:"#2EC4B6",fontWeight:600}}>{DIET_PLAN.stats}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:6}}>{DIET_PLAN.note}</div>
      </div>
      {DIET_PLAN.meals.map((meal,i) => (
        <div key={i} onClick={() => setExpandedSection(expandedSection===`meal-${i}`?null:`meal-${i}`)} style={{
          background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:14, padding:"14px 16px", marginBottom:8, cursor:"pointer", transition:"all 0.2s",
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{meal.name}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{meal.time} • Protein: {meal.protein} • {meal.cost}</div>
            </div>
            <span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>{expandedSection===`meal-${i}`?"−":"+"}</span>
          </div>
          {expandedSection===`meal-${i}` && (
            <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",whiteSpace:"pre-line",lineHeight:1.6,marginBottom:10}}>{meal.items}</div>
              <div style={{fontSize:12,color:"#2EC4B6",background:"rgba(46,196,182,0.06)",padding:"8px 12px",borderRadius:8,lineHeight:1.4}}>💡 {meal.tip}</div>
            </div>
          )}
        </div>
      ))}
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:14,padding:16,marginTop:16,border:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:10}}>💰 Weekly Budget Breakdown</div>
        {DIET_PLAN.weekly_budget.map((item,i) => (
          <div key={i} style={{fontSize:12,color:i===DIET_PLAN.weekly_budget.length-1?"#2EC4B6":"rgba(255,255,255,0.5)",padding:"4px 0",fontWeight:i===DIET_PLAN.weekly_budget.length-1?700:400,borderTop:i===DIET_PLAN.weekly_budget.length-1?"1px solid rgba(255,255,255,0.08)":"none",marginTop:i===DIET_PLAN.weekly_budget.length-1?4:0,paddingTop:i===DIET_PLAN.weekly_budget.length-1?8:4}}>{item}</div>
        ))}
      </div>
    </div>
  );

  // ── Mind ─────────────────────────────────────────────────────────────
  const renderMind = () => (
    <div>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{MIND_PLAN.title}</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:4}}>Today is {getDayLabel()} — check your schedule below</div>
      </div>
      {MIND_PLAN.blocks.map((block,i) => (
        <div key={i} onClick={() => setExpandedSection(expandedSection===`mind-${i}`?null:`mind-${i}`)} style={{
          background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:14, padding:"14px 16px", marginBottom:8, cursor:"pointer", transition:"all 0.2s",
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{block.name}</div>
            <span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>{expandedSection===`mind-${i}`?"−":"+"}</span>
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:4}}>{block.detail}</div>
          {expandedSection===`mind-${i}` && (
            <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
              {block.schedule.map((s,j) => (
                <div key={j} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#A78BFA",minWidth:70,paddingTop:2}}>{s.day}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.8)"}}>{s.type}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",whiteSpace:"pre-line",lineHeight:1.4}}>{s.examples}</div>
                  </div>
                </div>
              ))}
              <div style={{fontSize:12,color:"#A78BFA",background:"rgba(167,139,250,0.06)",padding:"8px 12px",borderRadius:8,marginTop:6}}>💡 {block.tip}</div>
            </div>
          )}
        </div>
      ))}
      <div style={{background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:14,padding:16,marginTop:16}}>
        <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:10}}>{MIND_PLAN.curated_dose.title}</div>
        {MIND_PLAN.curated_dose.sources.map((s,i) => (
          <div key={i} style={{fontSize:12,color:"rgba(255,255,255,0.6)",padding:"4px 0",lineHeight:1.4}}>• {s}</div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id:"dashboard", icon:"🏠", label:"Home" },
    { id:"workout", icon:"🏋️", label:"Workout" },
    { id:"diet", icon:"🥗", label:"Diet" },
    { id:"mind", icon:"🧠", label:"Mind" },
  ];

  return (
    <div style={{
      minHeight:"100vh", background:"#0a0a0f", color:"#fff",
      fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { background: #0a0a0f; overscroll-behavior: none; }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        button { -webkit-tap-highlight-color: transparent; }
        button:active { opacity: 0.7; }
      `}</style>

      <div style={{maxWidth:480,margin:"0 auto",padding:"16px 16px 90px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,paddingTop:8}}>
          <div style={{fontSize:18,fontWeight:800,letterSpacing:"-0.5px"}}>
            <span style={{color:"#FF6B35"}}>TRANS</span><span style={{color:"#fff"}}>FORM</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:18,filter:data.totalDays>0?"none":"grayscale(1)"}}>🔥</span>
            <span style={{fontSize:16,fontWeight:800,fontFamily:"'Space Mono',monospace",color:data.totalDays>0?"#FF6B35":"rgba(255,255,255,0.3)"}}>
              {Math.max(data.streaks.workout,data.streaks.diet,data.streaks.mind)}
            </span>
          </div>
        </div>

        {tab === "dashboard" && renderDashboard()}
        {tab === "workout" && renderWorkout()}
        {tab === "diet" && renderDiet()}
        {tab === "mind" && renderMind()}
      </div>

      <div style={{
        position:"fixed",bottom:0,left:0,right:0,
        background:"rgba(10,10,15,0.97)",
        backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
        borderTop:"1px solid rgba(255,255,255,0.06)",
        padding:"8px 0 env(safe-area-inset-bottom, 8px)",
        zIndex:100,
      }}>
        <div style={{display:"flex",justifyContent:"center",gap:0,maxWidth:480,margin:"0 auto"}}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              padding:"6px 0", background:"none", border:"none", cursor:"pointer",
              color: tab===t.id ? "#FF6B35" : "rgba(255,255,255,0.3)", transition:"all 0.2s",
            }}>
              <span style={{fontSize:20}}>{t.icon}</span>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:0.5}}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
