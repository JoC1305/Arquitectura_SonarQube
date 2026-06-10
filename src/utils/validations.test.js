const { actualizarErrorEmail, validarPasswordCompleja } = require('./validations.js');

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