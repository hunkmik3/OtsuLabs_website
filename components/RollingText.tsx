interface RollingTextProps {
    text: string;
}

export default function RollingText({ text }: RollingTextProps) {
    return (
        <span className="roll-text" aria-hidden="true">
            {Array.from(text).map((char, index) => {
                const letter = char === " " ? "\u00A0" : char;
                return (
                    <span
                        key={`${char}-${index}`}
                        className="roll-letter"
                        style={{ transitionDelay: `${index * 0.03}s` }}
                    >
                        <span>{letter}</span>
                        <span className="roll-letter-down">{letter}</span>
                    </span>
                );
            })}
        </span>
    );
}
