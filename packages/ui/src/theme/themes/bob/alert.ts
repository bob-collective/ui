import { rounded, spacing, fontSize, typography } from '../../core';
import { AlertTheme } from '../../components';

import { color } from './colors';

const alert: AlertTheme = {
  base: {
    ...typography('s'),
    color: color('dark'),
    padding: `${spacing('md')} ${spacing('xl')}`,
    borderRadius: rounded('md')
  },
  icon: {
    padding: `${spacing('s')} 0`,
    marginRight: spacing('md')
  },
  title: {
    fontSize: fontSize('md', 'rem'),
    marginBottom: spacing('s')
  },
  content: {
    padding: `${spacing('s')} 0`
  },
  closeBtn: {
    width: spacing('4xl'),
    height: spacing('4xl')
  },
  closeBtnWrapper: {
    marginRight: `-${spacing('md')}`
  },
  status: {
    success: {
      filled: {
        base: {
          backgroundColor: color('green-400'),
          color: color('dark')
        },
        icon: {
          color: color('dark')
        },
        title: {
          color: color('dark')
        }
      },
      outlined: {
        base: {
          backgroundColor: color('green-900'),
          border: `1px solid ${color('green-400')}`,
          color: color('light')
        },
        icon: {
          color: color('green-400')
        },
        title: {
          color: color('green-400')
        }
      },
      default: {
        base: {
          backgroundColor: color('green-900'),
          color: color('light')
        },
        icon: {
          color: color('green-400')
        },
        title: {
          color: color('green-400')
        }
      }
    },
    error: {
      filled: {
        base: {
          backgroundColor: color('red-600'),
          color: color('dark')
        },
        icon: {
          color: color('dark')
        },
        title: {
          color: color('dark')
        }
      },
      outlined: {
        base: {
          backgroundColor: color('red-900'),
          border: `1px solid ${color('red-600')}`,
          color: color('light')
        },
        icon: {
          color: color('red-600')
        },
        title: {
          color: color('red-600')
        }
      },
      default: {
        base: {
          backgroundColor: color('red-900'),
          color: color('light')
        },
        icon: {
          color: color('red-600')
        },
        title: {
          color: color('red-600')
        }
      }
    },
    info: {
      filled: {
        base: {
          backgroundColor: color('blue-400'),
          color: color('dark')
        },
        icon: {
          color: color('dark')
        },
        title: {
          color: color('dark')
        }
      },
      outlined: {
        base: {
          backgroundColor: color('blue-900'),
          border: `1px solid ${color('blue-400')}`,
          color: color('light')
        },
        icon: {
          color: color('blue-400')
        },
        title: {
          color: color('blue-400')
        }
      },
      default: {
        base: {
          backgroundColor: color('blue-900'),
          color: color('light')
        },
        icon: {
          color: color('blue-400')
        },
        title: {
          color: color('blue-400')
        }
      }
    },
    warning: {
      filled: {
        base: {
          backgroundColor: color('yellow-500'),
          color: color('dark')
        },
        icon: {
          color: color('dark')
        },
        title: {
          color: color('dark')
        }
      },
      outlined: {
        base: {
          backgroundColor: color('yellow-900'),
          border: `1px solid ${color('yellow-500')}`,
          color: color('light')
        },
        icon: {
          color: color('yellow-500')
        },
        title: {
          color: color('yellow-500')
        }
      },
      default: {
        base: {
          backgroundColor: color('yellow-900'),
          color: color('light')
        },
        icon: {
          color: color('yellow-500')
        },
        title: {
          color: color('yellow-500')
        }
      }
    }
  }
};

export { alert };
