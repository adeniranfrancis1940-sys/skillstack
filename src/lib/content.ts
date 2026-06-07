export type Quiz = {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
};

export type Lesson = {
  id: string;
  title: string;
  intro: string;
  body: string;
  code?: string;
  quiz: Quiz;
  xp: number;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Path = {
  id: "html" | "css" | "javascript";
  title: string;
  tagline: string;
  color: string;
  emoji: string;
  modules: Module[];
};

export const PATHS: Path[] = [
  {
    id: "html",
    title: "HTML Foundations",
    tagline: "Structure the web",
    color: "from-orange-400 to-pink-500",
    emoji: "🧱",
    modules: [
      {
        id: "html-basics",
        title: "Getting Started",
        lessons: [
          {
            id: "html-1",
            title: "What is HTML?",
            intro: "Meet the language that gives the web its skeleton.",
            body: "HTML stands for HyperText Markup Language. It uses tags wrapped in angle brackets to describe the structure of a page — headings, paragraphs, images, links, and more.",
            code: `<h1>Hello, world!</h1>\n<p>I am learning HTML.</p>`,
            quiz: {
              question: "What does HTML stand for?",
              options: [
                "Hyper Tool Markup Language",
                "HyperText Markup Language",
                "Home Tool Markdown Language",
                "Hyperlink Text Modeling Language",
              ],
              answer: 1,
            },
            xp: 10,
          },
          {
            id: "html-2",
            title: "Headings & Paragraphs",
            intro: "The basic building blocks of any page.",
            body: "Headings range from <h1> (most important) to <h6>. Paragraphs use <p>. Use one <h1> per page for SEO.",
            code: `<h1>Title</h1>\n<h2>Subtitle</h2>\n<p>A simple paragraph.</p>`,
            quiz: {
              question: "Which tag should be used once per page?",
              options: ["<p>", "<h6>", "<h1>", "<div>"],
              answer: 2,
            },
            xp: 10,
          },
          {
            id: "html-3",
            title: "Links & Images",
            intro: "Connect pages and add visuals.",
            body: "Use <a href='...'> for links and <img src='...' alt='...'> for images. Always include alt text for accessibility.",
            code: `<a href="https://lovable.dev">Lovable</a>\n<img src="cat.jpg" alt="A cat" />`,
            quiz: {
              question: "Which attribute makes an image accessible?",
              options: ["src", "title", "alt", "name"],
              answer: 2,
            },
            xp: 15,
          },
        ],
      },
    ],
  },
  {
    id: "css",
    title: "CSS Essentials",
    tagline: "Style with confidence",
    color: "from-sky-400 to-indigo-500",
    emoji: "🎨",
    modules: [
      {
        id: "css-basics",
        title: "Styling 101",
        lessons: [
          {
            id: "css-1",
            title: "Selectors",
            intro: "Target the elements you want to style.",
            body: "CSS rules consist of a selector and a block of declarations. Common selectors: element (p), class (.btn), and id (#hero).",
            code: `.btn {\n  background: hotpink;\n  color: white;\n}`,
            quiz: {
              question: "Which selector targets a class named 'btn'?",
              options: ["#btn", ".btn", "btn", "*btn"],
              answer: 1,
            },
            xp: 10,
          },
          {
            id: "css-2",
            title: "The Box Model",
            intro: "Every element is a box.",
            body: "Boxes have content, padding, border, and margin. Mastering them unlocks layout.",
            code: `.card {\n  padding: 16px;\n  margin: 8px;\n  border: 1px solid #000;\n}`,
            quiz: {
              question: "Which is OUTSIDE the border?",
              options: ["padding", "content", "margin", "background"],
              answer: 2,
            },
            xp: 15,
          },
          {
            id: "css-3",
            title: "Flexbox",
            intro: "Layout, made friendly.",
            body: "display: flex turns a container into a flex parent. Use justify-content and align-items to arrange children.",
            code: `.row {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`,
            quiz: {
              question: "What centers items vertically in a flex row?",
              options: ["justify-content", "align-items", "text-align", "vertical-align"],
              answer: 1,
            },
            xp: 20,
          },
        ],
      },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript Basics",
    tagline: "Make it interactive",
    color: "from-yellow-300 to-amber-500",
    emoji: "⚡",
    modules: [
      {
        id: "js-basics",
        title: "Language Core",
        lessons: [
          {
            id: "js-1",
            title: "Variables",
            intro: "Store and reuse values.",
            body: "Use let for values that change and const for values that don't. var is legacy — avoid it.",
            code: `const name = "Ada";\nlet score = 0;\nscore = score + 10;`,
            quiz: {
              question: "Which keyword creates a constant?",
              options: ["var", "let", "const", "static"],
              answer: 2,
            },
            xp: 10,
          },
          {
            id: "js-2",
            title: "Functions",
            intro: "Reusable blocks of logic.",
            body: "Functions take inputs and return outputs. Arrow functions are the modern shorthand.",
            code: `const add = (a, b) => a + b;\nadd(2, 3); // 5`,
            quiz: {
              question: "What does add(2, 3) return?",
              options: ["23", "5", "undefined", "NaN"],
              answer: 1,
            },
            xp: 15,
          },
          {
            id: "js-3",
            title: "Arrays",
            intro: "Collections of values.",
            body: "Arrays hold ordered lists. Use .map, .filter, .reduce to transform them.",
            code: `const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2);`,
            quiz: {
              question: "What is doubled[1]?",
              options: ["1", "2", "4", "6"],
              answer: 2,
            },
            xp: 20,
          },
        ],
      },
    ],
  },
];

export function getPath(id: string) {
  return PATHS.find((p) => p.id === id);
}

export function getLesson(pathId: string, lessonId: string) {
  const p = getPath(pathId);
  if (!p) return null;
  for (const m of p.modules) {
    const l = m.lessons.find((x) => x.id === lessonId);
    if (l) return { path: p, module: m, lesson: l };
  }
  return null;
}

export function getNextLesson(pathId: string, lessonId: string) {
  const p = getPath(pathId);
  if (!p) return null;
  const flat = p.modules.flatMap((m) => m.lessons);
  const idx = flat.findIndex((l) => l.id === lessonId);
  return idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
}

export const BADGES: Record<string, { name: string; emoji: string; desc: string }> = {
  "first-step": { name: "First Step", emoji: "🌱", desc: "Completed your first lesson" },
  "on-a-roll": { name: "On a Roll", emoji: "🔥", desc: "Completed 5 lessons" },
  "streak-3": { name: "3-Day Streak", emoji: "⚡", desc: "Practiced 3 days in a row" },
};
