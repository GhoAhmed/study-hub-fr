import { useState, useRef, useEffect } from "react";
import {
  MdAdd,
  MdDelete,
  MdDragIndicator,
  MdCode,
  MdTitle,
  MdNotes,
  MdLightbulb,
  MdRemove,
  MdFormatListBulleted,
} from "react-icons/md";

// ── Block type definitions ────────────────────────────────────────
const BLOCK_TYPES = [
  {
    type: "heading",
    icon: <MdTitle size={16} />,
    label: "Heading",
    desc: "H2 / H3 title",
  },
  {
    type: "paragraph",
    icon: <MdNotes size={16} />,
    label: "Paragraph",
    desc: "Plain text",
  },
  {
    type: "code",
    icon: <MdCode size={16} />,
    label: "Code",
    desc: "Syntax-highlighted block",
  },
  {
    type: "callout",
    icon: <MdLightbulb size={16} />,
    label: "Callout",
    desc: "Info / Warning / Tip",
  },
  {
    type: "bulletList",
    icon: <MdFormatListBulleted size={16} />,
    label: "List",
    desc: "Bullet list",
  },
  {
    type: "divider",
    icon: <MdRemove size={16} />,
    label: "Divider",
    desc: "Horizontal line",
  },
];

const defaultData = (type) =>
  ({
    heading: { text: "", level: 2 },
    paragraph: { text: "" },
    code: { text: "", language: "javascript" },
    callout: { text: "", style: "info" },
    bulletList: { items: [""] },
    divider: {},
  })[type];

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "bash",
  "json",
  "sql",
  "java",
  "cpp",
];

// ── Individual block editor components ───────────────────────────

function HeadingBlock({ data, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <select
        className="input text-xs py-1.5 w-20 shrink-0"
        value={data.level}
        onChange={(e) => onChange({ ...data, level: Number(e.target.value) })}
      >
        <option value={1}>H1</option>
        <option value={2}>H2</option>
        <option value={3}>H3</option>
      </select>
      <input
        className="input w-full font-display font-bold"
        style={{
          fontSize:
            data.level === 1 ? "1.5rem" : data.level === 2 ? "1.2rem" : "1rem",
        }}
        value={data.text}
        placeholder="Type your heading here..."
        onFocus={(e) => e.target.select()}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
      />
    </div>
  );
}

function ParagraphBlock({ data, onChange }) {
  return (
    <textarea
      className="input w-full resize-none text-sm leading-relaxed min-h-[80px]"
      value={data.text}
      placeholder="Write something..."
      rows={3}
      onChange={(e) => onChange({ ...data, text: e.target.value })}
    />
  );
}

function CodeBlock({ data, onChange }) {
  return (
    <div
      className="flex flex-col gap-2 rounded-xl overflow-hidden border"
      style={{ borderColor: "var(--color-border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="flex gap-1.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: "var(--color-danger)" }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: "#fbbf24" }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
        </div>
        <select
          className="ml-auto text-xs bg-transparent border-none outline-none cursor-pointer"
          style={{ color: "var(--color-muted)" }}
          value={data.language}
          onChange={(e) => onChange({ ...data, language: e.target.value })}
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className="w-full p-4 text-sm font-mono resize-none min-h-[120px] outline-none bg-transparent leading-relaxed"
        style={{
          color: "var(--color-accent)",
          caretColor: "var(--color-text)",
        }}
        value={data.text}
        placeholder={`// Write your ${data.language} code here...`}
        spellCheck={false}
        rows={6}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
      />
    </div>
  );
}

