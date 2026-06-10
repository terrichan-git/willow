/* @ds-bundle: {"format":3,"namespace":"WillowDesignSystem_6e2456","components":[{"name":"ChatBubble","sourcePath":"components/companion/ChatBubble.jsx"},{"name":"TaskRow","sourcePath":"components/companion/TaskRow.jsx"},{"name":"VoiceWave","sourcePath":"components/companion/VoiceWave.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"ProgressBar","sourcePath":"components/display/ProgressBar.jsx"},{"name":"Tabs","sourcePath":"components/display/Tabs.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"}],"sourceHashes":{"components/companion/ChatBubble.jsx":"e121320732a5","components/companion/TaskRow.jsx":"4c23cd3e789d","components/companion/VoiceWave.jsx":"0bc3f04462c2","components/display/Avatar.jsx":"9a753b537c37","components/display/Badge.jsx":"3b5cdc936e2d","components/display/Card.jsx":"c82b3675fa7d","components/display/ProgressBar.jsx":"791d8f82db46","components/display/Tabs.jsx":"3021c4f2a61a","components/forms/Button.jsx":"1924c5c859c1","components/forms/Checkbox.jsx":"68c4d18e436c","components/forms/Input.jsx":"255d956286c0","components/forms/Select.jsx":"daf304702c58","components/forms/Switch.jsx":"0567d0eeccaa","components/icons/Icon.jsx":"f8683dc376a4","ui_kits/app/AppShell.jsx":"7690ed76c590","ui_kits/app/CompanionScreen.jsx":"0db45b0aae3b","ui_kits/app/DashboardScreen.jsx":"32791b544380","ui_kits/app/VaultScreen.jsx":"cc2f46cd1d12","ui_kits/website/HomeSections.jsx":"7412c7dbcd5e","ui_kits/website/SiteChrome.jsx":"95ad1f10b7a5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WillowDesignSystem_6e2456 = window.WillowDesignSystem_6e2456 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/companion/TaskRow.jsx
try { (() => {
const statusMap = {
  done: {
    label: 'Done',
    bg: 'var(--status-success-soft)',
    fg: 'var(--status-success)'
  },
  progress: {
    label: 'In progress',
    bg: 'var(--status-pending-soft)',
    fg: 'var(--status-pending)'
  },
  todo: {
    label: 'Not started',
    bg: 'var(--willow-chalk-deep)',
    fg: 'var(--text-muted)'
  }
};
function TaskRow({
  title,
  detail,
  status = 'todo',
  icon,
  onClick,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  const s = statusMap[status] || statusMap.todo;
  const done = status === 'done';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    role: onClick ? 'button' : undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '14px 18px',
      borderRadius: 'var(--radius-md)',
      background: hover && onClick ? 'var(--willow-sage-mist)' : 'transparent',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'var(--transition-soft)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      flexShrink: 0,
      background: done ? 'var(--willow-teal)' : 'var(--willow-sage-soft)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, done ? /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--willow-chalk)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })) : icon ? icon : /*#__PURE__*/React.createElement("span", {
    style: {
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      background: 'var(--willow-teal)',
      opacity: status === 'progress' ? 1 : 0.35
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      color: done ? 'var(--text-muted)' : 'var(--text-display)',
      textDecoration: done ? 'line-through' : 'none',
      textDecorationColor: 'var(--border-soft)'
    }
  }, title), detail ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)',
      marginTop: '2px'
    }
  }, detail) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      fontSize: '12px',
      padding: '4px 12px',
      borderRadius: 'var(--radius-pill)',
      background: s.bg,
      color: s.fg,
      whiteSpace: 'nowrap'
    }
  }, s.label), onClick ? /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-faint)",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 18 6-6-6-6"
  })) : null);
}
Object.assign(__ds_scope, { TaskRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/companion/TaskRow.jsx", error: String((e && e.message) || e) }); }

// components/companion/VoiceWave.jsx
try { (() => {
function VoiceWave({
  bars = 24,
  active = false,
  color,
  height = 28,
  style = {}
}) {
  // deterministic gentle profile
  const heights = Array.from({
    length: bars
  }, (_, i) => {
    const t = i / (bars - 1);
    const envelope = Math.sin(t * Math.PI);
    const detail = 0.55 + 0.45 * Math.sin(i * 2.7 + 1.3) * Math.cos(i * 1.1);
    return Math.max(0.14, envelope * detail);
  });
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '3px',
      height: `${height}px`,
      ...style
    }
  }, heights.map((h, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: '3px',
      borderRadius: 'var(--radius-pill)',
      background: color || 'var(--willow-sage)',
      height: `${Math.round(h * height)}px`,
      animation: active ? `willowWave 1.6s var(--ease-out-soft) ${i * 0.07}s infinite alternate` : 'none'
    }
  })), /*#__PURE__*/React.createElement("style", null, `
        @keyframes willowWave {
          from { transform: scaleY(0.5); }
          to { transform: scaleY(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes willowWave { from { transform: none; } to { transform: none; } }
        }
      `));
}
Object.assign(__ds_scope, { VoiceWave });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/companion/VoiceWave.jsx", error: String((e && e.message) || e) }); }

