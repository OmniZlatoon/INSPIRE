export interface CourseQA {
  question: string;
  answer: string;
}

export interface CourseModule {
  title: string;
  content: string[];
}

export interface CourseData {
  id: string;
  title: string;
  modules: CourseModule[];
  qa: CourseQA[];
}

export const coursesData: Record<string, CourseData> = {
  "Discrete Mathematics": {
    "id": "Discrete Mathematics",
    "title": "DISCRETE MATHEMATICS",
    "modules": [
      {
        "title": "Module 1: \"Did You Know?\" (The Hook)",
        "content": [
          "Did you know that every time you send a secure WhatsApp message, stream a Netflix video, or rely on Google Maps to find the shortest route home, you are using Discrete Mathematics? This is the fundamental invisible framework that protects the internet (Cryptography) and structures the world's data."
        ]
      },
      {
        "title": "Module 2: Brief Course Introduction",
        "content": [
          "Forget traditional high school math. Unlike Calculus, which measures smooth, continuous changes, Discrete Mathematics is the study of distinct, separate values. It is the native language of computers. You are learning how to think in binary, how to structure data logically using sets and trees, and how to write the logical foundations of algorithms. Think of it as a pure logic and problem-solving bootcamp for software engineers."
        ]
      },
      {
        "title": "Module 3: Common Challenges",
        "content": [
          "•\tThe 'Proof' Wall: Transitioning from solving equations to writing formal mathematical proofs feels alien. It requires arguing a point logically rather than just finding a number.",
          "•\tNotation Overload: Being bombarded by new symbols (∀, ∃, ∈, ⊆) can feel like reading a foreign language.",
          "•\tAbstract Isolation: Struggling to see how theories about 'Sets' or 'Graphs' will ever help you write actual code."
        ]
      },
      {
        "title": "Module 4: Cultivating Inspiration",
        "content": [
          "•\tThe Database Mindset: Visualize Sets and Relations as SQL databases. An 'Intersection' is an INNER JOIN. A 'Union' is a FULL JOIN.",
          "•\tTreat Proofs like Debugging: A proof is a logical argument. Treat it like debugging a program: if Step A leads to Step B, what is the exact rule that allows that transition?",
          "•\tPRACTICAL EXAMPLE: Building a Password Cracker. When you learn 'Combinatorics' (counting), don't just solve textbook problems. Write a 5-line Python script that calculates exactly how many milliseconds it would take a hacker to brute-force your current Wi-Fi password. You will instantly realize why websites force you to use special characters.",
          "•\tThe Gamification Angle (NEW): Treat logic puzzles like Sudoku or escape rooms. There are many apps like Brilliant or logic grid puzzles that train this exact mental muscle in a low-stakes environment."
        ]
      },
      {
        "title": "Module 5: Real-World Wisdom (Part 1)",
        "content": [
          "\"Computer Science is no more about computers than astronomy is about telescopes. It is about the underlying logic.\" — Edsger W. Dijkstra"
        ]
      },
      {
        "title": "Module 6: The Bounce-Back Strategy",
        "content": [
          "1.\tTranslate to English: Stop looking at the symbols. Write the entire formula out in plain, conversational English.",
          "2.\tScale Down to N=3: Having trouble proving a formula for an abstract 'n' amount of items? Prove it for 1 item, then 2, then 3. Find the tangible pattern first.",
          "3.\tSeek Peer Review, Not Just Lecturer Help (NEW): Sometimes a professor's explanation is too advanced. Ask a second-year student how they survived the specific proof that is crushing you right now."
        ]
      },
      {
        "title": "Module 7: Real-World Wisdom (Part 2)",
        "content": [
          "\"It’s not that I’m so smart, it’s just that I stay with problems longer.\" — Albert Einstein",
          "[Module 8: Video Applications - Excluded per prototype requirements]"
        ]
      }
    ],
    "qa": [
      {
        "question": "Q1: Why do I need this to build web apps?",
        "answer": "Modern web apps rely heavily on databases (Set Theory) and routing (Graph Theory). When an app scales, engineers who understand discrete logic are the ones who fix the bottlenecks."
      },
      {
        "question": "Q2: I was terrible at Calculus. Will I fail this?",
        "answer": "No! Discrete Math requires a different part of your brain. Many who struggle with continuous math excel here because it relies on pure structural thinking."
      },
      {
        "question": "Q3: How do I memorize all these symbols?",
        "answer": "Don't memorize; translate. Create a cheat sheet where every symbol is written as a plain English phrase and read them aloud."
      },
      {
        "question": "Q4: What is the most important topic here?",
        "answer": "Graph Theory and Trees. They are the absolute foundation of 'Data Structures and Algorithms.'"
      },
      {
        "question": "Q5: I failed my first proofs test. How do I recover?",
        "answer": "Go back to the basic axioms. Most proofs fail because the student didn't strictly apply the base definition of a concept (e.g., the mathematical definition of an even number)."
      }
    ]
  },
  "Physics": {
    "id": "Physics",
    "title": "PHYSICS (FOR TECH & ENGINEERING)",
    "modules": [
      {
        "title": "Module 1: \"Did You Know?\" (The Hook)",
        "content": [
          "Did you know that without the principles of quantum physics, the solid-state drive (SSD) in your laptop wouldn't exist? Furthermore, every modern video game—from FIFA to Call of Duty—relies entirely on classical physics equations to make the ball bounce, the cars drift, and the light reflect off virtual water."
        ]
      },
      {
        "title": "Module 2: Brief Course Introduction",
        "content": [
          "Physics is the ultimate reverse-engineering of the universe. In the context of technology, it is the study of how hardware interacts with the physical world. You will learn Mechanics (how things move), Electromagnetism (how signals and power flow), and Thermodynamics (how systems manage heat). You aren't just calculating the velocity of a train; you are learning the rules that govern fiber-optic internet cables and smartphone touchscreens."
        ]
      },
      {
        "title": "Module 3: Common Challenges",
        "content": [
          "•\tThe Math-to-Reality Gap: Knowing the math formula but failing to understand what it actually means in the physical world.",
          "•\tVector Confusion: Struggling to visualize forces pulling in 3D space, leading to simple algebraic errors.",
          "•\tThe 'Spherical Cow' Frustration: Dealing with idealized problems (like 'assume there is no air resistance') that feel disconnected from reality."
        ]
      },
      {
        "title": "Module 4: Cultivating Inspiration",
        "content": [
          "•\tThink Like a Game Developer: Every physics formula is just a line of code in a physics engine. Acceleration is just adding to a velocity variable every frame.",
          "•\tFollow the Heat: If you want to build hardware or data centers, realize that thermodynamics is your biggest enemy. Physics is the manual for keeping your servers from melting.",
          "•\tPRACTICAL EXAMPLE: Coding a Bouncing Ball. Take the kinematic equation for gravity. Open a basic HTML canvas and use JavaScript to make a digital ball fall and bounce using exactly that formula. When you see the math turn into realistic on-screen animation, the equations stop being abstract.",
          "•\tHardware Teardowns (NEW): Watch YouTube channels like iFixit or JerryRigEverything. Seeing the literal physics of heat dissipation and material strength connects the equations to consumer tech."
        ]
      },
      {
        "title": "Module 5: Real-World Wisdom (Part 1)",
        "content": [
          "\"Physics is really nothing more than a search for ultimate simplicity, but so far all we have is a kind of elegant messiness.\" — Bill Bryson"
        ]
      },
      {
        "title": "Module 6: The Bounce-Back Strategy",
        "content": [
          "4.\tDraw it Out: Never do physics purely in your head. Draw a massive, overly detailed diagram for every single problem. Label every force.",
          "5.\tDimensional Analysis: If you are totally lost on an exam, look at the units. If you need an answer in m/s, divide whatever variables you have that give distance by the ones that give time.",
          "6.\tIdentify the Hidden Variables (NEW): If a formula isn't working, re-read the word problem. Is there a hidden 'rest' (Initial Velocity = 0) or 'drop' (Acceleration = 9.8)? Highlighting these words prevents missing data."
        ]
      },
      {
        "title": "Module 7: Real-World Wisdom (Part 2)",
        "content": [
          "\"I have no special talents. I am only passionately curious.\" — Albert Einstein",
          "[Module 8: Video Applications - Excluded per prototype requirements]"
        ]
      }
    ],
    "qa": [
      {
        "question": "Q1: I'm a software engineering student. Why do I care about mechanics?",
        "answer": "If you ever want to work in robotics, game development, VR/AR, or aerospace software, mechanics is your daily reality."
      },
      {
        "question": "Q2: Why are the textbook problems so unrealistic?",
        "answer": "They isolate variables so you can learn the core mechanics without being overwhelmed. You have to understand gravity in a vacuum before you can calculate aerodynamic drag."
      },
      {
        "question": "Q3: What if I don't understand the Calculus used in the lectures?",
        "answer": "Focus on the algebra and the concepts first. You can pass most introductory physics exams by deeply understanding the algebraic relationships between variables."
      },
      {
        "question": "Q4: Electromagnetism feels like magic. How do I visualize it?",
        "answer": "Use online simulators like PhET. You can't see a magnetic field, so you must rely on visual software to build an intuition for it."
      },
      {
        "question": "Q5: Is it normal to get the math right but still get the wrong answer?",
        "answer": "Yes! This usually means you messed up your sign conventions. Always establish which way is 'up' before calculating."
      }
    ]
  },
  "Data Structures and Algorithms (DSA)": {
    "id": "Data Structures and Algorithms (DSA)",
    "title": "DATA STRUCTURES AND ALGORITHMS (DSA)",
    "modules": [
      {
        "title": "Module 1: \"Did You Know?\" (The Hook)",
        "content": [
          "Did you know that a poor algorithm can make a supercomputer slower than an old iPhone? The difference between a database query taking 2 milliseconds and taking 3 weeks is entirely dependent on the data structure you choose. This course is the ultimate gatekeeper for jobs at Google, Amazon, and Microsoft."
        ]
      },
      {
        "title": "Module 2: Brief Course Introduction",
        "content": [
          "If coding is building a house, DSA is the architecture. It is the study of how to store data efficiently (Data Structures) and how to manipulate that data quickly (Algorithms). You will move past writing code that 'just works' and start writing code that scales. You will learn about Arrays, Linked Lists, Trees, Hash Maps, and how to measure their efficiency using Big O Notation."
        ]
      },
      {
        "title": "Module 3: Common Challenges",
        "content": [
          "•\tThe Pointer Paradox: Getting lost in memory management, especially in Linked Lists and Trees where variables point to other variables.",
          "•\tBig O Paralysis: Overthinking the time complexity (e.g., O(n²), O(log n)) of a function before actually solving the problem.",
          "•\tRecursion Melt-down: Struggling to comprehend functions that call themselves without causing infinite loops."
        ]
      },
      {
        "title": "Module 4: Cultivating Inspiration",
        "content": [
          "•\tThe Toolbelt Approach: Stop viewing DSA as a test. View it as a physical toolbelt. A Hash Map is a dictionary. A Stack is a stack of plates. Use the right tool for the job.",
          "•\tTrace the Execution: Never try to compile an algorithm in your head. Draw boxes on paper and physically move your pen to track the data as the loop runs.",
          "•\tPRACTICAL EXAMPLE: Building an 'Undo' Button. Have you ever wondered how Ctrl+Z works? It uses a 'Stack' data structure. Write a 10-line program where users type words, and those words are pushed onto a Stack. When they hit 'Undo', you pop() the last word off.",
          "•\tCompete Competitively But Safely (NEW): Join platforms like LeetCode or HackerRank, but ignore the global leaderboard. Focus strictly on your personal 'Daily Streak' and the 'Easy' category until your mental map solidifies."
        ]
      },
      {
        "title": "Module 5: Real-World Wisdom (Part 1)",
        "content": [
          "\"Bad programmers worry about the code. Good programmers worry about data structures and their relationships.\" — Linus Torvalds"
        ]
      },
      {
        "title": "Module 6: The Bounce-Back Strategy",
        "content": [
          "7.\tRubber Duck Debugging: If an algorithm is breaking, explain it out loud, line-by-line, to an inanimate object. You will usually hear your own logic flaw.",
          "8.\tUse Visualizers: Use websites like VisuAlgo to watch the algorithm sort data visually before you try to write the code for it.",
          "9.\tThe 'Brute Force First' Rule (NEW): When completely stuck, write the ugliest, slowest, most inefficient code possible just to get the right answer. Once it works, then try to optimize it. Never optimize a blank screen."
        ]
      },
      {
        "title": "Module 7: Real-World Wisdom (Part 2)",
        "content": [
          "\"First, solve the problem. Then, write the code.\" — John Johnson",
          "[Module 8: Video Applications - Excluded per prototype requirements]"
        ]
      }
    ],
    "qa": [
      {
        "question": "Q1: Why do tech companies obsess over DSA in interviews?",
        "answer": "They don't care if you memorized the code; they want to see your problem-solving process. They want to know you won't crash their servers by writing an O(n²) loop when an O(n) hash map would do."
      },
      {
        "question": "Q2: Which data structure is the most important to master?",
        "answer": "Hash Maps (Dictionaries). They are the 'cheat code' for reducing time complexity in almost any software problem."
      },
      {
        "question": "Q3: I don't understand Recursion. What do I do?",
        "answer": "Always define your 'Base Case' (the condition that stops the loop) first. If you know how the loop stops, the rest of the recursion becomes much easier to visualize."
      },
      {
        "question": "Q4: Is there a difference between an Array and a Linked List in the real world?",
        "answer": "Yes! Arrays are fast to read but slow to resize. Linked Lists are fast to resize but slow to read. Choosing between them is a classic engineering trade-off."
      },
      {
        "question": "Q5: I keep failing algorithm challenges. How do I practice?",
        "answer": "Stop memorizing solutions. Break the problem into plain English steps. Solve it on paper manually first. If you can't solve it as a human, you can't write code for a machine to solve it."
      }
    ]
  },
  "C Programming": {
    "id": "C Programming",
    "title": "C PROGRAMMING",
    "modules": [
      {
        "title": "Module 1: \"Did You Know?\" (The Hook)",
        "content": [
          "Did you know that the operating system you are using right now, the web browser rendering this text, and the software running the Mars Rover were all written in C? It is the mother of all modern languages. When you learn C, you aren't just learning to code; you are learning how a computer actually breathes."
        ]
      },
      {
        "title": "Module 2: Brief Course Introduction",
        "content": [
          "Modern languages like Python and JavaScript hold your hand—they manage memory and clean up errors for you. C gives you the keys to the engine and removes the seatbelts. You will learn to manipulate computer memory directly, manage pointers, and write blazingly fast programs. It is an unapologetic, low-level language that will make you a vastly superior programmer in any other language you learn afterward."
        ]
      },
      {
        "title": "Module 3: Common Challenges",
        "content": [
          "•\tThe Segmentation Fault: The dreaded error message that tells you nothing other than 'your program crashed because you touched memory you shouldn't have.'",
          "•\tPointers and References: Understanding the difference between the value of a variable and the physical memory address of that variable.",
          "•\tManual Memory Management: Forgetting to use free() after using malloc(), causing massive memory leaks."
        ]
      },
      {
        "title": "Module 4: Cultivating Inspiration",
        "content": [
          "•\tThe God Complex: Realize the power you hold. In C, you can command the hardware directly. You are communicating intimately with the CPU.",
          "•\tDraw the Memory Map: Whenever you write a C program, draw a grid on a whiteboard representing RAM. Track exactly where your pointers are looking.",
          "•\tPRACTICAL EXAMPLE: The Ethical Hacker's Toolkit. Want to know how video game cheats or basic malware works? They use C pointers to read and modify the memory addresses of other programs. Write a simple C script that creates an integer variable, and then use a pointer to maliciously 'hack' and change that variable's value from the outside.",
          "•\tBuild a Micro-OS Tool (NEW): Don't just write CLI calculators. Try writing a tiny C program that reads your system's battery percentage or current RAM usage. Interacting directly with the OS is the superpower of C."
        ]
      },
      {
        "title": "Module 5: Real-World Wisdom (Part 1)",
        "content": [
          "\"C makes it easy to shoot yourself in the foot; C++ makes it harder, but when you do, it blows your whole leg off.\" — Bjarne Stroustrup"
        ]
      },
      {
        "title": "Module 6: The Bounce-Back Strategy",
        "content": [
          "10.\tEmbrace the Segfault: A segmentation fault is a rite of passage. It just means your pointer was looking in the wrong place. Open a debugger (like GDB), step through the code one line at a time, and watch the memory addresses.",
          "11.\tPrint Statements Everywhere: If you are lost, put printf(\"I am here 1\"); everywhere. Trace exactly where the code dies.",
          "12.\tWalk Away from the Screen (NEW): C bugs, especially memory leaks, cause tunnel vision. If you've been chasing a bug for over 45 minutes, force a 15-minute screen break. Your brain often solves pointer issues in the background."
        ]
      },
      {
        "title": "Module 7: Real-World Wisdom (Part 2)",
        "content": [
          "\"The only way to learn a new programming language is by writing programs in it.\" — Dennis Ritchie",
          "[Module 8: Video Applications - Excluded per prototype requirements]"
        ]
      }
    ],
    "qa": [
      {
        "question": "Q1: Why learn C when Python is so much easier?",
        "answer": "Python is a car; C is the engine inside it. If the car breaks down, the Python dev has to call a mechanic. The C dev is the mechanic."
      },
      {
        "question": "Q2: I don't understand Pointers. Can I skip them?",
        "answer": "Absolutely not. Pointers are the entire point of learning C. Think of a pointer not as data, but as the GPS coordinates of where the data lives."
      },
      {
        "question": "Q3: What does 'Memory Leak' mean?",
        "answer": "It means you asked the computer for memory space to store data, but you forgot to tell the computer you were done with it. Eventually, the computer runs out of space and crashes."
      },
      {
        "question": "Q4: Is C used for web development?",
        "answer": "Rarely. C is used for embedded systems (microwaves, car engines), operating systems (Linux, Windows), and high-performance game engines."
      },
      {
        "question": "Q5: My code compiles but crashes instantly. Why?",
        "answer": "The compiler only checks your grammar, not your logic. You likely have an uninitialized pointer trying to access restricted memory. Time to debug!"
      }
    ]
  },
  "Circuit Theory": {
    "id": "Circuit Theory",
    "title": "CIRCUIT THEORY",
    "modules": [
      {
        "title": "Module 1: \"Did You Know?\" (The Hook)",
        "content": [
          "Did you know that all software is just an illusion? An 'if/else' statement in your code doesn't actually exist; it is just a physical electrical switch turning on and off billions of times per second. Circuit Theory is the exact science of how we trick sand (silicon) into thinking by pushing lightning (electricity) through it."
        ]
      },
      {
        "title": "Module 2: Brief Course Introduction",
        "content": [
          "Circuit Theory is the bridge between the physics of electricity and the engineering of computer hardware. You will move from simple batteries and resistors to complex networks of capacitors, inductors, and operational amplifiers. You will learn Kirchhoff's Laws and Ohm's Law to mathematically prove exactly how much voltage and current is flowing through any wire at any given microsecond."
        ]
      },
      {
        "title": "Module 3: Common Challenges",
        "content": [
          "•\tThe Mesh Analysis Matrix: Getting bogged down in massive systems of linear equations to solve a circuit, where one negative sign ruins the whole calculation.",
          "•\tAC vs. DC Confusion: Transitioning from direct current (simple math) to alternating current (where you suddenly have to use imaginary numbers and phase angles).",
          "•\tThe Breadboard Chaos: Building a circuit in real life only to have it fail because one wire is loose, making theory feel useless."
        ]
      },
      {
        "title": "Module 4: Cultivating Inspiration",
        "content": [
          "•\tCode in Hardware: View circuits as physical programming. A resistor is a throttle. A capacitor is a battery. A diode is a one-way street.",
          "•\tSimulate Before You Build: Never touch a physical breadboard until you have simulated the circuit in software (like Falstad or LTspice) and watched the simulated current flow.",
          "•\tPRACTICAL EXAMPLE: Building an IoT Sensor. Don't just calculate resistance on paper. Buy a $2 photoresistor (a resistor that changes value based on light). Calculate the voltage drop, and wire it to an LED. You have just built the exact circuit that tells your smartphone screen to auto-dim when you walk into a dark room.",
          "•\tThe Maker Movement (NEW): Buy a $10 Arduino starter kit. Applying Circuit Theory to make an LED blink using actual C-code and actual resistors bridges the gap between pure hardware and pure software."
        ]
      },
      {
        "title": "Module 5: Real-World Wisdom (Part 1)",
        "content": [
          "\"Engineering is not about perfect solutions; it is about doing the best you can with limited resources.\" — Randy Pausch"
        ]
      },
      {
        "title": "Module 6: The Bounce-Back Strategy",
        "content": [
          "13.\tRedraw the Circuit: Textbooks deliberately draw circuits in confusing ways to trick you. Redraw the circuit on your own paper, stretching it out into clean, straight vertical and horizontal lines. It will immediately make more sense.",
          "14.\tFollow the Nodes: Color-code your wires. Highlight every single wire connected directly to the positive battery terminal in red. Highlight every wire connected to the ground in blue. You will instantly see where the voltage drops.",
          "15.\tThe 'Sanity Check' Principle (NEW): Before doing a page of mesh analysis math, estimate the answer. If your battery is 12V and your calculated voltage drop across one resistor is 400V, stop. The math is wrong. Build an intuitive sense of scale."
        ]
      },
      {
        "title": "Module 7: Real-World Wisdom (Part 2)",
        "content": [
          "\"If it works, it's obsolete.\" — Gordon Moore",
          "[Module 8: Video Applications - Excluded per prototype requirements]"
        ]
      }
    ],
    "qa": [
      {
        "question": "Q1: I'm a software developer. Why do I need to know hardware circuits?",
        "answer": "If you ever write code for IoT devices, robotics, or embedded systems, you need to know how much power your code is demanding. Bad code can physically overheat a circuit."
      },
      {
        "question": "Q2: Why do we use imaginary numbers in Alternating Current (AC)?",
        "answer": "Because AC power moves in waves (sine waves). Imaginary numbers (complex math) are the easiest mathematical tool humanity has found to calculate the timing and phase of waves overlapping."
      },
      {
        "question": "Q3: What is the difference between Voltage and Current?",
        "answer": "Think of plumbing. Voltage is the water pressure pushing through the pipe. Current is the actual amount of water flowing past you every second."
      },
      {
        "question": "Q4: My calculations are right, but my breadboard circuit doesn't work. Why?",
        "answer": "The real world isn't perfect. Wires have hidden resistance, components have manufacturing tolerances (a 100Ω resistor might actually be 98Ω), and your breadboard might have a dead row."
      },
      {
        "question": "Q5: I keep failing Mesh Analysis equations. Any tips?",
        "answer": "Write larger. 90% of Mesh Analysis errors are not electrical misunderstandings; they are simple algebra errors because students cram a 4-variable equation into a tiny corner of their paper."
      }
    ]
  }
};