function CalloutBlock({ data, onChange }) {
  const styles = {
    info: {
      bg: "rgba(108,71,255,0.08)",
      border: "rgba(108,71,255,0.25)",
      color: "var(--color-primary)",
      emoji: "💡",
    },
    warning: {
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.25)",
      color: "#fbbf24",
      emoji: "⚠️",
    },
    success: {
      bg: "rgba(0,229,176,0.08)",
      border: "rgba(0,229,176,0.25)",
      color: "var(--color-accent)",
      emoji: "✅",
    },
    error: {
      bg: "rgba(255,107,107,0.08)",
      border: "rgba(255,107,107,0.25)",
      color: "var(--color-danger)",
      emoji: "🚨",
    },
  };
  const s = styles[data.style] || styles.info;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {Object.entries(styles).map(([key, val]) => (
          <button
            key={key}
            onClick={() => onChange({ ...data, style: key })}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize"
            style={{
              background: data.style === key ? val.bg : "var(--color-surface2)",
              color: data.style === key ? val.color : "var(--color-muted)",
              border: `1px solid ${data.style === key ? val.border : "transparent"}`,
            }}
          >
            {val.emoji} {key}
          </button>
        ))}
      </div>
      <div
        className="flex gap-3 p-4 rounded-xl"
        style={{ background: s.bg, border: `1px solid ${s.border}` }}
      >
        <span className="text-lg shrink-0">{s.emoji}</span>
        <textarea
          className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed"
          style={{ color: "var(--color-text)" }}
          value={data.text}
          placeholder="Write your note here..."
          rows={2}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
        />
      </div>
    </div>
  );
}

