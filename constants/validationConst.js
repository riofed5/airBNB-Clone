const registerConstraints = {
  username: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  email: {
    presence: {
      message: 'cannot be blank.',
    },
    email: {
      message: 'not valid.',
    },
  },
  full_name: {
    presence: 'cannot be blank.',
  },
  password: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 5,
      message: 'must be at least 5 characters',
    },
  },
  confirmPassword: {
    presence: 'cannot be blank.',
    equality: {
      attribute: 'password',
    },
  },
};

const bookingConstraints = {
  email: {
    presence: {
      message: 'cannot be blank.',
    },
    email: {
      message: 'not valid.',
    },
  },
  full_name: {
    presence: 'cannot be blank.',
  },
};

const uploadConstraints = {
  title: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  description: {
    format: {
      pattern: '^(.{3,})?$',
      flags: 'i',
      message: 'must be at least 3 characters',
    },
  },
  location: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  price: {
    presence: true,
    numericality: {
      greaterThanOrEqualTo: 0,
      message: 'must be a number'
    }
  },
  capacity: {
    presence: true,
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 0,
      message: 'must be an integer number'
    }
  }
};

export { registerConstraints, uploadConstraints, bookingConstraints };
