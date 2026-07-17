import { useMemo } from 'react';
import { ASSISTANT_VARIANTS } from '../constants/labFlavorText';
import { LEARNING_CONTENT, GATE_TO_LESSON_ID } from '../constants/learningContent';

// action: gate/event name (e.g. "H0", "MEASURE", "START")
// seed: anything that changes each time the same action recurs (e.g. circuit length)
// so re-applying the same gate later doesn't show identical commentary.
// onViewLesson: optional callback(lessonId) — wired up from App.jsx to jump to the
// matching Quantum Learning Centre lesson, closing the loop between Simulator and Resources.
const QuantumLearningAssistant = ({ action = "START", seed = 0, onViewLesson }) => {
    const relatedLessonId = GATE_TO_LESSON_ID[action];
    const relatedLesson = relatedLessonId
        ? LEARNING_CONTENT.learn.find((lesson) => lesson.id === relatedLessonId)
        : null;

    const info = useMemo(() => {
        const variants = ASSISTANT_VARIANTS[action] || ASSISTANT_VARIANTS.START;
        const index = Math.abs((seed + action.length) * 31 + seed) % variants.length;
        return variants[index];
    }, [action, seed]);

    return (

        <div className="mt-6 border-2 border-black rounded-lg p-5 bg-white shadow-lg animate-fade-in" key={`${action}-${seed}`}>

            <h3 className="text-2xl font-extrabold mb-4">
                Quantum Learning Assistant
            </h3>

            <div className="space-y-3">

                <div>
                    <strong>Gate Applied</strong>
                    <p>{info.title}</p>
                </div>

                <div>
                    <strong>What Happened?</strong>
                    <p>{info.happened}</p>
                </div>

                <div>
                    <strong>Why?</strong>
                    <p>{info.why}</p>
                </div>

                <div>
                    <strong>Try Next</strong>
                    <p>{info.next}</p>
                </div>

            </div>

            {relatedLesson && onViewLesson && (
                <button
                    onClick={() => onViewLesson(relatedLesson.id)}
                    className="mt-4 text-sm font-bold underline hover:no-underline"
                    aria-label={`Read the related lesson: ${relatedLesson.title}`}
                >
                    📖 Related Lesson: {relatedLesson.title}
                </button>
            )}

        </div>

    );

};

export default QuantumLearningAssistant;