function BulletListBlock({ data, onChange }) {
  const updateItem = (i, val) => {
    const items = [...(data.items || [])];
    items[i] = val;
    onChange({ ...data, items });
  };
  const addItem = () =>
    onChange({ ...data, items: [...(data.items || []), ""] });
  const removeItem = (i) => {
    const items = data.items.filter((_, idx) => idx !== i);
    onChange({ ...data, items: items.length ? items : [""] });
  };
  const handleKeyDown = (e, i) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
    if (e.key === "Backspace" && !data.items[i] && data.items.length > 1) {
      e.preventDefault();
      removeItem(i);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {(data.items || [""]).map((item, i) => (
        <div key={i} className="flex items-center gap-2 group/item">
          <span
            className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
            style={{ background: "var(--color-primary)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>
          <input
            className="input flex-1 text-sm py-1.5"
            value={item}
            placeholder={`List item ${i + 1}...`}
            onChange={(e) => updateItem(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
          <button
            onClick={() => removeItem(i)}
            className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 rounded text-muted hover:text-danger"
          >
            <MdDelete size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-1.5 text-xs mt-1 transition-colors"
        style={{ color: "var(--color-primary)" }}
      >
        <MdAdd size={14} /> Add item
      </button>
    </div>
  );
}

// ── Main BlockEditor ──────────────────────────────────────────────
export default function BlockEditor({ blocks = [], onChange }) {
  const [showAddMenu, setShowAddMenu] = useState(null); // index where to insert
  const [dragging, setDragging] = useState(null);
  const dragOver = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editorRef.current && !editorRef.current.contains(e.target)) {
        setShowAddMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addBlock = (type, afterIndex) => {
    const newBlock = {
      // eslint-disable-next-line react-hooks/purity
      _id: Date.now().toString(),
      type,
      data: defaultData(type),
    };
    const next = [...blocks];
    next.splice(afterIndex + 1, 0, newBlock);
    onChange(next);
    setShowAddMenu(null);
  };

  const updateBlock = (index, data) => {
    const next = [...blocks];
    next[index] = { ...next[index], data };
    onChange(next);
  };

  const deleteBlock = (index) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  // Drag reorder
  const onDragStart = (i) => setDragging(i);
  const onDragEnter = (i) => {
    dragOver.current = i;
  };
  const onDragEnd = () => {
    if (
      dragging === null ||
      dragOver.current === null ||
      dragging === dragOver.current
    ) {
      setDragging(null);
      dragOver.current = null;
      return;
    }
    const next = [...blocks];
    const [moved] = next.splice(dragging, 1);
    next.splice(dragOver.current, 0, moved);
    onChange(next);
    setDragging(null);
    dragOver.current = null;
  };

  const renderBlockEditor = (block, index) => {
    const props = { data: block.data, onChange: (d) => updateBlock(index, d) };
    switch (block.type) {
      case "heading":
        return <HeadingBlock {...props} />;
      case "paragraph":
        return <ParagraphBlock {...props} />;
      case "code":
        return <CodeBlock {...props} />;
      case "callout":
        return <CalloutBlock {...props} />;
      case "bulletList":
        return <BulletListBlock {...props} />;
      case "divider":
        return <hr style={{ borderColor: "var(--color-border)" }} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-1" ref={editorRef}>
      {blocks.length === 0 && (
        <div className="relative">
          <div
            className="flex flex-col items-center py-10 rounded-xl text-center cursor-pointer hover:bg-surface2 transition-colors"
            style={{ border: "1px dashed var(--color-border)" }}
            onClick={() =>
              setShowAddMenu(showAddMenu === "empty" ? null : "empty")
            }
          >
            <MdAdd size={24} className="mb-2 text-muted" />
            <p className="text-sm text-muted">Click to add your first block</p>
            <p
              className="text-xs text-muted mt-1"
              style={{ color: "var(--color-primary)" }}
            >
              heading · paragraph · code · callout · list
            </p>
          </div>

          {showAddMenu === "empty" && (
            <div
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 w-56"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              {BLOCK_TYPES.map((bt) => (
                <button
                  key={bt.type}
                  onClick={() => {
                    const newBlock = {
                      _id: Date.now().toString(),
                      type: bt.type,
                      data: defaultData(bt.type),
                    };
                    onChange([newBlock]);
                    setShowAddMenu(null);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left hover:bg-surface2 transition-colors"
                >
                  <span style={{ color: "var(--color-primary)" }}>
                    {bt.icon}
                  </span>
                  <div>
                    <p className="font-medium leading-none">{bt.label}</p>
                    <p className="text-xs text-muted mt-0.5">{bt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {blocks.map((block, index) => (
        <div
          key={block._id || index}
          className="group/block relative"
          draggable
          onDragStart={() => onDragStart(index)}
          onDragEnter={() => onDragEnter(index)}
          onDragEnd={onDragEnd}
          style={{
            opacity: dragging === index ? 0.4 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {/* Block wrapper */}
          <div className="flex gap-2 items-start py-1">
            {/* Drag handle */}
            <div className="flex flex-col gap-1 pt-2 opacity-0 group-hover/block:opacity-100 transition-opacity shrink-0">
              <button className="p-1 rounded text-muted hover:text-text cursor-grab active:cursor-grabbing">
                <MdDragIndicator size={16} />
              </button>
            </div>

            {/* Block content */}
            <div className="flex-1 min-w-0">
              {renderBlockEditor(block, index)}
            </div>

            {/* Delete */}
            <button
              onClick={() => deleteBlock(index)}
              className="opacity-0 group-hover/block:opacity-100 transition-opacity p-1.5 rounded-lg mt-1 shrink-0 text-muted hover:text-danger hover:bg-surface2"
            >
              <MdDelete size={15} />
            </button>
          </div>

          {/* Add block button between blocks */}
          <div className="relative h-5 flex items-center justify-center opacity-0 group-hover/block:opacity-100 transition-opacity">
            <div
              className="absolute inset-x-0 h-px"
              style={{ background: "var(--color-border)" }}
            />
            <button
              onClick={() =>
                setShowAddMenu(showAddMenu === index ? null : index)
              }
              className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shadow-md transition-transform hover:scale-110"
              style={{ background: "var(--color-primary)" }}
            >
              <MdAdd size={12} />
            </button>

            {/* Add menu */}
            {showAddMenu === index && (
              <div
                className="absolute top-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 w-52"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type, index)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left hover:bg-surface2 transition-colors"
                  >
                    <span style={{ color: "var(--color-primary)" }}>
                      {bt.icon}
                    </span>
                    <div>
                      <p className="font-medium leading-none">{bt.label}</p>
                      <p className="text-xs text-muted mt-0.5">{bt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {/* Bottom add button */}
      {blocks.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(showAddMenu === "end" ? null : "end")}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all hover:bg-surface2"
            style={{
              border: "1px dashed var(--color-border)",
              color: "var(--color-muted)",
            }}
          >
            <MdAdd size={16} /> Add Block
          </button>

          {showAddMenu === "end" && (
            <div
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 w-52"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              {BLOCK_TYPES.map((bt) => (
                <button
                  key={bt.type}
                  onClick={() => {
                    const newBlock = {
                      _id: Date.now().toString(),
                      type: bt.type,
                      data: defaultData(bt.type),
                    };
                    onChange([...blocks, newBlock]);
                    setShowAddMenu(null);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left hover:bg-surface2 transition-colors"
                >
                  <span style={{ color: "var(--color-primary)" }}>
                    {bt.icon}
                  </span>
                  <div>
                    <p className="font-medium leading-none">{bt.label}</p>
                    <p className="text-xs text-muted mt-0.5">{bt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