// components/companion/ChatBubble.jsx
try { (() => {
function ChatBubble({
  from = 'willow',
  children,
  voice = false,
  playing = false,
  timestamp,
  onPlay,
  style = {}
}) {
  const isUser = from === 'user';
  const isCompanion = from === 'companion';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '78%',
      padding: voice ? '14px 18px' : '12px 18px',
      borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
      background: isUser ? 'var(--willow-teal)' : isCompanion ? 'var(--surface-inverse)' : 'var(--surface-card)',
      border: from === 'willow' ? 'var(--border-card)' : 'none',
      color: isUser ? 'var(--text-on-action)' : isCompanion ? 'var(--willow-chalk)' : 'var(--text-body)',
      boxShadow: 'var(--shadow-card)'
    }
  }, voice ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onPlay,
    "aria-label": playing ? 'Pause' : 'Play',
    style: {
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      background: isCompanion ? 'rgba(236,242,236,0.14)' : 'var(--willow-sage-soft)',
      color: isCompanion ? 'var(--willow-chalk)' : 'var(--willow-onyx)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'var(--transition-soft)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "none"
  }, playing ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "4",
    width: "4",
    height: "16",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "4",
    width: "4",
    height: "16",
    rx: "1.5"
  })) : /*#__PURE__*/React.createElement("path", {
    d: "M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z"
  }))), /*#__PURE__*/React.createElement(__ds_scope.VoiceWave, {
    active: playing,
    color: isCompanion ? 'rgba(236,242,236,0.7)' : undefined
  })) : null, children ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: isCompanion ? 'italic 400 16px/1.5 var(--font-serif-display)' : 'var(--type-body)',
      marginTop: voice && children ? '10px' : 0
    }
  }, children) : null, timestamp ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      opacity: 0.65,
      marginTop: '6px'
    }
  }, timestamp) : null));
}
Object.assign(__ds_scope, { ChatBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/companion/ChatBubble.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
const sizesAvatar = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 72
};
function Avatar({
  name = '',
  src,
  size = 'md',
  style = {}
}) {
  const px = sizesAvatar[size] || sizesAvatar.md;
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  return /*#__PURE__*/React.createElement("span", {
    title: name,
    style: {
      width: `${px}px`,
      height: `${px}px`,
      borderRadius: '50%',
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--willow-sage-soft)',
      color: 'var(--willow-onyx)',
      fontFamily: 'var(--font-serif-display)',
      fontWeight: 500,
      fontSize: `${Math.round(px * 0.38)}px`,
      overflow: 'hidden',
      border: '1px solid var(--border-hairline)',
      boxSizing: 'border-box',
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
const tones = {
  sage: {
    background: 'var(--willow-sage-soft)',
    color: 'var(--willow-onyx)'
  },
  teal: {
    background: 'var(--status-success-soft)',
    color: 'var(--willow-teal)'
  },
  pending: {
    background: 'var(--status-pending-soft)',
    color: 'var(--status-pending)'
  },
  clay: {
    background: 'var(--status-error-soft)',
    color: 'var(--status-error)'
  },
  chalk: {
    background: 'var(--willow-chalk-deep)',
    color: 'var(--text-muted)'
  }
};
function Badge({
  children,
  tone = 'sage',
  dot = false,
  style = {}
}) {
  const t = tones[tone] || tones.sage;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      font: 'var(--type-label)',
      fontSize: '12.5px',
      padding: '4px 12px',
      borderRadius: 'var(--radius-pill)',
      whiteSpace: 'nowrap',
      ...t,
      ...style
    }
  }, dot ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: 'currentColor'
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function Card({
  children,
  padding = '24px',
  interactive = false,
  inverse = false,
  onClick,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: inverse ? 'var(--surface-inverse)' : 'var(--surface-card)',
      border: inverse ? '1px solid rgba(236,242,236,0.08)' : 'var(--border-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: interactive && hover ? 'var(--shadow-raised)' : 'var(--shadow-card)',
      transform: interactive && hover ? 'translateY(-2px)' : 'none',
      transition: 'var(--transition-soft)',
      cursor: interactive ? 'pointer' : 'default',
      padding,
      boxSizing: 'border-box',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  label,
  sublabel,
  showValue = true,
  style = {}
}) {
  const pct = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      ...style
    }
  }, label || showValue ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '12px'
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-display)'
    }
  }, label) : /*#__PURE__*/React.createElement("span", null), showValue ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-serif-display)',
      fontSize: '17px',
      fontWeight: 450,
      color: 'var(--willow-teal)'
    }
  }, pct, "%") : null) : null, /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuenow": pct,
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    style: {
      height: '8px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--willow-chalk-deep)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: '100%',
      borderRadius: 'var(--radius-pill)',
      background: 'linear-gradient(90deg, var(--willow-sage), var(--willow-teal))',
      transition: 'width var(--duration-slow) var(--ease-out-soft)'
    }
  })), sublabel ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)'
    }
  }, sublabel) : null);
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/display/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  active,
  defaultActive,
  onChange,
  style = {}
}) {
  const [internal, setInternal] = React.useState(defaultActive ?? (items[0] && (items[0].id ?? items[0])));
  const isControlled = active !== undefined;
  const current = isControlled ? active : internal;
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'inline-flex',
      gap: '4px',
      padding: '4px',
      background: 'var(--willow-chalk-deep)',
      borderRadius: 'var(--radius-pill)',
      ...style
    }
  }, items.map(item => {
    const it = typeof item === 'string' ? {
      id: item,
      label: item
    } : item;
    const selected = it.id === current;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      role: "tab",
      "aria-selected": selected,
      onClick: () => {
        if (!isControlled) setInternal(it.id);
        if (onChange) onChange(it.id);
      },
      style: {
        font: 'var(--type-label)',
        fontSize: '13.5px',
        fontFamily: 'var(--font-sans-body)',
        padding: '8px 18px',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-pill)',
        background: selected ? 'var(--surface-raised)' : 'transparent',
        color: selected ? 'var(--willow-onyx)' : 'var(--text-muted)',
        boxShadow: selected ? '0 1px 3px rgba(28,58,46,0.10)' : 'none',
        transition: 'var(--transition-soft)'
      }
    }, it.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: 'var(--font-sans-body)',
  fontWeight: 500,
  border: '1px solid transparent',
  borderRadius: 'var(--radius-pill)',
  cursor: 'pointer',
  transition: 'var(--transition-soft)',
  whiteSpace: 'nowrap',
  textDecoration: 'none'
};
const sizes = {
  sm: {
    fontSize: '13.5px',
    padding: '7px 16px',
    minHeight: '32px'
  },
  md: {
    fontSize: '14.5px',
    padding: '10px 22px',
    minHeight: '40px'
  },
  lg: {
    fontSize: '16px',
    padding: '13px 28px',
    minHeight: '48px'
  }
};
const variants = {
  primary: {
    background: 'var(--surface-action)',
    color: 'var(--text-on-action)',
    hover: {
      background: 'var(--surface-action-hover)'
    }
  },
  secondary: {
    background: 'transparent',
    color: 'var(--willow-teal)',
    border: '1px solid var(--border-soft)',
    hover: {
      background: 'var(--willow-sage-mist)',
      borderColor: 'var(--border-strong)'
    }
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-body)',
    hover: {
      background: 'var(--willow-sage-mist)'
    }
  },
  inverse: {
    background: 'var(--willow-chalk)',
    color: 'var(--willow-onyx)',
    hover: {
      background: '#FFFFFF'
    }
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon = null,
  onClick,
  type = 'button',
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const v = variants[variant] || variants.primary;
  const {
    hover: hoverStyle,
    ...rest
  } = v;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      ...base,
      ...sizes[size],
      ...rest,
      ...(hover && !disabled ? hoverStyle : {}),
      ...(press && !disabled ? {
        transform: 'translateY(0.5px)'
      } : {}),
      ...(fullWidth ? {
        width: '100%'
      } : {}),
      ...(disabled ? {
        opacity: 0.45,
        cursor: 'not-allowed'
      } : {}),
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: '17px',
      height: '17px'
    },
    "aria-hidden": "true"
  }, icon) : null, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  style = {}
}) {
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    if (onChange) onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: on,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: '20px',
      height: '20px',
      boxSizing: 'border-box',
      flexShrink: 0,
      borderRadius: '7px',
      border: `1.5px solid ${on ? 'var(--willow-teal)' : 'var(--border-soft)'}`,
      background: on ? 'var(--willow-teal)' : 'var(--surface-raised)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-soft)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--willow-chalk)",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      opacity: on ? 1 : 0,
      transition: 'opacity var(--duration-fast) var(--ease-out-soft)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-body)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  helper,
  error,
  value,
  defaultValue,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  multiline = false,
  rows = 3,
  style = {}
}) {
  const [focus, setFocus] = React.useState(false);
  const id = React.useId();
  const fieldStyle = {
    width: '100%',
    boxSizing: 'border-box',
    font: 'var(--type-body)',
    color: 'var(--text-body)',
    background: disabled ? 'var(--surface-sunken)' : 'var(--surface-raised)',
    border: `1px solid ${error ? 'var(--status-error)' : focus ? 'var(--border-focus)' : 'var(--border-hairline)'}`,
    borderRadius: 'var(--radius-md)',
    padding: multiline ? '12px 16px' : '11px 16px',
    outline: 'none',
    boxShadow: focus ? 'var(--ring-focus)' : 'none',
    transition: 'var(--transition-soft)',
    resize: multiline ? 'vertical' : 'none',
    fontFamily: 'var(--font-sans-body)'
  };
  const shared = {
    id,
    value,
    defaultValue,
    onChange,
    placeholder,
    disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: fieldStyle
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-display)'
    }
  }, label) : null, multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows
  }, shared)) : /*#__PURE__*/React.createElement("input", _extends({
    type: type
  }, shared)), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--status-error)'
    }
  }, error) : helper ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)'
    }
  }, helper) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  helper,
  value,
  defaultValue,
  onChange,
  options = [],
  disabled = false,
  style = {}
}) {
  const [focus, setFocus] = React.useState(false);
  const id = React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-display)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    id: id,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      font: 'var(--type-body)',
      fontFamily: 'var(--font-sans-body)',
      color: 'var(--text-body)',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-raised)',
      border: `1px solid ${focus ? 'var(--border-focus)' : 'var(--border-hairline)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '11px 40px 11px 16px',
      outline: 'none',
      boxShadow: focus ? 'var(--ring-focus)' : 'none',
      transition: 'var(--transition-soft)',
      appearance: 'none',
      WebkitAppearance: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      right: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-muted)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), helper ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)'
    }
  }, helper) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  style = {}
}) {
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    if (onChange) onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    disabled: disabled,
    onClick: toggle,
    style: {
      width: '42px',
      height: '24px',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      padding: '2px',
      background: on ? 'var(--willow-teal)' : 'var(--willow-chalk-deep)',
      display: 'inline-flex',
      alignItems: 'center',
      transition: 'var(--transition-soft)',
      cursor: 'inherit',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'var(--surface-raised)',
      boxShadow: '0 1px 3px rgba(28,58,46,0.18)',
      transform: on ? 'translateX(18px)' : 'translateX(0)',
      transition: 'transform var(--duration-base) var(--ease-out-soft)'
    }
  })), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-body)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
// Generated from assets/icons/*.svg (Lucide, 24x24, stroke 2, round caps).
// Renders inline so icons inherit currentColor.
const iconPaths = {
  'archive': '<rect width="20" height="5" x="2" y="3" rx="1"></rect> <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path> <path d="M10 12h4"></path>',
  'arrow-right': '<path d="M5 12h14"></path> <path d="m12 5 7 7-7 7"></path>',
  'audio-lines': '<path d="M2 10v3"></path> <path d="M6 6v11"></path> <path d="M10 3v18"></path> <path d="M14 8v7"></path> <path d="M18 5v13"></path> <path d="M22 10v3"></path>',
  'bell': '<path d="M10.268 21a2 2 0 0 0 3.464 0"></path> <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>',
  'calendar': '<path d="M8 2v4"></path> <path d="M16 2v4"></path> <rect width="18" height="18" x="3" y="4" rx="2"></rect> <path d="M3 10h18"></path>',
  'check': '<path d="M20 6 9 17l-5-5"></path>',
  'chevron-down': '<path d="m6 9 6 6 6-6"></path>',
  'chevron-right': '<path d="m9 18 6-6-6-6"></path>',
  'circle-check': '<circle cx="12" cy="12" r="10"></circle> <path d="m9 12 2 2 4-4"></path>',
  'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path> <path d="M14 2v4a2 2 0 0 0 2 2h4"></path> <path d="M10 9H8"></path> <path d="M16 13H8"></path> <path d="M16 17H8"></path>',
  'folder-open': '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path>',
  'heart-handshake': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path> <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"></path> <path d="m18 15-2-2"></path> <path d="m15 18-2-2"></path>',
  'house': '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path> <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>',
  'landmark': '<path d="M10 18v-7"></path> <path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"></path> <path d="M14 18v-7"></path> <path d="M18 18v-7"></path> <path d="M3 22h18"></path> <path d="M6 18v-7"></path>',
  'leaf': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path> <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>',
  'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect> <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
  'mail': '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path> <rect x="2" y="4" width="20" height="16" rx="2"></rect>',
  'message-circle': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>',
  'mic': '<path d="M12 19v3"></path> <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path> <rect x="9" y="2" width="6" height="13" rx="3"></rect>',
  'pause': '<rect x="14" y="4" width="4" height="16" rx="1"></rect> <rect x="6" y="4" width="4" height="16" rx="1"></rect>',
  'pen-line': '<path d="M12 20h9"></path> <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"></path>',
  'phone': '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>',
  'play': '<polygon points="6 3 20 12 6 21 6 3"></polygon>',
  'plus': '<path d="M5 12h14"></path> <path d="M12 5v14"></path>',
  'search': '<path d="m21 21-4.34-4.34"></path> <circle cx="11" cy="11" r="8"></circle>',
  'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path> <circle cx="12" cy="12" r="3"></circle>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path> <path d="m9 12 2 2 4-4"></path>',
  'sparkles': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path> <path d="M20 3v4"></path> <path d="M22 5h-4"></path> <path d="M4 17v2"></path> <path d="M5 18H3"></path>',
  'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path> <path d="M16 3.128a4 4 0 0 1 0 7.744"></path> <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path> <circle cx="9" cy="7" r="4"></circle>',
  'x': '<path d="M18 6 6 18"></path> <path d="m6 6 12 12"></path>'
};
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style = {}
}) {
  const inner = iconPaths[name];
  if (!inner) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    }
  });
}
Icon.names = Object.keys(iconPaths);
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
// Willow app shell — fixed sidebar + scrolling canvas.
// Reads design-system primitives from the compiled bundle at render time.

function AppSidebar({
  active,
  onNavigate
}) {
  const DS = window.WillowDesignSystem_6e2456;
  const {
    Icon,
    Avatar
  } = DS;
  const items = [{
    id: 'dashboard',
    label: 'Home',
    icon: 'house'
  }, {
    id: 'vault',
    label: 'Vault',
    icon: 'archive'
  }, {
    id: 'companion',
    label: 'Companion',
    icon: 'message-circle'
  }, {
    id: 'people',
    label: 'Your people',
    icon: 'users'
  }, {
    id: 'settings',
    label: 'Settings',
    icon: 'settings'
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--sidebar-width)',
      flexShrink: 0,
      boxSizing: 'border-box',
      background: 'var(--surface-sunken)',
      borderRight: '1px solid var(--border-hairline)',
      display: 'flex',
      flexDirection: 'column',
      padding: '28px 16px 20px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/willow-lockup-olive.png",
    alt: "Willow",
    style: {
      height: '72px',
      alignSelf: 'center',
      marginBottom: '28px'
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }
  }, items.map(it => {
    const selected = it.id === active;
    const enabled = ['dashboard', 'vault', 'companion'].includes(it.id);
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => enabled && onNavigate(it.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        font: 'var(--type-label)',
        fontFamily: 'var(--font-sans-body)',
        padding: '11px 14px',
        border: 'none',
        textAlign: 'left',
        borderRadius: 'var(--radius-md)',
        cursor: enabled ? 'pointer' : 'default',
        background: selected ? 'var(--surface-card)' : 'transparent',
        color: selected ? 'var(--willow-onyx)' : 'var(--text-muted)',
        boxShadow: selected ? 'var(--shadow-card)' : 'none',
        opacity: enabled ? 1 : 0.45,
        transition: 'var(--transition-soft)'
      },
      onMouseEnter: e => {
        if (!selected && enabled) e.currentTarget.style.background = 'var(--willow-sage-mist)';
      },
      onMouseLeave: e => {
        if (!selected) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 18
    }), it.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 8px'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Eleanor Reyes",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      fontSize: '13px',
      color: 'var(--text-display)'
    }
  }, "Eleanor Reyes"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      fontSize: '11.5px',
      color: 'var(--text-muted)'
    }
  }, "eleanor@reyes.family"))));
}
function AppShell({
  active,
  onNavigate,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100vh',
      background: 'var(--surface-page)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(AppSidebar, {
    active: active,
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      padding: '44px 48px 64px',
      boxSizing: 'border-box'
    }
  }, children)));
}
Object.assign(window, {
  AppShell,
  AppSidebar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/CompanionScreen.jsx
try { (() => {
// Willow companion — the conversation a loved one has with the cloned voice.

function CompanionScreen() {
  const DS = window.WillowDesignSystem_6e2456;
  const {
    Card,
    ChatBubble,
    Button,
    Icon,
    Badge
  } = DS;
  const [playing, setPlaying] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const [messages, setMessages] = React.useState([{
    from: 'user',
    text: 'Mom, I can\u2019t find the papers for the house.'
  }, {
    from: 'companion',
    voice: true,
    text: '"They\u2019re in the green folder, sweetheart. Bottom drawer of my desk. The deed and the insurance are together."',
    time: 'In Mom\u2019s voice'
  }, {
    from: 'willow',
    text: 'The deed for 41 Alder Lane is also verified and stored in the vault. Maya has full access.'
  }]);
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages(m => [...m, {
      from: 'user',
      text
    }, {
      from: 'companion',
      voice: true,
      text: '"One thing at a time, love. Willow and I will walk you through it."',
      time: 'In Mom\u2019s voice'
    }]);
    setDraft('');
  };
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Companion",
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 108px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h1)',
      fontSize: '32px',
      letterSpacing: 'var(--tracking-display)',
      marginBottom: '4px'
    }
  }, "Eleanor\u2019s companion"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "This is what Maya will experience. Your voice, your words, your care.")), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "teal",
    dot: true
  }, "Preview"))), /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '26px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }
  }, messages.map((m, i) => /*#__PURE__*/React.createElement(ChatBubble, {
    key: i,
    from: m.from,
    voice: m.voice,
    playing: m.voice && playing && i === messages.length - 2,
    onPlay: () => setPlaying(!playing),
    timestamp: m.time
  }, m.text))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-hairline)',
      padding: '16px 20px',
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      background: 'var(--surface-raised)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') send();
    },
    placeholder: "Ask anything \u2014 about the estate, or just to hear her voice",
    style: {
      flex: 1,
      font: 'var(--type-body)',
      fontFamily: 'var(--font-sans-body)',
      color: 'var(--text-body)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-pill)',
      padding: '12px 20px',
      outline: 'none',
      background: 'var(--surface-card)'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: send,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    })
  }, "Send"))));
}
Object.assign(window, {
  CompanionScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/CompanionScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/DashboardScreen.jsx
try { (() => {
// Willow dashboard — greeting, estate readiness, next steps, companion status.

function DashboardScreen({
  onNavigate
}) {
  const DS = window.WillowDesignSystem_6e2456;
  const {
    Card,
    ProgressBar,
    TaskRow,
    VoiceWave,
    Badge,
    Button,
    Icon,
    Avatar
  } = DS;
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Dashboard"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-overline)',
      letterSpacing: 'var(--tracking-overline)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      margin: '0 0 10px'
    }
  }, "Tuesday, June 10"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h1)',
      letterSpacing: 'var(--tracking-display)',
      marginBottom: '6px'
    }
  }, "Good afternoon, Eleanor."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--text-muted)',
      margin: '0 0 32px'
    }
  }, "Your estate is in good hands \u2014 yours."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.55fr 1fr',
      gap: '20px',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "28px"
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: 68,
    label: "Estate readiness",
    sublabel: "5 of 9 steps complete \xB7 Willow is verifying 2 accounts for you"
  })), /*#__PURE__*/React.createElement(Card, {
    padding: "14px 10px"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--type-h3)',
      letterSpacing: 'var(--tracking-display)',
      padding: '10px 18px 6px'
    }
  }, "Next steps"), /*#__PURE__*/React.createElement(TaskRow, {
    status: "done",
    title: "Record your voice",
    detail: "14 minutes recorded \xB7 enough for your companion"
  }), /*#__PURE__*/React.createElement(TaskRow, {
    status: "progress",
    title: "Locate your life insurance policy",
    detail: "Willow found 2 likely matches \u2014 review and approve",
    onClick: () => onNavigate('vault')
  }), /*#__PURE__*/React.createElement(TaskRow, {
    status: "todo",
    title: "Choose who receives the house",
    detail: "A 5-minute decision, saved as a wish",
    onClick: () => {}
  }), /*#__PURE__*/React.createElement(TaskRow, {
    status: "todo",
    title: "Leave a note for Maya's wedding day",
    detail: "Willow will hold it until the day comes",
    onClick: () => onNavigate('companion')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    inverse: true,
    padding: "26px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "audio-lines",
    size: 18,
    color: "var(--willow-sage)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-overline)',
      letterSpacing: 'var(--tracking-overline)',
      textTransform: 'uppercase',
      color: 'var(--willow-sage)'
    }
  }, "Your companion")), /*#__PURE__*/React.createElement(VoiceWave, {
    bars: 26,
    height: 30,
    color: "rgba(236,242,236,0.55)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'italic 350 19px/1.45 var(--font-serif-display)',
      color: 'var(--willow-chalk)',
      margin: '16px 0 18px'
    }
  }, "\"Sounding more like you every week.\""), /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "mic",
      size: 15
    })
  }, "Keep recording")), /*#__PURE__*/React.createElement(Card, {
    padding: "24px"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--type-h3)',
      fontSize: '19px',
      letterSpacing: 'var(--tracking-display)',
      marginBottom: '14px'
    }
  }, "Your people"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }
  }, [{
    name: 'Maya Reyes',
    role: 'Daughter · full access'
  }, {
    name: 'Daniel Reyes',
    role: 'Son · accounts only'
  }, {
    name: 'Ruth Alvarez',
    role: 'Sister · letters only'
  }].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.name,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      fontSize: '13.5px',
      color: 'var(--text-display)'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)'
    }
  }, p.role)), /*#__PURE__*/React.createElement(Badge, {
    tone: "chalk"
  }, "Invited"))))))));
}
Object.assign(window, {
  DashboardScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/VaultScreen.jsx
try { (() => {
// Willow vault — accounts, documents and wishes with calm statuses.

const vaultAccounts = [{
  icon: 'landmark',
  name: 'First Federal — checking',
  meta: 'Located by Willow · awaiting your review',
  tone: 'pending',
  status: 'In progress',
  tag: 'Banking'
}, {
  icon: 'shield-check',
  name: 'Meridian Life — term policy',
  meta: 'Verified · Maya receives this',
  tone: 'teal',
  status: 'Verified',
  tag: 'Insurance'
}, {
  icon: 'landmark',
  name: 'Vanguard — retirement',
  meta: 'Verified · split between Maya and Daniel',
  tone: 'teal',
  status: 'Verified',
  tag: 'Retirement'
}, {
  icon: 'file-text',
  name: 'Deed — 41 Alder Lane',
  meta: 'Uploaded by you · stored in the vault',
  tone: 'teal',
  status: 'Verified',
  tag: 'Property'
}, {
  icon: 'landmark',
  name: 'Hillside Credit Union — savings',
  meta: 'Willow found a likely match — confirm it is yours',
  tone: 'clay',
  status: 'Needs attention',
  tag: 'Banking'
}];
function VaultScreen() {
  const DS = window.WillowDesignSystem_6e2456;
  const {
    Card,
    Tabs,
    Input,
    Badge,
    Button,
    Icon
  } = DS;
  const [tab, setTab] = React.useState('Accounts');
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Vault"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '20px',
      marginBottom: '26px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h1)',
      letterSpacing: 'var(--tracking-display)',
      marginBottom: '6px'
    }
  }, "The vault"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "Everything you leave behind, kept safe for the people you choose.")), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    })
  }, "Add an account")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '22px'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: ['Accounts', 'Documents', 'Wishes'],
    active: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: '320px',
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search the vault"
  }))), tab === 'Accounts' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }
  }, vaultAccounts.map(a => /*#__PURE__*/React.createElement(Card, {
    key: a.name,
    interactive: true,
    padding: "18px 22px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '40px',
      height: '40px',
      borderRadius: 'var(--radius-md)',
      flexShrink: 0,
      background: 'var(--willow-sage-mist)',
      color: 'var(--willow-onyx)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 19
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      fontSize: '15px',
      color: 'var(--text-display)'
    }
  }, a.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)',
      marginTop: '2px'
    }
  }, a.meta)), /*#__PURE__*/React.createElement(Badge, {
    tone: "chalk"
  }, a.tag), /*#__PURE__*/React.createElement(Badge, {
    tone: a.tone,
    dot: true
  }, a.status), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    color: "var(--text-faint)"
  }))))) : /*#__PURE__*/React.createElement(Card, {
    padding: "48px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: '380px',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: tab === 'Documents' ? 'folder-open' : 'pen-line',
    size: 28,
    color: "var(--willow-sage)"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--type-h3)',
      fontSize: '20px',
      letterSpacing: 'var(--tracking-display)',
      margin: '14px 0 8px'
    }
  }, "Nothing here yet."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-muted)',
      margin: '0 0 20px'
    }
  }, tab === 'Documents' ? 'When you add a document, Willow keeps it safe for the people you choose.' : 'A wish is a decision written down — who receives what, and the words you want read aloud.'), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, tab === 'Documents' ? 'Upload a document' : 'Write your first wish'))));
}
Object.assign(window, {
  VaultScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/VaultScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeSections.jsx
try { (() => {
// Willow homepage sections — hero, how it works, companion preview, closing quote.

function HomeHero() {
  const {
    Button,
    Icon
  } = window.WillowDesignSystem_6e2456;
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Hero",
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: "url('../../assets/imagery/willow-leaves-hero.png') center/cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(236,242,236,0.97) 0%, rgba(236,242,236,0.88) 42%, rgba(236,242,236,0.25) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: '1160px',
      margin: '0 auto',
      padding: '110px 32px 120px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '560px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-hero)',
      letterSpacing: 'var(--tracking-display)',
      marginBottom: '22px'
    }
  }, "Leave them clarity.", /*#__PURE__*/React.createElement("br", null), "Leave them your voice."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--text-body)',
      margin: '0 0 30px',
      maxWidth: '460px'
    }
  }, "Willow puts your estate gently in order \u2014 accounts, policies, wishes \u2014 and stays with the people you love, speaking in your own voice when they need you most."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg"
  }, "Begin your estate"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "play",
      size: 15
    })
  }, "Hear a companion")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)',
      marginTop: '22px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 14
  }), " Private by design. Nothing is shared until you say so."))));
}
function HomeSteps() {
  const {
    Icon
  } = window.WillowDesignSystem_6e2456;
  const steps = [{
    icon: 'mic',
    title: 'Record your voice',
    body: 'A few quiet conversations are enough. Willow learns how you speak — and how you care.'
  }, {
    icon: 'search',
    title: 'Willow finds what matters',
    body: 'Accounts, policies, deeds. Willow locates and verifies them, and you approve each one.'
  }, {
    icon: 'heart-handshake',
    title: 'They are never alone',
    body: 'When the time comes, your companion guides them through every step — in your voice.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "How it works",
    style: {
      maxWidth: '1160px',
      margin: '0 auto',
      padding: '96px 32px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-overline)',
      letterSpacing: 'var(--tracking-overline)',
      textTransform: 'uppercase',
      color: 'var(--willow-teal)',
      margin: '0 0 12px',
      textAlign: 'center'
    }
  }, "How it works"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h1)',
      letterSpacing: 'var(--tracking-display)',
      textAlign: 'center',
      marginBottom: '56px'
    }
  }, "Three quiet steps"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px'
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.title,
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      padding: '36px 32px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '52px',
      height: '52px',
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--willow-sage-soft)',
      color: 'var(--willow-onyx)',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 23
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--type-h3)',
      letterSpacing: 'var(--tracking-display)',
      marginBottom: '10px'
    }
  }, i + 1, ". ", s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-muted)',
      margin: 0
    }
  }, s.body)))));
}
function HomeCompanion() {
  const {
    ChatBubble,
    VoiceWave
  } = window.WillowDesignSystem_6e2456;
  const [playing, setPlaying] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Companion preview",
    style: {
      background: 'var(--surface-inverse)',
      padding: '96px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '1160px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: '64px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-overline)',
      letterSpacing: 'var(--tracking-overline)',
      textTransform: 'uppercase',
      color: 'var(--willow-sage)',
      margin: '0 0 12px'
    }
  }, "The companion"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h1)',
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--willow-chalk)',
      marginBottom: '18px'
    }
  }, "Still there, when it counts"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'rgba(236,242,236,0.78)',
      margin: '0 0 26px'
    }
  }, "Your companion knows where everything is, what you decided, and the words you would use. It answers questions about the estate \u2014 and sometimes, it just talks."), /*#__PURE__*/React.createElement(VoiceWave, {
    bars: 34,
    height: 34,
    active: playing,
    color: "var(--willow-sage)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement(ChatBubble, {
    from: "user"
  }, "Mom, I can\u2019t find the papers for the house."), /*#__PURE__*/React.createElement(ChatBubble, {
    from: "companion",
    voice: true,
    playing: playing,
    onPlay: () => setPlaying(!playing),
    timestamp: "In Mom\u2019s voice"
  }, "\"They\u2019re in the green folder, sweetheart. The deed and the insurance are together.\""), /*#__PURE__*/React.createElement(ChatBubble, {
    from: "willow"
  }, "The deed is verified and stored in the vault. Would you like me to walk you through the transfer?"))));
}
function HomeClosing() {
  const {
    Button
  } = window.WillowDesignSystem_6e2456;
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Closing",
    style: {
      maxWidth: '760px',
      margin: '0 auto',
      padding: '110px 32px',
      textAlign: 'center',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/willow-leaf-mark.png",
    alt: "",
    style: {
      height: '54px',
      marginBottom: '26px'
    }
  }), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      font: 'var(--type-quote)',
      color: 'var(--text-display)',
      margin: '0 0 14px'
    }
  }, "\"Grief is heavy enough. The paperwork shouldn\u2019t be.\""), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-muted)',
      margin: '0 0 30px'
    }
  }, "Most estates take families 18 months to settle. Willow prepares yours while you\u2019re here to get it right."), /*#__PURE__*/React.createElement(Button, {
    size: "lg"
  }, "Begin your estate"));
}
Object.assign(window, {
  HomeHero,
  HomeSteps,
  HomeCompanion,
  HomeClosing
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeSections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteChrome.jsx
try { (() => {
// Willow site chrome — header + footer.

function SiteHeader() {
  const {
    Button
  } = window.WillowDesignSystem_6e2456;
  const links = ['How it works', 'Security', 'Stories', 'Pricing'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      maxWidth: '1160px',
      margin: '0 auto',
      padding: '22px 32px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/willow-lockup-olive.png",
    alt: "Willow",
    style: {
      height: '52px'
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: '28px',
      marginLeft: 'auto'
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      font: 'var(--type-label)',
      fontSize: '14.5px',
      color: 'var(--text-body)',
      textDecoration: 'none'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Begin")));
}
function SiteFooter() {
  const cols = [{
    h: 'Product',
    items: ['How it works', 'Security', 'Pricing', 'For families']
  }, {
    h: 'Company',
    items: ['About', 'Stories', 'Careers', 'Press']
  }, {
    h: 'Care',
    items: ['Help center', 'Grief resources', 'Contact']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-inverse)',
      padding: '64px 32px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '1160px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: '40px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/willow-lockup-chalk.png",
    alt: "Willow",
    style: {
      height: '78px'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'italic 350 16px/1.5 var(--font-serif-display)',
      color: 'var(--willow-sage)',
      marginTop: '16px'
    }
  }, "Leave them clarity. Leave them your voice.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      font: 'var(--type-overline)',
      letterSpacing: 'var(--tracking-overline)',
      textTransform: 'uppercase',
      color: 'var(--willow-sage)',
      margin: '0 0 14px'
    }
  }, c.h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      font: 'var(--type-body-sm)',
      color: 'rgba(236,242,236,0.75)',
      textDecoration: 'none'
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '1160px',
      margin: '48px auto 0',
      borderTop: '1px solid rgba(236,242,236,0.12)',
      paddingTop: '20px',
      font: 'var(--type-caption)',
      color: 'rgba(236,242,236,0.5)'
    }
  }, "\xA9 2026 Willow. Your estate, gently in order."));
}
Object.assign(window, {
  SiteHeader,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteChrome.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ChatBubble = __ds_scope.ChatBubble;

__ds_ns.TaskRow = __ds_scope.TaskRow;

__ds_ns.VoiceWave = __ds_scope.VoiceWave;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Icon = __ds_scope.Icon;

})();
