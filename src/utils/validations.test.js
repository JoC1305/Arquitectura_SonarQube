const {
  actualizarErrorEmail,
  validarConfirmacionClave,
  validarFormatoEmail,
  validarPasswordCompleja,
  validarRequerido,
  validarResena,
} = require('./validations.js');

const runValidationTest = (fn, input, expected) => {
  expect(fn(...input)).toEqual(expected);
};

describe('validarPasswordCompleja', () => {
  const runPasswordTest = (password, expectedValid, expectedErrorMessage) => {
    const resultado = validarPasswordCompleja(password);
    expect(resultado.isValid).toBe(expectedValid);
    if (expectedErrorMessage !== undefined) {
      expect(resultado.errorMessage).toBe(expectedErrorMessage);
    }
  };

  test('debe fallar si la contraseña es muy corta', () => {
    runPasswordTest('Ab1', false, 'La contraseña debe tener al menos 6 caracteres');
  });

  test('debe fallar si falta una mayúscula', () => {
    runPasswordTest('abc1234', false, 'La contraseña debe contener al menos una mayúscula');
  });

  test('debe fallar si falta un número', () => {
    runPasswordTest('Abcdefg', false, 'La contraseña debe contener al menos un número');
  });

  test('debe ser válida si cumple con todos los requisitos', () => {
    runPasswordTest('Abc123', true);
  });
});

describe('validarRequerido', () => {
  const cases = [
    ['', { isValid: false, errorMessage: 'Este campo es requerido' }],
    ['   ', { isValid: false, errorMessage: 'Este campo es requerido' }],
    ['valor', { isValid: true }],
  ];

  test.each(cases)('valida %p', (valor, expected) => {
    runValidationTest(validarRequerido, [valor], expected);
  });
});

describe('validarFormatoEmail', () => {
  const cases = [
    ['correo-invalido', { isValid: false, errorMessage: 'Por favor, ingresa un email válido' }],
    ['usuario@correo.com', { isValid: true }],
  ];

  test.each(cases)('valida %p', (email, expected) => {
    runValidationTest(validarFormatoEmail, [email], expected);
  });
});

describe('validarConfirmacionClave', () => {
  const cases = [
    [['Abc123', 'Abc124'], { isValid: false, errorMessage: 'Las contraseñas no coinciden' }],
    [['Abc123', 'Abc123'], { isValid: true }],
  ];

  test.each(cases)('valida %p', ([password, confirmPassword], expected) => {
    runValidationTest(validarConfirmacionClave, [password, confirmPassword], expected);
  });
});

describe('validarResena', () => {
  const casos = [
    [
      'muy corta',
      undefined,
      {
        isValid: false,
        errorMessage: 'La reseña debe tener al menos 5 palabras.',
        errorCode: 'TOO_SHORT',
      },
    ],
    [
      'uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciseis diecisiete dieciocho diecinueve veinte veintiuno veintidos veintitres veinticuatro veinticinco veintiseis veintisiete veintiocho veintinueve treinta treintauno treintados treintatres treintacuatro treintacinco treintaseis treintasiete treintaocho treintanueve cuarenta cuarentauno cuarentados cuarentatres cuarentacuatro cuarentacinco cuarentaseis cuarentasiete cuarentaocho cuarentanueve cincuenta cincuentauno',
      undefined,
      {
        isValid: false,
        errorMessage: 'La reseña no puede exceder las 50 palabras.',
        errorCode: 'TOO_LONG',
      },
    ],
    [
      'Esta reseña incluye https://ejemplo.com y no debe pasar',
      undefined,
      {
        isValid: false,
        errorMessage: 'No se permiten enlaces o URLs en la reseña.',
        errorCode: 'CONTAINS_LINK',
      },
    ],
    [
      'Esta reseña es tonto y no debe pasar la validación',
      undefined,
      {
        isValid: false,
        errorMessage: 'Tu reseña contiene palabras inapropiadas.',
        errorCode: 'BAD_LANGUAGE',
      },
    ],
    [
      'ESTA RESEÑA TIENE CINCO PALABRAS',
      undefined,
      {
        isValid: false,
        errorMessage: 'No escribas tu reseña completamente en mayúsculas.',
        errorCode: 'ALL_UPPERCASE',
      },
    ],
    [
      'Esta reseña tiene suficiente calidad y no incluye problemas',
      undefined,
      {
        isValid: true,
        errorMessage: null,
        errorCode: null,
      },
    ],
    [
      'una dos tres',
      { minWords: 2, maxWords: 3 },
      {
        isValid: true,
        errorMessage: null,
        errorCode: null,
      },
    ],
  ];

  test.each(casos)('valida %p', (texto, limites, expected) => {
    const resultado = limites === undefined ? validarResena(texto) : validarResena(texto, limites.minWords, limites.maxWords);
    expect(resultado.isValid).toBe(expected.isValid);
    expect(resultado.errorMessage).toBe(expected.errorMessage);
    expect(resultado.errorCode).toBe(expected.errorCode);
  });
});

describe('actualizarErrorEmail', () => {
  const runEmailTest = (errors, email, expectedErrors) => {
    expect(actualizarErrorEmail(errors, email)).toEqual(expectedErrors);
  };

  test('debe agregar un error cuando el email no es válido', () => {
    runEmailTest(
      { nombre: 'error previo' },
      'correo-invalido',
      { nombre: 'error previo', email: 'Por favor, ingresa un email válido' }
    );
  });

  test('debe eliminar el error de email cuando el email es válido', () => {
    runEmailTest(
      { nombre: 'error previo', email: 'Por favor, ingresa un email válido' },
      'usuario@correo.com',
      { nombre: 'error previo' }
    );
  });
});